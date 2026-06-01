import type { Meta, StoryObj } from '@storybook/react';
import { Bold, ChevronDown, Copy, Italic, Plus, Underline } from 'lucide-react';

import { Button } from '../button/button';
import { Input } from '../input/input';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from './button-group';

/**
 * # ButtonGroup
 *
 * Layout primitive that visually joins a row (or column) of buttons, inputs and
 * text addons into a single segmented control. Adjacent children share borders
 * and have their inner corners squared off via CVA `orientation` rules.
 *
 * ## Anatomy
 *
 * - **ButtonGroup** — `role="group"` flex wrapper that fuses its children.
 * - **ButtonGroupText** — a non-interactive text/label segment (muted addon).
 * - **ButtonGroupSeparator** — a thin Radix Separator between segments.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction; controls which corners/borders are merged. |
 * | ...`div` | `React.ComponentProps<"div">` | — | Native div props. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `ButtonGroupText` | Non-interactive muted text segment (`asChild` supported). |
 * | `ButtonGroupSeparator` | Divider between segments (vertical by default). |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--muted` | `ButtonGroupText` background |
 * | `--input` | separator color |
 * | `--border` | shared segment borders |
 */
const meta = {
  title: 'Inputs/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A simple horizontal group of three buttons. */
export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">One</Button>
      <Button variant="outline">Two</Button>
      <Button variant="outline">Three</Button>
    </ButtonGroup>
  ),
};

/** Vertical orientation stacks the segments and merges top/bottom corners. */
export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Top</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  ),
};

/** Icon-only toolbar — a common formatting cluster. */
export const IconToolbar: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline" size="icon" aria-label="Bold">
        <Bold />
      </Button>
      <Button variant="outline" size="icon" aria-label="Italic">
        <Italic />
      </Button>
      <Button variant="outline" size="icon" aria-label="Underline">
        <Underline />
      </Button>
    </ButtonGroup>
  ),
};

/** A text addon segment joined to an input and a button. */
export const WithText: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>https://</ButtonGroupText>
      <Input placeholder="example.com" />
      <Button variant="outline">Go</Button>
    </ButtonGroup>
  ),
};

/** Split button: primary action plus a separated dropdown affordance. */
export const SplitButton: Story = {
  render: () => (
    <ButtonGroup>
      <Button>
        <Plus /> New
      </Button>
      <ButtonGroupSeparator />
      <Button size="icon" aria-label="More options">
        <ChevronDown />
      </Button>
    </ButtonGroup>
  ),
};

/** Input + copy action, a frequent "copyable value" pattern. */
export const InputWithAction: Story = {
  render: () => (
    <ButtonGroup>
      <Input readOnly value="gmr_live_8f3a…d21" className="w-56" />
      <Button variant="outline" size="icon" aria-label="Copy">
        <Copy />
      </Button>
    </ButtonGroup>
  ),
};
