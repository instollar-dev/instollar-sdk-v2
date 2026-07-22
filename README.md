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
pnpm add @instollar-dev/instollar-sdk@^0.4.5
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
| `--color-destructive` | `#f49e0c` | `#fbbf24` |
| `--color-danger` | `#dc2626` | `#ef4444` |

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

## Toasts

The SDK ships an imperative **`toast`** helper (no third-party toast library). On **web** it renders a fixed stack on `document.body`; on **mobile** it logs to the console. Import `@instollar-dev/instollar-react/styles.css` (or ensure Instollar CSS variables are on `:root`) so web toasts pick up light/dark tokens.

```tsx
import { toast } from '@instollar-dev/instollar-sdk';

toast.success('Saved');
toast.error('Something went wrong');
toast.warning('Check your input');
toast.info('New version available');
toast.message('Longer notice', { title: 'Update', autoClose: 15000 });
toast.show({
  type: 'error',
  title: 'Validation',
  description: 'Email is required',
  position: 'bottom-center',
});
```

**Options** (`ToastOptions`): `title`, `description`, `message`, `type`, `autoClose` (default 5000ms, `message` type 10000ms), `closeOnClick`, `position` (`top-right`, `bottom-center`, …).

### Automatic toasts from the HTTP client

After `initAxios`, interceptors read **request metadata**:

- **`showErrorToast`** — defaults to **`true`** if omitted. Set to `false` to silence errors, or pass a partial `ToastOptions` object for title/position overrides.
- **`showSuccessToast`** — off by default. Set to `true` or pass partial options; success title defaults by HTTP method (POST → “Action Successful”, etc.).

```tsx
await api.post('/users', payload, {}, { showSuccessToast: true });

await api.get('/quiet', {}, {}, { showErrorToast: false });

await api.post('/x', data, {}, {
  showErrorToast: { title: 'Validation', position: 'bottom-right' },
});
```

Domain APIs often use `{ showSuccessToast: true }` on mutations and `{ showSuccessToast: false, showErrorToast: false }` for silent reads.

### React `Alert` vs `toast`

| | `toast.*` | `<Alert appearance="toast" />` |
|--|-----------|----------------------------------|
| Use | Imperative / axios | Declarative in React trees |
| API errors | Yes (default) | No (unless you wire it) |
| Theming | Reads CSS variables on web | Tailwind classes from `styles.css` |

`toastVariantFromApi('success' | 'error')` maps API flags to Alert variants when you build your own UI.

## Address autocomplete (Google Places API New)

`AddressAutocomplete` is a **controlled** text field with debounced Places **Autocomplete** + **Place Details** over plain `fetch` — no Google Maps JavaScript SDK.

Provide a key via the **`apiKey` prop** or `initInstollarSDK({ googlePlacesApiKey, … })`. Restrict the key in Google Cloud (Places API (New) only; HTTP referrers as needed).

```tsx
import {
  AddressAutocomplete,
  type AddressComponents,
  initInstollarSDK,
} from '@instollar-dev/instollar-sdk';

initInstollarSDK({ baseUrl: '…', googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY });

const [query, setQuery] = useState('');

<AddressAutocomplete
  label="Street address"
  inputValue={query}
  onInputChange={setQuery}
  onPlaceSelect={(address: AddressComponents) => {
    console.log(address.street, address.city, address.latitude);
  }}
  apiKey={process.env.GOOGLE_PLACES_API_KEY}
  helperText="Start typing to search"
  error={formError}
/>
```

**Parent contract:** `inputValue` / `onInputChange` for typing; `onPlaceSelect` receives parsed `AddressComponents` (`street`, `city`, `state`, `lga`, `postalCode`, `country`, `landmark`, `latitude`, `longitude`, `formattedAddress`, `placeTypes`). The `error` prop overrides API error text for display.

Low-level helpers are exported for custom UIs: `fetchPlaceAutocompleteSuggestions`, `fetchPlaceDetailsAsAddress`, `parseAddressComponents`.

## File upload

`FileUpload` is drag-and-drop + browse with optional `autoUpload`. The SDK does **not** ship your HTTP client or IndexedDB — pass `uploadFn` (multipart field `files`) and optional `offlineSaveFn` / `resolveOfflineBlobLabel` / `renderOfflineBlobPreview` from the host app.

```tsx
import {
  FileUpload,
  ALL_DOCUMENT_UPLOAD_ACCEPT,
  type UploadedFileAsset,
} from '@instollar-dev/instollar-sdk';

<FileUpload
  autoUpload
  uploadFn={uploadFromYourApi}
  allowOfflineSave
  offlineSaveFn={saveToLocalStore}
  isOnline={isOnline}
  onUploadComplete={(assets: UploadedFileAsset[]) => {
    form.setValue('fileUrl', assets[0]?.fileUrl);
  }}
/>
```

Export `ALL_DOCUMENT_UPLOAD_ACCEPT` (`*/*`) for workflow screens that accept any document type.

## Settings accordion

`SettingsItem` is a controlled collapsible settings row (header + unmounted body when closed). Use **stable English section keys** with `useSettingsAccordion` for single-open behaviour:

```tsx
import {
  SettingsItem,
  useSettingsAccordion,
  Icon,
  SecuritySafe,
} from '@instollar-dev/instollar-sdk';

const { isSectionOpen, toggleSection } = useSettingsAccordion();

<SettingsItem
  icon={<Icon icon={SecuritySafe} size="lg" color="primary" />}
  title={t('settings.sections.account.title')}
  description={t('settings.sections.account.desc')}
  isOpen={isSectionOpen('Account & Security')}
  onClick={() => toggleSection('Account & Security')}
>
  {/* forms, switches, links */}
</SettingsItem>
```

Header is a real `<button>` with `aria-expanded` (improves on the app-local `div` pattern).

## Avatar

Shows an image when `src` is set; otherwise (or if the image fails) shows initials.

```tsx
import { Avatar } from '@instollar-dev/instollar-sdk';

<Avatar src={user.avatarUrl} initials="Sarah Adams" />
<Avatar src={null} initials="SA" size="lg" />
```

`initials` accepts a short code (`"SA"`) or a full name (`"Sarah Adams"` → `SA`). Sizes: `sm` | `md` | `lg`. Pass `onClick` to render a focusable button.

## Segments

Pill-track view switcher (icon + label). Controlled via `value` / `onChange`, or route-driven like Tabs:

```tsx
import { Segments, Icon, Element3, TextalignLeft } from '@instollar-dev/instollar-sdk';
import { useLocation, useNavigate } from 'react-router-dom';

const location = useLocation();
const navigate = useNavigate();

<Segments
  useRoutes
  basePath="/leads"
  defaultValue="pipeline"
  router={{ pathname: location.pathname, navigate }}
  options={[
    { value: 'pipeline', label: 'Pipeline', path: 'pipeline', icon: <Icon icon={Element3} size="sm" /> },
    { value: 'table', label: 'Table', path: 'table', icon: <Icon icon={TextalignLeft} size="sm" /> },
  ]}
/>
```

Clicks use `navigate(..., { replace: true })` so segment switches do not stack history.
## Local development (this repo)

```bash
pnpm install
pnpm build
pnpm test
pnpm playground
```

## Release

1. Keep package versions lockstep (`0.4.5` everywhere until you need otherwise).
2. Commit, then tag and push:

```bash
git tag v0.4.5
git push origin v0.4.5
```

The Publish workflow builds and publishes all packages to GitHub Packages under the `instollar-dev` org.
