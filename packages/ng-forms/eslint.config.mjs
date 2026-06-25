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
          prefix: ['gn'],
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: [
            'gn-input',
            'gn-input-otp',
            'gn-input-group',
            'gn-label',
            'gn-textarea',
            'gn-checkbox',
            'gn-radio-group',
            'gn-select',
            'gn-switch',
            'gn-slider',
            'gn-toggle',
            'gn-toggle-group',
            'gn-button-group',
            'gn-calendar',
            'gn-date-picker',
            'gn-form-item',
            'gn-form-label',
            'gn-form-description',
            'gn-form-message',
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
