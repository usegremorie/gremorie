import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnHoverCard,
  BrnHoverCardTrigger,
} from '@spartan-ng/brain/hover-card';
import { Badge } from '@gremorie/ng-display';

/**
 * InlineCitation — footnote-style citation that hovers into a source card
 * (Angular edition). Mirrors React `InlineCitation` from `@gremorie/rx-ai`.
 *
 * Subcomponents (spartan-ng primitives where possible):
 * - `inline-citation`        — inline wrapper span
 * - `inline-citation-text`   — the cited text span
 * - `inline-citation-card`   — host of `@spartan-ng/brain` BrnHoverCard
 * - `inline-citation-card-trigger` — `gn-badge` (ng-display) + BrnHoverCardTrigger
 * - `inline-citation-card-body`    — styled popover surface (brain is headless)
 * - `inline-citation-source` / `inline-citation-quote` — presentational
 *
 * Brain idiom (deviation from React): the hover-card content must live in a
 * `<ng-template brnHoverCardContent>`, so the consumer wraps the body in that
 * template. For multiple sources, compose `gn-carousel` (from ng-display)
 * inside the body — React used a Carousel here too.
 *
 * @example
 * ```html
 * <inline-citation>
 *   <inline-citation-text> [1]</inline-citation-text>
 *   <inline-citation-card>
 *     <inline-citation-card-trigger [sources]="['https://gremorie.com']" />
 *     <ng-template brnHoverCardContent>
 *       <inline-citation-card-body>
 *         <inline-citation-source
 *           title="Gremorie docs"
 *           url="https://gremorie.com/docs"
 *           description="The AI-native design system."
 *         />
 *       </inline-citation-card-body>
 *     </ng-template>
 *   </inline-citation-card>
 * </inline-citation>
 * ```
 */
@Component({
  selector: 'inline-citation',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'inline-citation',
    class: 'group inline items-center gap-1',
  },
})
export class InlineCitation {}

@Component({
  selector: 'inline-citation-text',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'inline-citation-text',
    class: 'transition-colors group-hover:bg-accent',
  },
})
export class InlineCitationText {}

@Component({
  selector: 'inline-citation-card',
  standalone: true,
  hostDirectives: [BrnHoverCard],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'inline-citation-card',
    class: 'contents',
  },
})
export class InlineCitationCard {}

@Component({
  selector: 'inline-citation-card-trigger',
  standalone: true,
  hostDirectives: [BrnHoverCardTrigger],
  imports: [Badge],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<gn-badge
    variant="secondary"
    class="ml-1 cursor-default rounded-full"
    >{{ label() }}</gn-badge
  >`,
  host: {
    'data-slot': 'inline-citation-card-trigger',
    class: 'inline-flex align-baseline',
  },
})
export class InlineCitationCardTrigger {
  readonly sources = input<string[]>([]);

  protected readonly label = computed(() => {
    const sources = this.sources();
    const first = sources[0];
    if (!first) {
      return 'unknown';
    }
    let host: string;
    try {
      host = new URL(first).hostname;
    } catch {
      host = first;
    }
    return sources.length > 1 ? `${host} +${sources.length - 1}` : host;
  });
}

@Component({
  selector: 'inline-citation-card-body',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'inline-citation-card-body',
    class:
      'relative block w-80 overflow-hidden rounded-md border bg-popover p-0 text-popover-foreground shadow-md',
  },
})
export class InlineCitationCardBody {}

@Component({
  selector: 'inline-citation-source',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (title()) {
      <h4 class="truncate text-sm font-medium leading-tight">{{ title() }}</h4>
    }
    @if (url()) {
      <p class="truncate break-all text-xs text-muted-foreground">
        {{ url() }}
      </p>
    }
    @if (description()) {
      <p class="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {{ description() }}
      </p>
    }
    <ng-content />
  `,
  host: {
    'data-slot': 'inline-citation-source',
    class: 'block space-y-1',
  },
})
export class InlineCitationSource {
  readonly title = input<string>();
  readonly url = input<string>();
  readonly description = input<string>();
}

@Component({
  selector: 'inline-citation-quote',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'inline-citation-quote',
    class:
      'block border-l-2 border-muted pl-3 text-sm italic text-muted-foreground',
  },
})
export class InlineCitationQuote {}
