import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

/**
 * Card — surface primitive for grouping related content.
 *
 * Compound API: Header / Title / Description / Action / Content / Footer.
 * Stories exercise the common compositions: simple, with-action,
 * with-footer, edge-to-edge.
 */
const meta: Meta<Card> = {
  title: 'Layout & display/Display/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        Card,
        CardHeader,
        CardTitle,
        CardDescription,
        CardAction,
        CardContent,
        CardFooter,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Card>;

/** Workbench — header + content at a fixed width. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gr-card class="w-96">
        <gr-card-header>
          <gr-card-title>Notifications</gr-card-title>
          <gr-card-description>You have 3 unread messages.</gr-card-description>
        </gr-card-header>
        <gr-card-content>
          <p class="text-sm text-muted-foreground">
            Stay updated with the latest activity from your team.
          </p>
        </gr-card-content>
      </gr-card>
    `,
  }),
};

export const Default: Story = {
  render: () => ({
    template: `
      <gr-card class="max-w-sm">
        <gr-card-header>
          <gr-card-title>Notifications</gr-card-title>
          <gr-card-description>You have 3 unread messages.</gr-card-description>
        </gr-card-header>
        <gr-card-content>
          <p class="text-sm text-muted-foreground">
            Stay updated with the latest activity from your team.
          </p>
        </gr-card-content>
      </gr-card>
    `,
  }),
};

export const WithAction: Story = {
  render: () => ({
    template: `
      <gr-card class="max-w-sm">
        <gr-card-header>
          <gr-card-title>Project Alpha</gr-card-title>
          <gr-card-description>Status: In progress</gr-card-description>
          <gr-card-action>
            <button class="rounded-md border px-3 py-1 text-xs hover:bg-accent">
              Edit
            </button>
          </gr-card-action>
        </gr-card-header>
        <gr-card-content>
          <p class="text-sm text-muted-foreground">
            12 issues open, 4 closed this week.
          </p>
        </gr-card-content>
      </gr-card>
    `,
  }),
};

export const WithFooter: Story = {
  render: () => ({
    template: `
      <gr-card class="max-w-sm">
        <gr-card-header>
          <gr-card-title>Subscribe</gr-card-title>
          <gr-card-description>Get the weekly digest in your inbox.</gr-card-description>
        </gr-card-header>
        <gr-card-content>
          <input
            type="email"
            placeholder="you@example.com"
            class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </gr-card-content>
        <gr-card-footer class="flex justify-end gap-2">
          <button class="rounded-md border px-3 py-2 text-sm hover:bg-accent">
            Cancel
          </button>
          <button class="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90">
            Subscribe
          </button>
        </gr-card-footer>
      </gr-card>
    `,
  }),
};

/**
 * Edge-to-edge — when a media surface or list should fill the Card to its
 * border, drop the default `py-6` on the root and use `px-0` on content.
 * Mirrors the React `Card` recipe for thumbnails and inline tables.
 */
export const EdgeToEdge: Story = {
  render: () => ({
    template: `
      <gr-card class="max-w-sm gap-0 py-0 overflow-hidden">
        <gr-card-header class="py-6">
          <gr-card-title>Media card</gr-card-title>
          <gr-card-description>Cover fills the Card edges.</gr-card-description>
        </gr-card-header>
        <gr-card-content class="px-0">
          <div class="h-32 w-full bg-gradient-to-br from-brand-500 to-brand-700"></div>
        </gr-card-content>
        <gr-card-footer class="border-t py-4">
          <span class="text-xs text-muted-foreground">Updated 2 hours ago</span>
        </gr-card-footer>
      </gr-card>
    `,
  }),
};

/**
 * Compound showcase — full anatomy on one canvas. Useful for regression
 * (e.g., title/description spacing) when adjusting host classes on
 * `gr-card-header`.
 */
export const FullAnatomy: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gr-card class="max-w-md">
        <gr-card-header>
          <gr-card-title>Account settings</gr-card-title>
          <gr-card-description>Manage your account preferences and security.</gr-card-description>
          <gr-card-action>
            <button class="rounded-md border px-2 py-1 text-xs">…</button>
          </gr-card-action>
        </gr-card-header>
        <gr-card-content>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between"><span>Email</span><span class="text-muted-foreground">you&#64;example.com</span></div>
            <div class="flex justify-between"><span>Plan</span><span class="text-muted-foreground">Pro</span></div>
          </div>
        </gr-card-content>
        <gr-card-footer class="border-t justify-between">
          <span class="text-xs text-muted-foreground">Member since 2024</span>
          <button class="text-xs underline-offset-4 hover:underline">Log out</button>
        </gr-card-footer>
      </gr-card>
    `,
  }),
};
