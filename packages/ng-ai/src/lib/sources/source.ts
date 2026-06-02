import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Source — single citation link. Mirrors React `Source`.
 *
 * Renders an `<a target="_blank">` with default icon + title; projected
 * children override the default visual.
 */
@Component({
  selector: 'source',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      class="flex items-center gap-2"
      [href]="href()"
      target="_blank"
      rel="noreferrer"
    >
      <ng-content>
        <!-- BookIcon -->
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
          />
        </svg>
        <span class="block font-medium">{{ title() }}</span>
      </ng-content>
    </a>
  `,
})
export class Source {
  readonly href = input.required<string>();
  readonly title = input<string>('');
}
