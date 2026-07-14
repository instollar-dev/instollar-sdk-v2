# Instollar SDK

Design-system SDK for Instollar — tokens, React components, and a precompiled `styles.css`.

## Packages

| Package | Description |
|---------|-------------|
| `@codearemo/instollar-sdk` | Umbrella re-exports (preferred install) |
| `@codearemo/instollar-react` | React components + `styles.css` |
| `@codearemo/instollar-tokens` | CSS variables + typography utilities |

## Install (GitHub Packages)

Add to your app `.npmrc`:

```ini
@codearemo:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
npm install @codearemo/instollar-sdk@^0.1.0
```

## Usage

Load Spline Sans / Inter / Open Sans once in the app (Google Fonts or `next/font`), then:

```tsx
import '@codearemo/instollar-react/styles.css';
import { Button, Text, Icon, Home2 } from '@codearemo/instollar-sdk';

export function Example() {
  return (
    <div className="p-6 bg-background text-foreground">
      <Text variant="spline-bold-h4">Hello</Text>
      <Text variant="open-regular-p">Body copy with Open Sans.</Text>
      <Button prefix={<Icon icon={Home2} size="sm" color="secondary" />}>
        Continue
      </Button>
    </div>
  );
}
```

## Local development

```bash
pnpm install
pnpm build
pnpm test
pnpm playground
```

## Release

1. Keep package versions lockstep (`0.1.0` everywhere until you need otherwise).
2. Commit, then tag and push:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The Publish workflow builds and publishes all packages to GitHub Packages.
