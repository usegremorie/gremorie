import type { Meta, StoryObj } from '@storybook/react';
import { TooltipProvider } from '@gremorie/rx-overlays';
import {
  BookOpenIcon,
  DatabaseIcon,
  FileSpreadsheetIcon,
  GitBranchIcon,
  LayersIcon,
  NotebookTextIcon,
} from 'lucide-react';

import {
  PromptInputMentions,
  type PromptInputMentionsItem,
} from './prompt-input-mentions';

/**
 * # PromptInputMentions — "@ Add context"
 *
 * The context picker for the PromptInput header: a searchable command palette
 * behind an `@` trigger, plus a removable chip per selected item. It owns its
 * own selection state (controllable via `value` / `onValueChange`), so dropping
 * it into a header gives the canonical behaviour for free:
 *
 * - **0 selected** → a labelled `@ Add context` outline button.
 * - **1+ selected** → the trigger collapses to an icon-only `@` button,
 *   followed by a removable chip per selected item.
 *
 * The palette is the same Popover + Command combobox used by the model
 * selector: searchable, grouped by `group`, multi-select.
 *
 * ## Anatomy
 *
 * A single self-contained component — pass `items` and (optionally) the
 * controlled `value`. The trigger, popover palette and selected chips are all
 * rendered internally.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `items` | `PromptInputMentionsItem[]` | — | Available context, grouped in declaration order. |
 * | `value` | `string[]` | — | Controlled selected ids. |
 * | `defaultValue` | `string[]` | `[]` | Uncontrolled initial selection. |
 * | `onValueChange` | `(ids: string[]) => void` | — | Fires with the next selection. |
 * | `label` | `ReactNode` | `'Add context'` | Button label while nothing is selected. |
 * | `placeholder` | `string` | `'Search context...'` | Palette search placeholder. |
 * | `tooltip` | `ReactNode` | `'Add context'` | Trigger tooltip (`null` to disable). |
 */
const meta = {
  title: 'AI/Chatbot/PromptInput/Mentions',
  component: PromptInputMentions,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    emptyText: { control: 'text' },
  },
} satisfies Meta<typeof PromptInputMentions>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS: PromptInputMentionsItem[] = [
  {
    id: 'q3-revenue',
    label: 'Q3 revenue.csv',
    group: 'Recent',
    icon: <FileSpreadsheetIcon />,
  },
  {
    id: 'brand',
    label: 'Brand guidelines',
    group: 'Recent',
    icon: <BookOpenIcon />,
  },
  {
    id: 'onboarding-prd',
    label: 'Onboarding PRD',
    group: 'Recent',
    icon: <NotebookTextIcon />,
  },
  {
    id: 'notion-roadmap',
    label: 'Notion: Roadmap',
    group: 'Workspace',
    icon: <DatabaseIcon />,
  },
  {
    id: 'linear-sprint',
    label: 'Linear: Sprint 24',
    group: 'Workspace',
    icon: <LayersIcon />,
  },
  {
    id: 'github-app',
    label: 'GitHub: gremorie/app',
    group: 'Workspace',
    icon: <GitBranchIcon />,
  },
];

/**
 * Empty — nothing selected yet. The trigger is the labelled "@ Add context"
 * button. Click it to open the grouped, searchable palette.
 */
export const Empty: Story = {
  args: { items: ITEMS },
};

/**
 * With selection — the trigger collapses to an icon-only "@" and each pick
 * becomes a removable chip (same height as the trigger).
 */
export const WithSelection: Story = {
  args: {
    items: ITEMS,
    defaultValue: ['q3-revenue', 'brand'],
  },
};

/**
 * Filled — several items selected, so the chips wrap. Exercises the chip row
 * layout and the per-chip remove control.
 */
export const Filled: Story = {
  args: {
    items: ITEMS,
    defaultValue: ['q3-revenue', 'brand', 'onboarding-prd', 'notion-roadmap'],
  },
};
