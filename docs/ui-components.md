# UI Components

## shadcn/ui only

All UI elements in this app are built from **shadcn/ui** components. Do not
hand-roll custom components for things shadcn already provides (buttons,
inputs, dialogs, dropdowns, forms, cards, tooltips, etc.).

- Before building any UI element, check if a shadcn component covers it.
- If the needed component isn't present in `components/ui/`, add it via the
  shadcn CLI rather than writing it from scratch:

  ```bash
  npx shadcn@latest add <component>
  ```

- Compose pages/features by combining shadcn primitives from
  `components/ui/` — import them with the `@/components/ui/*` alias.
- Only write custom JSX/markup when no shadcn primitive exists for the need
  (e.g., app-specific layout wrappers). Even then, build it out of existing
  shadcn primitives rather than raw HTML + manual Tailwind styling.

## Configuration

Project shadcn config lives in [components.json](../components.json):

- Style: `base-nova`, base color: `neutral`, CSS variables enabled.
- Icons: `lucide-react` — use icons from `lucide-react`, not another icon set.
- Aliases: `@/components/ui` for primitives, `@/components` for composed
  components, `@/lib/utils` for the `cn()` helper.

## Styling

- Use Tailwind v4 utility classes alongside shadcn components; don't
  introduce another styling solution (CSS-in-JS, styled-components, etc.).
- Use the `cn()` helper from `@/lib/utils` to merge/conditionally apply
  classes instead of manual string concatenation.
- Global styles and Tailwind theme/CSS variables live in
  [app/globals.css](../app/globals.css) — extend theme tokens there instead
  of hardcoding one-off colors.
