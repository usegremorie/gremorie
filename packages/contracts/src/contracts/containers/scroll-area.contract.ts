import { defineContract } from '../../types';

/**
 * ScrollArea - a themeable scroll container with consistent, cross-OS scrollbar
 * styling. React: `@gremorie/rx-containers` (wraps Radix ScrollArea). Angular:
 * `@gremorie/ng-containers` (a `gremorie` directive over `ngx-scrollbar`'s
 * `<ng-scrollbar>`).
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
        ng: 'not exposed (ngx-scrollbar renders both axes automatically; tune via CSS custom properties)',
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
      'React: mount <scroll-bar orientation="horizontal" /> for sideways content. Angular delegates both axes to ngx-scrollbar and tunes the look through CSS custom properties (e.g. --scrollbar-thumb-color), so there is no per-axis component.',
    ],
    example:
      '<scroll-area className="h-64 w-56 rounded-md border"><div className="p-4">…long content…</div></scroll-area>',
  },
  preview: {
    rx: 'layout-display-containers-scrollarea--vertical',
  },
  // ng has no standalone host element: it is a directive applied to ngx-scrollbar's
  // <ng-scrollbar> (selector: ng-scrollbar[gremorie]). Live code targets that element.
  tag: { rx: 'ScrollArea', ng: 'ng-scrollbar[gremorie]' },
  // orientation is React-only (ng delegates both axes to ngx-scrollbar); seeded
  // from the React default.
  example: { orientation: 'vertical' },
  figma: { nodeId: null },
});
