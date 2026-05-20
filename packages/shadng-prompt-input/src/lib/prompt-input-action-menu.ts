import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { cva } from 'class-variance-authority';

import { PromptInput } from './prompt-input';

const triggerVariants = cva(
  'inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-transparent text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      open: {
        true: 'bg-accent text-accent-foreground',
        false: '',
      },
    },
    defaultVariants: {
      open: false,
    },
  },
);

/**
 * v0.1 implementation — minimal dropdown.
 * v0.2+ will migrate to @spartan-ng/brain/menu for full a11y/keyboard
 * affordances (typeahead, roving tabindex, etc).
 */
@Component({
  selector: 'prompt-input-action-menu',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="triggerClass()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-haspopup]="'menu'"
      [attr.aria-expanded]="open() ? 'true' : 'false'"
      [disabled]="isDisabled()"
      (click)="toggle()"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>

    @if (open()) {
      <div
        role="menu"
        [attr.aria-label]="ariaLabel()"
        class="absolute z-50 mt-2 min-w-[12rem] origin-top-left rounded-md border border-border bg-popover p-1 shadow-md text-popover-foreground motion-safe:animate-[shadng-pop-in_120ms_ease-out]"
        [style.left.px]="0"
        [style.top.px]="menuTopOffset"
      >
        <ng-content />
      </div>
    }
  `,
  host: {
    class: 'relative inline-flex',
  },
})
export class PromptInputActionMenu {
  private readonly parent = inject(PromptInput, { optional: true });
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>('More actions');

  protected readonly open = signal(false);
  protected readonly menuTopOffset = 36; // matches button size-9

  protected readonly triggerClass = () =>
    triggerVariants({ open: this.open() });

  protected isDisabled(): boolean {
    return this.disabled() || (this.parent?.disabled() ?? false);
  }

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) {
      return;
    }
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.close();
    }
  }
}
