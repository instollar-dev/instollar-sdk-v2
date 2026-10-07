# Local Vendor & Web App SDK Distribution Guide

## 📌 Overview

This document establishes the official workflow for publishing, syncing, and consuming SDK updates across Instollar applications (Web & Mobile) without depending on AWS CodeArtifact / npm registry authentication (PAT).

---

## 🏗 Key Principles

1. **Package Separation:**
   - `@instollar-dev/instollar-react` → Web Applications ONLY (Vite, Next.js). **Must NEVER import `react-native`, `react-native-svg`, `iconsax-react-native`, or `react-native-reanimated`.**
   - `@instollar-dev/instollar-react-native` → Mobile Applications ONLY (Expo, React Native CLI).

2. **Local Tarball Syncing (`vendor/*.tgz`):**
   - Until AWS PAT setup is finalized by DevOps, consuming apps store local SDK tarballs inside their `./vendor/` folder and point `package.json` to:
     ```json
     "@instollar-dev/instollar-core": "file:vendor/instollar-core.tgz",
     "@instollar-dev/instollar-tokens": "file:vendor/instollar-tokens.tgz",
     "@instollar-dev/instollar-react": "file:vendor/instollar-react.tgz",
     "@instollar-dev/instollar-sdk": "file:vendor/instollar-sdk.tgz"
     ```

---

## 🚀 1-Command Automated Sync Process

Whenever you modify code in `instollar-sdk-v2`, run the following single command from the SDK monorepo root:

```bash
pnpm vendor:sync
```

### What `pnpm vendor:sync` automatically does:
1. Builds all SDK packages (`pnpm build`).
2. Runs the React Cleanliness Guard (`scripts/check-react-clean.js`) to guarantee no `react-native` imports leaked into the Web SDK package.
3. Generates updated `.tgz` tarball files for all packages.
4. Copies the updated `.tgz` files directly into `./vendor/` in target web apps (`instollar-webappV2` and `instollar-website`).
5. Updates file timestamps to signal changes to package managers.

> 💡 **Custom App Paths:**  
> By default, `pnpm vendor:sync` updates both `instollar-webappV2` and `instollar-website`. You can also pass custom relative target paths:
> ```bash
> pnpm vendor:sync ../instollar-webappV2 ../instollar-website ../instollar-admin-portal
> ```

---

## ⚠️ The NPM Local Tarball Caching Gotcha & Fix

When using `file:vendor/*.tgz`, `npm` caches tarball installations by filename. If you replace `instollar-react.tgz` without forcing `npm` to re-extract it, your web app might keep running old/stale code.

### If your Web App is not picking up new SDK updates:

Run this command inside your Web App repository (e.g., `instollar-webappV2`):

```powershell
npm install --force
```

If issues persist due to stale Vite cache:
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 🛡️ Pre-Push & Safety Checks

To prevent broken code or React Native leaks from being pushed to Git, always run:

```bash
pnpm prepush
```

This verifies:
- ✅ Turbo build succeeds cleanly across all packages.
- ✅ `@instollar-dev/instollar-react` is 100% free of mobile dependencies (`react-native-svg`, `iconsax-react-native`, etc.).
- ✅ All unit tests pass.

### Setting up Git Pre-Push Hook (Optional but Recommended)

You can automatically enforce this before `git push`:

```bash
npx husky init
echo "pnpm prepush" > .husky/pre-push
```

---

## 📋 Checklist when updating the SDK:
- [ ] Make SDK code changes in `packages/*`.
- [ ] Run `pnpm vendor:sync` to build, check, pack & sync `.tgz` files to target apps.
- [ ] In target app (e.g. `instollar-webappV2`), verify changes with `npm run dev` (run `npm install --force` if cache persists).
- [ ] Run `pnpm prepush` before pushing your Git commits.
