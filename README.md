# Instollar SDK

Design-system SDK for Instollar — tokens, React components, and a precompiled `styles.css` (Tailwind compiled at publish time; consuming apps do not need Tailwind configured for SDK UI or standard layout utilities).

**Walkthrough:** `pnpm playground` — Overview · API · Style guide · Special logic.

`styles.css` ships the **standard Tailwind utility set** (flex, grid, spacing, object-fit, responsive `sm:`/`md:`/`lg:` variants, theme colors, etc.) so app layouts can use those classes without a local Tailwind build. Arbitrary values (`w-[37px]`, …) need an optional app-side Tailwind setup — see [Arbitrary values](#arbitrary-values-optional).

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
pnpm add @instollar-dev/instollar-sdk@^0.4.0
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

**What you get:** standard Tailwind utilities, Instollar `@theme` colors/fonts, and typography `@utility` classes from `@instollar-dev/instollar-tokens`. Installing `tailwindcss` for IntelliSense alone does **not** generate arbitrary classes at runtime — see below.

## Arbitrary values (optional)

Most apps only need `styles.css`. Classes like `w-[37px]`, `grid-cols-[200px_1fr]`, or `bg-[#1a2b3c]` are **not** in that prebuilt file (Tailwind generates them from your source).

To use arbitrary values at runtime in a consuming product:

1. Install Tailwind in **that** app and wire it into the bundler (Vite plugin / PostCSS / etc.):

```bash
pnpm add -D tailwindcss@^4.1.0
```

2. In the app’s main CSS (processed by Tailwind), add:

```css
@import "tailwindcss";
@import "@instollar-dev/instollar-react/theme.css";
```

3. Keep importing `styles.css` for Instollar components and the prebuilt utility set:

```tsx
import '@instollar-dev/instollar-react/styles.css';
```

Without that app-side build, prefer named utilities from `styles.css`, inline styles, or CSS variables for one-offs.

## Light / dark theme

Tokens ship light (default) and dark themes. Dark activates when `<html>` has `data-theme="dark"` or a `.dark` class.

| Token | Light | Dark |
|-------|-------|------|
| `--color-brand` | `#012b15` | `#012b15` (stable fills) |
| `--color-primary` | `#012b15` | `#8fc9a5` (accents / text) |
| `--color-secondary` | `#effe3e` | `#effe3e` |
| `--color-bg` | `#ffffff` | `#24382f` |
| `--color-fg` | brand green | `#edf6f0` |
| `--color-destructive` | `#b42318` | `#f97066` |

```tsx
import { ThemeProvider, useTheme } from '@instollar-dev/instollar-sdk';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Shell />
    </ThemeProvider>
  );
}

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  return (
    <button type="button" onClick={toggleTheme}>
      {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
```

Prefer semantic classes (`bg-background`, `text-foreground`, `border-border`, `bg-brand`) so surfaces follow the theme. Solid primary buttons use `--color-brand` so they stay forest green in both modes.

## Local development (this repo)

```bash
pnpm install
pnpm build
pnpm test
pnpm playground
```

## Release

1. Keep package versions lockstep (`0.4.0` everywhere until you need otherwise).
2. Commit, then tag and push:

```bash
git tag v0.4.0
git push origin v0.4.0
```

The Publish workflow builds and publishes all packages to GitHub Packages under the `instollar-dev` org.
