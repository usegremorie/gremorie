import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Injectable,
  input,
  type InputSignal,
  OnDestroy,
  signal,
  ViewChild,
  ViewEncapsulation,
  computed,
  type WritableSignal,
} from '@angular/core';
import EmblaCarousel, {
  type EmblaCarouselType,
  type EmblaOptionsType,
  type EmblaPluginType,
} from 'embla-carousel';
import { cn } from '@gremorie/ng-core';

/**
 * Carousel — horizontally (or vertically) scrollable slide region. Mirrors
 * React `Carousel` from `@gremorie/rx-display`, which follows the shadcn/ui
 * pattern built on Embla. Five parts:
 * `gn-carousel` (root), `gn-carousel-content`, `gn-carousel-item`,
 * `gn-carousel-previous`, `gn-carousel-next`.
 *
 * The React edition uses `embla-carousel-react`; this Angular edition wraps
 * the framework-agnostic `embla-carousel` core directly. State (api, orientation,
 * canScroll*) is shared through `CarouselService`, provided by the root.
 *
 * Carousels hide content past the first slide — use only when order matters
 * less than presence. Always pair with the arrow controls; arrow keys scroll
 * when focus is inside the region.
 *
 * @example
 * ```html
 * <gn-carousel>
 *   <gn-carousel-content>
 *     <gn-carousel-item>Slide 1</gn-carousel-item>
 *     <gn-carousel-item>Slide 2</gn-carousel-item>
 *   </gn-carousel-content>
 *   <gn-carousel-previous />
 *   <gn-carousel-next />
 * </gn-carousel>
 * ```
 */
export type CarouselOrientation = 'horizontal' | 'vertical';

@Injectable()
export class CarouselService {
  readonly api = signal<EmblaCarouselType | undefined>(undefined);
  readonly orientation = signal<CarouselOrientation>('horizontal');
  readonly opts: WritableSignal<EmblaOptionsType | undefined> = signal<
    EmblaOptionsType | undefined
  >(undefined);
  readonly plugins: WritableSignal<EmblaPluginType[] | undefined> = signal<
    EmblaPluginType[] | undefined
  >(undefined);
  readonly canScrollPrev = signal(false);
  readonly canScrollNext = signal(false);

  setApi(api: EmblaCarouselType): void {
    this.api.set(api);
    const onSelect = () => {
      this.canScrollPrev.set(api.canScrollPrev());
      this.canScrollNext.set(api.canScrollNext());
    };
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
  }

  scrollPrev(): void {
    this.api()?.scrollPrev();
  }

  scrollNext(): void {
    this.api()?.scrollNext();
  }
}

@Component({
  selector: 'gn-carousel',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CarouselService],
  template: `<ng-content />`,
  host: {
    'data-slot': 'carousel',
    class: 'relative block',
    role: 'region',
    'aria-roledescription': 'carousel',
    '(keydown)': 'onKeydown($event)',
  },
})
export class Carousel {
  protected readonly service = inject(CarouselService);

  readonly orientation = input<CarouselOrientation>('horizontal');
  readonly opts: InputSignal<EmblaOptionsType | undefined> =
    input<EmblaOptionsType>();
  readonly plugins: InputSignal<EmblaPluginType[] | undefined> =
    input<EmblaPluginType[]>();

  constructor() {
    effect(() => this.service.orientation.set(this.orientation()));
    effect(() => this.service.opts.set(this.opts()));
    effect(() => this.service.plugins.set(this.plugins()));
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.service.scrollPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.service.scrollNext();
    }
  }
}

@Component({
  selector: 'gn-carousel-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-hidden" data-slot="carousel-content" #viewport>
      <div [class]="trackClass()"><ng-content /></div>
    </div>
  `,
})
export class CarouselContent implements AfterViewInit, OnDestroy {
  private readonly service = inject(CarouselService);
  @ViewChild('viewport', { static: true })
  private readonly viewport!: ElementRef<HTMLDivElement>;
  private embla?: EmblaCarouselType;

  protected readonly trackClass = computed(() =>
    cn(
      'flex',
      this.service.orientation() === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
    ),
  );

  ngAfterViewInit(): void {
    const axis = this.service.orientation() === 'horizontal' ? 'x' : 'y';
    this.embla = EmblaCarousel(
      this.viewport.nativeElement,
      { ...this.service.opts(), axis },
      this.service.plugins(),
    );
    this.service.setApi(this.embla);
  }

  ngOnDestroy(): void {
    this.embla?.destroy();
  }
}

@Component({
  selector: 'gn-carousel-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'group',
    'aria-roledescription': 'slide',
    'data-slot': 'carousel-item',
    '[class]': 'computedClass()',
  },
})
export class CarouselItem {
  private readonly service = inject(CarouselService);
  protected readonly computedClass = computed(() =>
    cn(
      'min-w-0 shrink-0 grow-0 basis-full',
      this.service.orientation() === 'horizontal' ? 'pl-4' : 'pt-4',
    ),
  );
}

@Component({
  selector: 'gn-carousel-previous',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="computedClass()"
      [disabled]="!service.canScrollPrev()"
      (click)="service.scrollPrev()"
      aria-label="Previous slide"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
        aria-hidden="true"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
    </button>
  `,
  host: { 'data-slot': 'carousel-previous' },
})
export class CarouselPrevious {
  protected readonly service = inject(CarouselService);
  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex items-center justify-center absolute size-8 rounded-full border border-input bg-background shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
      this.service.orientation() === 'horizontal'
        ? 'top-1/2 -left-12 -translate-y-1/2'
        : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
    ),
  );
}

@Component({
  selector: 'gn-carousel-next',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="computedClass()"
      [disabled]="!service.canScrollNext()"
      (click)="service.scrollNext()"
      aria-label="Next slide"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </button>
  `,
  host: { 'data-slot': 'carousel-next' },
})
export class CarouselNext {
  protected readonly service = inject(CarouselService);
  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex items-center justify-center absolute size-8 rounded-full border border-input bg-background shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
      this.service.orientation() === 'horizontal'
        ? 'top-1/2 -right-12 -translate-y-1/2'
        : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
    ),
  );
}
