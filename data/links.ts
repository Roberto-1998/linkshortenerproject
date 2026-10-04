import "server-only";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { links } from "@/db/schema";

export type UserLink = typeof links.$inferSelect;

/**
 * Checks whether a short code is already in use by any link.
 */
export async function isShortCodeTaken(shortCode: string): Promise<boolean> {
  const [existing] = await db
    .select({ id: links.id })
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);
  return Boolean(existing);
}

/**
 * Inserts a new link owned by the given user.
 */
export async function insertLink(
  userId: string,
  data: { url: string; shortCode: string }
): Promise<UserLink> {
  const [link] = await db
    .insert(links)
    .values({ userId, url: data.url, shortCode: data.shortCode })
    .returning();
  return link;
}

/**
 * Checks whether a short code is used by a link other than the given one.
 */
export async function isShortCodeTakenByOther(
  shortCode: string,
  excludeId: string
): Promise<boolean> {
  const [existing] = await db
    .select({ id: links.id })
    .from(links)
    .where(and(eq(links.shortCode, shortCode), ne(links.id, excludeId)))
    .limit(1);
  return Boolean(existing);
}

/**
 * Updates a link owned by the given user. Returns false if nothing matched.
 */
export async function updateLink(
  userId: string,
  id: string,
  data: { url: string; shortCode: string }
): Promise<boolean> {
  const updated = await db
    .update(links)
    .set({ url: data.url, shortCode: data.shortCode })
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning({ id: links.id });
  return updated.length > 0;
}

/**
 * Deletes a link owned by the given user. Returns false if nothing matched.
 */
export async function deleteLink(userId: string, id: string): Promise<boolean> {
  const deleted = await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning({ id: links.id });
  return deleted.length > 0;
}

/**
 * Looks up a link by its short code. Returns null if no link matches.
 */
export async function getLinkByShortCode(
  shortCode: string
): Promise<UserLink | null> {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);
  return link ?? null;
}

/**
 * Fetches every link created by the currently signed-in user, newest first.
 * Returns an empty array when there is no authenticated user or the query fails.
 */
export async function getUserLinks(): Promise<UserLink[]> {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    return await db
      .select()
      .from(links)
      .where(eq(links.userId, userId))
      .orderBy(desc(links.createdAt));
  } catch (error) {
    console.error("Failed to fetch links for user:", error);
    return [];
  }
}
