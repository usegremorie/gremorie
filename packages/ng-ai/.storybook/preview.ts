import type { Preview } from '@storybook/angular';

/**
 * Shared preview for the ng-* Storybook. Wires the standard control matchers
 * and the live theme/dark toolbars, mirroring the rx-* Storybook
 * (`packages/rx-ai/.storybook/preview.ts`).
 *
 * Theme tokens (base + `.dark` + the five `data-theme` brand themes) are loaded
 * globally through `packages/playground/src/styles.css`, which imports
 * `@gremorie/tokens/theme.css` (that file in turn `@import`s every brand theme).
 * The Theme and Dark toolbars set `data-theme` and toggle the `.dark` class on
 * the document root, so every story recolors live without any component edits.
 */
const THEMES = [
  'default',
  'claude',
  'chatgpt',
  'gemini',
  'perplexity',
  'mistral',
] as const;

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Gremorie theme',
      defaultValue: 'default',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: THEMES.map((t) => ({
          value: t,
          title: t.charAt(0).toUpperCase() + t.slice(1),
        })),
      },
    },
    dark: {
      description: 'Dark mode',
      defaultValue: false,
      toolbar: {
        title: 'Mode',
        icon: 'circlehollow',
        dynamicTitle: true,
        items: [
          { value: false, title: 'Light' },
          { value: true, title: 'Dark' },
        ],
      },
    },
  },
  decorators: [
    (storyFn, context) => {
      const theme = context.globals['theme'] as string | undefined;
      const dark = context.globals['dark'];
      const root = document.documentElement;
      if (theme && theme !== 'default') {
        root.dataset['theme'] = theme;
      } else {
        delete root.dataset['theme'];
      }
      root.classList.toggle('dark', Boolean(dark));
      return storyFn();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
