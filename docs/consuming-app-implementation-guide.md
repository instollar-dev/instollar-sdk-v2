# Consuming app implementation guide

How to install and use `@codearemo/instollar-sdk@^0.1.4` in an Instollar React web app.

This SDK is a **light-only design system** (tokens + UI components + precompiled CSS). Components are authored with **Tailwind CSS** and published as a ready-made `styles.css` — consuming apps do **not** need Tailwind configured for the SDK to look correct.

It does **not** include an API client, dark mode, or a theme provider.

---

## SDK version summary (0.1.4)

| Version | What matters for your app |
|---------|---------------------------|
| **0.1.4** | Checkbox matches Radio (primary indicator). Primary Button = white label + lighter weight. |
| **0.1.3** | Iconsax paint fixes; Button inline fill/label; `sdk/icons` full catalog; Tailwind + full API guide. |
| **0.1.2** | Primary button contrast (lime on green). Icon defaults to `color="current"`. Theme removed (light-only). |
| **0.1.1** | Full SafeRent-shaped UI: searchable/multiple/creatable `Select`, `SegmentedTabs`, `LoadBoundary`, `StatusBadge`, password/number `Input`, `RadioGroup`, Iconsax. |
| **0.1.0** | Initial scaffold. Prefer **0.1.4**. |

**Upgrade:**

```bash
npm install @codearemo/instollar-sdk@^0.1.4
# restart Vite/Next after install
```

### Upgrade checklist (0.1.4)

**Install / registry**

- [ ] File is named `.npmrc` (not `.nmprc`); `@codearemo` → `https://npm.pkg.github.com`
- [ ] `NODE_AUTH_TOKEN` has `read:packages`
- [ ] Install `@codearemo/instollar-sdk@^0.1.4` and restart the dev server

**One-time setup**

