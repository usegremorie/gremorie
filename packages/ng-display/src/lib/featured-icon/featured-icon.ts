import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * FeaturedIcon variants — mirrors React `FeaturedIcon` from
 * `@gremorie/rx-display` (class strings copied verbatim).
 *
 * Variants: `color` (primary · gray · success · error) × `theme`
 * (light · solid · outline) × `size` (sm · md · lg · xl) × `shape`
 * (square · circle).
 */
export const featuredIconVariants = cva(
  'inline-flex shrink-0 items-center justify-center [&_svg]:shrink-0',
  {
    variants: {
      size: {
        sm: 'size-8 [&_svg]:size-4',
        md: 'size-10 [&_svg]:size-5',
        lg: 'size-12 [&_svg]:size-6',
        xl: 'size-14 [&_svg]:size-7',
      },
      shape: { square: '', circle: 'rounded-full' },
      theme: { light: '', solid: '', outline: '' },
      color: { primary: '', gray: '', success: '', error: '' },
    },
    compoundVariants: [
      // Square corner radius scales with size.
      { shape: 'square', size: 'sm', class: 'rounded-md' },
      { shape: 'square', size: 'md', class: 'rounded-lg' },
      { shape: 'square', size: 'lg', class: 'rounded-xl' },
      { shape: 'square', size: 'xl', class: 'rounded-2xl' },
      // color × theme.
      { color: 'primary', theme: 'light', class: 'bg-primary/10 text-primary' },
      {
        color: 'primary',
        theme: 'solid',
        class: 'bg-primary text-primary-foreground',
      },
      {
        color: 'primary',
        theme: 'outline',
        class: 'border border-primary/30 text-primary',
      },
      {
        color: 'gray',
        theme: 'light',
        class: 'bg-muted text-muted-foreground',
      },
      {
        color: 'gray',
        theme: 'solid',
        class: 'bg-secondary text-secondary-foreground',
      },
      {
        color: 'gray',
        theme: 'outline',
        class: 'border border-border text-muted-foreground',
      },
      { color: 'success', theme: 'light', class: 'bg-success/10 text-success' },
      {
        color: 'success',
        theme: 'solid',
        class: 'bg-success text-success-foreground',
      },
      {
        color: 'success',
        theme: 'outline',
        class: 'border border-success/30 text-success',
      },
      {
        color: 'error',
        theme: 'light',
        class: 'bg-destructive/10 text-destructive',
      },
      {
        color: 'error',
        theme: 'solid',
        class: 'bg-destructive text-destructive-foreground',
      },
      {
        color: 'error',
        theme: 'outline',
        class: 'border border-destructive/30 text-destructive',
      },
    ],
    defaultVariants: {
      size: 'md',
      shape: 'square',
      theme: 'light',
      color: 'primary',
    },
  },
);

export type FeaturedIconSize = NonNullable<
  VariantProps<typeof featuredIconVariants>['size']
>;
export type FeaturedIconShape = NonNullable<
  VariantProps<typeof featuredIconVariants>['shape']
>;
export type FeaturedIconTheme = NonNullable<
  VariantProps<typeof featuredIconVariants>['theme']
>;
export type FeaturedIconColor = NonNullable<
  VariantProps<typeof featuredIconVariants>['color']
>;

/**
 * FeaturedIcon — an icon inside a styled, themed container. Mirrors React
 * `FeaturedIcon` from `@gremorie/rx-display`.
 *
 * The small "badge" that anchors a card / artifact / empty-state header.
 * Token-driven, so theme + dark mode flow through automatically. Project an
 * SVG glyph as content (React takes a lucide `icon` prop — the Angular
 * edition adapts to content projection since lucide-angular is not a
 * dependency); the container sizes the glyph.
 *
 * @example
 * ```html
 * <gr-featured-icon color="success" theme="solid" size="lg" shape="circle">
 *   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
 *     <path d="M20 6 9 17l-5-5"/>
 *   </svg>
 * </gr-featured-icon>
 * ```
 */
@Component({
  selector: 'gr-featured-icon',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'featured-icon',
    '[attr.data-color]': 'color()',
    '[attr.data-theme]': 'theme()',
    '[class]': 'computedClass()',
  },
})
export class FeaturedIcon {
  readonly size = input<FeaturedIconSize>('md');
  readonly shape = input<FeaturedIconShape>('square');
  readonly theme = input<FeaturedIconTheme>('light');
  readonly color = input<FeaturedIconColor>('primary');

  protected readonly computedClass = computed(() =>
    featuredIconVariants({
      size: this.size(),
      shape: this.shape(),
      theme: this.theme(),
      color: this.color(),
    }),
  );
}
