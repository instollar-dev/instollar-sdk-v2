# Instollar SDK

Design-system SDK for Instollar — tokens, React components, and a precompiled `styles.css` (Tailwind compiled at publish time; consuming apps do not need Tailwind configured for SDK UI or standard layout utilities).

**Walkthrough:** `pnpm playground` — Overview · API · Style guide · Special logic.

`styles.css` ships the **standard Tailwind utility set** (flex, grid, spacing, object-fit, responsive `sm:`/`md:`/`lg:` variants, theme colors, etc.) so app layouts can use those classes without a local Tailwind build. **Arbitrary values** (`w-[37px]`, `grid-cols-[200px_1fr]`) are not pre-generated — use inline styles or add an app-side Tailwind pipeline for those.

The playground still runs its **own Tailwind** build (Vite plugin) so docs-only classes and arbitrary values work during development.

## Packages

| Package | Description |
|---------|-------------|
| `@codearemo/instollar-sdk` | Umbrella re-exports (preferred install) |
| `@codearemo/instollar-react` | React components + `styles.css` + `theme.css` (IntelliSense) |
| `@codearemo/instollar-tokens` | CSS variables + typography utilities |

## Quick start

In the consuming app, create `.npmrc` (exact name):

```ini
@codearemo:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
export NODE_AUTH_TOKEN=ghp_your_token   # needs read:packages
npm install @codearemo/instollar-sdk@^0.2.5
```

```tsx
import '@codearemo/instollar-react/styles.css';
import { Button, Text, Icon, Home2 } from '@codearemo/instollar-sdk';
```

Load Spline Sans / Inter / Open Sans once (CSS `@import` or HTML `<link>`). Explore the live SDK surface with `pnpm playground`.

## Tailwind IntelliSense (class autocomplete)

Runtime CSS comes from `styles.css`. Editor autocomplete needs a live Tailwind v4 entry so VS Code / Cursor can suggest theme tokens and custom `@utility` classes (`bg-primary`, `text-spline-bold-h4`, …).

1. Install the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension (`bradlc.vscode-tailwindcss`).
2. Add `tailwindcss` as a **devDependency** (required by the extension; optional for runtime if you only import `styles.css`):

```bash
npm install -D tailwindcss@^4.1.0
```

3. Copy the templates from this repo (`templates/vscode/`) into your app’s `.vscode/`, or add:

```json
{
  "tailwindCSS.experimental.configFile": "./node_modules/@codearemo/instollar-react/theme.css",
  "editor.quickSuggestions": { "strings": true }
}
```

You can also point at `@codearemo/instollar-sdk/theme.css` (re-exports the same entry).

**What you get:** standard Tailwind utilities, Instollar `@theme` colors/fonts, and typography `@utility` classes from `@codearemo/instollar-tokens`. Arbitrary values still need an app-side Tailwind build if you want them at runtime.

## Local development (this repo)

```bash
pnpm install
pnpm build
pnpm test
pnpm playground
```

## Release

1. Keep package versions lockstep (`0.2.5` everywhere until you need otherwise).
2. Commit, then tag and push:

```bash
git tag v0.2.5
git push origin v0.2.5
```

The Publish workflow builds and publishes all packages to GitHub Packages.
