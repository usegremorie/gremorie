import { defineContract } from '../../types';

/**
 * TabBar - the app's top-level destinations docked to the bottom of a phone
 * screen, in three looks (material bar, ios capsule, floating icon pill).
 * React: `@gremorie/rx-navigation`. Angular: `@gremorie/ng-navigation`.
 */
export const tabBar = defineContract({
  name: 'tab-bar',
  category: 'navigation',
  status: 'stable',
  anatomy: `
    <tab-bar>                (nav; variant material/ios/floating; fixed bottom, safe-area aware)
    └─ tab-bar-item value="…" label="…" icon   (badge: count or dot)`,
  props: [
    {
      name: 'variant',
      type: 'string',
      default: 'material',
      options: ['material', 'ios', 'floating'],
      desc: 'TabBar: full-width bar, floating translucent capsule, or compact icon-only pill.',
    },
    {
      name: 'labels',
      type: 'string',
      default: 'always',
      options: ['always', 'active', 'never'],
      desc: 'TabBar: when item labels show. floating always hides them visually.',
    },
    {
      name: 'value',
      type: 'string',
      adapts: { ng: 'model() input, two-way with [(value)]' },
      desc: 'TabBar: controlled active item. (Item: its key.)',
    },
    {
      name: 'defaultValue',
      type: 'string',
      adapts: { ng: 'seeds the value model' },
      desc: 'TabBar: initially active item (uncontrolled).',
    },
    {
      name: 'hideOnScroll',
      type: 'boolean',
      default: false,
      desc: 'TabBar: slide away while the page scrolls down, back on scrolling up.',
    },
    {
      name: 'label',
      type: 'string',
      desc: 'TabBarItem: visible text, and the accessible name when labels are hidden.',
    },
    {
      name: 'badge',
      type: 'number | boolean',
      desc: 'TabBarItem: a count, or true for a dot.',
    },
    {
      name: 'active',
      type: 'boolean',
      desc: 'TabBarItem: force the active state (e.g. from the router).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto each sub-component. Pass "absolute" to keep the bar inside a positioned frame.',
    },
  ],
  guidance: {
    summary:
      'Three to five top-level destinations of a phone app, always one tap away.',
    whenToUse: ['The main sections of a mobile app or of a site on phones.'],
    whenNotToUse: [
      { text: 'Panels inside one page', use: 'tabs' },
      { text: 'Desktop app navigation', use: 'sidebar' },
      { text: 'More than five destinations', use: 'drawer' },
    ],
    rules: [
      'Three to five items; each item is a destination, not an action.',
      'The root is a nav and the active item carries aria-current="page".',
      'Hidden labels still give each item its accessible name and a tooltip.',
    ],
    example:
      '<tab-bar variant="floating" value="home"><tab-bar-item value="home" label="Home" icon="home" /><tab-bar-item value="search" label="Search" icon="search" /></tab-bar>',
  },
  preview: {
    rx: 'interaction-navigation-tab-bar--workbench',
    ng: 'interaction-navigation-tab-bar--workbench',
  },
  tag: { rx: 'TabBar', ng: 'gr-tab-bar' },
  example: { variant: 'material', labels: 'always', hideOnScroll: false },
  figma: { nodeId: null },
});
