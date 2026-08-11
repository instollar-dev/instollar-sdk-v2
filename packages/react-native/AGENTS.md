---
name: instollar-react-native
description: >-
  Agent guide for @instollar-dev/instollar-react-native — Instollar mobile UI,
  theme, sheets, toasts, forms, and core API re-exports. Use when building or
  editing Expo / React Native apps that consume this package.
---

# Instollar React Native SDK — Agent Guide

Package: `@instollar-dev/instollar-react-native`

Use this package for **mobile (Expo / React Native)** only. Do **not** import `@instollar-dev/instollar-react` or its `styles.css` in RN apps.

## Install

```bash
npx expo install @instollar-dev/instollar-react-native react-native-svg @gorhom/bottom-sheet react-native-gesture-handler react-native-reanimated
npx expo install expo-haptics   # optional; enables haptics
```

Registry: GitHub Packages (`@instollar-dev`). Ensure `.npmrc` auth for `npm.pkg.github.com`.

## App root setup (required)

Wrap once near the root. Order matters:

```tsx
import {
  ThemeProvider,
  BottomSheetProvider,
  ToastProvider,
  initInstollarSDK,
} from '@instollar-dev/instollar-react-native';

initInstollarSDK({ /* env / base URLs */ });

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {/* wrapGestureHandler={false} if Expo Router already provides GestureHandlerRootView */}
      <BottomSheetProvider wrapGestureHandler={false}>
        <ToastProvider>{children}</ToastProvider>
      </BottomSheetProvider>
    </ThemeProvider>
  );
}
```

Peers: `@gorhom/bottom-sheet`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-svg`. Optional: `expo-haptics`.

---

## Providers & theme

| Export | Role |
|--------|------|
| `ThemeProvider` | Light/dark/system theme from `@instollar-dev/instollar-tokens` |
| `useTheme` | `{ mode, setMode, scheme, colors, fonts }` |
| `useThemeColors` | Theme color tokens only |
| `BottomSheetProvider` | Programmatic + declarative sheets |
| `useBottomSheet` | `openBottomSheet`, `closeBottomSheet`, `closeBottomSheetByID`, `closeAll` |
| `ToastProvider` | Wires core `toast()` to on-screen toasts + haptics |
| `toast` | From core — `toast.success()`, `toast.error()`, etc. |

`ThemeMode`: `'light' | 'dark' | 'system'`.

---

## Success confirmations (prefer sheet on mobile)

Hybrid of web `SuccessModal` / `useSuccessModal`:

| API | When to use |
|-----|-------------|
| **`useSuccessBottomSheet()`** → `openSuccessBottomSheet(opts)` | **Preferred** programmatic success after mutations |
| `SuccessBottomSheet` | Declarative controlled sheet (`open` / `onClose`) |
| `SuccessModal` | Centered dialog; use when a modal (not sheet) is required |
| `SuccessPanel` | Shared body only (custom layouts) |
| `SuccessModalIcon` | Default green check seal |

```tsx
const { openSuccessBottomSheet } = useSuccessBottomSheet();

openSuccessBottomSheet({
  title: 'Order Created Successfully!',
  description: 'You have successfully created an order.',
  buttonLabel: 'View Order',
  onButtonClick: () => router.push(`/orders/${id}`),
  // optional: snapPoints: ['42%'], children: <CustomFooter />
});
```

**Options** (`OpenSuccessBottomSheetOptions`): `title`, `description`, `icon`, `buttonLabel`, `onButtonClick`, `children` (replaces default button), `id`, `snapPoints` (default `['42%']`), `index`, `closeOnBackdrop`, `enablePanDownToClose`, `scrollable`, `onClose`.

Also returns full sheet API: `closeBottomSheet`, `openBottomSheet`, etc.

Declarative:

```tsx
<SuccessBottomSheet
  open={open}
  onClose={() => setOpen(false)}
  title="Saved"
  description="Your changes were saved."
  onButtonClick={() => setOpen(false)}
