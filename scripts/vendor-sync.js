import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Default target apps to sync vendor packages to (relative to monorepo root)
const DEFAULT_TARGET_APPS = [
  '../instollar-webappV2',
  '../instollar-website'
];

console.log('🚀 Step 1: Building SDK packages...');
execSync('pnpm build', { cwd: rootDir, stdio: 'inherit', shell: true });

console.log('\n🔍 Step 2: Verifying Web React SDK cleanliness...');
execSync('node scripts/check-react-clean.js', { cwd: rootDir, stdio: 'inherit', shell: true });

console.log('\n📦 Step 3: Packing packages...');
const packages = [
  { dir: 'packages/core', name: 'instollar-core' },
  { dir: 'packages/tokens', name: 'instollar-tokens' },
  { dir: 'packages/react', name: 'instollar-react' },
  { dir: 'packages/sdk', name: 'instollar-sdk' },
];

const generatedTarballs = [];

for (const pkg of packages) {
  const pkgPath = path.join(rootDir, pkg.dir);
  console.log(`Packing ${pkg.name}...`);
  
  // Clean existing tgz in package dir if any
  const existingFiles = fs.readdirSync(pkgPath).filter(f => f.endsWith('.tgz'));
  for (const f of existingFiles) {
    fs.unlinkSync(path.join(pkgPath, f));
  }

  execSync('pnpm pack', { cwd: pkgPath, stdio: 'ignore', shell: true });
  const newTgz = fs.readdirSync(pkgPath).find(f => f.endsWith('.tgz'));

  if (!newTgz) {
    console.error(`❌ Failed to find packed .tgz for ${pkg.name}`);
    process.exit(1);
  }

  const srcPath = path.join(pkgPath, newTgz);
  
  // Also save standard alias names into root for convenience
  const rootDest = path.join(rootDir, `${pkg.name}.tgz`);
  fs.copyFileSync(srcPath, rootDest);

  generatedTarballs.push({
    actualName: newTgz,
    genericName: `${pkg.name}.tgz`,
    srcPath
  });
}

console.log('\n🔄 Step 4: Syncing vendor packages to target web apps...');

// Read custom target apps from CLI args if provided
const args = process.argv.slice(2);
const targetApps = args.length > 0 ? args : DEFAULT_TARGET_APPS;

for (const appRelPath of targetApps) {
  const appPath = path.resolve(rootDir, appRelPath);

  if (!fs.existsSync(appPath)) {
    console.warn(`⚠️ Target application path does not exist, skipping: ${appPath}`);
    continue;
  }

  const vendorDir = path.join(appPath, 'vendor');
  if (!fs.existsSync(vendorDir)) {
    fs.mkdirSync(vendorDir, { recursive: true });
  }

  console.log(`\n  Syncing tarballs to: ${appPath}/vendor/`);

  for (const tgz of generatedTarballs) {
    // Copy both versioned name and generic name for flexibility
    const destPathGeneric = path.join(vendorDir, tgz.genericName);
    const destPathVersioned = path.join(vendorDir, tgz.actualName);

    fs.copyFileSync(tgz.srcPath, destPathGeneric);
    fs.copyFileSync(tgz.srcPath, destPathVersioned);

    // Touch file modification time to force npm/build tools to register update
    const now = new Date();
    fs.utimesSync(destPathGeneric, now, now);
    fs.utimesSync(destPathVersioned, now, now);

    console.log(`   - Copied ${tgz.genericName} & ${tgz.actualName}`);
  }

  console.log(`\n  ✅ Successfully updated vendor files for ${path.basename(appPath)}.`);
  console.log(`  💡 Reminder: If npm does not pick up local changes, run:`);
  console.log(`     npm install --force`);
}

console.log('\n🎉 All SDK packages built, verified, and synced successfully!\n');
