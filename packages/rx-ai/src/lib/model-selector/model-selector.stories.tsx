import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@gremorie/rx-forms';
import { Command } from '@gremorie/rx-overlays';

import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorSeparator,
  ModelSelectorShortcut,
  ModelSelectorTrigger,
} from './model-selector';

/**
 * # ModelSelector
 *
 * A faithful port of the Vercel AI Elements **ModelSelector** — a command-
 * palette style model picker built on the design system `Dialog` + `Command`.
 * Users open it from a trigger, search, and pick a model grouped by provider,
 * with provider logos and keyboard shortcuts.
 *
 * The default story renders the searchable list **inline** (without the dialog
 * shell) so the open content is visible in the Docs page; `WithDialog` shows the
 * real trigger → dialog flow.
 *
 * ## Anatomy
 *
 * - **ModelSelector** — `Dialog` provider.
 * - **ModelSelectorTrigger** — opens the dialog.
 * - **ModelSelectorContent** — dialog body wrapping a `Command`.
 * - **ModelSelectorInput** — search field.
 * - **ModelSelectorList** / **Empty** — results list and no-match state.
 * - **ModelSelectorGroup** / **Separator** — provider groups + dividers.
 * - **ModelSelectorItem** — a selectable model row.
 * - **ModelSelectorLogo** / **LogoGroup** — provider logo(s) from models.dev.
 * - **ModelSelectorName** — truncating model label.
 * - **ModelSelectorShortcut** — trailing keyboard hint.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `...DialogProps` | `ComponentProps<typeof Dialog>` | — | `ModelSelector` forwards all `Dialog` props (`open`, `onOpenChange`, …). |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `ModelSelectorTrigger` | Dialog trigger. |
 * | `ModelSelectorContent` | Dialog body with `Command`. |
 * | `ModelSelectorInput` | Search input. |
 * | `ModelSelectorList` | Results list. |
 * | `ModelSelectorEmpty` | No-results message. |
 * | `ModelSelectorGroup` | Provider group. |
 * | `ModelSelectorItem` | Selectable model row. |
 * | `ModelSelectorSeparator` | Divider between groups. |
 * | `ModelSelectorLogo` | Single provider logo (models.dev). |
 * | `ModelSelectorLogoGroup` | Stacked/overlapping logos. |
 * | `ModelSelectorName` | Truncating model name. |
 * | `ModelSelectorShortcut` | Trailing keyboard shortcut. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--popover` / `--border` | Command surface and border. |
 * | `--muted-foreground` | Group labels and shortcuts. |
 *
 * ## Anatomy
 *
 * ```text
 * ModelSelector
 * ├─ ModelSelectorTrigger          selected model (logo + name)
 * └─ ModelSelectorContent          command palette (popover or dialog)
 *    ├─ ModelSelectorInput         search
 *    ├─ ModelSelectorEmpty
 *    └─ ModelSelectorList
 *       └─ ModelSelectorGroup       per provider
 *          └─ ModelSelectorItem     logo + name + shortcut
 * ```
 */
