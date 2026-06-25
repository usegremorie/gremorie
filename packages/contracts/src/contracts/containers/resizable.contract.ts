import { defineContract } from '../../types';

/**
 * Resizable - split panes with draggable handles. React: `@gremorie/rx-containers`
 * (built on `react-resizable-panels`). Angular: `@gremorie/ng-containers` (wraps
 * `@spartan-ng/brain` resizable primitives via hostDirectives).
 */
export const resizable = defineContract({
  name: 'resizable',
  category: 'containers',
  status: 'stable',
  anatomy: `
    <resizable-panel-group>   (the frame; direction sets the axis)
    ├─ resizable-panel        (a flex region, sized in %)
    ├─ resizable-handle       (the drag divider; withHandle for a grip)
    └─ resizable-panel
       └─ resizable-panel-group   (groups nest for multi-pane layouts)`,
  props: [
    {
      name: 'direction',
      type: 'string',
      options: ['horizontal', 'vertical'],
      desc: 'Group: layout axis.',
    },
    {
      name: 'defaultSize',
      type: 'number',
      desc: 'Panel: initial size as a percentage.',
    },
    {
      name: 'minSize',
      type: 'number',
      desc: 'Panel: lower clamp (percentage).',
    },
    {
      name: 'maxSize',
      type: 'number',
      desc: 'Panel: upper clamp (percentage).',
    },
    {
      name: 'collapsible',
      type: 'boolean',
      default: false,
      desc: 'Panel: allow the panel to collapse fully.',
    },
    {
      name: 'withHandle',
      type: 'boolean',
      default: false,
      desc: 'Handle: show the visible grip affordance.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the group / panel / handle.',
    },
    {
      name: 'onLayout',
      type: '(sizes: number[]) => void',
      adapts: {
        rx: 'react-resizable-panels onLayout',
        ng: 'output: layoutChange / layoutChanged',
      },
      desc: 'Group: fires with the new panel sizes after a drag.',
    },
  ],
  guidance: {
    summary:
      'Split panes a user can drag to resize, with optional collapse and nesting.',
    whenToUse: [
      'Dev tools and pro apps: code editors, mail clients, file managers where the user controls the split.',
    ],
    whenNotToUse: [
      {
        text: 'Consumer surfaces that read better with fixed proportions plus responsive breakpoints',
        use: 'stack',
      },
    ],
    rules: [
      'defaultSize / minSize / maxSize are percentages, not pixels.',
      'Place a resizable-handle between every two panels; pass withHandle for a visible grip.',
      'Groups nest: a panel can host another panel-group on the opposite axis.',
    ],
    example:
      '<resizable-panel-group direction="horizontal"><resizable-panel defaultSize={40} minSize={20} /><resizable-handle withHandle /><resizable-panel defaultSize={60} /></resizable-panel-group>',
  },
  preview: {
    rx: 'layout-display-containers-resizable--horizontal',
    ng: 'layout-display-containers-resizable--workbench',
  },
  figma: { nodeId: null },
});
