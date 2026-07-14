import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/icons.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  external: ['react', 'react-dom', 'iconsax-react', '@codearemo/instollar-react'],
});