const meta = {
  title: 'AI/Chatbot/ModelSelector',
  component: ModelSelector,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ModelSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

const Picker = () => (
  <Command className="w-80 rounded-md border">
    <ModelSelectorInput placeholder="Search models…" />
    <ModelSelectorList>
      <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
      <ModelSelectorGroup heading="OpenAI">
        <ModelSelectorItem value="gpt-4o">
          <ModelSelectorLogo provider="openai" />
          <ModelSelectorName>GPT-4o</ModelSelectorName>
          <ModelSelectorShortcut>⌘1</ModelSelectorShortcut>
        </ModelSelectorItem>
        <ModelSelectorItem value="gpt-4o-mini">
          <ModelSelectorLogo provider="openai" />
          <ModelSelectorName>GPT-4o mini</ModelSelectorName>
          <ModelSelectorShortcut>⌘2</ModelSelectorShortcut>
        </ModelSelectorItem>
      </ModelSelectorGroup>
      <ModelSelectorSeparator />
      <ModelSelectorGroup heading="Anthropic">
        <ModelSelectorItem value="claude-3-5-sonnet">
          <ModelSelectorLogo provider="anthropic" />
          <ModelSelectorName>Claude 3.5 Sonnet</ModelSelectorName>
          <ModelSelectorShortcut>⌘3</ModelSelectorShortcut>
        </ModelSelectorItem>
        <ModelSelectorItem value="claude-3-haiku">
          <ModelSelectorLogo provider="anthropic" />
          <ModelSelectorName>Claude 3 Haiku</ModelSelectorName>
          <ModelSelectorShortcut>⌘4</ModelSelectorShortcut>
        </ModelSelectorItem>
      </ModelSelectorGroup>
      <ModelSelectorSeparator />
      <ModelSelectorGroup heading="Google">
        <ModelSelectorItem value="gemini-1.5-pro">
          <ModelSelectorLogo provider="google" />
          <ModelSelectorName>Gemini 1.5 Pro</ModelSelectorName>
          <ModelSelectorShortcut>⌘5</ModelSelectorShortcut>
        </ModelSelectorItem>
      </ModelSelectorGroup>
    </ModelSelectorList>
  </Command>
);

/** The searchable model list rendered inline (open content). */
export const Default: Story = {
  render: () => <Picker />,
};

/**
 * Workbench — fixed-width preview frame matching the catalog convention.
 * Same dataset as the Angular Workbench story; type to filter the list.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ width: 420 }}>
      <Command className="rounded-md border">
        <ModelSelectorInput placeholder="Search models…" />
        <ModelSelectorList>
          <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
          <ModelSelectorGroup>
            <ModelSelectorItem value="claude-3-5-sonnet">
              <ModelSelectorLogo provider="anthropic" />
              <ModelSelectorName>Claude 3.5 Sonnet</ModelSelectorName>
              <ModelSelectorShortcut>⌘1</ModelSelectorShortcut>
            </ModelSelectorItem>
            <ModelSelectorItem value="gpt-4o">
              <ModelSelectorLogo provider="openai" />
              <ModelSelectorName>GPT-4o</ModelSelectorName>
              <ModelSelectorShortcut>⌘2</ModelSelectorShortcut>
            </ModelSelectorItem>
            <ModelSelectorSeparator />
            <ModelSelectorItem value="gemini-1.5-pro">
              <ModelSelectorLogo provider="google" />
              <ModelSelectorName>Gemini 1.5 Pro</ModelSelectorName>
              <ModelSelectorShortcut>⌘3</ModelSelectorShortcut>
            </ModelSelectorItem>
          </ModelSelectorGroup>
        </ModelSelectorList>
      </Command>
    </div>
  ),
};

/** The real trigger → dialog flow. Click the button to open the picker. */
export const WithDialog: Story = {
  render: () => (
    <ModelSelector>
      <ModelSelectorTrigger asChild>
        <Button variant="outline">Select model…</Button>
      </ModelSelectorTrigger>
      <ModelSelectorContent>
        <ModelSelectorInput placeholder="Search models…" />
        <ModelSelectorList>
          <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
          <ModelSelectorGroup heading="OpenAI">
            <ModelSelectorItem value="gpt-4o">
              <ModelSelectorLogo provider="openai" />
              <ModelSelectorName>GPT-4o</ModelSelectorName>
              <ModelSelectorShortcut>⌘1</ModelSelectorShortcut>
            </ModelSelectorItem>
          </ModelSelectorGroup>
          <ModelSelectorSeparator />
          <ModelSelectorGroup heading="Anthropic">
            <ModelSelectorItem value="claude-3-5-sonnet">
              <ModelSelectorLogo provider="anthropic" />
              <ModelSelectorName>Claude 3.5 Sonnet</ModelSelectorName>
              <ModelSelectorShortcut>⌘3</ModelSelectorShortcut>
            </ModelSelectorItem>
          </ModelSelectorGroup>
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  ),
};
