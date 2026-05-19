import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

export interface ApiRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

@Component({
  selector: 'docs-api-table',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-x-auto rounded-md border border-border">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="border-b border-border bg-muted/40 text-left">
            <th class="px-3 py-2 font-semibold text-foreground">Name</th>
            <th class="px-3 py-2 font-semibold text-foreground">Type</th>
            @if (showDefault()) {
              <th class="px-3 py-2 font-semibold text-foreground">Default</th>
            }
            <th class="px-3 py-2 font-semibold text-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.name; let last = $last) {
            <tr [class.border-b]="!last" class="border-border align-top">
              <td class="px-3 py-2 font-mono text-[12.5px] text-foreground">{{ row.name }}</td>
              <td class="px-3 py-2 font-mono text-[12.5px] text-muted-foreground">{{ row.type }}</td>
              @if (showDefault()) {
                <td class="px-3 py-2 font-mono text-[12.5px] text-muted-foreground">{{ row.default || '—' }}</td>
              }
              <td class="px-3 py-2 text-[13px] text-foreground/90">{{ row.description }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class DocsApiTable {
  readonly rows = input.required<readonly ApiRow[]>();
  readonly showDefault = input<boolean>(true);
}
