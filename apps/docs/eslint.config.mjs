import config from '@gremorie/eslint-config/next';

export default [
  ...config,
  {
    ignores: [
      '.next/**',
      '.source/**',
      '.turbo/**',
      // Root-level config files: outside the typed project service, same
      // reason source.config.ts is here.
      'source.config.ts',
      'vitest.config.ts',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
