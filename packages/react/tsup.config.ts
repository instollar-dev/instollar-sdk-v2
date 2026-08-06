import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/icons.ts', 'src/components/AlertText.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  external: [
    'react',
    'react-dom',
    'iconsax-react',
    '@instollar-dev/instollar-core',
    '@instollar-dev/instollar-core/countries',
    '@instollar-dev/instollar-core/utils/phone',
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
