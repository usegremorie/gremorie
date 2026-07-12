import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

/**
 * Table — styled wrapper around the native `<table>` element. Mirrors React
 * `Table` from `@gremorie/rx-display`.
 *
 * Brings no behavior — just the skin (rules, hover, padding, typography) over
 * semantic markup. For sorting, filtering, pagination or selection, move up to
 * a DataTable pattern.
 *
 * To keep the table DOM valid, the `gr-table` root renders the overflow
 * container + the real `<table>`, and the sub-parts are **attribute
 * directives** applied to native table elements (`thead`, `tbody`, `tfoot`,
 * `tr`, `th`, `td`, `caption`). This mirrors the React anatomy while emitting
 * standards-compliant table markup.
 *
 * @example
 * ```html
 * <gr-table>
 *   <caption grTableCaption>Recent invoices</caption>
 *   <thead grTableHeader>
 *     <tr grTableRow><th grTableHead>Invoice</th><th grTableHead>Amount</th></tr>
 *   </thead>
 *   <tbody grTableBody>
 *     <tr grTableRow><td grTableCell>INV001</td><td grTableCell>$250</td></tr>
 *   </tbody>
 * </gr-table>
 * ```
 */
@Component({
  selector: 'gr-table',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div data-slot="table-container" class="relative w-full overflow-x-auto">
      <table data-slot="table" [class]="computedClass()">
        <ng-content />
      </table>
    </div>
  `,
})
export class Table {
  protected readonly computedClass = computed(() =>
    cn('w-full caption-bottom text-sm'),
  );
}

/** TableHeader — `<thead>`. Mirrors React `TableHeader`. */
@Directive({
  selector: 'thead[grTableHeader]',
  standalone: true,
  host: {
    'data-slot': 'table-header',
    '[class]': 'computedClass()',
  },
})
export class TableHeader {
  protected readonly computedClass = computed(() => cn('[&_tr]:border-b'));
}

/** TableBody — `<tbody>`. Mirrors React `TableBody`. */
@Directive({
  selector: 'tbody[grTableBody]',
  standalone: true,
  host: {
    'data-slot': 'table-body',
    '[class]': 'computedClass()',
  },
})
export class TableBody {
  protected readonly computedClass = computed(() =>
    cn('[&_tr:last-child]:border-0'),
  );
}

/** TableFooter — `<tfoot>` (muted, top border). Mirrors React `TableFooter`. */
@Directive({
  selector: 'tfoot[grTableFooter]',
  standalone: true,
  host: {
    'data-slot': 'table-footer',
    '[class]': 'computedClass()',
  },
})
export class TableFooter {
  protected readonly computedClass = computed(() =>
    cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0'),
  );
}

/** TableRow — `<tr>` with hover + `data-[state=selected]` styling. Mirrors React `TableRow`. */
@Directive({
  selector: 'tr[grTableRow]',
  standalone: true,
  host: {
    'data-slot': 'table-row',
    '[class]': 'computedClass()',
  },
})
export class TableRow {
  protected readonly computedClass = computed(() =>
    cn(
      'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
    ),
  );
}

/** TableHead — `<th>` column header. Mirrors React `TableHead`. */
@Directive({
  selector: 'th[grTableHead]',
  standalone: true,
  host: {
    'data-slot': 'table-head',
    '[class]': 'computedClass()',
  },
})
export class TableHead {
  protected readonly computedClass = computed(() =>
    cn(
      'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
    ),
  );
}

/** TableCell — `<td>` body cell. Mirrors React `TableCell`. */
@Directive({
  selector: 'td[grTableCell]',
  standalone: true,
  host: {
    'data-slot': 'table-cell',
    '[class]': 'computedClass()',
  },
})
export class TableCell {
  protected readonly computedClass = computed(() =>
    cn(
      'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
    ),
  );
}

/** TableCaption — `<caption>`, rendered below the table. Mirrors React `TableCaption`. */
@Directive({
  selector: 'caption[grTableCaption]',
  standalone: true,
  host: {
    'data-slot': 'table-caption',
    '[class]': 'computedClass()',
  },
})
export class TableCaption {
  protected readonly computedClass = computed(() =>
    cn('text-muted-foreground mt-4 text-sm'),
  );
}
