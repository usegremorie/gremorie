import { defineContract } from '../../types';

/**
 * AspectRatio - reserves vertical space for media before it loads, preventing
 * cumulative layout shift (CLS). React: `@gremorie/rx-containers` (wraps Radix
 * AspectRatio). Angular: `@gremorie/ng-containers` (native CSS `aspect-ratio`).
 */
export const aspectRatio = defineContract({
  name: 'aspect-ratio',
  category: 'containers',
  status: 'stable',
  anatomy: `
    <aspect-ratio>
    └─ box (one element; height derived from width × ratio; child fills it)`,
  props: [
    {
      name: 'ratio',
      type: 'number',
      default: 1,
      desc: 'Width / height ratio, e.g. 16 / 9 or 4 / 3.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the box (the child should fill with h-full w-full object-cover).',
    },
  ],
  guidance: {
    summary:
      'A one-prop container that reserves space for media so the layout never jumps.',
    whenToUse: [
      'Wrap a responsive image, iframe, video embed, or skeleton placeholder so the slot has a fixed shape before the asset settles.',
    ],
    whenNotToUse: [
      {
        text: 'Content with intrinsic, known dimensions',
        use: 'box',
      },
      { text: 'A loading placeholder with no media slot', use: 'skeleton' },
    ],
    rules: [
      'The single child should fill the box (h-full w-full object-cover).',
      'React uses Radix’s padding-bottom wrapper; Angular uses the native CSS aspect-ratio property on the host. Both expose the same single-box anatomy.',
    ],
    example:
      '<aspect-ratio ratio={16 / 9}><img className="h-full w-full object-cover" /></aspect-ratio>',
  },
  preview: {
    rx: 'layout-display-containers-aspectratio--workbench',
    ng: 'layout-display-containers-aspectratio--workbench',
  },
  tag: { rx: 'AspectRatio', ng: 'gn-aspect-ratio' },
  example: { ratio: 16 / 9 },
  figma: { nodeId: null },
});
