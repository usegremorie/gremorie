import type { Meta, StoryObj } from '@storybook/angular';

import { FeaturedIcon } from './featured-icon';

/**
 * FeaturedIcon — an icon inside a styled, themed container.
 *
 * Mirrors React `FeaturedIcon`. Variants: `color` (primary · gray · success ·
 * error) × `theme` (light · solid · outline) × `size` (sm · md · lg · xl) ×
 * `shape` (square · circle). The glyph is projected as content (the React
 * edition takes a lucide `icon` prop; Angular adapts to content projection).
 */
const meta: Meta<FeaturedIcon> = {
  title: 'Layout & display/Display/FeaturedIcon',
  component: FeaturedIcon,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: ['primary', 'gray', 'success', 'error'],
    },
    theme: { control: 'inline-radio', options: ['light', 'solid', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['square', 'circle'] },
  },
};

export default meta;
type Story = StoryObj<FeaturedIcon>;

// Inline lucide glyphs (no lucide-angular dependency).
const SPARKLES = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    <path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>
  </svg>`;

const CHART = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
  </svg>`;

const BELL = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M10.268 21a2 2 0 0 0 3.464 0"/>
    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
  </svg>`;

const CHECK = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5"/>
  </svg>`;

const TRIANGLE_ALERT = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 20h16a2 2 0 0 0 1.73-2"/>
    <path d="M12 9v4"/><path d="M12 17h.01"/>
  </svg>`;

/** Workbench — a single featured icon driven by the variant controls. */
export const Workbench: Story = {
  args: { color: 'primary', theme: 'light', size: 'md', shape: 'square' },
  render: (args) => ({
    props: args,
    template: `
      <gn-featured-icon [color]="color" [theme]="theme" [size]="size" [shape]="shape">
        ${SPARKLES}
      </gn-featured-icon>
    `,
  }),
};

export const Default: Story = {
  args: { color: 'primary', theme: 'light', size: 'md', shape: 'square' },
  render: (args) => ({
    props: args,
    template: `
      <gn-featured-icon [color]="color" [theme]="theme" [size]="size" [shape]="shape">
        ${SPARKLES}
      </gn-featured-icon>
    `,
  }),
};

/** Every color × theme combination. */
export const Themes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        @for (theme of ['light', 'solid', 'outline']; track theme) {
          <div class="flex items-center gap-4">
            <span class="w-16 text-xs text-muted-foreground capitalize">{{ theme }}</span>
            @for (color of ['primary', 'gray', 'success', 'error']; track color) {
              <gn-featured-icon [color]="color" [theme]="theme">
                ${SPARKLES}
              </gn-featured-icon>
            }
          </div>
        }
      </div>
    `,
  }),
};

/** The four sizes (square). */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-end gap-4">
        @for (size of ['sm', 'md', 'lg', 'xl']; track size) {
          <gn-featured-icon [size]="size">
            ${CHART}
          </gn-featured-icon>
        }
      </div>
    `,
  }),
};

/** Square vs circle. */
export const Shapes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-4">
        <gn-featured-icon shape="square" size="lg">${BELL}</gn-featured-icon>
        <gn-featured-icon shape="circle" size="lg">${BELL}</gn-featured-icon>
      </div>
    `,
  }),
};

/** Common semantic pairings. */
export const Semantic: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-4">
        <gn-featured-icon color="success">${CHECK}</gn-featured-icon>
        <gn-featured-icon color="error">${TRIANGLE_ALERT}</gn-featured-icon>
        <gn-featured-icon color="primary">${CHART}</gn-featured-icon>
        <gn-featured-icon color="gray">${BELL}</gn-featured-icon>
      </div>
    `,
  }),
};
