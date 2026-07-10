import type { Meta, StoryObj } from '@storybook/react';

import { Label } from '../label/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

/**
 * # Select
 *
 * Dropdown chooser for short, fixed lists — a faithful shadcn/Radix port. A
 * compound primitive: the trigger and value live in page flow while the listbox
 * is portalled and animated by Radix.
 *
 * ## Anatomy
 *
 * ```text
 * Select                       root, owns the value (value / onValueChange)
 * ├─ SelectTrigger             the visible button (size = sm | default)
 * │  └─ SelectValue            renders the selected value / placeholder
 * └─ SelectContent             the portalled, scrollable listbox
 *    ├─ SelectScrollUpButton   scroll-up affordance (auto-included)
 *    ├─ SelectGroup            grouped section
 *    │  ├─ SelectLabel         non-selectable group heading
 *    │  └─ SelectItem          one option (check indicator when selected)
 *    ├─ SelectSeparator        divider between groups
 *    └─ SelectScrollDownButton scroll-down affordance (auto-included)
 * ```
 *
 * ## Props
 *
 * | Prop (Select) | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `value` | `string` | — | Controlled value. |
 * | `defaultValue` | `string` | — | Uncontrolled initial value. |
 * | `onValueChange` | `(value: string) => void` | — | Change handler. |
 * | `disabled` | `boolean` | `false` | Disable the control. |
 *
 * | Prop (SelectTrigger) | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `size` | `"sm" \| "default"` | `"default"` | Trigger height. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `SelectTrigger` | The clickable trigger (`size`). |
 * | `SelectValue` | Selected value / placeholder display. |
 * | `SelectContent` | Portalled listbox. |
 * | `SelectGroup` / `SelectLabel` | Grouped options with a heading. |
 * | `SelectItem` | Single option. |
 * | `SelectSeparator` | Divider. |
 * | `SelectScrollUpButton` / `SelectScrollDownButton` | Scroll affordances. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--input` | trigger border |
 * | `--popover` / `--popover-foreground` | content surface |
 * | `--accent` / `--accent-foreground` | item hover/focus |
 * | `--ring` | focus ring |
 * | `--muted-foreground` | placeholder + group label |
 */
const meta = {
  title: 'Inputs/Selection/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Workbench preset: renders the IDENTICAL use case as the Angular `Workbench`
 * story in `ng-forms`. Keep both datasets in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: { disabled: false },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/** A realistic composed select with a placeholder. */
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/** Grouped options with labels and a separator. */
export const Grouped: Story = {
  render: () => (
    <Select defaultValue="cst">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern (EST)</SelectItem>
          <SelectItem value="cst">Central (CST)</SelectItem>
          <SelectItem value="pst">Pacific (PST)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich (GMT)</SelectItem>
          <SelectItem value="cet">Central European (CET)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

/** The small (`sm`) trigger size. */
export const SmallTrigger: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" className="w-44">
        <SelectValue placeholder="Small" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="one">One</SelectItem>
        <SelectItem value="two">Two</SelectItem>
        <SelectItem value="three">Three</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/** A disabled item within the list. */
export const WithDisabledItem: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Choose a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Free</SelectItem>
        <SelectItem value="pro">Pro</SelectItem>
        <SelectItem value="enterprise" disabled>
          Enterprise (contact sales)
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

/** Disabled control. */
export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Disabled" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="x">X</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/** Paired with a Label for an accessible field. */
export const WithLabel: Story = {
  render: () => (
    <div className="flex w-56 flex-col gap-2">
      <Label htmlFor="country">Country</Label>
      <Select>
        <SelectTrigger id="country" className="w-56">
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="br">Brazil</SelectItem>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="pt">Portugal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
