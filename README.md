# Instollar SDK

Design-system SDK for Instollar — tokens, React components, and a precompiled `styles.css` (Tailwind compiled at publish time; consuming apps do not need Tailwind configured for SDK UI).

**Walkthrough:** `pnpm playground` — Overview · API · Style guide · Special logic.

The playground runs its **own Tailwind** build (Vite plugin) so docs layout utilities work. Consuming apps still only need the SDK’s precompiled `styles.css` — no Tailwind required there.

## Packages

| Package | Description |
|---------|-------------|
| `@codearemo/instollar-sdk` | Umbrella re-exports (preferred install) |
| `@codearemo/instollar-react` | React components + `styles.css` |
| `@codearemo/instollar-tokens` | CSS variables + typography utilities |

## Quick start

In the consuming app, create `.npmrc` (exact name):

```ini
@codearemo:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
export NODE_AUTH_TOKEN=ghp_your_token   # needs read:packages
npm install @codearemo/instollar-sdk@^0.1.4
```

```tsx
import '@codearemo/instollar-react/styles.css';
import { Button, Text, Icon, Home2 } from '@codearemo/instollar-sdk';
```

Load Spline Sans / Inter / Open Sans once (CSS `@import` or HTML `<link>`). Explore the live SDK surface with `pnpm playground`.

## Local development (this repo)

```bash
pnpm install
pnpm build
pnpm test
pnpm playground
```

## Release

1. Keep package versions lockstep (`0.1.4` everywhere until you need otherwise).
2. Commit, then tag and push:

```bash
git tag v0.1.4
git push origin v0.1.4
```

The Publish workflow builds and publishes all packages to GitHub Packages.
