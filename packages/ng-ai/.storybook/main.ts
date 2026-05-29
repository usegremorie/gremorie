import type { StorybookConfig } from '@storybook/angular';

/**
 * Shared Storybook config for all `@gremorie/ng-*` packages.
 *
 * Although this lives under `packages/ng-ai/.storybook`, the `stories` glob
 * reaches into sibling packages (`ng-display`, `ng-feedback`) so a single
 * Storybook instance covers every Angular primitive in the workspace. One
 * server (port 4400) + one browserTarget (`playground:build`) instead of one
 * Storybook target per package. Tailwind scanning is handled by
 * `playground/src/styles.css` (`@source` directives include every ng-*
 * package).
 *
 * Run with `npm run storybook` or `nx storybook ng-ai`.
 */
const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../ng-display/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../ng-feedback/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;
