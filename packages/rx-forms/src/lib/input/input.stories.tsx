import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "../label/label";
import { Input } from "./input";

/**
 * # Input
 *
 * Single-line text field — a faithful shadcn port. Renders a styled native
 * `<input>` that adopts every HTML `type` (text, email, password, number,
 * search, tel, url, file…). Visual states are token-driven: `border-input` by
 * default, `ring-ring/50` on focus, `border-destructive` on `aria-invalid`.
 *
 * ## Anatomy
 *
 * A single styled `<input>` element.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `type` | `string` | `"text"` | Any native input type. |
 * | `placeholder` | `string` | — | Placeholder text. |
 * | `disabled` | `boolean` | `false` | Disable interaction. |
 * | `aria-invalid` | `boolean` | — | Switches to the destructive error styling. |
 * | ...`input` | `React.ComponentProps<"input">` | — | All native input props. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--input` | default border |
 * | `--ring` | focus ring |
 * | `--destructive` | `aria-invalid` border/ring |
 * | `--muted-foreground` | placeholder |
 * | `--primary` / `--primary-foreground` | text selection |
 */
const meta = {
  title: "Inputs/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { placeholder: "Type here…" },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url", "file"],
    },
    disabled: { control: "boolean" },
  },
  render: (args) => <Input className="w-72" {...args} />,
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default text input. */
export const Default: Story = {};

/** Pre-filled value. */
export const WithValue: Story = { args: { defaultValue: "ada@example.com" } };

/** Email type. */
export const Email: Story = { args: { type: "email", placeholder: "ada@example.com" } };

/** Password type (masked). */
export const Password: Story = { args: { type: "password", defaultValue: "secret123" } };

/** Disabled. */
export const Disabled: Story = { args: { disabled: true, defaultValue: "Can't edit" } };

/** Error state via `aria-invalid`. */
export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "not-an-email" },
};

/** File input. */
export const File: Story = { args: { type: "file", placeholder: undefined } };

/** Paired with a Label for an accessible field. */
export const WithLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="ada@example.com" />
    </div>
  ),
};
