import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanFooter,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from './plan';

/**
 * Plan — a collapsible Card presenting an agent's proposed plan. Mirrors
 * React `Plan` from `@gremorie/rx-ai`. Title/description shimmer while
 * `isStreaming` is true.
 */
const meta: Meta<Plan> = {
  title: 'AI/Plan',
  component: Plan,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        Plan,
        PlanHeader,
        PlanTitle,
        PlanDescription,
        PlanAction,
        PlanContent,
        PlanFooter,
        PlanTrigger,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Plan>;

/**
 * Workbench — fixed-width preview frame matching the catalog convention.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <div style="width: 420px;">
        <plan [open]="true">
          <plan-header>
            <div>
              <plan-title children="Refactor the auth flow" />
              <plan-description
                children="Split the monolithic handler into guard, resolver, and store."
              />
            </div>
            <plan-action>
              <plan-trigger />
            </plan-action>
          </plan-header>
          <plan-content>
            <ol class="ml-4 list-decimal space-y-1 text-sm text-muted-foreground">
              <li>Extract the token refresh into an interceptor.</li>
              <li>Move session state into a signal store.</li>
              <li>Add a route guard for protected pages.</li>
            </ol>
          </plan-content>
          <plan-footer>
            <span class="text-xs text-muted-foreground">3 steps · ~2 min</span>
          </plan-footer>
        </plan>
      </div>
    `,
  }),
};

/**
 * Collapsed — header only; click the trigger to expand the content.
 */
export const Collapsed: Story = {
  render: () => ({
    template: `
      <plan class="w-[420px]">
        <plan-header>
          <div>
            <plan-title children="Migrate to standalone components" />
            <plan-description children="Drop NgModules across the workspace." />
          </div>
          <plan-action><plan-trigger /></plan-action>
        </plan-header>
        <plan-content>
          <p class="text-sm text-muted-foreground">Hidden until expanded.</p>
        </plan-content>
      </plan>
    `,
  }),
};

/**
 * Streaming — title and description shimmer while the plan is being generated.
 */
export const Streaming: Story = {
  render: () => ({
    template: `
      <plan class="w-[420px]" [isStreaming]="true" [open]="true">
        <plan-header>
          <div>
            <plan-title children="Drafting a plan…" />
            <plan-description children="Analyzing the codebase to propose steps." />
          </div>
          <plan-action><plan-trigger /></plan-action>
        </plan-header>
        <plan-content>
          <p class="text-sm text-muted-foreground">Steps will appear here.</p>
        </plan-content>
      </plan>
    `,
  }),
};
