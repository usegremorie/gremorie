import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          // Stories and specs import dev-only tooling (@storybook/react, react,
          // culori, vitest) that must not leak into the published dependencies.
          // Without this, `--fix` writes them into `dependencies` and every
          // consumer of rx-core — i.e. the whole React edition — installs
          // Storybook and a second copy of React.
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            '{projectRoot}/vitest.config.{js,ts,mts}',
            '{projectRoot}/**/*.stories.{ts,tsx,js,jsx}',
            '{projectRoot}/**/*.spec.{ts,tsx,js,jsx}',
          ],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
