import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/icons.ts', 'src/countries.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  external: [
    'react',
    'react-dom',
    'iconsax-react',
    '@codearemo/instollar-react',
    '@codearemo/instollar-react/icons',
    'expo-secure-store',
  ],
});

