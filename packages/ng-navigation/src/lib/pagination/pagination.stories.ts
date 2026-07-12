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
  title: 'Interaction/Navigation/Pagination',
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
      <gr-pagination>
        <gr-pagination-content>
          <gr-pagination-item>
            <a gr-pagination-previous href="#"></a>
          </gr-pagination-item>
          <gr-pagination-item>
            <a gr-pagination-link href="#">1</a>
          </gr-pagination-item>
          <gr-pagination-item>
            <a gr-pagination-link href="#" [isActive]="true">2</a>
          </gr-pagination-item>
          <gr-pagination-item>
            <a gr-pagination-link href="#">3</a>
          </gr-pagination-item>
          <gr-pagination-item>
            <gr-pagination-ellipsis />
          </gr-pagination-item>
          <gr-pagination-item>
            <a gr-pagination-next href="#"></a>
          </gr-pagination-item>
        </gr-pagination-content>
      </gr-pagination>
    `,
  }),
};

/**
 * FirstPage — the first page; `Previous` is disabled via consumer-driven
 * `aria-disabled` + a passive class.
 */
export const FirstPage: Story = {
  render: () => ({
    template: `
      <gr-pagination>
        <gr-pagination-content>
          <gr-pagination-item>
            <a gr-pagination-previous href="#" aria-disabled="true" class="pointer-events-none opacity-50"></a>
          </gr-pagination-item>
          <gr-pagination-item>
            <a gr-pagination-link href="#" [isActive]="true">1</a>
          </gr-pagination-item>
          <gr-pagination-item>
            <a gr-pagination-link href="#">2</a>
          </gr-pagination-item>
          <gr-pagination-item>
            <a gr-pagination-link href="#">3</a>
          </gr-pagination-item>
          <gr-pagination-item>
            <a gr-pagination-next href="#"></a>
          </gr-pagination-item>
        </gr-pagination-content>
      </gr-pagination>
    `,
  }),
};

/** Compact — three pages, no ellipsis. */
export const Compact: Story = {
  render: () => ({
    template: `
      <gr-pagination>
        <gr-pagination-content>
          <gr-pagination-item>
            <a gr-pagination-link href="#" [isActive]="true">1</a>
          </gr-pagination-item>
          <gr-pagination-item>
            <a gr-pagination-link href="#">2</a>
          </gr-pagination-item>
          <gr-pagination-item>
            <a gr-pagination-link href="#">3</a>
          </gr-pagination-item>
        </gr-pagination-content>
      </gr-pagination>
    `,
  }),
};
