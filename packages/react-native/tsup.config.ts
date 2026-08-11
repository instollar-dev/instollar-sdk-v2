import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  external: [
    'react',
    'react-native',
    'react-native-svg',
    'iconsax-react-native',
    'expo-haptics',
    '@instollar-dev/instollar-core',
    '@instollar-dev/instollar-tokens',
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
