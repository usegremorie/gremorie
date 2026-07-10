import { defineContract } from '../../types';

/**
 * NavigationMenu - marketing-site primary navigation with rich dropdown panels
 * (the Vercel/Stripe pattern). React: `@gremorie/rx-navigation` (wraps Radix
 * NavigationMenu). Angular: `@gremorie/ng-navigation`.
 */
export const navigationMenu = defineContract({
  name: 'navigation-menu',
  category: 'navigation',
  status: 'stable',
  anatomy: `
    <navigation-menu>        (viewport renders below unless viewport={false})
    ├─ navigation-menu-list
    │  └─ navigation-menu-item
    │     ├─ navigation-menu-trigger
    │     ├─ navigation-menu-content
    │     │  └─ navigation-menu-link
    │     └─ navigation-menu-indicator
    └─ navigation-menu-viewport  (shared panel; omitted when viewport={false})`,
  props: [
    {
      name: 'viewport',
      type: 'boolean',
      default: true,
      desc: 'NavigationMenu: render the shared floating viewport panel; set false to render each content inline under its trigger.',
    },
    {
      name: 'value',
      type: 'string',
      adapts: { ng: 'two-way model: [(value)]' },
      desc: 'NavigationMenu: the open item (controlled).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto each sub-component.',
    },
  ],
  guidance: {
    summary:
      'Header-level navigation with multi-column dropdown panels under each trigger.',
    whenToUse: [
      'Public site headers with "Products / Solutions / Pricing" style entries that expand into rich content panels.',
    ],
    whenNotToUse: [
      { text: 'App-internal navigation', use: 'sidebar' },
      { text: 'Switching views inside one page', use: 'tabs' },
      { text: 'An action menu from a single button', use: 'dropdown-menu' },
    ],
    rules: [
      'Do not nest interactive overlays (dialog, popover) inside a panel — focus management gets fragile.',
      'navigation-menu-trigger expands navigation-menu-content; link items use navigation-menu-link.',
      'viewport={true} shares one animated panel; viewport={false} renders each content inline under its own trigger.',
    ],
    example:
      '<navigation-menu><navigation-menu-list><navigation-menu-item><navigation-menu-trigger>Products</navigation-menu-trigger><navigation-menu-content><navigation-menu-link href="/a">Analytics</navigation-menu-link></navigation-menu-content></navigation-menu-item></navigation-menu-list></navigation-menu>',
  },
  preview: {
    rx: 'interaction-navigation-navigationmenu--workbench',
    ng: 'interaction-navigation-navigationmenu--workbench',
  },
  tag: { rx: 'NavigationMenu', ng: 'gn-navigation-menu' },
  example: { viewport: true },
  figma: { nodeId: null },
});
