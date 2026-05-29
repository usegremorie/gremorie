import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

/**
 * MessageAvatar — circular avatar.
 *
 * Mirrors React `MessageAvatar`. Renders `<img>` when `src` is set, otherwise
 * falls back to projected content (initials, icon, etc.).
 */
@Component({
  selector: 'message-avatar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (src()) {
      <img
        [src]="src()"
        [alt]="alt() ?? name() ?? 'avatar'"
        class="size-full object-cover"
      />
    } @else {
      <ng-content />
    }
  `,
  host: {
    '[class]': 'hostClass()',
  },
})
export class MessageAvatar {
  readonly src = input<string>();
  readonly alt = input<string>();
  readonly name = input<string>();

  protected readonly hostClass = computed(() =>
    cn(
      'inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground text-xs font-medium ring-1 ring-border',
    ),
  );
}
