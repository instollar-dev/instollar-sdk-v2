# Instollar SDK

Design-system SDK for Instollar — tokens, React components, and a precompiled `styles.css` (Tailwind compiled at publish time; consuming apps do not need Tailwind configured for SDK UI or standard layout utilities).

**Walkthrough:** `pnpm playground` — Overview · API · Style guide · Special logic.

`styles.css` ships the **standard Tailwind utility set** (flex, grid, spacing, object-fit, responsive `sm:`/`md:`/`lg:` variants, theme colors, etc.) so app layouts can use those classes without a local Tailwind build. **Arbitrary values** (`w-[37px]`, `grid-cols-[200px_1fr]`) are not pre-generated — use inline styles or add an app-side Tailwind pipeline for those.

The playground still runs its **own Tailwind** build (Vite plugin) so docs-only classes and arbitrary values work during development.

## Packages

| Package | Description |
|---------|-------------|
| `@instollar-dev/instollar-sdk` | Umbrella re-exports (preferred install) |
| `@instollar-dev/instollar-react` | React components + `styles.css` + `theme.css` (IntelliSense) |
| `@instollar-dev/instollar-tokens` | CSS variables + typography utilities |

## Quick start

In the consuming app, create `.npmrc` (exact name):

```ini
@instollar-dev:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
export NODE_AUTH_TOKEN=ghp_your_token
pnpm add @instollar-dev/instollar-sdk@^0.3.0
```

`NODE_AUTH_TOKEN` must be a GitHub personal access token (or fine-grained token) with `read:packages` on the **instollar-dev** org. Use the same token in CI for installs.

```tsx
import '@instollar-dev/instollar-react/styles.css';
import { Button, Text, Icon, Home2 } from '@instollar-dev/instollar-sdk';
```

Load Spline Sans / Inter / Open Sans once (CSS `@import` or HTML `<link>`). Explore the live SDK surface with `pnpm playground`.

## Tailwind IntelliSense (class autocomplete)

Runtime CSS comes from `styles.css`. Editor autocomplete needs a live Tailwind v4 entry so VS Code / Cursor can suggest theme tokens and custom `@utility` classes (`bg-primary`, `text-spline-bold-h4`, …).

1. Install the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension (`bradlc.vscode-tailwindcss`).
2. Add `tailwindcss` as a **devDependency** (required by the extension; optional for runtime if you only import `styles.css`):

```bash
pnpm add -D tailwindcss@^4.1.0
```

3. Copy the templates from this repo (`templates/vscode/`) into your app’s `.vscode/`, or add:

```json
{
  "tailwindCSS.experimental.configFile": "./node_modules/@instollar-dev/instollar-react/theme.css",
  "editor.quickSuggestions": { "strings": true }
}
```

If IntelliSense can’t resolve that path under pnpm’s layout, point at the umbrella package instead:

```json
{
  "tailwindCSS.experimental.configFile": "./node_modules/@instollar-dev/instollar-sdk/theme.css"
}
```

Reload the editor window after changing settings.

**What you get:** standard Tailwind utilities, Instollar `@theme` colors/fonts, and typography `@utility` classes from `@instollar-dev/instollar-tokens`. Arbitrary values still need an app-side Tailwind build if you want them at runtime.

## Local development (this repo)

```bash
pnpm install
pnpm build
pnpm test
pnpm playground
```

## Release

1. Keep package versions lockstep (`0.3.0` everywhere until you need otherwise).
2. Commit, then tag and push:

```bash
git tag v0.3.0
git push origin v0.3.0
```

The Publish workflow builds and publishes all packages to GitHub Packages under the `instollar-dev` org.
