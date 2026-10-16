import nx from '@nx/eslint-plugin';

import baseConfig from '../../eslint.config.mjs';

export default [
  ...nx.configs['flat/base'],
  ...baseConfig,
  {
    // Build-time code (pipeline, tests) is not part of the published surface.
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            '{projectRoot}/pipeline/**',
            '{projectRoot}/test/**',
            '{projectRoot}/vitest.config.ts',
          ],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
