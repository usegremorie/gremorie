import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

/**
 * Image — renders an AI SDK `Experimental_GeneratedImage` as an `<img>`.
 * Mirrors React `Image` from `@gremorie/rx-ai`.
 *
 * React parity:
 * - The React component spreads `Experimental_GeneratedImage`
 *   (`{ base64, uint8Array, mediaType }`) plus `className` / `alt`, and builds
 *   the `src` as `data:${mediaType};base64,${base64}`. The Angular edition
 *   exposes the same fields as signal inputs.
 * - `uint8Array` is accepted for type parity but unused for the `src` (React
 *   ignores it too — it builds the data URL from `base64`).
 */
@Component({
  selector: 'image',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<img [src]="src()" [alt]="alt() ?? ''" [class]="imgClass()" />`,
  host: {
    'data-slot': 'image',
    class: 'contents',
  },
})
export class Image {
  /** Base64-encoded image data (mirrors `Experimental_GeneratedImage.base64`). */
  readonly base64 = input.required<string>();
  /** Raw bytes (mirrors `Experimental_GeneratedImage.uint8Array`). */
  readonly uint8Array = input<Uint8Array>();
  /** MIME type, e.g. `"image/png"` (mirrors `Experimental_GeneratedImage.mediaType`). */
  readonly mediaType = input.required<string>();
  readonly alt = input<string>();
  readonly class = input<string>();

  protected readonly src = computed(
    () => `data:${this.mediaType()};base64,${this.base64()}`,
  );

  protected readonly imgClass = computed(() =>
    cn(
      'h-auto max-w-full overflow-hidden rounded-md',
      this.class(),
    ),
  );
}
