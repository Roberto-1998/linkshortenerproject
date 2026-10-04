<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Standards

This is a link shortener app: Next.js 16 (App Router), Clerk auth, Drizzle
ORM + Neon Postgres, Tailwind v4 + shadcn/ui. Topic-specific project rules
live in `.github/instructions/`.

**ALWAYS check `.github/instructions/` for relevant guidance and read it
BEFORE generating code.** Don't rely on general training-data knowledge for
these topics — several defaults in this project differ from older
Next.js/Clerk/Tailwind versions. If guidance is missing, update this file or
the relevant instruction file; do not recreate the deleted `/docs` folder.

## Project instruction files

- [.github/instructions/authentication.md](.github/instructions/authentication.md) — Clerk-only auth, protected
  `/dashboard` route, homepage redirect for signed-in users, modal-only
  sign-in/up.
- [.github/instructions/ui-components.md](.github/instructions/ui-components.md) — shadcn/ui-only components,
  no custom components, adding components via the shadcn CLI.
- [.github/instructions/data-fetching.instructions.md](.github/instructions/data-fetching.instructions.md) — server-side
  data fetching through helpers in `/data` using Drizzle ORM.

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
