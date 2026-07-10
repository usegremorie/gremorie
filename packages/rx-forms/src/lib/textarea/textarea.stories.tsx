import type { Meta, StoryObj } from '@storybook/react';

import { Label } from '../label/label';
import { Textarea } from './textarea';

/**
 * # Textarea
 *
 * Multi-line text field — a faithful shadcn port. Uses CSS
 * `field-sizing: content` so it grows automatically as the user types, with no
 * manual `rows` or JS measurement in modern browsers. Pair with labels and
 * validation messages.
 *
 * ## Anatomy
 *
 * ```text
 * Textarea   single styled <textarea>, min-h-16, auto-growing via field-sizing: content
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `placeholder` | `string` | — | Placeholder text. |
 * | `disabled` | `boolean` | `false` | Disable interaction. |
 * | `aria-invalid` | `boolean` | — | Switches to destructive error styling. |
 * | ...`textarea` | `React.ComponentProps<"textarea">` | — | All native textarea props. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--input` | default border |
 * | `--ring` | focus ring |
 * | `--destructive` | `aria-invalid` border/ring |
 * | `--muted-foreground` | placeholder |
 */
const meta = {
  title: 'Inputs/Text/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { placeholder: 'Type your message…' },
  argTypes: { disabled: { control: 'boolean' } },
  render: (args) => <Textarea className="w-80" {...args} />,
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Workbench preset: renders the IDENTICAL use case as the Angular `Workbench`
 * story in `ng-forms`. Keep both datasets in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    placeholder: 'Type your message…',
    disabled: false,
    'aria-invalid': false,
    defaultValue: '',
  },
};

/** Empty textarea. */
export const Default: Story = {};

/** Pre-filled with content. */
export const WithValue: Story = {
  args: {
    defaultValue:
      'Gremorie is an AI-native design system. This field grows as you add more lines of text.',
  },
};

/** Disabled. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Read only content' },
};

/** Error state via `aria-invalid`. */
export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'Too short' },
};

/** Paired with a Label for an accessible field. */
export const WithLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" placeholder="Tell us about yourself…" />
    </div>
  ),
};
