import { defineContract } from '../../types';

/**
 * Pagination - bookmarkable page-by-page navigation. Plain semantic markup
 * (`<nav>` wrapping links styled as buttons). React: `@gremorie/rx-navigation`.
 * Angular: `@gremorie/ng-navigation`.
 */
export const pagination = defineContract({
  name: 'pagination',
  category: 'navigation',
  status: 'stable',
  anatomy: `
    <pagination>             (nav, aria-label="pagination")
    └─ pagination-content    (ul)
       └─ pagination-item    (li)
          ├─ pagination-previous
          ├─ pagination-link  (isActive marks the current page)
          ├─ pagination-ellipsis
          └─ pagination-next`,
  props: [
    {
      name: 'isActive',
      type: 'boolean',
      default: false,
      desc: 'PaginationLink: marks the current page (outline variant + aria-current="page").',
    },
    {
      name: 'size',
      type: 'string',
      default: 'icon',
      options: ['default', 'sm', 'lg', 'icon'],
      desc: 'PaginationLink: button size token.',
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
      'Discrete, shareable page links with previous / next and ellipsis controls.',
    whenToUse: [
      'When page URLs need to be shareable, order is stable, and users return to a specific position.',
    ],
    whenNotToUse: [
      {
        text: 'Continuous feeds where position need not be addressable (use infinite scroll or a load-more button)',
      },
    ],
    rules: [
      'The primitive does not auto-detect first/last — the consumer applies aria-disabled and a passive class on pagination-previous / pagination-next.',
      'Mark the current page with isActive on its pagination-link.',
      'Use pagination-ellipsis to indicate a collapsed range.',
    ],
    example:
      '<pagination><pagination-content><pagination-item><pagination-previous href="#" /></pagination-item><pagination-item><pagination-link href="#" isActive>1</pagination-link></pagination-item><pagination-item><pagination-next href="#" /></pagination-item></pagination-content></pagination>',
  },
  preview: {
    rx: 'interaction-navigation-pagination--default',
    ng: 'navigation-pagination--workbench',
  },
  tag: { rx: 'Pagination', ng: 'gn-pagination' },
  example: { isActive: false, size: 'icon' },
  figma: { nodeId: null },
});
