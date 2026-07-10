import { defineContract } from '../../types';

/**
 * Tabs - a content switcher within a single view, with pill (`default`) and
 * minimal (`line`) list variants and horizontal/vertical orientation. React:
 * `@gremorie/rx-navigation` (wraps Radix Tabs). Angular: `@gremorie/ng-navigation`
 * (wraps `@spartan-ng/brain` BrnTabs).
 */
export const tabs = defineContract({
  name: 'tabs',
  category: 'navigation',
  status: 'stable',
  anatomy: `
    <tabs>                   (orientation horizontal/vertical)
    ├─ tabs-list             (variant: default pill / line)
    │  └─ tabs-trigger value="…"
    └─ tabs-content value="…"   (one per trigger, matched by value)`,
  props: [
    {
      name: 'orientation',
      type: 'string',
      default: 'horizontal',
      options: ['horizontal', 'vertical'],
      desc: 'Tabs: layout direction.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      adapts: { ng: 'seeds brain’s single activeTab model' },
      desc: 'Tabs: initially-active tab (uncontrolled).',
    },
    {
      name: 'value',
      type: 'string',
      adapts: {
        ng: 'forwarded to brain’s activeTab; emit changes via your own binding',
      },
      desc: 'Tabs: controlled active tab. (Trigger/Content: the key matching a panel.)',
    },
    {
      name: 'variant',
      type: 'string',
      default: 'default',
      options: ['default', 'line'],
      desc: 'TabsList: pill background vs minimal underline indicator.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'TabsTrigger: disable the tab.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto each sub-component.',
    },
  ],
  guidance: {
    summary: 'A switcher for mutually exclusive views of the same scope.',
    whenToUse: [
      'Code/Preview, Overview/Details — alternate panels that share a single context.',
    ],
    whenNotToUse: [
      { text: 'Cross-section app navigation', use: 'sidebar' },
      { text: 'Marketing-site header navigation', use: 'navigation-menu' },
      { text: 'Filters or formatting choices', use: 'toggle-group' },
    ],
    rules: [
      'Each tabs-trigger value must match exactly one tabs-content value.',
      'React/Radix splits uncontrolled (defaultValue) and controlled (value/onValueChange); the Angular port collapses both onto brain’s single activeTab — value forwards in for controlled use, defaultValue seeds the initial tab.',
      'variant="line" gives a minimal underline; "default" gives the pill background.',
    ],
    example:
      '<tabs defaultValue="overview"><tabs-list><tabs-trigger value="overview">Overview</tabs-trigger><tabs-trigger value="details">Details</tabs-trigger></tabs-list><tabs-content value="overview">…</tabs-content><tabs-content value="details">…</tabs-content></tabs>',
  },
  preview: {
    rx: 'interaction-navigation-tabs--workbench',
    ng: 'interaction-navigation-tabs--workbench',
  },
  tag: { rx: 'Tabs', ng: 'gn-tabs' },
  example: { orientation: 'horizontal', variant: 'default', disabled: false },
  figma: { nodeId: null },
});
