import { defineContract } from '../../types';

/**
 * ScrollArea - a themeable scroll container with consistent, cross-OS scrollbar
 * styling. React: `@gremorie/rx-containers` (wraps Radix ScrollArea). Angular:
 * `@gremorie/ng-containers` (a standalone `<gr-scroll-area>` component; the
 * visible bar comes from the DS scrollbar token baseline, no third-party lib).
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
        ng: 'not exposed (gr-scroll-area uses native overflow plus the token scrollbar baseline; a horizontal bar is just native overflow-x, no per-axis component)',
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
      'React: mount <scroll-bar orientation="horizontal" /> for sideways content. Angular relies on native overflow plus the DS scrollbar token baseline for both axes, so there is no per-axis component.',
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
  // orientation is React-only (ng relies on native overflow for both axes);
  // seeded from the React default.
  example: { orientation: 'vertical' },
  figma: { nodeId: null },
});
