import type { Preview } from '@storybook/react';

import './preview.css';

/**
 * Shared preview for the rx-* Storybook. Centers primitives by default and
 * wires the standard control matchers. Theme tokens come from preview.css
 * (Gremorie two-tier tokens via @gremorie/rx-core).
 *
 * The Theme and Dark toolbars set `data-theme` and the `.dark` class on the
 * document root, so every story recolors live without any component edits.
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
    (Story, context) => {
      const { theme, dark } = context.globals;
      const root = document.documentElement;
      if (theme && theme !== 'default') {
        root.dataset.theme = theme as string;
      } else {
        delete root.dataset.theme;
      }
      root.classList.toggle('dark', Boolean(dark));
      return Story();
    },
  ],
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
