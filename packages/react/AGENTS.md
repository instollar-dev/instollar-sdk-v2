---
name: instollar-react
description: >-
  Agent guide for @instollar-dev/instollar-react — Instollar web UI, forms,
  PhoneInput, modals, and theme. Use when building web apps that consume this
  package (or @instollar-dev/instollar-sdk).
---

# Instollar React (Web) SDK — Agent Guide

Package: `@instollar-dev/instollar-react` (v0.6.1+) — also via `@instollar-dev/instollar-sdk`.

Use for **web** only. Mobile apps should use `@instollar-dev/instollar-react-native`.

## PhoneInput

Same value shape as RN:

```tsx
import { PhoneInput, toE164, formatPhoneValueForApi, type PhoneValue } from '@instollar-dev/instollar-react';

const [phone, setPhone] = useState<PhoneValue>({ countryCode: 'NG', nationalNumber: '' });

<PhoneInput
  label="Phone"
  value={phone}
  onChange={setPhone}
  onE164Change={(e164) => {/* +234… */}}
  defaultCountryCode="NG"
/>
```

- Country dial code: searchable **dropdown** `Select` with **flag emoji** prefix on the trigger and each option
- National number: `Input` `type="tel"` with country format/length
- `nationalNumber` is **digits only**

## Soft buttons (ghost / underline)

In dark mode (`data-theme="dark"` / `.dark`), default soft buttons use `--color-soft-button` → destructive. Light mode uses fg.

## ProgressBar

Determinate linear bar — fill uses **destructive** (`bg-destructive` / `--color-destructive`).

```tsx
{/* Bare track — no label / % */}
<ProgressBar value={65} />

{/* Optional chrome */}
<ProgressBar value={65} label="Uploading" showValue />
```

## Success

Prefer `useSuccessModal()` / `openSuccessModal` with `ModalProvider` (web). Mobile uses `SuccessModal`.
