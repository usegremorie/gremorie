import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'docs-page',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="flex flex-col gap-6">
      <header class="flex flex-col gap-2 border-b border-border pb-6">
        @if (eyebrow()) {
          <span
            class="text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            {{ eyebrow() }}
          </span>
        }
        <h1 class="text-3xl font-semibold tracking-tight text-foreground">
          {{ title() }}
        </h1>
        @if (lede()) {
          <p class="max-w-prose text-base text-muted-foreground">
            {{ lede() }}
          </p>
        }
      </header>

      <ng-content />
    </article>
  `,
})
export class DocsPage {
  readonly title = input.required<string>();
  readonly lede = input<string>('');
  readonly eyebrow = input<string>('');
}

@Component({
  selector: 'docs-section',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-col gap-3">
      <h2
        class="scroll-mt-20 text-xl font-semibold tracking-tight text-foreground"
        [id]="anchor()"
      >
        {{ title() }}
      </h2>
      @if (lede()) {
        <p class="max-w-prose text-sm text-muted-foreground">{{ lede() }}</p>
      }
      <div class="flex flex-col gap-3">
        <ng-content />
      </div>
    </section>
  `,
})
export class DocsSection {
  readonly title = input.required<string>();
  readonly lede = input<string>('');
  readonly anchor = input<string>('');
}

@Component({
  selector: 'docs-prose',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    class="max-w-prose text-sm leading-relaxed text-foreground/90 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-muted-foreground hover:[&_a]:decoration-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12.5px] [&_strong]:font-semibold [&_strong]:text-foreground"
  >
    <ng-content />
  </div>`,
})
export class DocsProse {}
