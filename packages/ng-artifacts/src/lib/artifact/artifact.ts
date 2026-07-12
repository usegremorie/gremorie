import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { cn } from '@gremorie/ng-core';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/ng-overlays';

import { ARTIFACT_ICONS } from './icons';

/**
 * Artifact — the generic shell that wraps a piece of styled content (a chart, a
 * table, markdown, …) as a card with a header (featured icon · title ·
 * description · actions) and a content area.
 *
 * The shell is **content-agnostic**: it never knows what it holds. Typed presets
 * (`ChartArtifact`, …) compose it, filling the actions slot with
 * content-appropriate controls and projecting the styled component into
 * `ArtifactContent`. Parity port of `@gremorie/rx-artifacts`' `Artifact`.
 *
 * `@container/artifact` lets the header adapt to the CARD's own width (not the
 * viewport), so actions collapse/expand based on how much room the card actually
 * has. `min-w-[280px]` keeps icon + truncated title + a menu button legible.
 */
@Component({
  selector: 'artifact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'artifact',
    class:
      '@container/artifact flex min-w-[280px] flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm',
  },
  template: `<ng-content />`,
})
export class Artifact {}

/**
 * Header shares the card surface; only the bottom border separates it from the
 * content. `items-stretch` lets the featured icon match the height of the title
 * + description block.
 */
@Component({
  selector: 'artifact-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'artifact-header',
    class: 'flex items-stretch gap-3 border-b px-4 py-3',
  },
  template: `<ng-content />`,
})
export class ArtifactHeader {}

/** Featured-icon color, mirroring `@gremorie/rx-display`'s `FeaturedIcon`. */
export type ArtifactFeaturedIconColor =
  | 'primary'
  | 'gray'
  | 'success'
  | 'error';

const FEATURED_ICON_COLORS: Record<ArtifactFeaturedIconColor, string> = {
  primary: 'bg-primary/10 text-primary',
  gray: 'bg-muted text-muted-foreground',
  success: 'bg-success/10 text-success',
  error: 'bg-destructive/10 text-destructive',
};

/**
 * The featured icon that anchors the header (optional). A fixed 40px square
 * (`size-10`), aligned to the top of the title + description block. `ng-display`
 * has no `FeaturedIcon`, so we build it here from `NgIcon` + the lucide glyphs.
 * Pass `icon` as a registered lucide name (e.g. `'lucideChartColumn'`).
 */
@Component({
  selector: 'artifact-featured-icon',
  imports: [NgIcon],
  providers: [provideIcons(ARTIFACT_ICONS)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'artifact-featured-icon',
    '[attr.data-color]': 'color()',
    class:
      'inline-flex size-10 shrink-0 items-center justify-center self-start rounded-lg',
    '[class]': 'colorClass()',
  },
  template: `<ng-icon [name]="icon()" class="text-xl" aria-hidden="true" />`,
})
export class ArtifactFeaturedIcon {
  readonly icon = input<string>('lucideChartColumn');
  readonly color = input<ArtifactFeaturedIconColor>('primary');

  protected readonly colorClass = computed(
    () => FEATURED_ICON_COLORS[this.color()],
  );
}

/** Title + description block; flexes to fill so actions sit on the right. */
@Component({
  selector: 'artifact-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'artifact-heading', class: 'min-w-0 flex-1' },
  template: `<ng-content />`,
})
export class ArtifactHeading {}

@Component({
  selector: 'artifact-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'artifact-title',
    class: 'block truncate font-medium text-foreground text-sm',
  },
  template: `<ng-content />`,
})
export class ArtifactTitle {}

@Component({
  selector: 'artifact-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'artifact-description',
    class: 'block truncate text-muted-foreground text-sm',
  },
  template: `<ng-content />`,
})
export class ArtifactDescription {}

@Component({
  selector: 'artifact-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'artifact-actions',
    class: 'flex shrink-0 items-center gap-1',
  },
  template: `<ng-content />`,
})
export class ArtifactActions {}

