import type { Meta, StoryObj } from '@storybook/react';
import { RotateCwIcon } from 'lucide-react';

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from './web-preview';

/**
 * # WebPreview
 *
 * A sandboxed live-preview card — a URL bar over an `<iframe>` with an optional
 * collapsible console. Built for showing rendered output (e.g. generated sites
 * or component previews) inline. State (current URL, console open/closed) lives
 * in a context shared by the subcomponents.
 *
 * ## Anatomy
 *
 * - **WebPreview** — the card root + context provider (`defaultUrl`, `onUrlChange`).
 * - **WebPreviewNavigation** — the top toolbar row.
 *   - **WebPreviewNavigationButton** — a ghost icon button with a tooltip.
 *   - **WebPreviewUrl** — the address input (commits on Enter).
 * - **WebPreviewBody** — the sandboxed `<iframe>` (uses the context URL unless `src` is set).
 * - **WebPreviewConsole** — a collapsible console panel rendering a `logs` array.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `defaultUrl` | `string` | `""` | Initial URL loaded into the iframe + input. |
 * | `onUrlChange` | `(url: string) => void` | — | Fires when the URL is committed. |
 * | `...props` | `ComponentProps<"div">` | — | Forwarded to the card root. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `WebPreviewNavigation` | Toolbar row. |
 * | `WebPreviewNavigationButton` | Ghost icon button (`tooltip`). |
 * | `WebPreviewUrl` | Address input; commits on Enter. |
 * | `WebPreviewBody` | Sandboxed iframe (`loading` slot, optional `src`). |
 * | `WebPreviewConsole` | Collapsible console rendering `logs`. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--card` | Card surface |
 * | `--border` | Card border + toolbar / console dividers |
 * | `--muted` | Console background |
 * | `--foreground` / `--muted-foreground` | Log text + timestamps |
 * | `--destructive` | `error`-level log rows |
 */
const meta = {
  title: 'AI/Code/WebPreview',
  component: WebPreview,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="h-[28rem] w-[40rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WebPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

const LOGS = [
  { level: 'log' as const, message: 'App mounted', timestamp: new Date() },
  {
    level: 'warn' as const,
    message: 'Deprecated prop `legacy` used',
    timestamp: new Date(),
  },
  {
    level: 'error' as const,
    message: 'Failed to fetch /api/user (404)',
    timestamp: new Date(),
  },
];

/**
 * A full preview: a reload button + editable URL bar over the sandboxed iframe,
 * with a collapsible console below holding a few log lines.
 */
export const Default: Story = {
  render: () => (
    <WebPreview defaultUrl="https://example.com" className="h-full">
      <WebPreviewNavigation>
        <WebPreviewNavigationButton tooltip="Reload">
          <RotateCwIcon className="h-4 w-4" />
        </WebPreviewNavigationButton>
        <WebPreviewUrl />
      </WebPreviewNavigation>
      <WebPreviewBody />
      <WebPreviewConsole logs={LOGS} />
    </WebPreview>
  ),
};

/** Without a console — just the URL bar and the iframe body. */
export const PreviewOnly: Story = {
  render: () => (
    <WebPreview defaultUrl="https://example.com" className="h-full">
      <WebPreviewNavigation>
        <WebPreviewNavigationButton tooltip="Reload">
          <RotateCwIcon className="h-4 w-4" />
        </WebPreviewNavigationButton>
        <WebPreviewUrl />
      </WebPreviewNavigation>
      <WebPreviewBody />
    </WebPreview>
  ),
};

/** An empty console — shows the "No console output" placeholder when expanded. */
export const EmptyConsole: Story = {
  render: () => (
    <WebPreview defaultUrl="https://example.com" className="h-full">
      <WebPreviewNavigation>
        <WebPreviewNavigationButton tooltip="Reload">
          <RotateCwIcon className="h-4 w-4" />
        </WebPreviewNavigationButton>
        <WebPreviewUrl />
      </WebPreviewNavigation>
      <WebPreviewBody />
      <WebPreviewConsole logs={[]} />
    </WebPreview>
  ),
};
