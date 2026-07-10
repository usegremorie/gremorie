import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '../badge/badge';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

/**
 * # Table
 *
 * A styled wrapper around the native `<table>` element — it brings no behavior,
 * just the skin (rules, hover, padding, typography) over semantic markup. For
 * sorting, filtering, pagination or selection, move up to the **DataTable**
 * pattern (`Table` + `@tanstack/react-table` + `Pagination`).
 *
 * ## Anatomy
 *
 * ```text
 * Table                       wraps <table> in an overflow container
 * ├─ TableCaption             <caption>, rendered below the table
 * ├─ TableHeader              <thead>
 * │  └─ TableRow              <tr> with hover + data-[state=selected]
 * │     └─ TableHead          <th> column header
 * ├─ TableBody                <tbody>
 * │  └─ TableRow              <tr> with hover + data-[state=selected]
 * │     └─ TableCell          <td> body cell
 * └─ TableFooter              <tfoot> (muted, top border)
 *    └─ TableRow              <tr> with hover + data-[state=selected]
 *       └─ TableCell          <td> summary cell
 * ```
 *
 * ## Props
 *
 * Each part forwards its native element props (`className`, `colSpan`, …).
 * There are no variants.
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `TableHeader` | `<thead>`. |
 * | `TableBody` | `<tbody>`. |
 * | `TableFooter` | `<tfoot>` (muted, top border). |
 * | `TableRow` | `<tr>` with hover. |
 * | `TableHead` | `<th>`. |
 * | `TableCell` | `<td>`. |
 * | `TableCaption` | `<caption>`. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--border` | row dividers |
 * | `--muted` | row hover + footer background |
 * | `--foreground` | header text |
 * | `--muted-foreground` | caption text |
 */
const meta = {
  title: 'Layout & display/Display/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const INVOICES = [
  { id: 'INV-001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { id: 'INV-002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  {
    id: 'INV-003',
    status: 'Unpaid',
    method: 'Bank Transfer',
    amount: '$350.00',
  },
  { id: 'INV-004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
];

const statusVariant = {
  Paid: 'secondary',
  Pending: 'outline',
  Unpaid: 'destructive',
} as const;

const WORKBENCH_INVOICES = [
  { id: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { id: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  {
    id: 'INV003',
    status: 'Unpaid',
    method: 'Bank Transfer',
    amount: '$350.00',
  },
];

/** Workbench — a recent-invoices table at a fixed width. */
export const Workbench: Story = {
  render: () => (
    <div className="w-[36rem]">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {WORKBENCH_INVOICES.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>{invoice.method}</TableCell>
              <TableCell className="text-right">{invoice.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$750.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
};

/** A realistic invoices table with header, body, footer and caption. */
export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVOICES.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>
              <Badge
                variant={
                  statusVariant[invoice.status as keyof typeof statusVariant]
                }
              >
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right tabular-nums">
              {invoice.amount}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right tabular-nums">$1,200.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

/** Minimal header + body, no footer or caption. */
export const Simple: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada Lovelace</TableCell>
          <TableCell>Engineer</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Alan Turing</TableCell>
          <TableCell>Researcher</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
