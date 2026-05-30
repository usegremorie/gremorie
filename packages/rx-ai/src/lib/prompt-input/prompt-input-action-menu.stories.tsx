import type { Meta, StoryObj } from "@storybook/react";
import { CameraIcon, MicIcon, PlugIcon } from "lucide-react";

import {
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
} from "./prompt-input";

/**
 * PromptInputActionMenu - dropdown of in-input actions (React edition).
 *
 * Mirrors the ng-ai PromptInput/ActionMenu stories. A trigger button (a "+"
 * by default) opens a DropdownMenu of extra actions: take a photo, record
 * voice, connect a tool, and so on.
 */
const meta = {
  title: "PromptInput/ActionMenu",
  component: PromptInputActionMenu,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof PromptInputActionMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Trigger + 3 items",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="p-16">
      <PromptInputActionMenu>
        <PromptInputActionMenuTrigger aria-label="More actions" />
        <PromptInputActionMenuContent>
          <PromptInputActionMenuItem>
            <CameraIcon className="mr-2 size-4" /> Take a photo
          </PromptInputActionMenuItem>
          <PromptInputActionMenuItem>
            <MicIcon className="mr-2 size-4" /> Record voice
          </PromptInputActionMenuItem>
          <PromptInputActionMenuItem>
            <PlugIcon className="mr-2 size-4" /> Connect tool...
          </PromptInputActionMenuItem>
        </PromptInputActionMenuContent>
      </PromptInputActionMenu>
    </div>
  ),
};

/**
 * Disabled - the trigger is disabled, so the menu cannot be opened.
 */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="p-16">
      <PromptInputActionMenu>
        <PromptInputActionMenuTrigger aria-label="More actions" disabled />
        <PromptInputActionMenuContent>
          <PromptInputActionMenuItem>
            <CameraIcon className="mr-2 size-4" /> Take a photo
          </PromptInputActionMenuItem>
          <PromptInputActionMenuItem>
            <MicIcon className="mr-2 size-4" /> Record voice
          </PromptInputActionMenuItem>
          <PromptInputActionMenuItem>
            <PlugIcon className="mr-2 size-4" /> Connect tool...
          </PromptInputActionMenuItem>
        </PromptInputActionMenuContent>
      </PromptInputActionMenu>
    </div>
  ),
};