/>
```

Requires `BottomSheetProvider`.

---

## Overlays

### `Modal`
Centered dialog. Props: `open`, `onClose?`, `closeOnBackdrop?` (default true), `children`, plus RN Modal props (except `transparent`).

### `BottomSheet`
Gorhom-based sheet. Props: `open`, `onClose?`, `children`, `snapPoints?` (default `['50%', '90%']`), `index?`, `title?`, `footer?`, `showCloseButton?`, `closeOnBackdrop?`, `enablePanDownToClose?`, `scrollable?` (default true), `enableDynamicSizing?` (default **false** — we always pass explicit `snapPoints`; gorhom's content auto-sizing can mis-measure scrollable content and collapse the visible sheet), `style?`, `contentContainerStyle?`, `modalProps?`.

Re-exports for custom layouts: `BottomSheetScrollView`, `BottomSheetView`, `BottomSheetFlatList`, `BottomSheetTextInput`.

### `useBottomSheet` / `openBottomSheet`
```tsx
openBottomSheet({
  title: 'Confirm',
  content: <Text>…</Text>,
  snapPoints: ['40%'],
  footer: <Button onPress={closeBottomSheet}>Done</Button>,
});
```

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
Country dial code + national number. Uses searchable `Select` (**bottom sheet**) + `Input` `type="tel"`.

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
- **Dark mode:** selected dial code (trigger + list accent) uses **destructive** color
- Helpers also exported: `toE164`, `formatPhoneValueForApi`, `validateNationalNumber`, `countryCodeToFlagEmoji`, `COUNTRIES`

### `Textarea`
Multiline. Props: `label?`, `error?`, plus TextInput (forced multiline).

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
Options open in a **bottom sheet** (requires `BottomSheetProvider`). Uses `BottomSheetScrollView` + mapped rows (not FlatList) so search + keyboard keep the country list visible.

Props: `options` (`value`, `label`, `description?`, `prefix?`), `value`, `onValueChange`, `label?`, `placeholder?`, `error?`, `searchable?`, `selectedColor?`, `snapPoints?` (default `['55%', '90%']`), `variant?` (`default`|`inline`), `disabled?`, `optionsLoading?`, etc. Search matches label, description, dial digits, and string value. Helper: `selectOptionsPropsFromQuery(query)`.

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

---

## Haptics

| Export | Role |
|--------|------|
| `registerHapticsModule(mod)` | **Required in Expo apps** — pass `import * as ExpoHaptics from 'expo-haptics'` |
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

If the app depends on `"@instollar-dev/instollar-react-native": "file:../instollar-sdk-v2/packages/react-native"`, Metro can load **duplicate** `react-native-reanimated` / `@gorhom/bottom-sheet` from the SDK’s nested `node_modules` and crash at import with:

`TypeError: property is not writable`

Fix in the **consuming app** `metro.config.js` (not the SDK):

```js
config.watchFolders = [/* … */, sdkPackageRoot];
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];
config.resolver.extraNodeModules = {
  'react-native-reanimated': /* app node_modules */,
  'react-native-worklets': /* app */,
  'react-native-gesture-handler': /* app */,
  '@gorhom/bottom-sheet': /* app */,
  // …react, react-native, svg, tokens, core
};
```

Published installs from GitHub Packages do not need this (no nested peers).

## Do / don’t

**Do**
- Use `ThemeProvider` + `BottomSheetProvider` + `ToastProvider` at root
- Prefer `openSuccessBottomSheet` for post-action success on mobile
- Use SDK `Text` / `Button` / form controls for visual consistency
- Pass `wrapGestureHandler={false}` when the host already has `GestureHandlerRootView`

**Don’t**
- Import `@instollar-dev/instollar-react` or web CSS into RN
- Call `useBottomSheet` / `useSuccessBottomSheet` outside `BottomSheetProvider`
- Build one-off success modals when `SuccessBottomSheet` / hook already covers the pattern

---

## Quick import map

```tsx
import {
  // providers
  ThemeProvider, useTheme, useThemeColors,
  BottomSheetProvider, useBottomSheet,
  ToastProvider, toast,
  // success
  useSuccessBottomSheet, SuccessBottomSheet, SuccessModal, SuccessPanel, SuccessModalIcon,
  // overlays
  Modal, BottomSheet,
  // primitives
  Text, Button, Spinner, ProgressBar, Icon, Card, Avatar, Chip,
  // forms
  FieldControl, Input, PhoneInput, Textarea, Checkbox, Switch, Radio, RadioGroup,
  Select, OtpInput,
  // feedback
  Alert, AlertText, StatusBadge, LoadBoundary, SettingsItem,
  Tabs, Segments,
  // utils
  triggerHapticFeedback, initInstollarSDK,
} from '@instollar-dev/instollar-react-native';
```
