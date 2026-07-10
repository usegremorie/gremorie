import type { Meta, StoryObj } from '@storybook/react';

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
 * # Pagination
 *
 * Bookmarkable page-by-page navigation. Plain semantic markup — a `<nav>`
 * wrapping a list of `<a>` links styled as buttons (via `buttonVariants`). Use
 * this (vs infinite scroll / load-more) when URLs need to be shareable, stable
 * order matters, and users need to return to a specific position. Faithful
 * shadcn/ui port.
 *
 * The disabled state on `Previous` / `Next` is consumer-driven — apply
 * `aria-disabled` and a passive class; the primitive does not auto-detect
 * first/last.
 *
 * ## Anatomy
 *
 * ```text
 * Pagination                  <nav aria-label="pagination"> wrapper
 * └─ PaginationContent        the <ul> row of controls
 *    └─ PaginationItem        one <li> cell wrapping a control
 *       ├─ PaginationLink     page-number link; isActive marks the current page
 *       ├─ PaginationPrevious labelled previous-page control
 *       ├─ PaginationNext     labelled next-page control
 *       └─ PaginationEllipsis gap indicator for skipped page ranges
 * ```
 *
 * ## Props (PaginationLink)
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `isActive` | `boolean` | `false` | Marks the current page (renders `outline`, else `ghost`). |
 * | `size` | `Button["size"]` | `"icon"` | Button size token applied to the link. |
 * | `...props` | `React.ComponentProps<"a">` | — | Forwarded to the `<a>`. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `PaginationContent` | The `<ul>` row. |
 * | `PaginationItem` | A single `<li>` cell. |
 * | `PaginationLink` | A page link; `isActive` highlights it. |
 * | `PaginationPrevious` | Previous-page control with chevron + label. |
 * | `PaginationNext` | Next-page control with chevron + label. |
 * | `PaginationEllipsis` | Skipped-range indicator. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--accent` / `--accent-foreground` | Ghost link hover |
 * | `--border` / `--input` | Active link outline |
 * | `--ring` | Keyboard focus ring |
 */
const meta = {
  title: 'Interaction/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Workbench preset: a typical paged range with active page 2 — the IDENTICAL
 * use case as the Angular `Workbench` story. Keep both in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/** A typical paginated control: prev/next, numbered pages, and an ellipsis. */
export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * The first page — `Previous` is disabled via consumer-driven
 * `aria-disabled` + a passive class.
 */
export const FirstPage: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled
            className="pointer-events-none opacity-50"
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};
