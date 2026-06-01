import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...nx.configs['flat/base'],
  ...baseConfig,
  {
    // Parser-input samples: consumed as raw text by the TS/CVA parser tests,
    // never compiled. They intentionally carry `@ts-nocheck` and stand-in code.
    ignores: ['src/parsers/**/__fixtures__/**'],
  },
];
