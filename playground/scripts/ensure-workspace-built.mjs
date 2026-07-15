import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const playgroundDir = join(scriptDir, '..');
const rootDir = join(playgroundDir, '..');
const sdkEntry = join(rootDir, 'packages/sdk/dist/index.js');

if (existsSync(sdkEntry)) {
  process.exit(0);
}

console.log('Workspace package dist/ missing — building dependency packages…');

for (const pkg of ['packages/tokens', 'packages/react', 'packages/sdk']) {
  const result = spawnSync('pnpm', ['--dir', join(rootDir, pkg), 'run', 'build'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
