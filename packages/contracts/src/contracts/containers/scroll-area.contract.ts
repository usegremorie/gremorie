import { defineContract } from '../../types';

/**
 * ScrollArea - a themeable scroll container with consistent, cross-OS scrollbar
 * styling. React: `@gremorie/rx-containers` (wraps Radix ScrollArea). Angular:
 * `@gremorie/ng-containers` (a standalone `<gr-scroll-area>` component that
 * implements its own overlay scrollbar natively with signals + ResizeObserver
 * - the native bar is hidden and a `--border`-colored pill thumb floats over
 * the content, fading in on hover, mirroring Radix ScrollArea's default
 * `type="hover"` behaviour).
 */
export const scrollArea = defineContract({
  name: 'scroll-area',
  category: 'containers',
  status: 'stable',
  anatomy: `
    <scroll-area>            (root: relative box)
    ├─ viewport             (the scrollable content area)
    ├─ scroll-bar           (a per-axis styled bar; thumb on --border)
    └─ corner`,
  props: [
    {
      name: 'orientation',
      type: 'string',
      default: 'vertical',
      options: ['vertical', 'horizontal'],
      adapts: {
        ng: 'not exposed - Angular exposes no per-axis component; the overlay thumb is vertical-only, and horizontal content still scrolls natively (no styled horizontal bar)',
      },
      desc: 'ScrollBar: which axis the bar tracks (React mounts a vertical bar by default; add a horizontal one explicitly).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Constrain the viewport (set a fixed height/width to enable scrolling).',
    },
  ],
  guidance: {
    summary:
      'A scroll container with a consistent, themed scrollbar across operating systems.',
    whenToUse: [
      'You want a uniform scrollbar look across OSs, or the bar sits inside a rounded card where the native one would bleed past the radius.',
    ],
    whenNotToUse: [
      {
        text: 'Plain page or element scroll (native scroll is fine 99% of the time)',
      },
    ],
    rules: [
      'Set a fixed height/width on the area so its content can overflow and scroll.',
      'React: mount <scroll-bar orientation="horizontal" /> for sideways content. Angular renders a single vertical overlay thumb natively, with no external dependency; it exposes no per-axis component, so horizontal content still scrolls natively without a styled bar.',
    ],
    example:
      '<scroll-area className="h-64 w-56 rounded-md border"><div className="p-4">…long content…</div></scroll-area>',
  },
  preview: {
    rx: 'layout-display-containers-scrollarea--workbench',
    ng: 'layout-display-containers-scrollarea--workbench',
  },
  // ng is a standalone component (selector: gr-scroll-area) with its own host
  // element and inner viewport. Live code targets that element.
  tag: { rx: 'ScrollArea', ng: 'gr-scroll-area' },
  // orientation is React-only (ng exposes no per-axis component - its overlay
  // thumb is vertical-only); seeded from the React default.
  example: { orientation: 'vertical' },
  figma: { nodeId: null },
});
