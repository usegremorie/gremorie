import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

/**
 * Pagination — bookmarkable page-by-page navigation. Mirrors React
 * `Pagination`. Links are styled as buttons; the active page uses the
 * `outline` variant and `aria-current="page"`.
 */
const meta: Meta<Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        Pagination,
        PaginationContent,
        PaginationItem,
        PaginationLink,
        PaginationPrevious,
        PaginationNext,
        PaginationEllipsis,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Pagination>;

/** Workbench — a typical paged range with active page 2. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gn-pagination>
        <gn-pagination-content>
          <gn-pagination-item>
            <a gn-pagination-previous href="#"></a>
          </gn-pagination-item>
          <gn-pagination-item>
            <a gn-pagination-link href="#">1</a>
          </gn-pagination-item>
          <gn-pagination-item>
            <a gn-pagination-link href="#" [isActive]="true">2</a>
          </gn-pagination-item>
          <gn-pagination-item>
            <a gn-pagination-link href="#">3</a>
          </gn-pagination-item>
          <gn-pagination-item>
            <gn-pagination-ellipsis />
          </gn-pagination-item>
          <gn-pagination-item>
            <a gn-pagination-next href="#"></a>
          </gn-pagination-item>
        </gn-pagination-content>
      </gn-pagination>
    `,
  }),
};

/** Compact — three pages, no ellipsis. */
export const Compact: Story = {
  render: () => ({
    template: `
      <gn-pagination>
        <gn-pagination-content>
          <gn-pagination-item>
            <a gn-pagination-link href="#" [isActive]="true">1</a>
          </gn-pagination-item>
          <gn-pagination-item>
            <a gn-pagination-link href="#">2</a>
          </gn-pagination-item>
          <gn-pagination-item>
            <a gn-pagination-link href="#">3</a>
          </gn-pagination-item>
        </gn-pagination-content>
      </gn-pagination>
    `,
  }),
};
