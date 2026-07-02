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
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}'],
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
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: [],
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          // One namespaced prefix per AI Elements family (mirrors the Vercel AI
          // Elements component names — intentional, not the workspace `gn-` prefix).
          prefix: [
            'ai',
            'attachment',
            'chain-of-thought',
            'checkpoint',
            'code-block',
            'confirmation',
            'context',
            'conversation',
            'image',
            'inline-citation',
            'message',
            'model-selector',
            'open-in',
            'plan',
            'prompt-input',
            'queue',
            'reasoning',
            'source',
            'sources',
            'suggestion',
            'suggestions',
            'task',
            'tool',
            'toolbar',
          ],
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    rules: {},
  },
];
