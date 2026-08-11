import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/countries.ts',
    'src/utils/index.ts',
    'src/utils/dateTime.ts',
    'src/utils/money.ts',
    'src/utils/number.ts',
    'src/utils/string.ts',
    'src/utils/phone.ts',
    'src/utils/currency.ts',
    'src/utils/validation.ts',
    'src/utils/errors.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  external: ['expo-secure-store'],
});
