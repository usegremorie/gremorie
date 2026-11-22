import type { Meta, StoryObj } from '@storybook/react';
import { Sparkles } from 'lucide-react';

import { QrCode } from './qr-code';

const PAIRING_URL = 'https://pocketbook.example/link/K7Q2-M9XD';

/**
 * # QrCode
 *
 * A scannable code drawn as one SVG path. The matrix is built by `uqr`; the
 * dark modules use `currentColor`, so the code takes `text-foreground` on
 * `bg-background` and follows theme and dark mode with no raw colors.
 *
 * ## Anatomy
 *
 * ```
 * <QrCode>              role="img" box, quiet zone inside
 * ├─ <svg>              aria-hidden, one <path> of dark modules
 * └─ [icon]             optional centered mark
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `value` | `string` | required | Text the code encodes, usually a URL. |
 * | `ecc` | `"L" \| "M" \| "Q" \| "H"` | `"M"` | Error correction level. |
 * | `size` | `"sm" \| "md" \| "lg"` | `"md"` | 128 / 192 / 256 px. |
 * | `aria-label` | `string` | `"QR code"` | Accessible name. |
 * | `icon` | `ReactNode` | none | Centered mark; raise `ecc` to `Q` or `H`. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--background` | Code surface and the quiet zone |
 * | `--foreground` | Dark modules |
 */
const meta = {
  title: 'Layout & display/Display/QrCode',
  component: QrCode,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    value: PAIRING_URL,
    ecc: 'M',
    size: 'md',
    'aria-label': 'Pairing code',
  },
  argTypes: {
    ecc: { control: 'inline-radio', options: ['L', 'M', 'Q', 'H'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    icon: { control: false },
  },
} satisfies Meta<typeof QrCode>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Workbench: a single code driven by the controls. */
export const Workbench: Story = {};

export const Default: Story = {};

/** The three sizes. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <QrCode key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** Higher error correction trades density for tolerance to damage. */
export const ErrorCorrection: Story = {
  render: (args) => (
    <div className="flex items-end gap-6">
      {(['L', 'M', 'Q', 'H'] as const).map((ecc) => (
        <div key={ecc} className="flex flex-col items-center gap-2">
          <QrCode {...args} ecc={ecc} size="sm" />
          <span className="text-muted-foreground text-xs">Level {ecc}</span>
        </div>
      ))}
    </div>
  ),
};

/** A centered mark; level H keeps the code readable behind it. */
export const WithIcon: Story = {
  args: {
    ecc: 'H',
    icon: <Sparkles aria-hidden="true" className="text-primary" />,
  },
};