/**
 * Header actions shown ONLY when the card is wide enough (≥ 448px / `@28rem`, via
 * the `@container/artifact` on `Artifact`). Put the primary actions here; on a
 * narrow card they hide and the same actions surface through the collapsed More
 * menu. The view toggle is intentionally NOT wrapped in this — it stays visible.
 */
@Component({
  selector: 'artifact-actions-expanded',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'artifact-actions-expanded',
    class: 'hidden shrink-0 items-center gap-1 @[28rem]/artifact:flex',
  },
  template: `<ng-content />`,
})
export class ArtifactActionsExpanded {}

/**
 * Header action shown ONLY when the card is narrow (< 448px). Put the single
 * collapsed More menu here — it carries every action when there's no room to
 * expand them.
 */
@Component({
  selector: 'artifact-actions-collapsed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'artifact-actions-collapsed',
    class: 'flex shrink-0 items-center gap-1 @[28rem]/artifact:hidden',
  },
  template: `<ng-content />`,
})
export class ArtifactActionsCollapsed {}

/**
 * ArtifactAction — single ghost icon button for the header actions cluster,
 * with an optional tooltip. Mirrors React `ArtifactAction` (rx-artifacts):
 * a `Button` (variant `ghost`, size `icon-sm`) tinted `text-muted-foreground
 * hover:text-foreground`, wrapped in the styled tooltip compound when
 * `tooltip` is set. The Tailwind classes below are the RX `buttonVariants`
 * base + `ghost` + `icon-sm` strings verbatim, merged through the same `cn`.
 *
 * Host adaptations: the tooltip comes from the `gr-tooltip` compound in
 * `@gremorie/ng-overlays` (same pattern as ng-ai's `message-action`), and
 * `icon` is a registered lucide name string (e.g. `'lucideCopy'`) rendered
 * via `NgIcon` — project custom content instead when no `icon` is given.
 * `label` (falling back to `tooltip`) renders as sr-only text so the
 * icon-only button keeps an accessible name, exactly like React.
 */
