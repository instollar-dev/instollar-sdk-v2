import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reactDistPath = path.join(__dirname, '../packages/react/dist');

const FORBIDDEN_IMPORTS = [
  'react-native',
  'react-native-svg',
  'iconsax-react-native',
  'react-native-reanimated'
];

let hasError = false;

function scanDir(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Build directory not found: ${dir}. Run 'pnpm build' first.`);
    process.exit(1);
  }

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.cjs') || file.endsWith('.mjs')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const forbidden of FORBIDDEN_IMPORTS) {
        if (content.includes(`from "${forbidden}"`) || content.includes(`from '${forbidden}'`) || content.includes(`require("${forbidden}")`) || content.includes(`require('${forbidden}')`)) {
          console.error(`❌ ERROR: Forbidden mobile import "${forbidden}" detected in web package file: ${fullPath}`);
          hasError = true;
        }
      }
    }
  }
}

console.log('🔍 Checking @instollar-dev/instollar-react for accidental mobile dependencies...');
scanDir(reactDistPath);

if (hasError) {
  console.error('\n🚨 Verification failed! Mobile/React-Native packages were found in the Web SDK build.');
  console.error('Please remove react-native imports from packages/react before packing or pushing.\n');
  process.exit(1);
} else {
  console.log('✅ Clean! @instollar-dev/instollar-react has no React Native contamination.');
}
