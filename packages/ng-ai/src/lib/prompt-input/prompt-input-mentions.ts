import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

/** One selectable context item in the mentions palette. */
export interface PromptInputMentionsItem {
  /** Stable identifier, surfaced through `value`. */
  id: string;
  /** Visible label in the palette and the selected chip. */
  label: string;
  /** Optional group heading, e.g. "Recent" or "Workspace". */
  group?: string;
  /** Extra search terms folded into the palette filter. */
  keywords?: string[];
}

interface MentionGroup {
  heading: string;
  items: PromptInputMentionsItem[];
}

/**
 * PromptInputMentions — the "@ Add context" command palette + selected chips.
 *
 * Mirrors React `PromptInputMentions`: a self-contained, stateful header
 * affordance. While nothing is selected it shows a labelled "@ Add context"
 * outline button; once items are picked the trigger collapses to an icon-only
 * "@" button followed by a removable chip per selection. The trigger opens a
 * small searchable, grouped, multi-select list.
 *
 * APPROXIMATION: React composes a Radix Popover + cmdk Command palette. To avoid
 * adding the `@gremorie/ng-overlays` dependency to `ng-ai` (and to match the
 * existing lightweight `prompt-input-model-select` / `prompt-input-action-menu`
 * pattern), the popover and the search/filter are implemented inline with signals
 * and a document-click outside handler. Keyboard typeahead is plain substring
 * search rather than cmdk fuzzy matching.
 */
@Component({
  selector: 'prompt-input-mentions',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="triggerClass()"
      [attr.aria-expanded]="open()"
      aria-haspopup="listbox"
      aria-label="Add context"
      (click)="toggle()"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-4"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
      </svg>
      @if (!hasSelection()) {
        <span>{{ label() }}</span>
      }
    </button>

    @if (open()) {
      <div
        role="listbox"
        aria-label="Add context"
        class="absolute z-50 mt-2 w-64 origin-top-left overflow-hidden rounded-md border border-border bg-popover p-0 text-popover-foreground shadow-md motion-safe:animate-[gremorie-pop-in_120ms_ease-out]"
        [style.top.px]="menuTopOffset"
      >
        <div class="border-b p-2">
          <input
            type="text"
            class="w-full bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground"
            [placeholder]="placeholder()"
            [value]="query()"
            (input)="onSearch($event)"
          />
        </div>
        <div class="max-h-64 overflow-y-auto p-1">
          @if (filteredGroups().length === 0) {
            <p class="px-2 py-4 text-center text-sm text-muted-foreground">
              {{ emptyText() }}
            </p>
          }
          @for (group of filteredGroups(); track group.heading) {
            @if (group.heading) {
              <p class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                {{ group.heading }}
              </p>
            }
            @for (item of group.items; track item.id) {
              <button
                type="button"
                role="option"
                [attr.aria-selected]="isSelected(item.id)"
                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                (click)="toggleItem(item.id)"
              >
                <span class="truncate">{{ item.label }}</span>
                @if (isSelected(item.id)) {
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                    class="ml-auto size-4"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                }
              </button>
            }
          }
        </div>
      </div>
    }

    @for (item of selectedItems(); track item.id) {
      <span
        class="inline-flex h-8 items-center gap-1 rounded-md border px-2.5 text-xs"
      >
        <span class="max-w-[10rem] truncate">{{ item.label }}</span>
        <button
          type="button"
          [attr.aria-label]="'Remove ' + item.label"
          class="ml-0.5 inline-flex size-4 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          (click)="remove(item.id)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="size-3"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </span>
    }
  `,
  host: {
    'data-slot': 'prompt-input-mentions',
    class: 'relative flex flex-wrap items-center gap-1.5',
  },
})
export class PromptInputMentions {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  readonly items = input.required<PromptInputMentionsItem[]>();
  /** Two-way bindable selected ids. */
  readonly value = model<string[]>([]);
  readonly label = input<string>('Add context');
  readonly placeholder = input<string>('Search context...');
  readonly emptyText = input<string>('No context found.');

  protected readonly open = signal(false);
  protected readonly query = signal('');
  protected readonly menuTopOffset = 36;

  protected readonly hasSelection = computed(() => this.value().length > 0);

  protected readonly selectedItems = computed(() =>
    this.value()
      .map((id) => this.items().find((it) => it.id === id))
      .filter((it): it is PromptInputMentionsItem => Boolean(it)),
  );

  protected readonly triggerClass = computed(() =>
    cn(
      'inline-flex h-8 items-center gap-1.5 rounded-md border border-input border-solid bg-transparent px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-expanded:bg-accent',
      this.hasSelection() && 'size-8 justify-center px-0',
    ),
  );

  protected readonly filteredGroups = computed<MentionGroup[]>(() => {
    const q = this.query().trim().toLowerCase();
    const order: string[] = [];
    const map = new Map<string, PromptInputMentionsItem[]>();
    for (const item of this.items()) {
      if (q) {
        const haystack =
          `${item.label} ${(item.keywords ?? []).join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) {
          continue;
        }
      }
      const key = item.group ?? '';
      if (!map.has(key)) {
        map.set(key, []);
        order.push(key);
      }
      map.get(key)?.push(item);
    }
    return order.map((heading) => ({ heading, items: map.get(heading) ?? [] }));
  });

  protected isSelected(id: string): boolean {
    return this.value().includes(id);
  }

  toggle(): void {
    this.open.update((v) => !v);
  }

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  toggleItem(id: string): void {
    this.value.update((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  remove(id: string): void {
    this.value.update((prev) => prev.filter((x) => x !== id));
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) {
      return;
    }
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.open.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.open.set(false);
    }
  }
}
