import type { Meta, StoryObj } from "@storybook/react";
import { CreditCard, Mail, Search, Send } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group";

/**
 * # InputGroup
 *
 * Layout primitive that composes an Input or Textarea with inline addons
 * (icons, buttons, text, kbd hints). The wrapper drives focus / invalid /
 * disabled styling from the inner control, so addons style themselves
 * automatically.
 *
 * ## Anatomy
 *
 * - **InputGroup** — `role="group"` wrapper owning the border + focus ring.
 * - **InputGroupInput** / **InputGroupTextarea** — the borderless inner control.
 * - **InputGroupAddon** — positioned slot for icons/buttons/text (`align`).
 * - **InputGroupButton** — a compact ghost button sized for the group.
 * - **InputGroupText** — inline muted text/kbd hint.
 *
 * ## Props
 *
 * | Prop (InputGroupAddon) | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `align` | `"inline-start" \| "inline-end" \| "block-start" \| "block-end"` | `"inline-start"` | Where the addon sits relative to the control. |
 *
 * | Prop (InputGroupButton) | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `size` | `"xs" \| "sm" \| "icon-xs" \| "icon-sm"` | `"xs"` | Compact button size. |
 * | `variant` | `Button["variant"]` | `"ghost"` | Inherited from Button. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `InputGroupInput` | Borderless `Input` for the group. |
 * | `InputGroupTextarea` | Borderless `Textarea` for the group. |
 * | `InputGroupAddon` | Positioned addon slot (`align` variants). |
 * | `InputGroupButton` | Compact button sized for the group. |
 * | `InputGroupText` | Inline muted text / kbd. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--input` | group border |
 * | `--ring` | focus ring (from inner control) |
 * | `--destructive` | invalid state (from inner control) |
 * | `--muted-foreground` | addon text/icons |
 * | `--radius` | kbd / button corner rounding |
 */
const meta = {
  title: "Inputs/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Leading icon addon. */
export const LeadingIcon: Story = {
  render: () => (
    <InputGroup className="w-72">
      <InputGroupAddon align="inline-start">
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search…" />
    </InputGroup>
  ),
};

/** Trailing button addon (send). */
export const TrailingButton: Story = {
  render: () => (
    <InputGroup className="w-72">
      <InputGroupInput placeholder="Type a message…" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label="Send">
          <Send />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

/** Leading text prefix plus a trailing icon. */
export const TextAddon: Story = {
  render: () => (
    <InputGroup className="w-72">
      <InputGroupAddon align="inline-start">
        <InputGroupText>@</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="username" />
      <InputGroupAddon align="inline-end">
        <Mail />
      </InputGroupAddon>
    </InputGroup>
  ),
};

/** Both ends: icon prefix + button suffix. */
export const BothEnds: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon align="inline-start">
        <CreditCard />
      </InputGroupAddon>
      <InputGroupInput placeholder="Card number" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Apply</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

/** Block addon below a textarea (toolbar row). */
export const TextareaWithBlockAddon: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupTextarea placeholder="Write a comment…" />
      <InputGroupAddon align="block-end">
        <InputGroupText>Markdown supported</InputGroupText>
        <InputGroupButton className="ml-auto">
          <Send /> Send
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

/** Invalid state propagates from the inner control to the group border. */
export const Invalid: Story = {
  render: () => (
    <InputGroup className="w-72">
      <InputGroupAddon align="inline-start">
        <Mail />
      </InputGroupAddon>
      <InputGroupInput aria-invalid defaultValue="not-an-email" />
    </InputGroup>
  ),
};
