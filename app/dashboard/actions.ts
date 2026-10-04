"use server";

import { randomBytes } from "crypto";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  deleteLink as deleteLinkRecord,
  insertLink,
  isShortCodeTaken,
  isShortCodeTakenByOther,
  updateLink as updateLinkRecord,
} from "@/data/links";

const SHORT_CODE_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateShortCode(length = 7): string {
  const bytes = randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += SHORT_CODE_ALPHABET[bytes[i] % SHORT_CODE_ALPHABET.length];
  }
  return code;
}

const createLinkSchema = z.object({
  url: z.string().trim().url("Enter a valid URL."),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters.")
    .max(32, "Slug must be 32 characters or fewer.")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Slug can only contain letters, numbers, and hyphens."
    )
    .optional(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

type CreateLinkResult =
  | { success: true; shortCode: string }
  | { success: false; error: string };

export async function createLink(
  input: CreateLinkInput
): Promise<CreateLinkResult> {
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const { url, slug } = parsed.data;

  let shortCode = slug;
  if (shortCode) {
    if (await isShortCodeTaken(shortCode)) {
      return { success: false, error: "That custom slug is already taken." };
    }
  } else {
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generateShortCode();
      if (!(await isShortCodeTaken(candidate))) {
        shortCode = candidate;
        break;
      }
    }
    if (!shortCode) {
      return {
        success: false,
        error: "Could not generate a unique link. Please try again.",
      };
    }
  }

  await insertLink(userId, { url, shortCode });
  revalidatePath("/dashboard");
  return { success: true, shortCode };
}

const updateLinkSchema = z.object({
  id: z.string().uuid(),
  url: z.string().trim().url("Enter a valid URL."),
  shortCode: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters.")
    .max(32, "Slug must be 32 characters or fewer.")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Slug can only contain letters, numbers, and hyphens."
    ),
});

export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

type ActionResult = { success: true } | { success: false; error: string };

export async function updateLink(input: UpdateLinkInput): Promise<ActionResult> {
  const parsed = updateLinkSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const { id, url, shortCode } = parsed.data;

  if (await isShortCodeTakenByOther(shortCode, id)) {
    return { success: false, error: "That custom slug is already taken." };
  }

  const updated = await updateLinkRecord(userId, id, { url, shortCode });
  if (!updated) return { success: false, error: "Link not found." };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteLink(id: string): Promise<ActionResult> {
  const parsed = z.string().uuid().safeParse(id);
  if (!parsed.success) return { success: false, error: "Invalid link." };

  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const deleted = await deleteLinkRecord(userId, parsed.data);
  if (!deleted) return { success: false, error: "Link not found." };

  revalidatePath("/dashboard");
  return { success: true };
}
