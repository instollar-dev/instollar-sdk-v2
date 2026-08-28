---
name: instollar-react-native
description: >-
  Agent guide for @instollar-dev/instollar-react-native — Instollar mobile UI,
  theme, toasts, forms, and core API re-exports. Use when building or
  editing Expo / React Native apps that consume this package.
---

# Instollar React Native SDK — Agent Guide

Package: `@instollar-dev/instollar-react-native`

Use this package for **mobile (Expo / React Native)** only. Do **not** import `@instollar-dev/instollar-react` or its `styles.css` in RN apps.

## Install

```bash
npx expo install @instollar-dev/instollar-react-native react-native-svg
npx expo install expo-haptics expo-document-picker expo-image-picker   # optional; enables haptics + file upload
```

Registry: GitHub Packages (`@instollar-dev`). Ensure `.npmrc` auth for `npm.pkg.github.com`.

## App root setup (required)

Wrap once near the root. Order matters:

```tsx
import {
  ThemeProvider,
  ToastProvider,
  initInstollarSDK,
} from '@instollar-dev/instollar-react-native';

initInstollarSDK({ /* env / base URLs */ });

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
```

Peers: `react-native-svg`. Optional: `expo-haptics`.

---

## Providers & theme

| Export | Role |
|--------|------|
| `ThemeProvider` | Light/dark/system theme from `@instollar-dev/instollar-tokens` |
| `useTheme` | `{ mode, setMode, scheme, colors, fonts }` |
| `useThemeColors` | Theme color tokens only |
| `ToastProvider` | Wires core `toast()` to on-screen toasts + haptics |
| `toast` | From core — `toast.success()`, `toast.error()`, etc. |

`ThemeMode`: `'light' | 'dark' | 'system'`.

---

## Success confirmations

| API | When to use |
|-----|-------------|
| **`SuccessModal`** | Centered success dialog after mutations |
| `SuccessPanel` | Shared body only (custom layouts) |
| `SuccessModalIcon` | Default green check seal |

```tsx
const [open, setOpen] = useState(false);

<SuccessModal
  open={open}
  onClose={() => setOpen(false)}
  title="Order Created Successfully!"
  description="You have successfully created an order."
  buttonLabel="View Order"
  onButtonClick={() => router.push(`/orders/${id}`)}
/>
```

---

## Overlays

### `Modal`
Centered dialog. Backdrop appears instantly; panel fades/slides in. Props: `open`, `onClose?`, `closeOnBackdrop?` (default true), `children`, plus RN Modal props (except `transparent`).

### `Sheet`
Lightweight bottom sheet (RN Modal). Backdrop appears instantly; panel slides up/down. No Gorhom dependency. Props: `open`, `onClose?`, `closeOnBackdrop?`, `children`, `style?`, `contentContainerStyle?`, `bottomInset?`.

