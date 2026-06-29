import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@gremorie/rx-forms';
import { TrendingUp } from 'lucide-react';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

/**
 * # Card
 *
 * A surface primitive for grouping related content — a rounded, bordered
 * surface with a structured `Header → Content → Footer` rhythm. The API is
 * composable, not configurative: opt in to only the parts you need. A faithful
 * shadcn port.
 *
 * ## Anatomy
 *
 * ```text
 * Card                       the surface (bg-card, rounded, bordered, vertical flow)
 * ├─ CardHeader              title/description area; lays out a CardAction to the right when present
 * │  ├─ CardTitle            semibold heading line
 * │  ├─ CardDescription      muted supporting copy
 * │  └─ CardAction           top-right slot (button, menu, switch)
 * ├─ CardContent             the main body (padded horizontally)
 * └─ CardFooter              bottom row (actions, captions, metadata)
 * ```
 *
 * ## Props
 *
 * Every part is a thin styled `<div>` taking `React.ComponentPropsWithoutRef<"div">`
 * (`className`, `children`, …). There are no variants.
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `CardHeader` | Header grid (title + description + optional action). |
 * | `CardTitle` | Heading text. |
 * | `CardDescription` | Muted subtitle. |
 * | `CardAction` | Right-aligned header slot. |
 * | `CardContent` | Body region. |
 * | `CardFooter` | Footer row. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--card` / `--card-foreground` | surface background + text |
 * | `--border` | the outline + header/footer dividers |
 * | `--muted-foreground` | `CardDescription` |
 */
const meta = {
  title: 'Layout & display/Display/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A realistic card composed from every part. */
export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Monthly revenue</CardTitle>
        <CardDescription>Trailing 30 days vs. prior period.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            Export
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tabular-nums">$48,210</div>
      </CardContent>
      <CardFooter className="text-muted-foreground gap-1.5 text-sm">
        <TrendingUp className="size-4 text-success" />
        Up 12.5% from last month
      </CardFooter>
    </Card>
  ),
};

/** Header + content only — the minimal useful composition. */
export const Simple: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Storage</CardTitle>
        <CardDescription>You have used 6.2 GB of 10 GB.</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        Upgrade your plan to unlock unlimited storage and shared workspaces.
      </CardContent>
    </Card>
  ),
};

/** Footer with two actions and a top border divider. */
export const WithFooterActions: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader className="border-b">
        <CardTitle>Delete project</CardTitle>
        <CardDescription>
          This permanently removes the project and all of its data.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        This action cannot be undone.
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </CardFooter>
    </Card>
  ),
};
