import type { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gremorie/rx-overlays';
import { SlashIcon } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

/**
 * # Breadcrumb
 *
 * Hierarchical trail of links showing where the current page sits in the site
 * structure. Plain semantic markup — a `<nav>` wrapping an `<ol>` of `<li>`
 * items, kept dependency-free for SSR and accessibility. Use only on deep
 * hierarchies (≥3 levels). This is a faithful shadcn/ui port.
 *
 * ## Anatomy
 *
 * ```text
 * Breadcrumb                     <nav aria-label="breadcrumb"> wrapper
 * └─ BreadcrumbList              <ol> row of segments
 *    ├─ BreadcrumbItem           one segment cell
 *    │  ├─ BreadcrumbLink        navigable ancestor link (asChild swaps the tag)
 *    │  ├─ BreadcrumbPage        terminal current page (not a link)
 *    │  └─ BreadcrumbEllipsis    collapsed-middle indicator, paired with a menu
 *    └─ BreadcrumbSeparator      divider between segments (defaults to a chevron)
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `...props` | `React.ComponentProps<"nav">` | — | Forwarded to the `<nav>` root. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `BreadcrumbList` | The `<ol>` container. |
 * | `BreadcrumbItem` | A single `<li>` segment. |
 * | `BreadcrumbLink` | A link segment; `asChild` swaps the element. |
 * | `BreadcrumbPage` | The current page (terminal, non-interactive). |
 * | `BreadcrumbSeparator` | Divider between segments. |
 * | `BreadcrumbEllipsis` | Collapsed-middle indicator. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--muted-foreground` | Default link color |
 * | `--foreground` | Hover + current page color |
 */
const meta = {
  title: 'Interaction/Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A three-level trail terminating in the current page. */
export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * A deep trail with the middle segments collapsed behind an ellipsis that opens
 * a dropdown menu — the realistic pattern for long hierarchies.
 */
export const WithEllipsisDropdown: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Themes</DropdownMenuItem>
              <DropdownMenuItem>GitHub</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/** A custom separator (slash) instead of the default chevron. */
export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
