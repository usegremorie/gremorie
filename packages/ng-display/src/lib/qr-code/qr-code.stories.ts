import type { Meta, StoryObj } from '@storybook/angular';

import { QrCode } from './qr-code';

const PAIRING_URL = 'https://pocketbook.example/link/K7Q2-M9XD';

/**
 * QrCode: a scannable code drawn as one SVG path.
 *
 * Mirrors React `QrCode`. The matrix is built by `uqr`; the dark modules use
 * `currentColor`, so the code takes `text-foreground` on `bg-background`. The
 * center mark is projected as content (React takes an `icon` prop).
 */
const meta: Meta<QrCode> = {
  title: 'Layout & display/Display/QrCode',
  component: QrCode,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { value: PAIRING_URL, ecc: 'M', size: 'md' },
  argTypes: {
    ecc: { control: 'inline-radio', options: ['L', 'M', 'Q', 'H'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<QrCode>;

const SPARKLES = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary" aria-hidden="true">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
  </svg>`;

/** Workbench: a single code driven by the controls. */
export const Workbench: Story = {
  render: (args) => ({
    props: args,
    template: `<gr-qr-code [value]="value" [ecc]="ecc" [size]="size" aria-label="Pairing code" />`,
  }),
};

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<gr-qr-code [value]="value" [ecc]="ecc" [size]="size" aria-label="Pairing code" />`,
  }),
};

/** The three sizes. */
export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex items-end gap-6">
        <gr-qr-code [value]="value" size="sm" aria-label="Pairing code" />
        <gr-qr-code [value]="value" size="md" aria-label="Pairing code" />
        <gr-qr-code [value]="value" size="lg" aria-label="Pairing code" />
      </div>
    `,
  }),
};

/** Higher error correction trades density for tolerance to damage. */
export const ErrorCorrection: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex items-end gap-6">
        @for (level of ['L', 'M', 'Q', 'H']; track level) {
          <div class="flex flex-col items-center gap-2">
            <gr-qr-code [value]="value" [ecc]="level" size="sm" aria-label="Pairing code" />
            <span class="text-muted-foreground text-xs">Level {{ level }}</span>
          </div>
        }
      </div>
    `,
  }),
};

/** A centered mark; level H keeps the code readable behind it. */
export const WithIcon: Story = {
  render: (args) => ({
    props: args,
    template: `<gr-qr-code [value]="value" ecc="H" [size]="size" aria-label="Pairing code">${SPARKLES}</gr-qr-code>`,
  }),
};
