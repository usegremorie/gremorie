import { defineContract } from '../../types';

/**
 * Stack - the vertical layout primitive: a `flex flex-col` div with consistent
 * gap / align / justify props. React: `@gremorie/rx-containers`. Angular:
 * `@gremorie/ng-containers`.
 */
export const stack = defineContract({
  name: 'stack',
  category: 'containers',
  status: 'stable',
  anatomy: `
    <stack>
    └─ div (flex flex-col; spacing + alignment driven by props)`,
  props: [
    {
      name: 'gap',
      type: 'string',
      default: 'md',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      desc: 'Spacing between children (0 / 4 / 8 / 16 / 24 / 32 / 48 px).',
    },
    {
      name: 'align',
      type: 'string',
      default: 'stretch',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      desc: 'Cross-axis (align-items).',
    },
    {
      name: 'justify',
      type: 'string',
      default: 'start',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      desc: 'Main-axis (justify-content).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the flex column.',
    },
    {
      name: 'ref',
      type: 'Ref<HTMLDivElement>',
      adapts: { ng: 'use a template reference variable on the host' },
      desc: 'Forwarded to the underlying div.',
    },
  ],
  guidance: {
    summary:
      'A flex-column primitive for any list of items flowing top to bottom.',
    whenToUse: [
      'Card contents, form sections, settings rows, vertical menus — anything stacked vertically with a consistent gap.',
    ],
    whenNotToUse: [
      { text: 'Row layouts', use: 'flex' },
      { text: 'Two-axis grids', use: 'grid' },
      { text: 'A one-off styled div with no layout intent', use: 'box' },
    ],
    rules: [
      'The gap scale maps 1:1 across frameworks (0 / 4 / 8 / 16 / 24 / 32 / 48 px).',
    ],
    example:
      '<stack gap="md" className="w-64"><div>One</div><div>Two</div></stack>',
  },
  preview: {
    rx: 'layout-display-containers-stack--default',
    ng: 'layout-display-containers-stack--workbench',
  },
  figma: { nodeId: null },
});
