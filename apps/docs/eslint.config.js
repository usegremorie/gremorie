import config from '@gremorie/eslint-config/next';

export default [
  ...config,
  {
    ignores: ['.next/**', '.source/**', '.turbo/**', 'source.config.ts'],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
