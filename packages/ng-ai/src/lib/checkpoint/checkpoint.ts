import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { Separator } from '@gremorie/ng-display';
import { cn } from '@gremorie/ng-core';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/ng-overlays';

/**
 * Checkpoint — a conversation "save point" row. Mirrors React `Checkpoint`
 * from `@gremorie/rx-ai`.
 *
 * Anatomy (React parity):
 * - `<checkpoint>`         → React `Checkpoint` (flex row + trailing `Separator`)
 * - `<checkpoint-icon>`    → React `CheckpointIcon` (default bookmark glyph)
 * - `<checkpoint-trigger>` → React `CheckpointTrigger` (ghost/sm button, optional tooltip)
 *
 * The React `Separator` (rendered after children) becomes the ng-display
 * `gr-separator`. lucide `BookmarkIcon` is unavailable in Angular, so the icon
 * is an inline SVG bookmark matching the lucide path.
 */
@Component({
  selector: 'checkpoint',
  standalone: true,
  imports: [Separator],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    <gr-separator />
  `,
  host: {
    'data-slot': 'checkpoint',
    '[class]': 'hostClass()',
  },
})
export class Checkpoint {
  readonly class = input<string>();

  protected readonly hostClass = computed(() =>
    cn(
      'flex items-center gap-0.5 text-muted-foreground overflow-hidden',
      this.class(),
    ),
  );
}

/**
 * CheckpointIcon — the bookmark glyph. Mirrors React `CheckpointIcon`.
 * Project custom children to override the default bookmark.
 */
@Component({
  selector: 'checkpoint-icon',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        [class]="iconClass()"
      >
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
    </ng-content>
  `,
  host: {
    'data-slot': 'checkpoint-icon',
    class: 'contents',
  },
})
export class CheckpointIcon {
  readonly class = input<string>();

  protected readonly iconClass = computed(() =>
    cn('size-4 shrink-0', this.class()),
  );
}

/**
 * CheckpointTrigger — ghost/sm button label for the checkpoint. Mirrors
 * React `CheckpointTrigger`. When `tooltip` is set, the button is wrapped in
 * the styled `gr-tooltip` compound from `@gremorie/ng-overlays` (the same
 * primitive the React side uses from `@gremorie/rx-overlays`), so the surface
 * matches the styled tooltip (popover card + arrow), not the bare brain
 * overlay.
 */
@Component({
  selector: 'checkpoint-trigger',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #btn>
      <button type="button" [disabled]="disabled()" [class]="buttonClass()">
        <ng-content />
      </button>
    </ng-template>

    @if (tooltip()) {
      <gr-tooltip-provider>
        <gr-tooltip side="bottom">
          <gr-tooltip-trigger>
            <ng-container [ngTemplateOutlet]="btn" />
          </gr-tooltip-trigger>
          <gr-tooltip-content>{{ tooltip() }}</gr-tooltip-content>
        </gr-tooltip>
      </gr-tooltip-provider>
    } @else {
      <ng-container [ngTemplateOutlet]="btn" />
    }
  `,
  host: {
    'data-slot': 'checkpoint-trigger',
    class: 'inline-flex',
  },
})
export class CheckpointTrigger {
  /**
   * Optional tooltip text (React `tooltip`). Side mirrors React
   * `side="bottom"`; React also passes `align="start"`, which the Angular
   * `gr-tooltip` compound does not expose (brain tooltip positions are
   * side-only).
   */
  readonly tooltip = input<string>();
  /** Visual variant (React default `ghost`). */
  readonly variant = input<'ghost' | 'outline' | 'default' | 'secondary'>(
    'ghost',
  );
  /** Button size (React default `sm`). */
  readonly size = input<'sm' | 'md' | 'lg'>('sm');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>();

  protected readonly buttonClass = computed(() => {
    const sizeClass: Record<'sm' | 'md' | 'lg', string> = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-5 text-sm',
    };
    const variantClass: Record<string, string> = {
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      outline:
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    };
    return cn(
      'inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      sizeClass[this.size()],
      variantClass[this.variant()],
      this.class(),
    );
  });
}
