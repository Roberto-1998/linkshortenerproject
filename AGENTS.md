<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Standards

This is a link shortener app: Next.js 16 (App Router), Clerk auth, Drizzle
ORM + Neon Postgres, Tailwind v4 + shadcn/ui. Detailed, topic-specific rules
live in `docs/` as separate `.md` files (one per topic: project structure,
Next.js conventions, database, authentication, UI/styling, code style, etc.).

**ALWAYS check `docs/` for a relevant `.md` file and read it BEFORE
generating any code.** Don't rely on general training-data knowledge for
these topics — several defaults in this project differ from older
Next.js/Clerk/Tailwind versions. If no doc exists yet for the area you're
working in, create one in `docs/` capturing the conventions you establish.

## Docs index

- [docs/authentication.md](docs/authentication.md) — Clerk-only auth, protected
  `/dashboard` route, homepage redirect for signed-in users, modal-only
  sign-in/up.
- [docs/ui-components.md](docs/ui-components.md) — shadcn/ui-only components,
  no custom components, adding components via the shadcn CLI.

## Core rules (apply everywhere)

- Before writing routing/caching/data-fetching code, check
  `node_modules/next/dist/docs/` for the Next 16 behavior — don't assume
  pre-16 APIs still apply.
- NEVER use `middleware.ts` — it's deprecated in this Next.js version. Use
  `proxy.ts` (see the existing [proxy.ts](proxy.ts)) instead.
- Use the `@/*` path alias instead of deep relative imports.
- Run queries through the shared Drizzle client in `db/index.ts`; never add a
  second DB client or expose it to client components.
- Never commit secrets; all credentials come from `.env` via `process.env`.
- Run `npm run lint` before considering a change done.
