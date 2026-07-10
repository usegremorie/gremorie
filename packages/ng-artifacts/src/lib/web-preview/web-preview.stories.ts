import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  type WebPreviewLog,
} from './web-preview';

/**
 * WebPreview — a sandboxed live-preview card: a URL bar over an `<iframe>` with
 * an optional collapsible console. Parity port of the React
 * `@gremorie/rx-artifacts` `WebPreview`.
 *
 * Anatomy:
 * - `<web-preview>` — card root + shared state (`defaultUrl`, `(urlChange)`).
 *   - `<web-preview-navigation>` — toolbar row.
 *     - `<web-preview-navigation-button>` — ghost icon button (`tooltip`).
 *     - `<web-preview-url>` — address input (commits on Enter).
 *   - `<web-preview-body>` — sandboxed iframe (uses shared URL unless `src`).
 *   - `<web-preview-console>` — collapsible console rendering a `logs` array.
 *
 * Note: the iframe is sandboxed and points at example.com — in Storybook the
 * frame may be blank depending on the host's framing policy; the chrome (URL
 * bar, console) is the point of the preview.
 */
type WebPreviewArgs = { defaultUrl: string };

const meta: Meta<WebPreviewArgs> = {
  title: 'AI/Code/WebPreview',
  component: WebPreview,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        WebPreview,
        WebPreviewNavigation,
        WebPreviewNavigationButton,
        WebPreviewUrl,
        WebPreviewBody,
        WebPreviewConsole,
      ],
    }),
  ],
  argTypes: {
    defaultUrl: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<WebPreviewArgs>;

const RELOAD_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
`;

const LOGS: WebPreviewLog[] = [
  { level: 'log', message: 'App mounted', timestamp: new Date() },
  {
    level: 'warn',
    message: 'Deprecated prop `legacy` used',
    timestamp: new Date(),
  },
  {
    level: 'error',
    message: 'Failed to fetch /api/user (404)',
    timestamp: new Date(),
  },
];

/**
 * A full preview: a reload button + editable URL bar over the sandboxed iframe,
 * with a collapsible console below holding a few log lines.
 */
export const Default: Story = {
  args: { defaultUrl: 'https://example.com' },
  render: (args) => ({
    props: { ...args, logs: LOGS, reloadIcon: RELOAD_ICON },
    template: `
      <div style="height: 28rem; width: 40rem; max-width: 100%;">
        <web-preview [defaultUrl]="defaultUrl" class="h-full">
          <web-preview-navigation>
            <web-preview-navigation-button tooltip="Reload">
              <span [innerHTML]="reloadIcon"></span>
            </web-preview-navigation-button>
            <web-preview-url />
          </web-preview-navigation>
          <web-preview-body />
          <web-preview-console [logs]="logs" />
        </web-preview>
      </div>
    `,
  }),
};

/** Without a console — just the URL bar and the iframe body. */
export const PreviewOnly: Story = {
  args: { defaultUrl: 'https://example.com' },
  render: (args) => ({
    props: { ...args, reloadIcon: RELOAD_ICON },
    template: `
      <div style="height: 28rem; width: 40rem; max-width: 100%;">
        <web-preview [defaultUrl]="defaultUrl" class="h-full">
          <web-preview-navigation>
            <web-preview-navigation-button tooltip="Reload">
              <span [innerHTML]="reloadIcon"></span>
            </web-preview-navigation-button>
            <web-preview-url />
          </web-preview-navigation>
          <web-preview-body />
        </web-preview>
      </div>
    `,
  }),
};

/** An empty console — shows the "No console output" placeholder when expanded. */
export const EmptyConsole: Story = {
  name: 'Empty console',
  args: { defaultUrl: 'https://example.com' },
  render: (args) => ({
    props: { ...args, reloadIcon: RELOAD_ICON },
    template: `
      <div style="height: 28rem; width: 40rem; max-width: 100%;">
        <web-preview [defaultUrl]="defaultUrl" class="h-full">
          <web-preview-navigation>
            <web-preview-navigation-button tooltip="Reload">
              <span [innerHTML]="reloadIcon"></span>
            </web-preview-navigation-button>
            <web-preview-url />
          </web-preview-navigation>
          <web-preview-body />
          <web-preview-console [logs]="[]" />
        </web-preview>
      </div>
    `,
  }),
};

/**
 * Workbench preset: the full preview at a fixed size with `layout: 'padded'`, so
 * the dual-framework workbench renders the IDENTICAL use case on both sides.
 * Keep in sync with the React `WebPreview` workbench preview.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: { defaultUrl: 'https://example.com' },
  render: (args) => ({
    props: { ...args, logs: LOGS, reloadIcon: RELOAD_ICON },
    template: `
      <div style="height: 28rem; width: 40rem; max-width: 100%;">
        <web-preview [defaultUrl]="defaultUrl" class="h-full">
          <web-preview-navigation>
            <web-preview-navigation-button tooltip="Reload">
              <span [innerHTML]="reloadIcon"></span>
            </web-preview-navigation-button>
            <web-preview-url />
          </web-preview-navigation>
          <web-preview-body />
          <web-preview-console [logs]="logs" />
        </web-preview>
      </div>
    `,
  }),
};
