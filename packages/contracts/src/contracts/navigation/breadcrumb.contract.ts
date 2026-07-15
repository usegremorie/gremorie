import { defineContract } from '../../types';

/**
 * Breadcrumb - a hierarchical trail of links ending in the current page. Plain
 * semantic markup (`<nav>` > `<ol>` > `<li>`), dependency-free. React:
 * `@gremorie/rx-navigation`. Angular: `@gremorie/ng-navigation`.
 */
export const breadcrumb = defineContract({
  name: 'breadcrumb',
  category: 'navigation',
  status: 'stable',
  anatomy: `
    <breadcrumb>             (nav, aria-label="breadcrumb")
    └─ breadcrumb-list       (ol)
       └─ breadcrumb-item    (li)
          ├─ breadcrumb-link       (a; asChild to render a router link)
          ├─ breadcrumb-page       (current page; not a link)
          ├─ breadcrumb-separator  (defaults to a chevron; override via children)
          └─ breadcrumb-ellipsis   (collapsed middle segments)`,
  props: [
    {
      name: 'asChild',
      type: 'boolean',
      default: false,
      adapts: {
        ng: 'project an <a routerLink> as the link content instead',
      },
      desc: 'BreadcrumbLink: render the consumer’s own element (e.g. a router link) instead of an <a>.',
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
      'A semantic trail showing where the current page sits in a deep hierarchy.',
    whenToUse: [
      'Deep hierarchies (≥3 levels) where users benefit from seeing and jumping up the path.',
    ],
    whenNotToUse: [
      {
        text: 'Flat sites — the trail adds noise without payoff',
      },
      { text: 'Switching views within one page', use: 'tabs' },
    ],
    rules: [
      'The current page renders as breadcrumb-page (role="link", aria-current="page"), not a breadcrumb-link, so the trail terminates explicitly.',
      'For collapsed middle segments use breadcrumb-ellipsis paired with a dropdown-menu or popover.',
      'breadcrumb-separator renders a chevron by default; pass children to override it.',
    ],
    example:
      '<breadcrumb><breadcrumb-list><breadcrumb-item><breadcrumb-link href="/">Home</breadcrumb-link></breadcrumb-item><breadcrumb-separator /><breadcrumb-item><breadcrumb-page>Settings</breadcrumb-page></breadcrumb-item></breadcrumb-list></breadcrumb>',
  },
  preview: {
    rx: 'interaction-navigation-breadcrumb--workbench',
    ng: 'interaction-navigation-breadcrumb--workbench',
  },
  tag: { rx: 'Breadcrumb', ng: 'gr-breadcrumb' },
  example: { asChild: false },
  figma: { nodeId: null },
});
