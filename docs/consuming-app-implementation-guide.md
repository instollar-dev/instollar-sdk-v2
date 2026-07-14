# Consuming app implementation guide

How to install and use `@codearemo/instollar-sdk@^0.1.1` in an Instollar React web app.

This SDK is a **design system** (tokens + UI components + precompiled CSS). It does **not** include an API client yet.

---

## 1. Install from GitHub Packages

### 1.1 Auth + registry

In the **consuming app** root, create a file named exactly `.npmrc` (not `.nmprc`):

```ini
@codearemo:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Create a GitHub personal access token with **`read:packages`**, then:

```bash
export NODE_AUTH_TOKEN=ghp_your_token_here
```

Keep the token out of git. Use an env var locally and a secret in CI (`NODE_AUTH_TOKEN`).

### 1.2 Install

```bash
npm install @codearemo/instollar-sdk@^0.1.1
```

| Part | Meaning |
|------|---------|
| `@codearemo/instollar-sdk` | Scoped package name (org + package) |
| `@^0.1.1` | Version range (optional — pins/semver) |

If you see a **404 on `registry.npmjs.org`**, npm is not using GitHub Packages — fix `.npmrc` and retry.

### 1.3 Peer dependencies

Your app must already have:

- `react` >= 18
- `react-dom` >= 18

---

## 2. One-time app setup

Do these once at the app root (e.g. `main.tsx` / `App.tsx` / global CSS).

### 2.1 Styles (required)

```tsx
import '@codearemo/instollar-react/styles.css';
```

This ships precompiled component styles. You do **not** need Tailwind to scan `node_modules` for the SDK to look correct.

You can also import styles from the umbrella package:

```tsx
import '@codearemo/instollar-sdk/styles.css';
```

### 2.2 Fonts (required)

Load **Spline Sans**, **Inter**, and **Open Sans** once.

**Via CSS** (recommended):

```css
/* e.g. src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Open+Sans:wght@400;700&family=Spline+Sans:wght@300;400;700&display=swap');
```

**Via HTML:**

```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Open+Sans:wght@400;700&family=Spline+Sans:wght@300;400;700&display=swap"
  rel="stylesheet"
/>
```

Or map the same families with Next.js `next/font` to CSS variables `--font-spline`, `--font-inter`, `--font-open-sans`.

### 2.3 Theme (recommended)

Wrap the app (or a layout) in `ThemeProvider` so fields/cards resolve light vs dark surfaces automatically:

```tsx
import { ThemeProvider, ThemeToggle } from '@codearemo/instollar-sdk';

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" persist>
      <header className="flex justify-end p-4">
        <ThemeToggle showLabel />
      </header>
      {children}
    </ThemeProvider>
  );
}
```

| Prop | Default | Notes |
|------|---------|--------|
| `defaultTheme` | `'system'` | `'light' \| 'dark' \| 'system'` |
| `theme` | — | Controlled mode |
| `persist` | `true` | Writes to `localStorage` (`instollar.theme`) |
| `onThemeChange` | — | Callback when mode changes |

Hooks: `useTheme()` (throws outside provider), `useThemeOptional()` (returns `null` outside).

### 2.4 Minimal working page

```tsx
import '@codearemo/instollar-react/styles.css';
import { Button, Text, Icon, Home2, ThemeProvider } from '@codearemo/instollar-sdk';

export function Example() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="p-6 bg-background text-foreground">
        <Text variant="spline-bold-h4">Hello</Text>
        <Text variant="open-regular-p">Body copy with Open Sans.</Text>
        <Button prefix={<Icon icon={Home2} size="sm" color="secondary" />}>
          Continue
        </Button>
      </div>
    </ThemeProvider>
  );
}
```

**Prefer the umbrella import:**

```ts
import { Button, Text, Input } from '@codearemo/instollar-sdk';
```

---

## 3. Design tokens

Installed via `@codearemo/instollar-tokens` (dependency of the SDK).

### 3.1 Brand

| Token | Value |
|-------|--------|
| Primary | `#012b15` |
| Secondary | `#effe3e` |
| Destructive | `#b42318` |

### 3.2 CSS variables (`:root`)

Set by tokens / `styles.css`:

| Variable | Role |
|----------|------|
| `--font-spline` | Display / headings |
| `--font-inter` | UI |
| `--font-open-sans` | Body |
| `--color-primary` | Brand green |
| `--color-secondary` | Lime accent |
| `--color-bg` | Background |
| `--color-fg` | Foreground text |
| `--color-muted` | Muted text |
| `--color-border` | Borders |
| `--color-destructive` | Errors / destructive actions |

### 3.3 Tailwind-style utilities from `styles.css`

These work in your JSX `className` after importing `styles.css`:

| Utility | Maps to |
|---------|---------|
| `bg-primary` / `text-primary` | Brand primary |
| `bg-secondary` / `text-secondary` | Brand secondary |
| `bg-background` / `text-foreground` | Page surface / text |
| `text-muted` | Muted text |
| `border-border` | Standard border |
| `text-destructive` / `bg-destructive` | Errors |
| `font-spline` | Spline Sans |

### 3.4 JS token exports (optional)

```ts
import { brand, colors, fonts } from '@codearemo/instollar-tokens';

brand.primary; // '#012b15'
```

### 3.5 Extra typography CSS (advanced)

If you need **all** style-guide utilities (beyond the `Text` variants below):

```ts
import '@codearemo/instollar-tokens/typography.css';
```

Most apps only need the `Text` component variants.

---

## 4. Components

All examples assume:

```ts
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  FieldControl,
  Icon,
  Input,
  LoadBoundary,
  Radio,
  RadioGroup,
  SegmentedTab,
  SegmentedTabs,
  Select,
  Spinner,
  Switch,
  Text,
  Textarea,
  ThemeProvider,
  ThemeToggle,
  Home2,
  User,
  Lock,
  ArrowRight2,
  TickCircle,
  CloseCircle,
  cn,
  loadBoundaryPropsFromQuery,
} from '@codearemo/instollar-sdk';
```

Field surfaces (`variant` on Input / Textarea / Select / Checkbox / etc.): `'light' | 'dark'`.  
Default resolves from `ThemeProvider` when omitted.

---

### 4.1 `Text`

Product-facing typography. Prefer this over hard-coding font classes.

| Prop | Type | Default | Notes |
|------|------|---------|--------|
| `variant` | `TextVariant` | `'open-regular-p'` | See list below |
| `as` | element type | `'p'` | e.g. `'h1'`, `'span'` |
| `className` | `string` | — | Merged with variant |

**Variants:**

| Variant | Use for |
|---------|---------|
| `spline-bold-display` | Hero / large display |
| `spline-bold-h4` | Page title |
| `spline-bold-h5` | Section title |
| `spline-bold-label` | Emphasized label / button-like text |
| `spline-regular-p` | Spline body |
| `open-bold-h5` | Open Sans section |
| `open-bold-p` | Emphasized body |
| `open-regular-p` | Default body |
| `open-regular-label` | Form labels |
| `open-regular-tiny` | Captions / helper text |

```tsx
<Text as="h1" variant="spline-bold-h4">
  Projects
</Text>
<Text variant="open-regular-p" className="text-muted">
  Helper copy
</Text>
```

---

### 4.2 `Button`

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive' \| 'danger'` | `'primary'` |
| `tone` | `'default' \| 'destructive' \| 'danger'` | `'default'` — **ghost only** |
| `size` | `'default' \| 'sm'` | `'default'` |
| `loading` | `boolean` | `false` |
| `prefix` / `suffix` | `ReactNode` | — |
| … | standard button HTML attrs | — |

```tsx
<Button>Continue</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Skip</Button>
<Button variant="ghost" tone="destructive">
  Remove
</Button>
<Button variant="destructive">Delete</Button>
<Button variant="danger">Danger</Button>
<Button loading>Saving…</Button>
<Button
  prefix={<Icon icon={Home2} size="sm" color="secondary" />}
  suffix={<Icon icon={ArrowRight2} size="sm" color="secondary" />}
>
  Home
</Button>
```

`loading` disables the button, sets `aria-busy`, and shows a centered spinner while keeping width.

---

### 4.3 `Icon` + Iconsax icons

Thin wrapper over [Iconsax](https://iconsax-react.pages.dev/). Pass an Iconsax component into `icon`.

| Prop | Type | Default |
|------|------|---------|
| `icon` | Iconsax component | required |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `color` | `'primary' \| 'secondary' \| 'muted' \| 'inverse' \| 'destructive'` | `'primary'` |
| `variant` | `'Linear' \| 'Outline' \| 'Broken' \| 'Bold' \| 'Bulk' \| 'TwoTone'` | `'Linear'` |

**Curated icons** (import from the SDK directly):  
`Home2`, `ArrowLeft2`, `ArrowRight2`, `ArrowDown2`, `ArrowUp2`, `User`, `UserAdd`, `People`, `Lock`, `Unlock`, `Eye`, `EyeSlash`, `Add`, `AddCircle`, `CloseCircle`, `TickCircle`, `Trash`, `Edit2`, `SearchNormal1`, `Filter`, `InfoCircle`, `Warning2`, `Notification`, `Calendar`, `Location`, `Setting2`, `Sun`, `Moon`, and more (see `packages/react/src/components/Icon.tsx`).

**Full Iconsax catalog** (~993 icons):

```ts
import { Activity, Bluetooth, Wifi } from '@codearemo/instollar-sdk/icons';
// or: from '@codearemo/instollar-react/icons'
// or: from 'iconsax-react' (same package)
```

```tsx
import { Button, Icon, Home2, SearchNormal1 } from '@codearemo/instollar-sdk';

<Button prefix={<Icon icon={Home2} size="sm" color="secondary" />}>Home</Button>
<Button prefix={<Icon icon={SearchNormal1} size="sm" />}>Search</Button>
```

---

### 4.4 `Spinner`

| Prop | Type | Default |
|------|------|---------|
| `size` | `number` (px) | `16` |
| `className` | `string` | — |

```tsx
<Spinner size={24} className="text-primary" />
```

---

### 4.5 `Input`

Uses shared `FieldControl` chrome. Supports password show/hide and thousand-separated numbers.

| Prop | Type | Notes |
|------|------|--------|
| `label` | `string` | Associated `<label>` |
| `error` | `string` | Error message + `aria-invalid` |
| `variant` | `'light' \| 'dark'` | Defaults from theme |
| `prefix` / `suffix` | `ReactNode` | Icons / adornments |
| `type="password"` | — | Built-in eye toggle (merges with `suffix`) |
| `type="number"` | — | Renders text + `inputMode="decimal"`; display has commas; `onChange` emits **raw** value |
| … | input HTML attrs | `disabled`, `placeholder`, `value`, etc. |

```tsx
<Input label="Email" placeholder="you@example.com" />
<Input label="Password" type="password" error="Required" />
<Input label="Amount" type="number" placeholder="1,000" />
<Input
  label="Search"
  prefix={<Icon icon={Home2} size="sm" color="muted" />}
/>
```

---

### 4.6 `Textarea`

Same field API as Input (`label`, `error`, `variant`, `prefix`, `suffix`) minus password/number.

```tsx
<Textarea label="Notes" placeholder="Optional" rows={4} />
```

---

### 4.7 `Checkbox`

Custom peer checkbox (not native browser chrome).

| Prop | Type | Notes |
|------|------|--------|
| `label` | `ReactNode` | |
| `description` / `error` | `string` | Helper + alert text |
| `variant` | `'light' \| 'dark'` | Unchecked surface |
| … | checkbox HTML attrs | `checked`, `defaultChecked`, `onChange`, `disabled` |

```tsx
<Checkbox
  label="I agree to the terms"
  description="Required to continue"
  defaultChecked
/>
```

---

### 4.8 `Radio` + `RadioGroup`

Prefer `RadioGroup` with `onValueChange` over raw shared `name` alone.

**`RadioGroup`**

| Prop | Notes |
|------|--------|
| `label` / `description` / `error` | Fieldset legend + messages |
| `name` | Optional; else `useId()` |
| `value` / `defaultValue` / `onValueChange` | Controlled or uncontrolled |
| `variant` / `disabled` | Passed via context |

**`Radio`**

| Prop | Notes |
|------|--------|
| `value` | Required string |
| `label` / `description` | — |
| `variant` | Overrides group |

```tsx
<RadioGroup label="Role" defaultValue="installer" onValueChange={console.log}>
  <Radio value="admin" label="Admin" />
  <Radio value="installer" label="Installer" description="Field crew" />
</RadioGroup>
```

---

### 4.9 `Switch`

| Prop | Type | Notes |
|------|------|--------|
| `checked` / `defaultChecked` / `onCheckedChange` | Controlled or uncontrolled | |
| `label` / `description` / `error` | — | |
| `variant` | Inactive track color | |

```tsx
const [on, setOn] = useState(false);

<Switch label="Notifications" defaultChecked />
<Switch label="Dark mode" checked={on} onCheckedChange={setOn} />
```

---

### 4.10 `Select` (portal dropdown)

Custom select with portal dropdown (not a native `<select>`).

| Prop | Type | Notes |
|------|------|--------|
| `options` | `{ value, label, disabled?, prefix?, suffix? }[]` | Required |
| `value` / `defaultValue` / `onValueChange` | `T` or `T[]` when `multiple` | |
| `multiple` | `boolean` | Checkbox rows; stays open |
| `searchable` | `boolean` | Filter field in dropdown |
| `creatable` | `boolean` | Add value not in list |
| `optionsLoading` / `optionsError` / `onReloadOptions` | Async options UX | |
| `compareValue` / `getOptionKey` / `getOptionLabel` | Object-valued options | |
| `createOptionLabel` / `formatCreateValue` / … | Creatable pipeline | |
| `label` / `error` / `variant` / `prefix` / `suffix` | Field chrome | |

```tsx
const [role, setRole] = useState('installer');
const [skills, setSkills] = useState<string[]>(['wiring']);

<Select
  label="Role"
  searchable
  value={role}
  onValueChange={(v) => setRole(v as string)}
  options={[
    { value: 'admin', label: 'Admin' },
    { value: 'installer', label: 'Installer' },
  ]}
/>

<Select
  label="Skills"
  multiple
  searchable
  value={skills}
  onValueChange={(v) => setSkills(v as string[])}
  options={[
    { value: 'wiring', label: 'Wiring' },
    { value: 'roofing', label: 'Roofing' },
  ]}
/>
```

Helper for TanStack Query:

```ts
<Select
  options={options}
  {...selectOptionsPropsFromQuery(query)}
  …
/>
```

---

### 4.11 `Alert`

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'success' \| 'error' \| 'destructive' \| 'warning' \| 'info'` | `'info'` |
| `appearance` | `'inline' \| 'toast'` | `'inline'` |
| `title` | `ReactNode` | — |
| `onDismiss` | `() => void` | Optional X button |
| `children` | `ReactNode` | Body |

```tsx
<Alert variant="success" title="Saved">
  Your changes were published.
</Alert>
<Alert variant="error" title="Failed" onDismiss={() => {}}>
  Could not save. Try again.
</Alert>
```

Class maps (`alertContainerClasses`, `toastContainerClasses`, `alertIconChipClasses`) are exported for overlay reuse later.

---

### 4.12 `Badge`

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'kicker' \| 'eyebrow' \| 'success' \| 'destructive' \| 'neutral' \| 'secondary'` | `'kicker'` |
| `prefix` / `suffix` | `ReactNode` | — |

```tsx
<Badge>New</Badge>
<Badge variant="eyebrow">Status</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="secondary">Accent</Badge>
```

---

### 4.13 `Card`

| Prop | Type | Notes |
|------|------|--------|
| `variant` | `'light' \| 'dark-glass'` | Defaults from theme |

```tsx
<Card className="flex flex-col gap-3">
  <Text variant="spline-bold-h5">Invoice</Text>
  <Text variant="open-regular-p">Due next week.</Text>
  <Button size="sm">Pay</Button>
</Card>
```

---

### 4.14 `Chip`

Interactive filter pill (`aria-pressed`).

| Prop | Type | Default |
|------|------|---------|
| `selected` | `boolean` | `false` |
| `prefix` / `suffix` | `ReactNode` | — |
| … | button HTML attrs | `onClick`, `disabled` |

```tsx
const [selected, setSelected] = useState(false);

<Chip
  selected={selected}
  onClick={() => setSelected((v) => !v)}
  prefix={<Icon icon={Home2} size="xs" />}
>
  Solar
</Chip>
```

---

### 4.15 `SegmentedTabs` + `SegmentedTab`

Pill segmented control (not underline tabs). Supports keyboard arrows / Home / End.

| Prop (Tabs) | Values | Default |
|-------------|--------|---------|
| `value` / `defaultValue` / `onValueChange` | string | — |
| `accent` | `'adaptive' \| 'primary' \| 'destructive'` | `'adaptive'` |
| `size` | `'sm' \| 'default'` | `'default'` |

| Prop (Tab) | Notes |
|------------|--------|
| `value` | Required |
| `badge` | Count chip |
| `prefix` / `suffix` | Icons |

```tsx
const [tab, setTab] = useState('overview');

<SegmentedTabs value={tab} onValueChange={setTab} accent="primary">
  <SegmentedTab value="overview">Overview</SegmentedTab>
  <SegmentedTab value="jobs" badge={3}>
    Jobs
  </SegmentedTab>
  <SegmentedTab value="settings">Settings</SegmentedTab>
</SegmentedTabs>
```

---

### 4.16 `LoadBoundary`

Async page shell for loading / error / stale / forbidden states.

| Prop | Meaning |
|------|---------|
| `isLoading` | First load — no content |
| `isError` | Failed |
| `isStale` | Error **with** prior `children` — content + top-right stale banner |
| `permitted` | `false` → forbidden shell |
| `onRetry` / labels / messages | Copy + retry |
| `minHeight` / `*Fallback` | Layout + custom shells |

```tsx
<LoadBoundary
  isLoading={query.isLoading}
  isError={query.isError}
  isStale={query.isError && query.data != null}
  error={query.error}
  onRetry={() => query.refetch()}
  minHeight={240}
>
  <YourContent data={query.data} />
</LoadBoundary>
```

Helper for TanStack Query-shaped objects:

```ts
<LoadBoundary {...loadBoundaryPropsFromQuery(query)} onRetry={() => query.refetch()}>
  …
</LoadBoundary>
```

---

### 4.17 `ThemeToggle`

Button calling `toggleTheme()`. Iconsax sun/moon. Optional `showLabel`.

```tsx
<ThemeToggle showLabel />
```

---

### 4.18 `StatusBadge`

Pure status pill — apps map their own API statuses → `tone` + `label`.

| Prop | Type | Notes |
|------|------|--------|
| `tone` | `'success' \| 'destructive' \| 'neutral'` | Required |
| `label` | `string` | Required |
| `prefix` / `suffix` | `ReactNode` | Optional |

```tsx
<StatusBadge tone="success" label="Active" />
<StatusBadge tone="destructive" label="Failed" />
<StatusBadge tone="neutral" label="Draft" />
```

---

## 5. `cn` helper

Classname merge (`clsx` + `tailwind-merge`), exported for app use:

```tsx
import { cn, Button } from '@codearemo/instollar-sdk';

<Button className={cn('w-full', isWide && 'max-w-md')} />
```

---

## 6. Form layout example

```tsx
import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Input,
  Select,
  Text,
  Textarea,
} from '@codearemo/instollar-sdk';

export function ContactForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // your API call
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Text as="h2" variant="spline-bold-h5">
          Contact
        </Text>

        {error ? (
          <Alert variant="error" title="Error">
            {error}
          </Alert>
        ) : null}

        <Input label="Name" name="name" required />
        <Input label="Email" name="email" type="email" required />
        <Input label="Password" type="password" />
        <Select
          label="Topic"
          placeholder="Choose one"
          value={topic}
          onValueChange={setTopic}
          options={[
            { value: 'support', label: 'Support' },
            { value: 'sales', label: 'Sales' },
          ]}
        />
        <Textarea label="Message" name="message" required />
        <Checkbox label="Send me a copy" name="copy" />
        <Button type="submit" loading={loading}>
          Send
        </Button>
      </form>
    </Card>
  );
}
```

---

## 7. Packages reference

| Package | When to import |
|---------|----------------|
| `@codearemo/instollar-sdk` | **Default** — all components + curated icons |
| `@codearemo/instollar-sdk/icons` | Full Iconsax catalog (~993 icons) |
| `@codearemo/instollar-react` | Same components; also `styles.css` |
| `@codearemo/instollar-react/icons` | Same full Iconsax catalog |
| `@codearemo/instollar-tokens` | JS `brand` / `colors`, or raw `tokens.css` / `typography.css` |

Exports from the umbrella match `@codearemo/instollar-react`.

Also exported for advanced composition: `FieldControl`, form class helpers, `useClickOutside`, `useFloatingPosition`, alert/segmented class maps.

---

## 8. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `404` on `registry.npmjs.org` | File must be named `.npmrc`; `@codearemo` must point at `https://npm.pkg.github.com` |
| `401` / `403` from GitHub Packages | Set `NODE_AUTH_TOKEN` with `read:packages`; authorize SSO for `codearemo` if required |
| Components unstyled | Import `@codearemo/instollar-react/styles.css` (or SDK `styles.css`) once at app root |
| Wrong fonts | Load Google Fonts (or `next/font`) for Spline / Inter / Open Sans |
| Dark fields look wrong without provider | Wrap with `ThemeProvider`, or set `variant="light"` explicitly |
| Publish not found | Confirm Actions → **Publish** for the release tag succeeded |

---

## 9. Out of scope (still)

Not in this release — add later if needed:

- API client / OpenAPI / auth session
- React Native package
- Overlay / toast stacks (Alert `appearance="toast"` is ready to reuse)
- Domain `AddressInput` (locations API)

---

## 10. Upgrade

```bash
npm install @codearemo/instollar-sdk@^0.1.1
```

After upgrading, restart the Vite/Next dev server so CSS and package resolution refresh.

### Breaking notes since first scaffold

| Change | Migration |
|--------|-----------|
| `Select` is no longer a native `<select>` | Use `value` / `defaultValue` / `onValueChange` instead of `onChange`; supports `multiple` / `searchable` / `creatable` |
| `Badge` variants renamed | Use `kicker` / `eyebrow` / `success` / `destructive` / `neutral` / `secondary` (not `default` / `warning` / `error`) |
| `Alert` variants expanded | Prefer `error` or `destructive`; add `appearance` / `onDismiss` as needed |
| Icons | Curated set on main import; full catalog via `@codearemo/instollar-sdk/icons` |
