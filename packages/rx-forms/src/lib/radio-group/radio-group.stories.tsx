import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "../label/label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

/**
 * # RadioGroup
 *
 * Single-select group of mutually-exclusive options, a faithful shadcn/Radix
 * port. The `Root` owns the selected value; each `Item` is one option. The Radix
 * primitive handles roving tabindex and arrow-key navigation. Cap visible
 * options around five — beyond that, prefer `Select`.
 *
 * ## Anatomy
 *
 * - **RadioGroup** — the `Root`, a `grid gap-3` owning the value.
 * - **RadioGroupItem** — one circular option with a filled `Indicator` dot.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `value` | `string` | — | Controlled selected value. |
 * | `defaultValue` | `string` | — | Uncontrolled initial value. |
 * | `onValueChange` | `(value: string) => void` | — | Change handler. |
 * | `disabled` | `boolean` | `false` | Disable the whole group. |
 * | ...`RadioGroup.Root` | `React.ComponentProps<typeof RadioGroupPrimitive.Root>` | — | All Radix props. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `RadioGroupItem` | A single option (`value` required); pair with a `Label`. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--primary` | selected dot fill + item text |
 * | `--input` | item border |
 * | `--ring` | focus ring |
 * | `--destructive` | `aria-invalid` state |
 */
const meta = {
  title: "Inputs/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A realistic composed group with labelled options. */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

/** A disabled option within an otherwise enabled group. */
export const WithDisabledItem: Story = {
  render: () => (
    <RadioGroup defaultValue="standard">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="standard" id="p1" />
        <Label htmlFor="p1">Standard shipping</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="express" id="p2" />
        <Label htmlFor="p2">Express shipping</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="overnight" id="p3" disabled />
        <Label htmlFor="p3">Overnight (unavailable)</Label>
      </div>
    </RadioGroup>
  ),
};

/** The entire group disabled. */
export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="a" disabled>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="d1" />
        <Label htmlFor="d1">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" id="d2" />
        <Label htmlFor="d2">Option B</Label>
      </div>
    </RadioGroup>
  ),
};
