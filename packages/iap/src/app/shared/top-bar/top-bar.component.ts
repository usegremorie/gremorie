import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { COLOR_PRESETS, type ColorPreset, ThemeService } from '../../services/theme.service';
import { cn } from '@gremorie/ng-core';

@Component({
  selector: 'iap-top-bar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex h-12 shrink-0 items-center justify-end gap-1 border-b border-border bg-background px-4">
      <!-- Toggle dark/light -->
      <button
        type="button"
        [attr.aria-label]="darkLabel()"
        [title]="darkLabel()"
        class="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        (click)="themeService.toggleDarkMode()"
      >
        @if (themeService.darkMode() === 'dark') {
          <!-- Sol -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        } @else {
          <!-- Lua -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        }
      </button>

      <!-- Dropdown de tema de cor -->
      <div class="relative inline-flex">
        <button
          type="button"
          [attr.aria-label]="'Tema de cor: ' + activePresetLabel()"
          [attr.aria-haspopup]="'listbox'"
          [attr.aria-expanded]="presetOpen() ? 'true' : 'false'"
          [class]="presetTriggerClass()"
          (click)="togglePreset()"
        >
          <span
            class="size-3.5 shrink-0 rounded-full border border-border"
            [style.background]="activeSwatch()"
            aria-hidden="true"
          ></span>
          <span class="text-sm">{{ activePresetLabel() }}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5 shrink-0 opacity-60">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        @if (presetOpen()) {
          <div
            role="listbox"
            aria-label="Selecionar tema de cor"
            class="absolute right-0 top-full z-50 mt-1 min-w-[180px] origin-top-right rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
          >
            @for (preset of presets; track preset.id) {
              <button
                type="button"
                role="option"
                [attr.aria-selected]="themeService.colorPreset() === preset.id ? 'true' : 'false'"
                [class]="presetOptionClass(preset.id)"
                (click)="selectPreset(preset.id)"
              >
                <span
                  class="size-3.5 shrink-0 rounded-full border border-border"
                  [style.background]="preset.swatch"
                  aria-hidden="true"
                ></span>
                <span class="text-sm">{{ preset.label }}</span>
                @if (themeService.colorPreset() === preset.id) {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="ml-auto size-3.5 shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                }
              </button>
            }
          </div>
        }
      </div>
    </header>
  `,
})
export class TopBar {
  protected readonly themeService = inject(ThemeService);
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  protected readonly presets = COLOR_PRESETS;
  protected readonly presetOpen = signal(false);

  protected readonly darkLabel = computed(() =>
    this.themeService.darkMode() === 'dark'
      ? 'Mudar para modo claro'
      : 'Mudar para modo escuro',
  );

  protected readonly activePresetLabel = computed(
    () =>
      this.presets.find((p) => p.id === this.themeService.colorPreset())?.label ?? 'Padrão',
  );

  protected readonly activeSwatch = computed(
    () =>
      this.presets.find((p) => p.id === this.themeService.colorPreset())?.swatch ??
      'oklch(0.205 0 0)',
  );

  protected readonly presetTriggerClass = computed(() =>
    cn(
      'inline-flex h-9 items-center gap-2 rounded-md px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      this.presetOpen() && 'bg-accent text-accent-foreground',
    ),
  );

  protected presetOptionClass(id: ColorPreset): string {
    return cn(
      'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground',
      this.themeService.colorPreset() === id && 'bg-accent/50',
    );
  }

  protected togglePreset(): void {
    this.presetOpen.update((v) => !v);
  }

  protected selectPreset(id: ColorPreset): void {
    this.themeService.setColorPreset(id);
    this.presetOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.presetOpen()) return;
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.presetOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.presetOpen()) this.presetOpen.set(false);
  }
}
