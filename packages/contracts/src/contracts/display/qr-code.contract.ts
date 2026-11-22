import { defineContract } from '../../types';

/**
 * QrCode - a scannable code drawn as one SVG path. The matrix comes from
 * `uqr`; color comes from tokens (`text-foreground` on `bg-background`) and
 * the four-module quiet zone scanners need stays inside the box.
 * React: `@gremorie/rx-display` (`icon` prop).
 * Angular: `@gremorie/ng-display` (`gr-qr-code`, projected center mark).
 */
export const qrCode = defineContract({
  name: 'qr-code',
  category: 'display',
  status: 'stable',
  anatomy: `
    <qr-code>                (role="img" box: bg-background, quiet zone inside)
    ├─ <svg>                 (aria-hidden; one <path> of dark modules, fill currentColor)
    └─ [icon]                (optional centered mark over the code)`,
  props: [
    {
      name: 'value',
      type: 'string',
      required: true,
      desc: 'Text the code encodes, usually a URL. A value too long for the largest code renders an empty box.',
    },
    {
      name: 'ecc',
      type: "'L' | 'M' | 'Q' | 'H'",
      default: 'M',
      options: ['L', 'M', 'Q', 'H'],
      desc: 'Error correction level: about 7 / 15 / 25 / 30 percent recoverable. Use Q or H with a large center icon.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: 'md',
      options: ['sm', 'md', 'lg'],
      desc: '128 / 192 / 256 px square (size-32 / size-48 / size-64).',
    },
    {
      name: 'aria-label',
      type: 'string',
      default: 'QR code',
      adapts: { ng: 'input aliased to aria-label' },
      desc: 'Accessible name of the code (role="img").',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      adapts: { ng: 'not exposed (project the mark as content)' },
      desc: 'Mark centered over the code, on a bg-background plate.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the container.',
    },
  ],
  guidance: {
    summary:
      'A token-colored QR code that stays crisp at any size: one SVG path, no raster image.',
    whenToUse: [
      'Hand a link to another device: pairing, sign-in, sharing, payments.',
      'Show a short, scannable value next to its call to action.',
    ],
    whenNotToUse: [
      {
        text: 'A barcode or a long payload',
        use: 'a dedicated barcode renderer',
      },
      {
        text: 'A decorative pattern with no value to scan',
        use: 'an illustration',
      },
    ],
    rules: [
      'Always give the code an accessible name that says what scanning does (for example "Pairing code"); show the value as text nearby when it matters.',
      'Keep the code on bg-background: the quiet zone only works against a plain surface.',
      'Raise ecc to Q or H before covering the center with a mark, and test a real scan.',
      'Never recolor with raw values: color comes from text-* and bg-* tokens.',
    ],
    example:
      '<qr-code value="https://example.com/link/42" aria-label="Pairing code" />',
  },
  preview: {
    rx: 'layout-display-display-qrcode--workbench',
    ng: 'layout-display-display-qrcode--workbench',
  },
  tag: { rx: 'QrCode', ng: 'gr-qr-code' },
  example: { value: 'https://example.com', ecc: 'M', size: 'md' },
  figma: { nodeId: null },
});
