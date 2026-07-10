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
        <gn-table>
          <caption gnTableCaption>A list of your recent invoices.</caption>
          <thead gnTableHeader>
            <tr gnTableRow>
              <th gnTableHead>Invoice</th>
              <th gnTableHead>Status</th>
              <th gnTableHead>Method</th>
              <th gnTableHead class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody gnTableBody>
            <tr gnTableRow>
              <td gnTableCell class="font-medium">INV001</td>
              <td gnTableCell>Paid</td>
              <td gnTableCell>Credit Card</td>
              <td gnTableCell class="text-right">$250.00</td>
            </tr>
            <tr gnTableRow>
              <td gnTableCell class="font-medium">INV002</td>
              <td gnTableCell>Pending</td>
              <td gnTableCell>PayPal</td>
              <td gnTableCell class="text-right">$150.00</td>
            </tr>
            <tr gnTableRow>
              <td gnTableCell class="font-medium">INV003</td>
              <td gnTableCell>Unpaid</td>
              <td gnTableCell>Bank Transfer</td>
              <td gnTableCell class="text-right">$350.00</td>
            </tr>
          </tbody>
          <tfoot gnTableFooter>
            <tr gnTableRow>
              <td gnTableCell colspan="3">Total</td>
              <td gnTableCell class="text-right">$750.00</td>
            </tr>
          </tfoot>
        </gn-table>
      </div>
    `,
  }),
};

/** Simple — header + body only, no footer or caption. */
export const Simple: Story = {
  render: () => ({
    template: `
      <div class="w-96">
        <gn-table>
          <thead gnTableHeader>
            <tr gnTableRow>
              <th gnTableHead>Name</th>
              <th gnTableHead>Role</th>
            </tr>
          </thead>
          <tbody gnTableBody>
            <tr gnTableRow><td gnTableCell>Ada Lovelace</td><td gnTableCell>Engineer</td></tr>
            <tr gnTableRow><td gnTableCell>Alan Turing</td><td gnTableCell>Scientist</td></tr>
          </tbody>
        </gn-table>
      </div>
    `,
  }),
};

/** Selected row — `data-state="selected"` highlights a row. */
export const SelectedRow: Story = {
  render: () => ({
    template: `
      <div class="w-96">
        <gn-table>
          <tbody gnTableBody>
            <tr gnTableRow><td gnTableCell>Row one</td></tr>
            <tr gnTableRow data-state="selected"><td gnTableCell>Row two (selected)</td></tr>
            <tr gnTableRow><td gnTableCell>Row three</td></tr>
          </tbody>
        </gn-table>
      </div>
    `,
  }),
};
