import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { BrnSeparator } from '@spartan-ng/brain/separator';
import { cn } from '@gremorie/ng-core';

/**
 * Item variants — mirrors React `Item` from `@gremorie/rx-display`
 * (class strings copied verbatim). One `size` on the root drives media size
 * AND title/description typography at once via `data-size` + `group-data`
 * selectors, so no wrapper has to repeat measurements.
 *
 * Height rule (media height tracks the text-block height), media centered
 * with the text:
 * - with a description:    lg 40px · md 36px · sm 32px
 * - without a description: lg/md 20px · sm 16px
 */
export const itemVariants = cva(
  'group/item flex flex-wrap items-center rounded-md border border-transparent text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border-border',
        muted: 'bg-muted/50',
      },
      size: {
        lg: 'gap-3 p-4',
        md: 'gap-2.5 px-4 py-3',
        sm: 'gap-2 px-3 py-2',
        // No padding/gap so a host-styled row controls layout; the media/text
        // still resolve to `md` because data-size falls back to `md` below.
        none: '',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-accent/50',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      interactive: false,
    },
  },
);

export type ItemVariant = NonNullable<
  VariantProps<typeof itemVariants>['variant']
>;
export type ItemSize = NonNullable<VariantProps<typeof itemVariants>['size']>;

/**
 * Item — flexible list-row primitive (compound). Mirrors React `Item` from
 * `@gremorie/rx-display` (adapted from shadcn/ui's Item).
 *
 * The `size` set on the root cascades to the media size and the
 * title/description typography via `data-size` + `group-data` selectors.
 * The `icon` media variant is the only fixed size (24px); `featured` /
 * `avatar` / `image` follow the cascade.
 *
 * @example
 * ```html
 * <gn-item variant="outline">
 *   <gn-item-media variant="featured">...</gn-item-media>
 *   <gn-item-content>
 *     <gn-item-title>Starred workspace</gn-item-title>
 *     <gn-item-description>Pinned for quick access.</gn-item-description>
 *   </gn-item-content>
 *   <gn-item-actions>...</gn-item-actions>
 * </gn-item>
 * ```
 */
@Component({
  selector: 'gn-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'item',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'dataSize()',
    '[attr.data-interactive]': 'interactive() || null',
    '[class]': 'computedClass()',
  },
})
export class Item {
  readonly variant = input<ItemVariant>('default');
  readonly size = input<ItemSize>('md');
  readonly interactive = input<boolean>(false);

  protected readonly dataSize = computed(() =>
    this.size() === 'none' ? 'md' : this.size(),
  );

  protected readonly computedClass = computed(() =>
    itemVariants({
      variant: this.variant(),
      size: this.size(),
      interactive: this.interactive(),
    }),
  );
}

// Cascade applied only to the container media variants (featured/avatar/image).
// Base (no description) = title height; with description = title+description.
const mediaSizeCascade =
  'group-data-[size=lg]/item:size-5 group-data-[size=md]/item:size-5 group-data-[size=sm]/item:size-4 ' +
  'group-has-[[data-slot=item-description]]/item:group-data-[size=lg]/item:size-10 ' +
  'group-has-[[data-slot=item-description]]/item:group-data-[size=md]/item:size-9 ' +
  'group-has-[[data-slot=item-description]]/item:group-data-[size=sm]/item:size-8';

/**
 * ItemMedia variants — mirrors React `ItemMedia` (class strings copied
 * verbatim).
 */
export const itemMediaVariants = cva(
  'flex shrink-0 items-center justify-center [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        // The only fixed size: a bare 24px glyph, no container, no cascade.
        icon: "bg-transparent [&_svg:not([class*='size-'])]:size-6",
        featured: `${mediaSizeCascade} rounded-sm border bg-muted [&_svg:not([class*='size-'])]:size-[60%]`,
        avatar: `${mediaSizeCascade} overflow-hidden rounded-full [&_img]:size-full [&_img]:object-cover`,
        image: `${mediaSizeCascade} overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover`,
      },
    },
    defaultVariants: {
      variant: 'icon',
    },
  },
);

