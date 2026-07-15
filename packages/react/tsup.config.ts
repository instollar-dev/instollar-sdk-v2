import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/icons.ts', 'src/components/AlertText.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  external: ['react', 'react-dom', 'iconsax-react'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
