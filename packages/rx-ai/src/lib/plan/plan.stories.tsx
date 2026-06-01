import type { Meta, StoryObj } from "@storybook/react";
import { CheckIcon, CircleDashedIcon, LoaderIcon } from "lucide-react";

import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanFooter,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "./plan";

/**
 * # Plan
 *
 * A faithful port of the Vercel AI Elements **Plan** primitive — a collapsible
 * card summarizing an agent's plan: a title, description and a body of steps,
 * with a footer for meta. When `isStreaming` is set, the title and description
 * animate with the `Shimmer` effect to signal the plan is still being written.
 *
 * ## Anatomy
 *
 * - **Plan** — `Collapsible` + `Card`; `isStreaming` toggles shimmer on text.
 * - **PlanHeader** — top row holding title/description and the action/trigger.
 * - **PlanTitle** / **PlanDescription** — heading text (string children).
 * - **PlanAction** — top-right slot (e.g. the collapse trigger).
 * - **PlanTrigger** — chevron button that toggles the content.
 * - **PlanContent** — collapsible body (the steps).
 * - **PlanFooter** — footer row for status/meta.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `isStreaming` | `boolean` | `false` | Shimmer the title/description while streaming. |
 * | `defaultOpen` | `boolean` | — | Start expanded (from `Collapsible`). |
 * | `...CollapsibleProps` | `ComponentProps<typeof Collapsible>` | — | Forwarded to the root. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `PlanHeader` | Header row. |
 * | `PlanTitle` | Title text (shimmers while streaming). |
 * | `PlanDescription` | Description text (shimmers while streaming). |
 * | `PlanAction` | Top-right action slot. |
 * | `PlanTrigger` | Chevron toggle button. |
 * | `PlanContent` | Collapsible body. |
 * | `PlanFooter` | Footer row. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--card` / `--border` | Card surface and border. |
 * | `--muted-foreground` | Description and step text. |
 */
const meta = {
  title: "AI/Plan",
  component: Plan,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    isStreaming: { control: "boolean" },
  },
} satisfies Meta<typeof Plan>;

export default meta;
type Story = StoryObj<typeof meta>;

const steps = [
  { label: "Read the relevant source files", status: "done" as const },
  { label: "Draft the implementation", status: "active" as const },
  { label: "Run the test suite", status: "todo" as const },
];

const StepList = () => (
  <ul className="space-y-2">
    {steps.map((step) => (
      <li
        className="flex items-center gap-2 text-muted-foreground text-sm"
        key={step.label}
      >
        {step.status === "done" && (
          <CheckIcon className="size-4 text-foreground" />
        )}
        {step.status === "active" && (
          <LoaderIcon className="size-4 animate-spin" />
        )}
        {step.status === "todo" && <CircleDashedIcon className="size-4" />}
        <span>{step.label}</span>
      </li>
    ))}
  </ul>
);

/** A complete plan, expanded, showing its steps. */
export const Default: Story = {
  args: { defaultOpen: true, isStreaming: false },
  render: (args) => (
    <div className="max-w-md">
      <Plan {...args}>
        <PlanHeader>
          <div className="space-y-1">
            <PlanTitle>Implement the export button</PlanTitle>
            <PlanDescription>
              Add a CSV export action to the reports table.
            </PlanDescription>
          </div>
          <PlanAction>
            <PlanTrigger />
          </PlanAction>
        </PlanHeader>
        <PlanContent>
          <StepList />
        </PlanContent>
        <PlanFooter>
          <span className="text-muted-foreground text-xs">
            1 of 3 steps complete
          </span>
        </PlanFooter>
      </Plan>
    </div>
  ),
};

/** Streaming — title and description shimmer while the plan is being generated. */
export const Streaming: Story = {
  args: { defaultOpen: true, isStreaming: true },
  render: (args) => (
    <div className="max-w-md">
      <Plan {...args}>
        <PlanHeader>
          <div className="space-y-1">
            <PlanTitle>Planning the refactor…</PlanTitle>
            <PlanDescription>
              Analyzing the module graph to decide the safest order of changes.
            </PlanDescription>
          </div>
          <PlanAction>
            <PlanTrigger />
          </PlanAction>
        </PlanHeader>
        <PlanContent>
          <StepList />
        </PlanContent>
      </Plan>
    </div>
  ),
};

/** Collapsed — body hidden; click the chevron to expand. */
export const Collapsed: Story = {
  args: { defaultOpen: false, isStreaming: false },
  render: (args) => (
    <div className="max-w-md">
      <Plan {...args}>
        <PlanHeader>
          <div className="space-y-1">
            <PlanTitle>Implement the export button</PlanTitle>
            <PlanDescription>
              Add a CSV export action to the reports table.
            </PlanDescription>
          </div>
          <PlanAction>
            <PlanTrigger />
          </PlanAction>
        </PlanHeader>
        <PlanContent>
          <StepList />
        </PlanContent>
      </Plan>
    </div>
  ),
};
