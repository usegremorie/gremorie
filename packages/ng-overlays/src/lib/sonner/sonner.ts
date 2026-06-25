import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { BrnSonnerToaster, toast } from '@spartan-ng/brain/sonner';

/**
 * Sonner (Toaster) — root mount for transient toast notifications. Mirrors
 * React `Toaster` from `@gremorie/rx-overlays`, which wraps `sonner`
 * (by emil kowalski). Behavior is delegated to the spartan brain
 * `BrnSonnerToaster`.
 *
 * Mount this component **once** at the root of the app so any descendant can
 * fire `toast()` (re-exported from this module) without an extra provider.
 * Sonner is for transient feedback ("Salvo", "Convite enviado"). For
 * persistent in-flow messages use `Alert`; for critical errors that need
 * acknowledgment use `AlertDialog`.
 *
 * KDS tokens: the inner `brn-sonner-toaster` receives the same CSS-var bridge
 * the React component sets inline — `--normal-bg`, `--normal-text`,
 * `--normal-border`, `--border-radius` — so sonner's internal styles resolve to
 * KDS `--popover` / `--border` / `--radius`.
 *
 * Type icons (success / info / warning / error / loading) are projected as
 * `<ng-template>`s into the brain toaster's icon slots — the brain queries them
 * by template-ref name (`#successIcon`, `#infoIcon`, `#warningIcon`,
 * `#errorIcon`, `#loadingIcon`), matching the lucide glyphs the React side
 * passes through sonner's `icons` prop.
 *
 * Divergence vs. React/sonner:
 * - **Theme `system` resolution.** React tracks the document `.dark` class via a
 *   `MutationObserver` to resolve `'system'`. The brain toaster instead resolves
 *   `'system'` against the OS `prefers-color-scheme: dark` media query (and
 *   reacts to its `change` event). We forward `theme` straight through and rely
 *   on the brain's resolution rather than re-implementing the `.dark` observer,
 *   so under `theme="system"` the resolved light/dark follows the OS, not the
 *   app's `.dark` class. Pass `theme="light"` / `theme="dark"` explicitly to pin
 *   it to the KDS dark-mode convention.
 * - `theme` defaults to `'system'` here to mirror React's `theme ?? 'system'`
 *   (the brain input itself defaults to `'light'`).
 *
 * @example
 * ```html
 * <gn-sonner />
 * <button (click)="notify()">Save</button>
 * ```
 * ```ts
 * import { toast } from '@gremorie/ng-overlays';
 * notify() { toast.success('Saved'); }
 * ```
 */
@Component({
  selector: 'gn-sonner',
  standalone: true,
  imports: [BrnSonnerToaster],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'sonner',
    class: 'toaster group',
  },
  template: `
    <brn-sonner-toaster
      [theme]="theme()"
      [style]="kdsStyle()"
      class="toaster group"
    >
      <ng-template #successIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </ng-template>

      <ng-template #infoIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </ng-template>

      <ng-template #warningIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
          aria-hidden="true"
        >
          <path
            d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
          />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      </ng-template>

      <ng-template #errorIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
          aria-hidden="true"
        >
          <path
            d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"
          />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      </ng-template>

      <ng-template #loadingIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4 animate-spin"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </ng-template>
    </brn-sonner-toaster>
  `,
})
export class Sonner {
  /**
   * Toast theme — `'light'` | `'dark'` | `'system'`. Mirrors React `theme`.
   * Defaults to `'system'` (React `theme ?? 'system'`). Under `'system'` the
   * brain toaster resolves light/dark from `prefers-color-scheme` (see
   * Divergence in the component doc).
   */
  readonly theme = input<'light' | 'dark' | 'system'>('system');

  /**
   * KDS CSS-var bridge fed to the brain toaster's `style` input — the Angular
   * equivalent of the React `style` object. The brain merges these into its own
   * toaster styles, so sonner's internal `--normal-*` / `--border-radius` resolve
   * to KDS tokens.
   */
  protected readonly kdsStyle = computed<Record<string, string>>(() => ({
    '--normal-bg': 'var(--popover)',
    '--normal-text': 'var(--popover-foreground)',
    '--normal-border': 'var(--border)',
    '--border-radius': 'var(--radius)',
  }));
}

// Re-export the brain `toast` fn for React `toast` parity (React exports
// `{ Toaster, toast }`; here `{ Sonner, toast }`).
export { toast };
