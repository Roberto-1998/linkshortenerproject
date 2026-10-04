---
description: Guidelines and best practices for writing and using server actions in the project.
---

# Server Actions

## All mutations go through server actions

Every data mutation in this app (create, update, delete) must be performed
through a Next.js **server action**. Do not mutate data from route handlers,
client-side fetch calls, or directly inside components.

## Called only from client components

Server actions must be invoked from **client components** (`"use client"`),
e.g. via a form's `action` prop or an event handler. Do not call a server
action from another server action or from a server component.

## File naming and location

Server actions must be named `actions.ts` and colocated in the same
directory as the client component that calls them:

```
app/dashboard/
  page.tsx
  link-form.tsx       # "use client", calls createLink from ./actions
  actions.ts          # "use server"
```

Do not place server actions in a shared/global file — each consuming
component's directory gets its own `actions.ts`.

## Typed arguments only — no `FormData`

Server actions must accept plain, explicitly typed arguments. Do not type a
parameter as `FormData`; the calling client component is responsible for
extracting form values into a typed object before calling the action.

```ts
// actions.ts
"use server";

type CreateLinkInput = {
  url: string;
  slug?: string;
};

export async function createLink(input: CreateLinkInput) {
  // ...
}
```

## Validate input with Zod

Every server action must validate its input with a **Zod** schema before
doing anything else. Reject/return early on validation failure.

```ts
"use server";

import { z } from "zod";

const createLinkSchema = z.object({
  url: z.string().url(),
  slug: z.string().min(1).optional(),
});

export async function createLink(input: CreateLinkInput) {
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  // ...
}
```

## Check authentication first

Every server action must verify there is a logged-in user, via Clerk's
`auth()`, **before** performing any database operation. Return early if
there is no authenticated user.

```ts
"use server";

import { auth } from "@clerk/nextjs/server";

export async function createLink(input: CreateLinkInput) {
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid input" };

  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  // ...
}
```

## Database access via `/data` helpers only

Server actions must never call Drizzle queries directly. All database
operations go through helper functions in the `/data` directory, the same
helpers used for data fetching. If a needed mutation helper doesn't exist
yet, add it to the relevant file in `/data` instead of writing the query
inline in the action.

```ts
// data/links.ts
export async function insertLink(userId: string, data: { url: string; slug?: string }) {
  return db.insert(links).values({ userId, ...data }).returning();
}

// actions.ts
"use server";

export async function createLink(input: CreateLinkInput) {
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid input" };

  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  return insertLink(userId, parsed.data);
}
```

## Quick reference

| Do | Don't |
|----|-------|
| Put mutations in a colocated `actions.ts` with `"use server"` | Mutate data in route handlers or client components |
| Call server actions from client components only | Call a server action from a server component or another action |
| Type parameters explicitly (e.g. `CreateLinkInput`) | Type a server action parameter as `FormData` |
| Validate all input with a Zod schema before anything else | Trust input or skip validation |
| Check `await auth()` for a `userId` before any DB call | Run database operations before confirming the user is authenticated |
| Call helper functions from `/data` for all DB access | Import `db` or write Drizzle queries directly inside `actions.ts` |