- [ ] Import `@codearemo/instollar-react/styles.css` (or `@codearemo/instollar-sdk/styles.css`) once at app root — no Tailwind config required for SDK UI (see [§2.4](#24-tailwind-and-this-sdk))
- [ ] Load Spline Sans / Inter / Open Sans (CSS `@import` or HTML `<link>`)
- [ ] Remove any `ThemeProvider` / `ThemeToggle` usage

**UI usage**

- [ ] Icons: import curated names from `@codearemo/instollar-sdk`, or full set from `@codearemo/instollar-sdk/icons` — no extra install required (see [§1.4](#14-icons--do-you-need-an-extra-install), [§4.3](#43-icon--iconsax-icons))
- [ ] On buttons: `<Icon icon={…} />` with default `current` (do **not** use `color="primary"` on primary buttons)
- [ ] Confirm primary buttons show **white** label on **dark green** fill (`#012b15`)
- [ ] Confirm Checkbox uses the same primary-dot treatment as Radio (square control)
- [ ] Prefer portal `Select` APIs (`value` / `onValueChange`); use `LoadBoundary`, `SegmentedTabs`, `StatusBadge` as needed

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
npm install @codearemo/instollar-sdk@^0.1.4
```

| Part | Meaning |
|------|---------|
| `@codearemo/instollar-sdk` | Scoped package name (org + package) |
| `@^0.1.4` | Semver range — latest compatible 0.1.x |

If you see a **404 on `registry.npmjs.org`**, npm is not using GitHub Packages — fix `.npmrc` and retry.

### 1.3 Peer dependencies

Your app must already have:

- `react` >= 18
- `react-dom` >= 18

### 1.4 Icons — do you need an extra install?

**Usually no.** Installing `@codearemo/instollar-sdk` already pulls `iconsax-react` as a dependency of `@codearemo/instollar-react`.

You get icons in three ways:

| Approach | Install extra? | Import from |
|----------|----------------|-------------|
| **Curated set** (recommended) | No | `@codearemo/instollar-sdk` — e.g. `Home2`, `SearchNormal1` |
| **Full Iconsax re-export** | No | `@codearemo/instollar-sdk/icons` (~993 icons) |
| **Direct Iconsax** (optional) | Optional | `iconsax-react` — only if you want that package as a direct app dependency |

Optional direct install (same Iconsax version the SDK uses):

```bash
npm install iconsax-react@^0.0.8
```

You still wrap icons with the SDK `Icon` component for size/color consistency:

```tsx
import { Icon } from '@codearemo/instollar-sdk';
import { Bluetooth } from 'iconsax-react';
// or: import { Bluetooth } from '@codearemo/instollar-sdk/icons';

<Icon icon={Bluetooth} size="md" color="primary" />
```

Full usage patterns are in [§4.3 Icon + Iconsax](#43-icon--iconsax-icons).

---

## 2. One-time app setup

Do these once at the app root (e.g. `main.tsx` / `App.tsx` / global CSS).

### 2.1 Styles (required)

```tsx
import '@codearemo/instollar-react/styles.css';
```

This ships precompiled component styles (Tailwind utilities that the SDK components use, brand theme tokens, typography utilities, and a few component-specific rules). You do **not** need Tailwind to scan `node_modules` for the SDK to look correct.

You can also import styles from the umbrella package:

```tsx
import '@codearemo/instollar-sdk/styles.css';
```

Prefer `styles.css` over importing `@codearemo/instollar-tokens/tokens.css` alone — the react styles already include tokens + typography + Tailwind theme.

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

### 2.3 Minimal working page

No theme wrapper. Light UI only.

```tsx
import '@codearemo/instollar-react/styles.css';
import { Button, Text, Icon, Home2 } from '@codearemo/instollar-sdk';

export function Example() {
  return (
    <div className="p-6 bg-background text-foreground">
      <Text variant="spline-bold-h4">Hello</Text>
      <Text variant="open-regular-p">Body copy with Open Sans.</Text>
      {/* Icon defaults to color="current" — inherits the white button label */}
      <Button prefix={<Icon icon={Home2} size="sm" />}>Continue</Button>
    </div>
  );
}
```

**Prefer the umbrella import:**

```ts
import { Button, Text, Input } from '@codearemo/instollar-sdk';
```

### 2.4 Tailwind and this SDK

| Who | Tailwind role |
|-----|----------------|
| **SDK package** | Components use Tailwind utility classes. At publish time, Tailwind CLI compiles them into `styles.css`. |
| **Consuming app** | **No Tailwind setup required** for SDK UI. Import `styles.css` once. |

**You do not need** a `tailwind.config`, `@tailwind` directives, or content paths that scan `node_modules/@codearemo/**` for the SDK to render correctly.

**If your app already uses Tailwind** (e.g. its own UI), that is fine — both can coexist:

1. Keep your app’s Tailwind pipeline for *your* classes.
2. Still import `@codearemo/instollar-react/styles.css` (or SDK `styles.css`) so SDK components get their compiled styles.
3. Optional: use SDK brand utilities from that CSS (`bg-primary`, `text-muted`, `font-spline`, …) in your own JSX — see [§3.3](#33-tailwind-style-utilities-from-stylescss).

**Do not** expect every Tailwind utility to exist from `styles.css` alone. The precompiled file contains what the SDK scanned at build time (component sources + theme + typography). App-only classes like an arbitrary `gap-7` only work if *your* Tailwind build emits them.

`cn` (`clsx` + `tailwind-merge`) is exported so you can safely merge SDK + app classNames when your app uses Tailwind.

---

## 3. Design tokens

Installed via `@codearemo/instollar-tokens` (dependency of the SDK).

### 3.1 Brand

| Token | Value | Typical use |
|-------|--------|-------------|
| Primary | `#012b15` | Button fill, links, strong brand |
| Secondary | `#effe3e` | Accent / secondary button fill |
| Destructive | `#b42318` | Errors / danger actions |

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

These work in your JSX `className` after importing `styles.css` (from the SDK `@theme` mapping):

| Utility | Maps to |
|---------|---------|
| `bg-primary` / `text-primary` / `border-primary` | Brand primary `#012b15` |
| `bg-secondary` / `text-secondary` / `border-secondary` | Brand secondary `#effe3e` |
| `bg-background` / `text-foreground` | Page surface / text |
| `text-muted` / `bg-muted` | Muted text / soft fills |
| `border-border` | Standard border |
| `text-destructive` / `bg-destructive` / `border-destructive` | Errors |
| `font-spline` | Spline Sans |
| `font-inter` | Inter |
| `font-open` | Open Sans |

Plus layout utilities that the SDK components themselves use (flex, gap, rounded, etc.) — available because they were included when `styles.css` was built.

### 3.4 JS token exports (optional)

```ts
import { brand, colors, fonts } from '@codearemo/instollar-tokens';

brand.primary; // '#012b15'
brand.secondary; // '#effe3e'
colors.bg; // '#ffffff'
colors.fg; // same as brand.primary
colors.destructive; // '#b42318'
fonts.spline; // '"Spline Sans", sans-serif'
fonts.inter;
fonts.openSans;
```

### 3.5 CSS entry points (tokens package)

| Import | When to use |
|--------|-------------|
| `@codearemo/instollar-react/styles.css` (or SDK `styles.css`) | **Default** — includes tokens + typography + Tailwind theme + component CSS |
| `@codearemo/instollar-tokens/tokens.css` | Rare — only if you need `:root` vars **without** the full react stylesheet |
| `@codearemo/instollar-tokens/typography.css` | Rare — style-guide `@utility text-*` classes when not using full `styles.css` |

`styles.css` already pulls in both token CSS files. Most apps only ever import `styles.css`.

### 3.6 Full typography utilities

Prefer the `Text` component’s curated `variant`s for product UI. For one-off raw classes (or when you import typography CSS directly), these `text-*` utilities exist:

**Spline Sans**

`text-spline-bold-display`, `text-spline-bold-h4`, `text-spline-bold-h5`, `text-spline-bold-h6`, `text-spline-bold-label`, `text-spline-bold-p`, `text-spline-bold-tiny`, `text-spline-light-display`, `text-spline-light-h1`, `text-spline-light-h2`, `text-spline-regular-h2`, `text-spline-light-h3`, `text-spline-light-h4`, `text-spline-light-h5`, `text-spline-light-h6`, `text-spline-light-p`, `text-spline-light-label`, `text-spline-regular-p`, `text-spline-regular-h5`, `text-spline-regular-h6`, `text-spline-regular-label`, `text-spline-regular-tiny`, `text-spline-light-tiny`

**Open Sans**

`text-open-bold-display`, `text-open-bold-h1` … `h4`, `text-open-bold-h5`, `text-open-bold-h5-sm`, `text-open-bold-h6`, `text-open-bold-p`, `text-open-bold-label`, `text-open-bold-tiny`, `text-open-regular-display`, `text-open-regular-h1` … `h6`, `text-open-regular-p`, `text-open-regular-label`, `text-open-regular-tiny`

(`Text` component variants omit the `text-` prefix — e.g. `variant="open-regular-p"` → class `text-open-regular-p`.)

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
  StatusBadge,
  Switch,
  Text,
  Textarea,
  Home2,
  User,
  Lock,
  ArrowRight2,
  TickCircle,
  CloseCircle,
  SearchNormal1,
  cn,
  loadBoundaryPropsFromQuery,
  selectOptionsPropsFromQuery,
} from '@codearemo/instollar-sdk';
```

Fields default to the **light** surface. Do not rely on a theme provider.

`variant="dark"` on form fields (`FieldSurface`) is still exported for dark *input chrome* inside a light app (e.g. a dark search bar). It is **not** an app-wide dark theme.

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
<Button prefix={<Icon icon={Home2} size="sm" />} suffix={<Icon icon={ArrowRight2} size="sm" />}>
  Home
</Button>
```

| Variant | Appearance |
|---------|------------|
| `primary` | Dark green fill (`#012b15`) + **white** label; regular (lighter) weight |
| `secondary` | Lime fill + dark green label |
| `ghost` | Transparent + border |
| `destructive` / `danger` | Red fill + white label |

Colors use CSS vars with **hex fallbacks**, so labels stay visible even if host CSS vars fail.

`loading` disables the button, sets `aria-busy`, and shows a centered spinner while keeping width.

---

### 4.3 `Icon` + Iconsax icons

Thin wrapper over [Iconsax](https://iconsax-react.pages.dev/). Always pass an Iconsax component into the `icon` prop — do not render Iconsax components bare if you want Instollar sizing/colors.

#### Installation

Already covered in [§1.4](#14-icons--do-you-need-an-extra-install). Summary:

1. Install the SDK once: `npm install @codearemo/instollar-sdk@^0.1.4`
2. Import curated icons from `@codearemo/instollar-sdk`, **or** any icon from `@codearemo/instollar-sdk/icons`
3. Optionally `npm install iconsax-react@^0.0.8` if your tooling prefers a direct dependency

No separate “icons package” from Instollar — icons ship with the SDK.

#### Import patterns

```ts
// A) Curated icons + Icon wrapper (preferred for common UI)
import { Icon, Home2, SearchNormal1, User, Lock } from '@codearemo/instollar-sdk';

// B) Full catalog via SDK subpath (~993 icons)
import { Icon } from '@codearemo/instollar-sdk';
import { Bluetooth, Wifi, Activity } from '@codearemo/instollar-sdk/icons';
// same catalog: '@codearemo/instollar-react/icons'

// C) Direct iconsax-react (optional direct dep)
import { Icon } from '@codearemo/instollar-sdk';
import { Bluetooth } from 'iconsax-react';
```

Prefer **named** imports so bundlers can tree-shake. Avoid:

```ts
import * as Icons from '@codearemo/instollar-sdk/icons'; // pulls a huge surface
```

Browse names at [iconsax-react demo](https://iconsax-react.pages.dev/).

#### Props

| Prop | Type | Default |
|------|------|---------|
| `icon` | Iconsax component | required |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` → `{13,16,20,32,48}` px |
| `color` | `'current' \| 'primary' \| 'secondary' \| 'muted' \| 'inverse' \| 'destructive'` | `'current'` |
| `variant` | `'Linear' \| 'Outline' \| 'Broken' \| 'Bold' \| 'Bulk' \| 'TwoTone'` | `'Linear'` |

Iconsax paints via the SVG **`color` prop** (fill/stroke). The wrapper maps:

| `color` | Resolves to |
|---------|-------------|
| `current` | `currentColor` (inherits parent text) |
| `primary` | `var(--color-primary, #012b15)` |
| `secondary` | `var(--color-secondary, #effe3e)` |
| `muted` | `var(--color-muted, …)` |
| `inverse` | `#ffffff` |
| `destructive` | `var(--color-destructive, #b42318)` |

#### Color rules (avoid invisible icons)

| Situation | What to do |
|-----------|------------|
| Icon inside `Button` / Chip / tab | Omit `color` (default `current`) so it inherits the label |
| Standalone icon on a page | Set `color="primary"` / `muted` / etc. |
| Primary button | Never use `color="primary"` — green on green looks invisible |

#### Implementation examples

**Inside buttons / chips (inherit label color):**

```tsx
import { Button, Chip, Icon, Home2, ArrowRight2 } from '@codearemo/instollar-sdk';

<Button prefix={<Icon icon={Home2} size="sm" />} suffix={<Icon icon={ArrowRight2} size="sm" />}>
  Home
</Button>

<Chip selected prefix={<Icon icon={Home2} size="xs" />}>
  Solar
</Chip>
```

**Standalone icons:**

```tsx
import { Icon, Home2, User, Lock } from '@codearemo/instollar-sdk';

<div className="flex items-center gap-3">
  <Icon icon={Home2} size="md" color="primary" />
  <Icon icon={User} size="md" color="muted" />
  <Icon icon={Lock} size="lg" color="destructive" variant="Bold" />
</div>
```

**Icon from the full catalog / direct package:**

```tsx
import { Button, Icon } from '@codearemo/instollar-sdk';
import { Bluetooth } from '@codearemo/instollar-sdk/icons';

<Button prefix={<Icon icon={Bluetooth} size="sm" />}>Connect</Button>

<Icon icon={Bluetooth} size="md" color="primary" />
```

**Input prefix:**

```tsx
import { Icon, Input, SearchNormal1 } from '@codearemo/instollar-sdk';

<Input
  label="Search"
  prefix={<Icon icon={SearchNormal1} size="sm" color="muted" />}
/>
```

#### Curated icons (from `@codearemo/instollar-sdk`)

| Group | Icons |
|-------|--------|
| Navigation | `Home2`, `ArrowLeft2`, `ArrowRight2`, `ArrowDown2`, `ArrowUp2`, `ArrowCircleLeft2`, `ArrowCircleRight2`, `Menu` |
| People / auth | `User`, `UserAdd`, `Profile2User`, `People`, `Login`, `Logout`, `Lock`, `Unlock`, `Eye`, `EyeSlash`, `ShieldTick`, `SecuritySafe` |
| Actions | `Add`, `AddCircle`, `Minus`, `CloseCircle`, `TickCircle`, `TickSquare`, `Trash`, `Edit2`, `Copy`, `DocumentDownload`, `DocumentUpload`, `Send2`, `Refresh`, `SearchNormal1`, `Filter`, `More`, `More2` |
| Feedback | `InfoCircle`, `Warning2`, `Danger`, `Notification`, `NotificationBing` |
| Time / place | `Calendar`, `Clock`, `Location`, `Gps` |
| Media / files | `Gallery`, `Image`, `DocumentText`, `Folder2` |
| Work | `Bag2`, `Box1`, `Briefcase`, `Chart`, `Chart21`, `Setting2`, `Setting4`, `Category` |
| Misc | `Sun`, `Sun1`, `Moon` |

Anything not in this table: import from `@codearemo/instollar-sdk/icons` (or `iconsax-react`) and pass into `<Icon icon={…} />`.

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
| `variant` | `'light' \| 'dark'` | Defaults to `'light'` — use light for Instollar apps |
| `prefix` / `suffix` | `ReactNode` | Icons / adornments |
| `type="password"` | — | Built-in eye toggle (merges with `suffix`) |
| `type="number"` | — | Renders text + `inputMode="decimal"`; display has commas; `onChange` emits **raw** value (no commas) |
| … | input HTML attrs | `disabled`, `placeholder`, `value`, etc. |

```tsx
<Input label="Email" placeholder="you@example.com" />
<Input label="Password" type="password" error="Required" />
<Input label="Amount" type="number" placeholder="1,000" />
<Input
  label="Search"
  prefix={<Icon icon={SearchNormal1} size="sm" color="muted" />}
/>
```

**Number-input helpers** (also exported for custom fields):

| Helper | Role |
|--------|------|
| `sanitizeNumberInput(value)` | Strip commas / invalid chars; keep at most one `.` |
| `formatNumberInput(value)` | Thousand-separated display string while typing |
| `numberInputDisplayValue(value)` | Format a controlled `value` for display |
| `numberInputRawValue(value)` | Strip formatting → raw string for APIs |

```ts
import { formatNumberInput, numberInputRawValue } from '@codearemo/instollar-sdk';

formatNumberInput('1000'); // '1,000'
numberInputRawValue('1,000.5'); // '1000.5'
```

---

### 4.6 `Textarea`

Same field API as Input (`label`, `error`, `variant`, `prefix`, `suffix`) minus password/number.

```tsx
<Textarea label="Notes" placeholder="Optional" rows={4} />
```

---

### 4.7 `Checkbox`

Custom peer checkbox (not native browser chrome). Matches **Radio**’s indicator pattern: bordered control + primary-colored inner mark when checked (square outer / square inner; Radio is circular).

| Prop | Type | Notes |
|------|------|--------|
| `label` | `ReactNode` | |
| `description` / `error` | `string` | Helper + alert text |
| `variant` | `'light' \| 'dark'` | Defaults to `'light'` |
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
| `variant` | Defaults to `'light'` | |

```tsx
const [on, setOn] = useState(false);

<Switch label="Notifications" defaultChecked />
<Switch label="Email digests" checked={on} onCheckedChange={setOn} />
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
| `optionsLoadingLabel` / `optionsErrorLabel` / `reloadLabel` | Copy for async states (defaults: loading / error / “Try again”) | |
| `compareValue` / `getOptionKey` / `getOptionLabel` | Object-valued options | |
| `createOptionLabel` / `formatCreateValue` / `normalizeCreateInput` / `isValidCreateInput` / `onCreateOption` | Creatable pipeline | |
| `customInputPlaceholder` | Placeholder for creatable inline input (default `Add custom…`) | |
| `label` / `error` / `variant` / `prefix` / `suffix` / `placeholder` / `disabled` / `id` | Field chrome (`variant` defaults to `'light'`) | |

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
  creatable
  value={skills}
  onValueChange={(v) => setSkills(v as string[])}
  options={[
    { value: 'wiring', label: 'Wiring' },
    { value: 'roofing', label: 'Roofing' },
  ]}
/>
```

Helper for TanStack Query–shaped objects:

```ts
<Select
  options={options}
  {...selectOptionsPropsFromQuery(query)}
  value={value}
  onValueChange={setValue}
/>
```

`onValueChange` is typed as `(value: T | T[]) => void` — cast when you know single vs multiple.

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

**Helpers / class maps** (for custom toast overlays):

| Export | Role |
|--------|------|
| `alertContainerClasses` | Inline soft surfaces by variant |
| `toastContainerClasses` | Opaque toast surfaces by variant |
| `alertIconChipClasses` | Icon chip colors by variant |
| `alertVariantClasses` | **Deprecated** alias of `alertContainerClasses` |
| `toastVariantFromApi(type)` | Maps `'success' \| 'error'` → `AlertVariant` |

```ts
import { Alert, toastVariantFromApi } from '@codearemo/instollar-sdk';

const variant = toastVariantFromApi(api.type); // 'success' | 'error'
<Alert appearance="toast" variant={variant} title="Saved" />
```

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

Light surface only (border + padding + shadow).

| Prop | Type | Notes |
|------|------|--------|
| `variant` | `'light'` | Typed for future variants; currently only `'light'` (styling is the default card look) |
| … | div HTML attrs | `className`, etc. |

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
| `accent` | `'adaptive' \| 'primary' \| 'destructive'` | `'adaptive'` (same as primary in light UI) |
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

Wrap in `max-w-full` if the track may overflow on small screens.

---

### 4.16 `LoadBoundary`

Async page shell for loading / error / stale / forbidden states.

| Prop | Type | Meaning |
|------|------|---------|
| `isLoading` | `boolean` | First load — no content |
| `isError` | `boolean` | Failed |
| `isStale` | `boolean` | Error **with** prior `children` — content + top-right stale banner |
| `permitted` | `boolean` | Default `true`; `false` → forbidden shell |
| `error` | `Error \| null` | Feeds default error message |
| `loadingMessage` | `ReactNode` | Loading shell copy |
| `errorTitle` / `errorMessage` | `ReactNode` | Error shell (message defaults to `error.message`) |
| `staleMessage` | `ReactNode` | Stale banner copy |
| `forbiddenTitle` / `forbiddenMessage` | `ReactNode` | Forbidden shell copy |
| `onRetry` | `() => void` | Retry / refresh action |
| `retryLabel` / `refreshLabel` | `string` | Button labels |
| `minHeight` | `string \| number` | Shared footprint for shells |
| `loadingFallback` / `errorFallback` / `forbiddenFallback` | `ReactNode` | Replace default shells |
| `className` / `style` | — | Wrapper |

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

Helper for TanStack Query–shaped objects:

```ts
<LoadBoundary {...loadBoundaryPropsFromQuery(query)} onRetry={() => query.refetch()}>
  …
</LoadBoundary>
```

---

### 4.17 `StatusBadge`

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

### 4.18 `FieldControl`

Shared bordered field chrome used by `Input`, `Textarea`, and `Select`. Use it to build custom controls with the same look.

| Prop | Type | Notes |
|------|------|--------|
| `variant` | `'light' \| 'dark'` | Required `FieldSurface` |
| `prefix` / `suffix` | `ReactNode` | Adornments |
| `error` | `boolean` | Destructive border |
| `disabled` | `boolean` | Opacity |
| `children` | `ReactNode` | Control content (required) |
| `className` | `string` | — |

```tsx
import { FieldControl, formFieldLabelClass, formFieldErrorClass } from '@codearemo/instollar-sdk';

<label className={formFieldLabelClass}>Custom</label>
<FieldControl variant="light" prefix={<Icon icon={SearchNormal1} size="sm" />}>
  <input className="w-full bg-transparent px-3 py-2 outline-none" />
</FieldControl>
{error ? <p className={formFieldErrorClass}>{error}</p> : null}
```

Related class helpers: `formControlVariantClasses`, `formFieldLabelClass`, `formFieldErrorClass`, `formFieldDescriptionClass` (see [§5.3](#53-form--variant-class-maps)).

---

## 5. Helpers, hooks, and class maps

### 5.1 `cn`

Classname merge (`clsx` + `tailwind-merge`), exported for app use:

```tsx
import { cn, Button } from '@codearemo/instollar-sdk';

<Button className={cn('w-full', isWide && 'max-w-md')} />
```

### 5.2 Hooks

#### `useClickOutside`

Fires when pointer is outside one or more refs (used internally by `Select`).

```ts
import { useRef } from 'react';
import { useClickOutside } from '@codearemo/instollar-sdk';

const panelRef = useRef<HTMLDivElement>(null);
useClickOutside(panelRef, () => setOpen(false), open);
// or: useClickOutside([panelRef, buttonRef], handler, enabled)
```

| Arg | Type | Notes |
|-----|------|--------|
| `refs` | `RefObject \| RefObject[]` | Elements that count as “inside” |
| `handler` | `() => void` | Called on outside pointer down |
| `enabled` | `boolean` | Default `true` |

#### `useFloatingPosition`

Anchor-relative dropdown placement (flip up/down, clamp width, max height). Used by `Select`.

```ts
import { useRef, useState } from 'react';
import { useFloatingPosition } from '@codearemo/instollar-sdk';

const anchorRef = useRef<HTMLButtonElement>(null);
const [open, setOpen] = useState(false);
const position = useFloatingPosition(anchorRef, open, 224);
// position: { top?, bottom?, left, width, maxHeight, placement: 'top' | 'bottom' } | null
```

| Arg | Type | Notes |
|-----|------|--------|
| `anchorRef` | `RefObject<HTMLElement \| null>` | Trigger element |
| `open` | `boolean` | Recalculates while open |
| `maxHeight` | `number` | Default `224` |

Types: `FloatingPlacement`, `FloatingPosition`.

### 5.3 Form / variant class maps

For custom fields and overlays that must match Instollar chrome:

| Export | Role |
|--------|------|
| `formControlVariantClasses` | `FieldSurface` → field surface classes |
| `formFieldLabelClass` | Standard label |
| `formFieldErrorClass` | Error text |
| `formFieldDescriptionClass` | Helper text |
| `statusBadgeBaseClasses` / `statusBadgeToneClasses` | Build custom status pills |
| `alertContainerClasses` / `toastContainerClasses` / `alertIconChipClasses` | Alert / toast surfaces |
| `alertVariantClasses` | Deprecated alias of `alertContainerClasses` |
| `segmentedTabsTrackClasses` | Track wrapper |
| `segmentedTabBaseClasses` / `segmentedTabSizeClasses` | Tab pills |
| `segmentedTabBadgeBaseClasses` | Count chip base |
| `getSegmentedTabStateClasses(accent, selected)` | Active/inactive tab classes |
| `getSegmentedTabBadgeClasses(accent, selected)` | Badge chip classes |

### 5.4 Query helpers (TanStack-shaped)

Already shown under Select / LoadBoundary:

| Export | Maps from |
|--------|-----------|
| `selectOptionsPropsFromQuery(query)` | `isPending` / `isError` / etc. → Select options loading props |
| `loadBoundaryPropsFromQuery(query)` | Query flags → LoadBoundary loading/error/stale |

Neither package depends on `@tanstack/react-query` — pass any object with the expected flags.

### 5.5 Other helpers

| Export | Role |
|--------|------|
| `sanitizeNumberInput` / `formatNumberInput` / `numberInputDisplayValue` / `numberInputRawValue` | Number field formatting ([§4.5](#45-input)) |
| `toastVariantFromApi` | `'success' \| 'error'` → Alert variant ([§4.11](#411-alert)) |

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
          onValueChange={(v) => setTopic(v as string)}
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

| Package / path | When to import |
|----------------|----------------|
| `@codearemo/instollar-sdk` | **Default** — all components, helpers, hooks, curated icons |
| `@codearemo/instollar-sdk/icons` | Full Iconsax catalog (~993 icons) |
| `@codearemo/instollar-sdk/styles.css` | Umbrella styles entry |
| `@codearemo/instollar-react` | Same components; also `styles.css` / `icons` |
| `@codearemo/instollar-react/icons` | Same full Iconsax catalog |
| `@codearemo/instollar-react/styles.css` | Precompiled Tailwind CSS (preferred styles path) |
| `@codearemo/instollar-tokens` | JS `brand` / `colors` / `fonts` |
| `@codearemo/instollar-tokens/tokens.css` | `:root` CSS variables only |
| `@codearemo/instollar-tokens/typography.css` | Full `text-*` style-guide utilities |

Exports from the umbrella match `@codearemo/instollar-react`. Transitive deps (`iconsax-react`, `clsx`, `tailwind-merge`) come with the react package — you do not need to install them unless you want them as direct dependencies.

### 7.1 Complete public API (umbrella / react)

**Components:** `Alert`, `Badge`, `Button`, `Card`, `Checkbox`, `Chip`, `FieldControl`, `Icon`, `Input`, `LoadBoundary`, `Radio`, `RadioGroup`, `SegmentedTab`, `SegmentedTabs`, `Select`, `Spinner`, `StatusBadge`, `Switch`, `Text`, `Textarea`

**Curated icons:** see [§4.3](#43-icon--iconsax-icons)

**Hooks:** `useClickOutside`, `useFloatingPosition`

**Utils:** `cn`, `selectOptionsPropsFromQuery`, `loadBoundaryPropsFromQuery`, `sanitizeNumberInput`, `formatNumberInput`, `numberInputDisplayValue`, `numberInputRawValue`, `toastVariantFromApi`, `getSegmentedTabStateClasses`, `getSegmentedTabBadgeClasses`

**Class maps:** `formControlVariantClasses`, `formFieldLabelClass`, `formFieldErrorClass`, `formFieldDescriptionClass`, `statusBadgeBaseClasses`, `statusBadgeToneClasses`, `alertContainerClasses`, `toastContainerClasses`, `alertIconChipClasses`, `alertVariantClasses` (deprecated), `segmentedTabsTrackClasses`, `segmentedTabBaseClasses`, `segmentedTabSizeClasses`, `segmentedTabBadgeBaseClasses`

**Tokens JS:** `brand`, `colors`, `fonts` from `@codearemo/instollar-tokens`

---

## 8. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `404` on `registry.npmjs.org` | File must be named `.npmrc`; `@codearemo` must point at `https://npm.pkg.github.com` |
| `401` / `403` from GitHub Packages | Set `NODE_AUTH_TOKEN` with `read:packages`; authorize SSO for `codearemo` if required |
| Package not found after tag | Confirm Actions → **Publish** for tag `v0.1.4` succeeded |
| Components unstyled | Import `@codearemo/instollar-react/styles.css` (or SDK `styles.css`) once at app root |
| App Tailwind classes missing on SDK pages | App utilities come from *your* Tailwind build; SDK `styles.css` only includes what the SDK compiled. Keep both pipelines if you need both |
| Wrong fonts | Load Google Fonts (or `next/font`) for Spline / Inter / Open Sans |
| Invisible icons on primary buttons | Default Icon `color` is `current` (inherits white label). Never use `color="primary"` on a primary button |
| Checkbox / Select chevron / Alert icons missing | Iconsax needs the SVG `color` prop — fixed in SDK internals. If you render Iconsax yourself, pass `color` (or use `<Icon icon={…} />`), not only `className="text-…"` |
| Button label invisible | Import `styles.css`. Primary uses white label on green fill via inline styles — rebuild/upgrade if still missing |
| Looking for dark mode / ThemeProvider | Removed in 0.1.2 — Instollar apps are light-only |
| Large bundle after icons | Prefer curated named imports from `@codearemo/instollar-sdk`; use `/icons` only for icons not in the curated set |
| Select TypeScript type fuss | Cast `onValueChange` when using single vs `multiple` |

---

## 9. Out of scope (0.1.4)

Not in this release — add later if needed:

- API client / OpenAPI / auth session
- React Native package
- Overlay / toast stacks (Alert `appearance="toast"` is ready to reuse)
- Dark mode / theme provider
- Domain `AddressInput` (locations API)

---

## 10. Upgrade

```bash
npm install @codearemo/instollar-sdk@^0.1.4
```

After upgrading, restart the Vite/Next dev server so CSS and package resolution refresh.

### Breaking / migration notes

| Change | Migration |
|--------|-----------|
| `Select` is not a native `<select>` | Use `value` / `defaultValue` / `onValueChange`; supports `multiple` / `searchable` / `creatable` |
| `Badge` variants renamed | Use `kicker` / `eyebrow` / `success` / `destructive` / `neutral` / `secondary` |
| `Alert` variants expanded | Prefer `error` or `destructive`; optional `appearance` / `onDismiss` |
| Icons (0.1.2+) | Default `color="current"`; on buttons omit `color`. Full catalog: `@codearemo/instollar-sdk/icons` |
| Theme removed (0.1.2) | Delete `ThemeProvider` / `ThemeToggle` — light-only |
| Button / Iconsax paint (0.1.3) | Checkbox, Select chevron, Alert icons, password eyes paint correctly; Button uses inline fill/label colors. Upgrade from 0.1.2 if those were invisible |
| Checkbox + primary Button (0.1.4) | Checkbox uses Radio-style primary indicator; primary Button label is white with regular weight |