The panel clears the Android soft-key bar / iOS home indicator on its own: it pads by the host `SafeAreaProvider` bottom inset, with a 48dp floor on Android (the Modal window is translucent, and host insets don't reliably describe the nav bar). Override with `bottomInset`. Host apps must wrap with `SafeAreaProvider` (Expo Router does this by default).

---

## Typography & actions

### `Text`
Props: `variant?`, `muted?`, plus RN `Text` props.

Variants (examples): `spline-bold-h1`…`h4`, `open-regular-p`, `open-medium-label`, etc. Prefer SDK variants over raw font styles.

### `Button`
Props: `variant?` (`primary` | `secondary` | `ghost` | `underline` | `destructive` | `danger`), `tone?`, `size?` (`default` | `sm`), `loading?`, `prefix?`, `suffix?`, `children`, Pressable props. Fires light haptic on press.

### `Spinner`
Themed `ActivityIndicator`. Props: `size?`, `color?`, plus RN props.

### `ProgressBar`
Linear determinate bar. Fill uses **destructive** color. Props: `value` (0–`max`), `max?` (default `100`), `label?`, `showValue?`, `size?` (`sm`|`md`).

```tsx
{/* Bare track — no label / % */}
<ProgressBar value={uploadProgress} />

{/* With optional chrome */}
<ProgressBar value={uploadProgress} label="Uploading" showValue />
```

### `Icon` + named icons
`Icon` props: `name` (Iconsax), `size?` (`xs`|`sm`|`md`|`lg`|`xl` or number), `color?` (token or string), `variant?` (`Linear`|`Outline`|`Bold`|…).

Named exports (subset): `Home2`, `ArrowLeft2`, `Add`, `CloseCircle`, `TickCircle`, `SearchNormal1`, `Notification`, `Setting2`, `Trash`, `Edit2`, … — see package exports.

---

## Forms

### `FieldControl`
Label + error wrapper. Props: `label?`, `error?`, `children`, `style?`.

### `Input`
Labeled text field. Props: `label?`, `error?`, `prefix?`, `suffix?`, `type?` (`text`|`password`|`number`|`email`|`tel`|`url`), `secureTextEntry?`, `onChangeText?`, `containerStyle?`, plus TextInput props (omit `onChange`). Number type uses sanitize/format helpers.

### `PhoneInput`
Country dial code + national number. Dial-code picker uses searchable **`Select` with `presentation="sheet"`** + `Input` `type="tel"`.

```tsx
const [phone, setPhone] = useState({ countryCode: 'NG', nationalNumber: '' });

<PhoneInput
  label="Phone"
  value={phone}
  onChange={setPhone}
  onE164Change={(e164) => console.log(e164)} // +234801…
  defaultCountryCode="NG"
/>
```

- `value.nationalNumber` is **digits only**; UI applies `Country.inputFormat`
- Max length from `Country.phoneLength`
- Flag prefix on the dial-code trigger and each option: `flagcdn.com` PNG (`https://flagcdn.com/w40/{iso2}.png`), falling back to the emoji flag if the image fails to load (e.g. offline)
- **Dark mode:** selected country row in the sheet uses **destructive** (amber); trigger text stays **foreground**
- Helpers also exported: `toE164`, `formatPhoneValueForApi`, `validateNationalNumber`, `countryCodeToFlagEmoji`, `COUNTRIES`

### `Textarea`
Multiline. Props: `label?`, `error?`, plus TextInput (forced multiline).

### `FileUpload`
Document / image picker with web-matching UI (dashed drop zone, file list, optional grid). Opens a **sheet** to choose **camera**, **photo library**, or **browse files**.

Register Expo pickers once at app startup (same pattern as haptics):

```tsx
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {
  FileUpload,
  registerFilePickerModules,
  ALL_DOCUMENT_UPLOAD_ACCEPT,
  sharedApi,
} from '@instollar-dev/instollar-react-native';

registerFilePickerModules({
  documentPicker: DocumentPicker,
  imagePicker: ImagePicker,
});

<FileUpload
  label="CAC document"
  accept=".pdf,.jpg,.jpeg,.png"
  maxSizeMB={5}
  autoUpload
  onFileSelect={(file) => console.log(file?.uri)}
  uploadFn={async (formData) => {
    const res = await sharedApi.uploadFiles(formData);
    return res.data ?? [];
  }}
/>
```

Props align with web: `accept`, `maxSizeMB`, `autoUpload`, `uploadFn`, `value` (prefilled URLs/assets), `multiple`, `showAssetPreviewGrid`, `strings`, etc. Selected files are `PickedFile` (`uri`, `name`, `mimeType?`, `size?`).

### `Checkbox` / `Switch`
Controlled: `checked`, `onCheckedChange`, `label?`, `description?`, `disabled?`, `style?`.

### `Radio` / `RadioGroup`
```tsx
<RadioGroup value={v} onValueChange={setV}>
  <Radio value="a" label="Option A" />
  <Radio value="b" label="Option B" />
</RadioGroup>
```

### `Select`
Options open in a **centered `Modal`** by default. Pass **`presentation="sheet"`** for a bottom sheet (recommended for long searchable lists).

Props: `options`, `value`, `onValueChange`, `label?`, `placeholder?`, `error?`, `searchable?`, `searchPlaceholder?` (default `Search…`), `presentation?` (`modal` | `sheet`, default `modal`), `selectedColor?` (list accent), `triggerSelectedColor?`, `variant?`, `disabled?`, `optionsLoading?`, etc. Helper: `selectOptionsPropsFromQuery(query)`.

### `OtpInput` / `VerificationInput` (alias)
Props: `length?` (default 6), `value?`, `onChangeText?`, `onComplete?`, `error?`, `autoFocus?`, `disabled?`.

### Number helpers
`sanitizeNumberInput`, `formatNumberInput`, `numberInputDisplayValue`, `numberInputRawValue`.

---

## Feedback & status

### `Alert`
Banner. Props: `variant?` (`success`|`error`|`warning`|`info`), `title?`, `children`, `onClose?`, `style?`.

### `AlertText`
Inline message. Variants: `error`|`success`|`pending`|`info`. Helper: `dismissibleAlertProps(...)`.

### `StatusBadge`
Props: `status` / resolver via `createStatusResolver`. Tones: `success`|`destructive`|`neutral`. Sizes: `sm`|`md`|`lg`.

### `LoadBoundary`
Loading / error / empty / children. Helper: `loadBoundaryPropsFromQuery(query)`.

### `Chip`
Compact label/pill. Props: `children`, `selected?`, `onPress?`, `disabled?`, `style?`.

---

## Layout & navigation chrome

### `Card`
Simple themed surface. Props: `children`, `style?`.

### `Avatar`
Props: `name?`, `src?` / image URI, `size?` (`sm`|`md`|`lg`). Helper: `getAvatarInitials(name)`.

### `Tabs`
Props: `tabs` (`TabModel[]`: `id`, `label`, `href?`, …), `value?`, `onValueChange?`, optional `router` adapter for Expo Router.

### `Segments`
Segmented control. Props: `options` (`SegmentOption[]`), `value`, `onValueChange`, optional router adapter.

### `SettingsItem`
Row for settings lists. Props: `title`, `description?`, `icon?`, `onPress?`, `right?`, `destructive?`.

For settings pages, prefer **`Accordion`** + **`AccordionItem`** (or manual state with `useAccordion`).

### `Accordion` / `AccordionItem`
Collapsible sections. Body unmounts when closed.

```tsx
<Accordion type="single" collapsible defaultValue="billing">
  <AccordionItem value="billing" title="Billing" description="Invoices and payment">
    <Text>Billing content…</Text>
  </AccordionItem>
  <AccordionItem value="security" title="Security">
    <Text>Security content…</Text>
  </AccordionItem>
</Accordion>
```

Props:
- **`Accordion`**: `type?` (`single` | `multiple`), `collapsible?` (single only, default true), `value` / `defaultValue` / `onValueChange`, `gap?`
- **`AccordionItem`**: `value`, `title`, `description?`, `icon?`, `disabled?`, `children`
- **`useAccordion`**: standalone state helper (same options as `Accordion`)

`SettingsItem` remains available for the richer settings-row layout (icon circle, etc.).

---

## Haptics

| Export | Role |
|--------|------|
| `registerHapticsModule(mod)` | **Required in Expo apps** — pass `import * as ExpoHaptics from 'expo-haptics'` |
| `registerFilePickerModules({ documentPicker, imagePicker })` | **Required for `FileUpload`** — pass `expo-document-picker` + `expo-image-picker` |
| `triggerHapticFeedback(type?)` | `light`\|`medium`\|`heavy`\|`selection`\|`success`\|`warning`\|`error` |
| `setHapticsEnabled` / `getHapticsEnabled` | Global toggle |
| `withHapticPress(handler, type?)` | Wrap press handlers |

Metro cannot resolve a dynamic `require('expo-haptics')` from the prebundled
package. Register once near app init (e.g. next to `initInstollarSDK`):

```tsx
import * as ExpoHaptics from 'expo-haptics';
import { registerHapticsModule } from '@instollar-dev/instollar-react-native';

registerHapticsModule(ExpoHaptics);
```

No-op if never registered / `expo-haptics` is missing.

---

## Core re-exports (same package)

Prefer importing these from `@instollar-dev/instollar-react-native` in RN apps:

- `initInstollarSDK`, `api`, `authApi`, `adminApi`, `companyApi`, `installerApi`, `sharedApi`
- `toast`, `setToastHandler`, `clearToastHandler`
- Storage: `initStorage`, `initStorageAuto`, `createExpoSecureStorage`, `detectPlatform`, `isMobile`, `isWeb`

---

## Local `file:` linking (SDK monorepo)

If the app depends on `"@instollar-dev/instollar-react-native": "file:../instollar-sdk-v2/packages/react-native"`, Metro may need `watchFolders` / `extraNodeModules` so shared deps resolve from the **app** `node_modules` (not nested copies under the SDK). Published GitHub Packages installs do not need this.

## Do / don’t

**Do**
- Use `ThemeProvider` + `ToastProvider` at root
- Prefer `SuccessModal` for post-action success on mobile
- Use SDK `Text` / `Button` / form controls for visual consistency

**Don’t**
- Import `@instollar-dev/instollar-react` or web CSS into RN
- Import removed BottomSheet APIs (`BottomSheet`, `BottomSheetProvider`, `useSuccessBottomSheet`, …)

---

## Quick import map

```tsx
import {
  // providers
  ThemeProvider, useTheme, useThemeColors,
  ToastProvider, toast,
  // success
  SuccessModal, SuccessPanel, SuccessModalIcon,
  // overlays
  Modal, Sheet,
  // primitives
  Text, Button, Spinner, ProgressBar, Icon, Card, Avatar, Chip,
  // forms
  FieldControl, Input, PhoneInput, FileUpload, Textarea, Checkbox, Switch, Radio, RadioGroup,
  Select, OtpInput,
  // feedback
  Alert, AlertText, StatusBadge, LoadBoundary, Accordion, AccordionItem, SettingsItem,
  Tabs, Segments,
  // utils
  triggerHapticFeedback, initInstollarSDK,
} from '@instollar-dev/instollar-react-native';
```
