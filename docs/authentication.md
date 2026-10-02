# Authentication

## Clerk only

All authentication and session handling in this app goes through **Clerk**
(`@clerk/nextjs`). Do not introduce any other auth method — no NextAuth, no
custom JWT/session/cookie logic, no third-party auth providers. User
identity, sign-in/up, and session state must always come from Clerk APIs:

- Server: `await auth()` / `currentUser()` from `@clerk/nextjs/server`
- Client: `useAuth()` / `useUser()` from `@clerk/nextjs`
- Never mix server and client auth APIs in the same component.

## Protected routes

`/dashboard` (and everything under it) requires an authenticated user.

Enforce this centrally in `proxy.ts` (Next.js 16's middleware entrypoint —
`clerkMiddleware` from `@clerk/nextjs/server`) rather than with per-page
checks:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});
```

When adding new protected sections, add their path to `isProtectedRoute`
instead of writing a separate redirect check inside the page.

## Homepage redirect for signed-in users

If an already-authenticated user visits `/` (the homepage), redirect them to
`/dashboard`. Do this server-side at the top of `app/page.tsx`:

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated } = await auth();
  if (isAuthenticated) redirect("/dashboard");

  // ...render public homepage
}
```

Do not do this check client-side — it must happen on the server to avoid an
authenticated-content flash.

## Sign in / sign up — modal only

Sign-in and sign-up must always be presented as **modals**, never as
dedicated full-page flows. Trigger them with Clerk's modal mode wherever a
sign-in/up action is needed (e.g., the header in `app/layout.tsx`):

```tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs";

<SignInButton mode="modal" />
<SignUpButton mode="modal" />
```

Do not link to or rely on routed `/sign-in` or `/sign-up` pages as the
primary entry point for authentication — modal mode is the only supported
flow.

## Quick reference

| Do | Don't |
|----|-------|
| Use `clerkMiddleware` + `createRouteMatcher` in `proxy.ts` to protect `/dashboard` | Add manual `userId` checks scattered across pages |
| Redirect signed-in users away from `/` server-side with `await auth()` | Redirect client-side with `useEffect`/`useAuth()` |
| Use `<SignInButton mode="modal">` / `<SignUpButton mode="modal">` | Link to `/sign-in` or `/sign-up` as the default auth entry point |
| Use Clerk's `auth()`, `currentUser()`, `useAuth()`, `useUser()` | Add NextAuth, custom JWT/session logic, or any other auth library |
