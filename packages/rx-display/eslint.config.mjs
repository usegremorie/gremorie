import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          // Stories and specs import dev-only tooling (@storybook/react,
          // vitest, react-dom/server, @vitejs/plugin-react) that must not leak
          // into the published peerDependencies.
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
