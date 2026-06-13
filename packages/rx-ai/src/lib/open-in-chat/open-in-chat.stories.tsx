import type { Meta, StoryObj } from '@storybook/react';

import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInCursor,
  OpenInLabel,
  OpenInScira,
  OpenInSeparator,
  OpenInT3,
  OpenInTrigger,
  OpenInv0,
} from './open-in-chat';

/**
 * # OpenIn
 *
 * A faithful port of the Vercel AI Elements **OpenIn** primitive — a dropdown
 * that deep-links the current `query` into an external AI chat / builder
 * (ChatGPT, Claude, T3 Chat, Scira, v0, Cursor). Each provider item builds a
 * pre-filled URL from the shared `query` and opens it in a new tab.
 *
 * ## Anatomy
 *
 * - **OpenIn** — `DropdownMenu` provider holding the `query`.
 * - **OpenInTrigger** — the button (defaults to "Open in chat" with a chevron).
 * - **OpenInContent** — the menu surface (240px wide).
 * - **OpenInLabel** / **OpenInSeparator** — section label and divider.
 * - **OpenInChatGPT / Claude / T3 / Scira / v0 / Cursor** — provider link items
 *   with a logo, title and external-link affordance.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `query` | `string` | — | The text/prompt deep-linked into each provider. |
 * | `...DropdownMenuProps` | `ComponentProps<typeof DropdownMenu>` | — | Forwarded to the menu root. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `OpenInTrigger` | Dropdown trigger button. |
 * | `OpenInContent` | Menu surface. |
 * | `OpenInLabel` | Section label. |
 * | `OpenInSeparator` | Divider. |
 * | `OpenInChatGPT` | Deep-link to ChatGPT. |
 * | `OpenInClaude` | Deep-link to Claude. |
 * | `OpenInT3` | Deep-link to T3 Chat. |
 * | `OpenInScira` | Deep-link to Scira. |
 * | `OpenInv0` | Deep-link to v0. |
 * | `OpenInCursor` | Deep-link to Cursor. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--popover` / `--border` | Menu surface and border. |
 * | `--accent` | Item hover background. |
 *
 * ## Anatomy
 *
 * ```text
 * OpenIn
 * ├─ OpenInTrigger   "Open in…" button
 * └─ OpenInContent   menu
 *    ├─ OpenInLabel · OpenInSeparator
 *    ├─ OpenInItem    generic target row
 *    └─ presets       OpenInChatGPT · OpenInClaude · OpenInCursor · OpenInv0 · OpenInScira · OpenInT3
 * ```
 */
const meta = {
  title: 'AI/Utilities/OpenIn',
  component: OpenIn,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    query: { control: 'text' },
  },
} satisfies Meta<typeof OpenIn>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_QUERY =
  'Explain how React Server Components stream HTML to the client.';

/** Every provider in one dropdown. Open the menu to see the deep links. */
export const Default: Story = {
  args: { query: SAMPLE_QUERY, defaultOpen: true },
  render: (args) => (
    <OpenIn {...args}>
      <OpenInTrigger />
      <OpenInContent>
        <OpenInLabel>Open this prompt in…</OpenInLabel>
        <OpenInSeparator />
        <OpenInChatGPT />
        <OpenInClaude />
        <OpenInT3 />
        <OpenInScira />
        <OpenInv0 />
        <OpenInCursor />
      </OpenInContent>
    </OpenIn>
  ),
};
