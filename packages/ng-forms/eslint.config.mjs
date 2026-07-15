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
          prefix: ['gr'],
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: [
            'gr-input',
            'gr-input-otp',
            'gr-input-group',
            'gr-label',
            'gr-textarea',
            'gr-checkbox',
            'gr-radio-group',
            'gr-select',
            'gr-switch',
            'gr-slider',
            'gr-toggle',
            'gr-toggle-group',
            'gr-button-group',
            'gr-calendar',
            'gr-date-picker',
            'gr-form-item',
            'gr-form-label',
            'gr-form-description',
            'gr-form-message',
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