@Component({
  selector: 'artifact-action',
  imports: [
    NgIcon,
    NgTemplateOutlet,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  ],
  providers: [provideIcons(ARTIFACT_ICONS)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'artifact-action', class: 'contents' },
  template: `
    <ng-template #btn>
      <button
        type="button"
        data-slot="button"
        data-variant="ghost"
        data-size="icon-sm"
        [disabled]="disabled()"
        [class]="buttonClass()"
      >
        @if (icon(); as iconName) {
          <ng-icon [name]="iconName" class="text-base" aria-hidden="true" />
        } @else {
          <ng-content />
        }
        <span class="sr-only">{{ accessibleName() }}</span>
      </button>
    </ng-template>

    @if (tooltip()) {
      <gr-tooltip-provider>
        <gr-tooltip>
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
})
export class ArtifactAction {
  /** Tooltip text shown on hover/focus (also the fallback accessible name). */
  readonly tooltip = input<string | null | undefined>(null);

  /** Accessible label rendered as sr-only inside the button. */
  readonly label = input<string | null | undefined>(null);

  /** Registered lucide icon name (e.g. `'lucideCopy'`); omit to project content. */
  readonly icon = input<string | null | undefined>(null);

  /** Disables the button (and with it the tooltip trigger). */
  readonly disabled = input<boolean>(false);

  /** Extra classes merged onto the button surface. Mirrors React className. */
  readonly class = input<string>();

  protected readonly accessibleName = computed(
    () => this.label() || this.tooltip() || '',
  );

  protected readonly buttonClass = computed(() =>
    cn(
      // rx-forms buttonVariants base (verbatim)
      "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      // variant: ghost (verbatim)
      'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      // size: icon-sm (verbatim)
      'size-8',
      // ArtifactAction overlay (verbatim)
      'text-muted-foreground hover:text-foreground',
      this.class(),
    ),
  );
}

/** One option in an `ArtifactViewToggle`. */
export interface ArtifactViewOption {
  value: string;
  /** Registered lucide icon name (e.g. `'lucideChartColumn'`). */
  icon: string;
  label: string;
}

/**
 * Segmented view switch for the header (chart ⇄ table, preview ⇄ raw, …).
 * Generic — each preset passes its own `options`. Outline-style buttons; the
 * active one is highlighted with token classes.
 */
@Component({
  selector: 'artifact-view-toggle',
  imports: [NgIcon],
  providers: [provideIcons(ARTIFACT_ICONS)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'artifact-view-toggle' },
  template: `
    <div
      class="mr-1 inline-flex items-center rounded-md border border-input bg-background p-0.5"
      role="group"
    >
      @for (o of options(); track o.value) {
        <button
          type="button"
          [attr.aria-label]="o.label"
          [attr.aria-pressed]="o.value === value()"
          (click)="select(o.value)"
          class="inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
          [class.bg-accent]="o.value === value()"
          [class.text-accent-foreground]="o.value === value()"
        >
          <ng-icon [name]="o.icon" class="text-base" aria-hidden="true" />
        </button>
      }
    </div>
  `,
})
export class ArtifactViewToggle {
  readonly value = input.required<string>();
  readonly options = input.required<ArtifactViewOption[]>();
  readonly valueChange = output<string>();

  protected select(value: string): void {
    if (value !== this.value()) this.valueChange.emit(value);
  }
}

/** One row in an `ArtifactMenu` (or the literal `'separator'`). */
export interface ArtifactMenuItem {
  label: string;
  /** Registered lucide icon name (optional). */
  icon?: string;
  onSelect?: () => void;
}

export type ArtifactMenuEntry = ArtifactMenuItem | 'separator';

/**
 * Icon-triggered dropdown for header actions (Download, More, …). `ng-overlays`
 * has no `DropdownMenu` primitive, so this is a minimal build: a trigger button
 * toggles an absolutely-positioned menu via a signal; a fixed inset-0 backdrop
 * closes it on outside click; Escape closes. Generic — the trigger icon and
 * items are passed in.
 */
@Component({
  selector: 'artifact-menu',
  imports: [NgIcon],
  providers: [provideIcons(ARTIFACT_ICONS)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'artifact-menu', class: 'relative inline-flex' },
  template: `
    <button
      type="button"
      [attr.aria-label]="label()"
      [attr.aria-expanded]="open()"
      aria-haspopup="menu"
      (click)="toggle()"
      class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <ng-icon [name]="icon()" class="text-base" aria-hidden="true" />
    </button>

    @if (open()) {
      <!-- backdrop closes on outside click; a button so it is keyboard-reachable -->
      <button
        type="button"
        class="fixed inset-0 z-40 cursor-default"
        tabindex="-1"
        aria-label="Close menu"
        (click)="close()"
      ></button>
      <div
        role="menu"
        tabindex="-1"
        (keydown.escape)="close()"
        class="absolute top-full z-50 mt-1 w-44 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
        [class.right-0]="align() === 'end'"
        [class.left-0]="align() === 'start'"
      >
        @for (it of items(); track $index) {
          @if (it === 'separator') {
            <div class="-mx-1 my-1 h-px bg-border" role="separator"></div>
          } @else {
            <button
              type="button"
              role="menuitem"
              (click)="run(it)"
              class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              @if (it.icon) {
                <ng-icon
                  [name]="it.icon"
                  class="text-base"
                  aria-hidden="true"
                />
              }
              <span>{{ it.label }}</span>
            </button>
          }
        }
      </div>
    }
  `,
})
export class ArtifactMenu {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly items = input.required<ArtifactMenuEntry[]>();
  readonly align = input<'start' | 'end'>('end');

  protected readonly open = signal(false);

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected run(item: ArtifactMenuItem): void {
    this.close();
    item.onSelect?.();
  }
}

@Component({
  selector: 'artifact-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'artifact-content', class: 'flex-1 overflow-auto p-4' },
  template: `<ng-content />`,
})
export class ArtifactContent {}
