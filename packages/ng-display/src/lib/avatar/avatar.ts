import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injectable,
  input,
  signal,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

export type AvatarSize = 'default' | 'sm' | 'lg';

/**
 * Shares the image-load lifecycle between the root, image and fallback so the
 * fallback renders while the source loads and stays if the load errors or no
 * `src` is given — matching the Radix Avatar behavior the React edition relies
 * on (an Avatar never shows a broken image or empty circle).
 */
@Injectable()
export class AvatarService {
  /** 'idle' | 'loading' | 'loaded' | 'error' */
  readonly status = signal<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  readonly showImage = computed(() => this.status() === 'loaded');
  readonly showFallback = computed(() => this.status() !== 'loaded');
}

/**
 * Avatar — user / entity portrait with image + fallback. Mirrors React
 * `Avatar` from `@gremorie/rx-display`, which wraps `@radix-ui/react-avatar`.
 *
 * The image-load lifecycle is hand-rolled here (no spartan brain equivalent
 * exposes the `size` / badge / group anatomy) via `AvatarService`: while the
 * source loads the fallback renders; if the load errors or `src` is missing,
 * the fallback stays.
 *
 * Sizes are exposed as a `size` input (`sm | default | lg`) and propagated to
 * subcomponents via `data-size`. For an `xl` avatar pass `size-12`+ via class.
 *
 * @example
 * ```html
 * <gn-avatar size="lg">
 *   <gn-avatar-image src="/me.png" alt="Me" />
 *   <gn-avatar-fallback>CN</gn-avatar-fallback>
 * </gn-avatar>
 * ```
 */
@Component({
  selector: 'gn-avatar',
  standalone: true,
  providers: [AvatarService],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'avatar',
    '[attr.data-size]': 'size()',
    '[class]': 'computedClass()',
  },
})
export class Avatar {
  /** Avatar size. Mirrors React `size`. */
  readonly size = input<AvatarSize>('default');

  protected readonly computedClass = computed(() =>
    cn(
      'group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6',
    ),
  );
}

/**
 * AvatarImage — the portrait image. Mirrors React `AvatarImage`. Hidden until
 * the source loads; reports load/error to the shared `AvatarService`.
 */
@Component({
  selector: 'gn-avatar-image',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (src()) {
      <img
        data-slot="avatar-image"
        [src]="src()"
        [alt]="alt()"
        [class]="computedClass()"
        [style.display]="service.showImage() ? null : 'none'"
        (load)="service.status.set('loaded')"
        (error)="service.status.set('error')"
      />
    }
  `,
})
export class AvatarImage {
  protected readonly service = inject(AvatarService);

  /** Image source. Forwarded to the `<img>`. Mirrors React `src`. */
  readonly src = input<string>();
  /** Alt text. Mirrors React `alt`. */
  readonly alt = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('aspect-square size-full'),
  );

  constructor() {
    // Mark loading whenever a source is set so the fallback shows until the
    // image resolves (matching the Radix lifecycle). The (load)/(error)
    // handlers on the <img> then settle the status to 'loaded' / 'error'.
    effect(() => {
      const hasSrc = !!this.src();
      untracked(() => {
        if (hasSrc && this.service.status() === 'idle') {
          this.service.status.set('loading');
        }
      });
    });
  }
}

/**
 * AvatarFallback — initials/icon shown while the image loads or on error.
 * Mirrors React `AvatarFallback`.
 */
@Component({
  selector: 'gn-avatar-fallback',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (service.showFallback()) {
      <span data-slot="avatar-fallback" [class]="computedClass()">
        <ng-content />
      </span>
    }
  `,
})
export class AvatarFallback {
  protected readonly service = inject(AvatarService);

  protected readonly computedClass = computed(() =>
    cn(
      'flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs',
    ),
  );
}

/**
 * AvatarBadge — small status dot anchored bottom-right. Mirrors React
 * `AvatarBadge`. Sizes track the parent Avatar via `group-data-[size=…]`.
 */
@Component({
  selector: 'gn-avatar-badge',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'avatar-badge',
    '[class]': 'computedClass()',
  },
})
export class AvatarBadge {
  protected readonly computedClass = computed(() =>
    cn(
      'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none',
      'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
      'group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2',
      'group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2',
    ),
  );
}

/**
 * AvatarGroup — overlapping `-space-x-2` stack of avatars. Mirrors React
 * `AvatarGroup`.
 */
@Component({
  selector: 'gn-avatar-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'avatar-group',
    '[class]': 'computedClass()',
  },
})
export class AvatarGroup {
  protected readonly computedClass = computed(() =>
    cn(
      'group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background',
    ),
  );
}

/**
 * AvatarGroupCount — the "+N" overflow chip. Mirrors React `AvatarGroupCount`.
 */
@Component({
  selector: 'gn-avatar-group-count',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'avatar-group-count',
    '[class]': 'computedClass()',
  },
})
export class AvatarGroupCount {
  protected readonly computedClass = computed(() =>
    cn(
      'relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3',
    ),
  );
}
