import { defineContract } from '../../types';

/**
 * Sidebar - the composable app-shell sidebar: a SidebarProvider wrapping
 * header / content / footer regions with collapsible state, icon-only mode, a
 * mobile sheet, badges, sub-menus, and skeleton loaders. React:
 * `@gremorie/rx-navigation`. Angular: `@gremorie/ng-navigation`.
 */
export const sidebar = defineContract({
  name: 'sidebar',
  category: 'navigation',
  status: 'stable',
  anatomy: `
    <sidebar-provider>       (owns open/collapsed state + ⌘B shortcut)
    ├─ sidebar               (side / variant / collapsible)
    │  ├─ sidebar-header     (+ sidebar-input)
    │  ├─ sidebar-content
    │  │  └─ sidebar-group
    │  │     ├─ sidebar-group-label
    │  │     ├─ sidebar-group-action
    │  │     └─ sidebar-group-content
    │  │        └─ sidebar-menu
    │  │           └─ sidebar-menu-item
    │  │              ├─ sidebar-menu-button (+ sidebar-menu-action / sidebar-menu-badge)
    │  │              ├─ sidebar-menu-skeleton
    │  │              └─ sidebar-menu-sub > sidebar-menu-sub-item > sidebar-menu-sub-button
    │  ├─ sidebar-footer
    │  ├─ sidebar-separator
    │  └─ sidebar-rail
    ├─ sidebar-trigger       (toggles open/collapsed)
    └─ sidebar-inset         (the main content area beside the sidebar)`,
  props: [
    {
      name: 'side',
      type: 'string',
      default: 'left',
      options: ['left', 'right'],
      desc: 'Sidebar: which edge it docks to.',
    },
    {
      name: 'variant',
      type: 'string',
      default: 'sidebar',
      options: ['sidebar', 'floating', 'inset'],
      desc: 'Sidebar: surface treatment.',
    },
    {
      name: 'collapsible',
      type: 'string',
      default: 'offcanvas',
      options: ['offcanvas', 'icon', 'none'],
      desc: 'Sidebar: how it collapses.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: true,
      desc: 'SidebarProvider: initial open state (uncontrolled).',
    },
    {
      name: 'open',
      type: 'boolean',
      adapts: { ng: 'two-way model: [(open)]' },
      desc: 'SidebarProvider: controlled open state.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      adapts: { ng: 'output via the open two-way model' },
      desc: 'SidebarProvider: fires when open changes.',
    },
    {
      name: 'isActive',
      type: 'boolean',
      default: false,
      desc: 'SidebarMenuButton / SidebarMenuSubButton: marks the current item.',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: false,
      adapts: { ng: 'project an <a routerLink> as the button content instead' },
      desc: 'SidebarMenuButton: render the consumer’s own element (e.g. a router link).',
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
      'A full app-shell sidebar with collapsible state, icon mode, mobile sheet, and grouped menus.',
    whenToUse: [
      'App-internal primary navigation in a persistent left/right rail (dashboards, admin tools, docs apps).',
    ],
    whenNotToUse: [
      { text: 'Marketing-site header navigation', use: 'navigation-menu' },
      { text: 'Switching views inside one page', use: 'tabs' },
    ],
    rules: [
      'Wrap every sidebar (each Storybook story and each docs preview) in a sidebar-provider; do not mount a global provider where another sidebar (e.g. Fumadocs) already exists.',
      'sidebar-trigger toggles state; ⌘B / Ctrl+B is wired by the provider.',
      'On mobile the sidebar renders as a sheet automatically.',
      'Use sidebar-menu-skeleton inside sidebar-menu while items load.',
    ],
    example:
      '<sidebar-provider><sidebar collapsible="icon"><sidebar-content><sidebar-menu><sidebar-menu-item><sidebar-menu-button isActive>Home</sidebar-menu-button></sidebar-menu-item></sidebar-menu></sidebar-content></sidebar><sidebar-inset><sidebar-trigger />…</sidebar-inset></sidebar-provider>',
  },
  preview: {
    rx: 'interaction-navigation-sidebar--default',
    ng: 'navigation-sidebar--workbench',
  },
  tag: { rx: 'Sidebar', ng: 'gn-sidebar' },
  example: {
    side: 'left',
    variant: 'sidebar',
    collapsible: 'offcanvas',
    defaultOpen: true,
    isActive: false,
    asChild: false,
  },
  figma: { nodeId: null },
});
