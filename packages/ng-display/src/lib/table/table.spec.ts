import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

@Component({
  standalone: true,
  imports: [
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
  ],
  template: `
    <gn-table>
      <caption gnTableCaption>
        Cap
      </caption>
      <thead gnTableHeader>
        <tr gnTableRow>
          <th gnTableHead>Name</th>
        </tr>
      </thead>
      <tbody gnTableBody>
        <tr gnTableRow>
          <td gnTableCell>Ada</td>
        </tr>
      </tbody>
    </gn-table>
  `,
})
class Host {}

describe('Table', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders an overflow container around a real <table>', () => {
    const host = render().nativeElement as HTMLElement;
    const container = host.querySelector('[data-slot="table-container"]');
    expect(container).not.toBeNull();
    const table = host.querySelector('table[data-slot="table"]');
    expect(table).not.toBeNull();
    expect(table?.className).toContain('caption-bottom');
  });

  it('applies slots and styling to native table sub-elements', () => {
    const host = render().nativeElement as HTMLElement;
    expect(
      host.querySelector('thead[data-slot="table-header"]'),
    ).not.toBeNull();
    expect(host.querySelector('tbody[data-slot="table-body"]')).not.toBeNull();
    const row = host.querySelector('tr[data-slot="table-row"]') as HTMLElement;
    expect(row.className).toContain('border-b');
    expect(host.querySelector('th[data-slot="table-head"]')).not.toBeNull();
    expect(host.querySelector('td[data-slot="table-cell"]')).not.toBeNull();
    expect(
      host.querySelector('caption[data-slot="table-caption"]'),
    ).not.toBeNull();
  });
});
