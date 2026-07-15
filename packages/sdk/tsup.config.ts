import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/icons.ts',
    'src/countries.ts',
    'src/alert-text.ts',
    'src/utils/index.ts',
    'src/utils/cn.ts',
    'src/utils/dateTime.ts',
    'src/utils/money.ts',
    'src/utils/number.ts',
    'src/utils/string.ts',
    'src/utils/phone.ts',
    'src/utils/validation.ts',
    'src/utils/errors.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  external: [
    'react',
    'react-dom',
    'iconsax-react',
    '@codearemo/instollar-react',
    '@codearemo/instollar-react/alert-text',
    '@codearemo/instollar-react/icons',
    'date-fns',
    'expo-secure-store',
  ],
});

