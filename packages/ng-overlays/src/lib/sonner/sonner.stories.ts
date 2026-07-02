import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Sonner, toast } from './sonner';

/**
 * Sonner (Toaster) — root mount for transient toast notifications.
 *
 * Mirrors React `Toaster` (wraps `sonner`). Behavior delegated to spartan brain
 * `BrnSonnerToaster`. Mount once; fire `toast()` from anywhere. Each story
 * mounts `<gn-sonner />` and a trigger button that calls a `toast` variant.
 */
const meta: Meta<Sonner> = {
  title: 'Overlays/Sonner',
  component: Sonner,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [Sonner] })],
  argTypes: {
    theme: {
      control: 'inline-radio',
      options: ['light', 'dark', 'system'],
    },
  },
};

export default meta;
type Story = StoryObj<Sonner>;

const TRIGGER_CLASS =
  'inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

/** Workbench — default toast on click; `theme` is controllable. */
export const Workbench: Story = {
  args: { theme: 'system' },
  render: (args) => ({
    props: {
      ...args,
      fire: () =>
        toast('Event created', {
          description: 'Monday, January 6 at 9:00 AM',
        }),
    },
    template: `
      <gn-sonner [theme]="theme" />
      <button type="button" class="${TRIGGER_CLASS}" (click)="fire()">
        Show toast
      </button>
    `,
  }),
};

/** Success — green-intent toast with the success icon. */
export const Success: Story = {
  render: () => ({
    props: { fire: () => toast.success('Profile saved') },
    template: `
      <gn-sonner />
      <button type="button" class="${TRIGGER_CLASS}" (click)="fire()">
        Show success
      </button>
    `,
  }),
};

/** Error — destructive-intent toast with the error icon and an action. */
export const Error: Story = {
  render: () => ({
    props: {
      fire: () =>
        toast.error('Could not save changes', {
          description: 'Check your connection and try again.',
          action: { label: 'Retry', onClick: () => toast('Retrying…') },
        }),
    },
    template: `
      <gn-sonner />
      <button type="button" class="${TRIGGER_CLASS}" (click)="fire()">
        Show error
      </button>
    `,
  }),
};
