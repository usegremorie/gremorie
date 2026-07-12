import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

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
 * Table — styled wrapper around the native `<table>` element.
 *
 * Mirrors React `Table`. No behavior, just the skin. Sub-parts are attribute
 * directives applied to native table elements so the DOM stays valid.
 */
const meta: Meta<Table> = {
  title: 'Layout & display/Display/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        Table,
        TableHeader,
        TableBody,
        TableFooter,
        TableRow,
        TableHead,
        TableCell,
        TableCaption,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Table>;

/** Workbench — a recent-invoices table at a fixed width. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <div class="w-[36rem]">
        <gr-table>
          <caption grTableCaption>A list of your recent invoices.</caption>
          <thead grTableHeader>
            <tr grTableRow>
              <th grTableHead>Invoice</th>
              <th grTableHead>Status</th>
              <th grTableHead>Method</th>
              <th grTableHead class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody grTableBody>
            <tr grTableRow>
              <td grTableCell class="font-medium">INV001</td>
              <td grTableCell>Paid</td>
              <td grTableCell>Credit Card</td>
              <td grTableCell class="text-right">$250.00</td>
            </tr>
            <tr grTableRow>
              <td grTableCell class="font-medium">INV002</td>
              <td grTableCell>Pending</td>
              <td grTableCell>PayPal</td>
              <td grTableCell class="text-right">$150.00</td>
            </tr>
            <tr grTableRow>
              <td grTableCell class="font-medium">INV003</td>
              <td grTableCell>Unpaid</td>
              <td grTableCell>Bank Transfer</td>
              <td grTableCell class="text-right">$350.00</td>
            </tr>
          </tbody>
          <tfoot grTableFooter>
            <tr grTableRow>
              <td grTableCell colspan="3">Total</td>
              <td grTableCell class="text-right">$750.00</td>
            </tr>
          </tfoot>
        </gr-table>
      </div>
    `,
  }),
};

/** Simple — header + body only, no footer or caption. */
export const Simple: Story = {
  render: () => ({
    template: `
      <div class="w-96">
        <gr-table>
          <thead grTableHeader>
            <tr grTableRow>
              <th grTableHead>Name</th>
              <th grTableHead>Role</th>
            </tr>
          </thead>
          <tbody grTableBody>
            <tr grTableRow><td grTableCell>Ada Lovelace</td><td grTableCell>Engineer</td></tr>
            <tr grTableRow><td grTableCell>Alan Turing</td><td grTableCell>Scientist</td></tr>
          </tbody>
        </gr-table>
      </div>
    `,
  }),
};

/** Selected row — `data-state="selected"` highlights a row. */
export const SelectedRow: Story = {
  render: () => ({
    template: `
      <div class="w-96">
        <gr-table>
          <tbody grTableBody>
            <tr grTableRow><td grTableCell>Row one</td></tr>
            <tr grTableRow data-state="selected"><td grTableCell>Row two (selected)</td></tr>
            <tr grTableRow><td grTableCell>Row three</td></tr>
          </tbody>
        </gr-table>
      </div>
    `,
  }),
};