export type ItemMediaVariant = NonNullable<
  VariantProps<typeof itemMediaVariants>['variant']
>;

/**
 * ItemMedia — leading media slot of an Item. Mirrors React `ItemMedia`.
 * Project an SVG glyph (`icon` / `featured`) or an `<img>` (`avatar` /
 * `image`) as content.
 */
@Component({
  selector: 'gn-item-media',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'item-media',
    '[attr.data-variant]': 'variant()',
    '[class]': 'computedClass()',
  },
})
export class ItemMedia {
  readonly variant = input<ItemMediaVariant>('icon');

  protected readonly computedClass = computed(() =>
    itemMediaVariants({ variant: this.variant() }),
  );
}

/**
 * ItemContent — the flexible text column of an Item. Mirrors React
 * `ItemContent`.
 */
@Component({
  selector: 'gn-item-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'item-content',
    class:
      'flex flex-1 flex-col gap-0.5 [&+[data-slot=item-content]]:flex-none',
  },
})
export class ItemContent {}

/**
 * ItemTitle — the title line of an Item. Mirrors React `ItemTitle`.
 * Typography scales with the root `size` via `group-data` selectors.
 */
@Component({
  selector: 'gn-item-title',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'item-title',
    class:
      'flex w-fit items-center gap-2 font-medium group-data-[size=lg]/item:text-sm group-data-[size=md]/item:text-sm group-data-[size=sm]/item:text-xs',
  },
})
export class ItemTitle {}

/**
 * ItemDescription — supporting copy under the title. Mirrors React
 * `ItemDescription`. Its presence drives the taller media cascade.
 */
@Component({
  selector: 'gn-item-description',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'item-description',
    class:
      'line-clamp-2 font-normal text-balance text-muted-foreground group-data-[size=lg]/item:text-sm group-data-[size=md]/item:text-xs group-data-[size=sm]/item:text-xs [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
  },
})
export class ItemDescription {}

/**
 * ItemActions — trailing actions slot (badge · button · switch). Mirrors
 * React `ItemActions`.
 */
@Component({
  selector: 'gn-item-actions',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'item-actions',
    class: 'flex items-center gap-2',
  },
})
export class ItemActions {}

/**
 * ItemHeader — full-width row above the media/content. Mirrors React
 * `ItemHeader`.
 */
@Component({
  selector: 'gn-item-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'item-header',
    class: 'flex basis-full items-center justify-between gap-2',
  },
})
export class ItemHeader {}

/**
 * ItemFooter — full-width row below the media/content. Mirrors React
 * `ItemFooter`.
 */
@Component({
  selector: 'gn-item-footer',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'item-footer',
    class: 'flex basis-full items-center justify-between gap-2',
  },
})
export class ItemFooter {}

/**
 * ItemGroup — `role="list"` wrapper for stacked Items. Mirrors React
 * `ItemGroup`.
 */
@Component({
  selector: 'gn-item-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'list',
    'data-slot': 'item-group',
    class: 'group/item-group flex flex-col',
  },
})
export class ItemGroup {}

/**
 * ItemSeparator — divider between Items inside an ItemGroup. Mirrors React
 * `ItemSeparator` (a horizontal Separator with `my-0`); the decorative
 * semantics are delegated to the spartan brain `BrnSeparator`, like
 * `gn-separator`.
 */
@Component({
  selector: 'gn-item-separator',
  standalone: true,
  hostDirectives: [
    {
      directive: BrnSeparator,
      inputs: ['orientation', 'decorative'],
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    'data-slot': 'item-separator',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
  },
})
export class ItemSeparator {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly decorative = input<boolean>(true);

  protected readonly computedClass = computed(() =>
    cn(
      'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      'my-0',
    ),
  );
}
