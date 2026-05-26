import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          // Only the publishable library source counts toward peerDependencies.
          // Test/config/story files pull dev-only deps that consumers never get.
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            '{projectRoot}/vitest.config.{js,ts,mts}',
            '{projectRoot}/src/test-setup.ts',
            '{projectRoot}/**/*.spec.ts',
            '{projectRoot}/**/*.stories.ts',
          ],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      // D-14: no lib prefix on selectors (white-label).
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: [], style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: [], style: 'kebab-case' },
      ],
    },
  },
  {
    files: ['**/*.html'],
    rules: {},
  },
];
