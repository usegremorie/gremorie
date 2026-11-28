import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  numberAttribute,
  output,
  signal,
  untracked,
  viewChild,
  ViewEncapsulation,
  effect,
  afterNextRender,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  addSavedColor,
  applyAreaStep,
  areaColorFromPoint,
  areaStepFromKey,
  areaThumbPosition,
  CHANNEL_RANGE,
  channelGradient,
  channelRatio,
  channelToEnd,
  channelValueText,
  colorAtRatio,
  formatColor,
  getChannelValue,
  paintArea,
  parseColor,
  removeSavedColor,
  sameColor,
  setChannelValue,
  stepChannel,
  stepFromKey,
  toCss,
  type ChannelLabels,
  type Color,
  type ColorChannel,
  type ColorFormat,
} from '@gremorie/color';
import { BrnPopover, BrnPopoverTrigger } from '@spartan-ng/brain/popover';
import { buttonVariants, cn } from '@gremorie/ng-core';

export type { ChannelLabels, Color, ColorChannel, ColorFormat };

/**
 * ColorPicker - pick a colour on an OKLCH area and channel sliders, type it in
 * any CSS format, choose from swatches and keep saved colours. Angular parity
 * port of React `ColorPicker` from `@gremorie/rx-forms`.
 *
 * The logic (colour model, keyboard, geometry) comes from `@gremorie/color`,
 * the same module the React edition uses, so both behave the same. Parts find
 * the root through DI; the popover is the spartan brain `BrnPopover`, carried
 * by the root as a host directive, so the panel goes in an
 * `<ng-template brnPopoverContent>` like any Gremorie popover. `inline`
 * renders the panel in place.
 *
 * ## React → Angular mapping
 *
 * - React `value` / `defaultValue` / `onValueChange` = the `value` two-way
 *   model (a CSS string). It also works with `formControl` / `ngModel`.
 * - React `onValueChangeEnd` = the `valueChangeEnd` output (same details).
 * - React `format`, `open`, `savedColors` (+ their `default*` / `on*Change`)
 *   = the `format`, `open`, `savedColors` two-way models.
 * - React `className` = the `class` input on each part.
 *
 * @example
 * ```html
 * <gr-color-picker [(value)]="brand">
 *   <button gr-color-picker-trigger></button>
 *   <ng-template brnPopoverContent>
 *     <gr-color-picker-content>
 *       <gr-color-picker-area />
 *       <gr-color-picker-channel-slider channel="hue" />
 *     </gr-color-picker-content>
 *   </ng-template>
 * </gr-color-picker>
 * ```
 */

const BLACK: Color = { l: 0, c: 0, h: 0, alpha: 1 };

export interface ColorPickerValueChangeDetails {
  value: Color;
  valueAsString: string;
}

const DEFAULT_NAMES: Record<ColorChannel, string> = {
  lightness: 'Lightness',
  chroma: 'Chroma',
  hue: 'Hue',
  alpha: 'Alpha',
};

const directionOf = (el: Element | null): 'ltr' | 'rtl' =>
  el && getComputedStyle(el).direction === 'rtl' ? 'rtl' : 'ltr';

@Component({
  selector: 'gr-color-picker',
  standalone: true,
  hostDirectives: [{ directive: BrnPopover, inputs: ['align', 'sideOffset'] }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPicker),
      multi: true,
    },
  ],
  template: `
    <ng-content />
    @if (name()) {
      <input
        type="hidden"
        [attr.name]="name()"
        [value]="valueAsString()"
        [required]="required()"
        [disabled]="isDisabled()"
      />
    }
  `,
  host: {
    'data-slot': 'color-picker',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-readonly]': 'readOnly() ? "" : null',
    '[attr.data-invalid]': 'invalid() ? "" : null',
    '[attr.data-dragging]': 'dragging() ? "" : null',
    '[class]': 'hostClass()',
  },
})
export class ColorPicker implements ControlValueAccessor {
  /** The colour as CSS text. Two-way `[(value)]`; also a form control. */
  readonly value = model<string>('oklch(0 0 0)');
  /** Format of the value text and of the field. Two-way. */
  readonly format = model<ColorFormat>('oklch');
  /** Popover open state. Two-way. */
  readonly open = model<boolean>(false);
  /** Saved colours, newest first. Two-way. */
  readonly savedColors = model<string[]>([]);
  /** Render the panel in place, without a popover. */
  readonly inline = input(false, { transform: booleanAttribute });
  /** Close the popover when a swatch is picked. */
  readonly closeOnSelect = input(false, { transform: booleanAttribute });
  /** Most saved colours kept; the oldest goes first. */
  readonly maxSavedColors = input(16, { transform: numberAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readOnly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  /** Form field name: renders a hidden input with the value. */
  readonly name = input<string>('');
  /** Words for channel names in assistive text, to translate them. */
  readonly channelLabels = input<ChannelLabels>({});
  readonly class = input<string>('');
  /** Fires when a change is committed: drag released, key, swatch or field. */
  readonly valueChangeEnd = output<ColorPickerValueChangeDetails>();

  private readonly popover = inject(BrnPopover);
  private readonly formDisabled = signal(false);
  private lastEmitted: string | undefined;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  /**
   * The exact colour being edited. Follows `value` unless the new text is the
   * one just emitted, so a hex round-trip never snaps a drag.
   */
  readonly color = linkedSignal<string, Color>({
    source: this.value,
    computation: (text, previous) => {
      const prev = previous?.value;
      if (prev && text === this.lastEmitted) return prev;
      return parseColor(text, prev?.h ?? 0) ?? prev ?? BLACK;
    },
  });

  readonly dragging = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly interactive = computed(() => !this.isDisabled() && !this.readOnly());
  readonly valueAsString = computed(() =>
    formatColor(this.color(), this.format()),
  );
  protected readonly hostClass = computed(() => cn('grid gap-2', this.class()));

  constructor() {
    // Mirror the open model onto the brain popover, and back.
    effect(() => {
      const open = this.open();
      untracked(() => {
        if (this.inline()) return;
        const state = this.popover.stateComputed();
        if (open && state !== 'open') this.popover.open();
        if (!open && state === 'open') this.popover.close();
      });
    });
    this.popover.stateChanged.subscribe((state) =>
      this.open.set(state === 'open'),
    );
  }

  private details(color: Color): ColorPickerValueChangeDetails {
    return { value: color, valueAsString: formatColor(color, this.format()) };
  }

  setColor(next: Color, end = false): void {
    if (!this.interactive()) return;
    const d = this.details(next);
    this.lastEmitted = d.valueAsString;
    this.color.set(next);
    this.value.set(d.valueAsString);
    this.onChange(d.valueAsString);
    if (end) this.commit();
  }

  commit(): void {
    this.valueChangeEnd.emit(this.details(this.color()));
    this.onTouched();
  }

  select(text: string): void {
    const parsed = parseColor(text, this.color().h);
    if (!parsed) return;
    this.setColor(parsed, true);
    if (this.closeOnSelect() && !this.inline()) this.open.set(false);
  }

  saveColor(): void {
    if (!this.interactive()) return;
    this.savedColors.set(
      addSavedColor(
        this.savedColors(),
        this.valueAsString(),
        this.maxSavedColors(),
      ),
    );
  }

  forgetColor(text: string): void {
    if (!this.interactive()) return;
    this.savedColors.set(removeSavedColor(this.savedColors(), text));
  }

  writeValue(value: string | null): void {
    if (value) this.value.set(value);
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
}

/** Drag on an element: maps each point to a colour until release. */
function startDrag(
  root: ColorPicker,
  event: PointerEvent,
  onPoint: (event: PointerEvent, el: HTMLElement) => void,
): void {
  if (!root.interactive() || event.button !== 0) return;
  const el = event.currentTarget as HTMLElement;
  el.setPointerCapture?.(event.pointerId);
  root.dragging.set(true);
  onPoint(event, el);
  el.querySelector<HTMLElement>('[role="slider"]')?.focus({
    preventScroll: true,
  });
  event.preventDefault();
  const move = (e: Event) => onPoint(e as PointerEvent, el);
  const up = (e: Event) => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', up);
    el.releasePointerCapture?.((e as PointerEvent).pointerId);
    root.dragging.set(false);
    root.commit();
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
}

const THUMB_CLASS =
  'absolute block size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md ring-ring/50 transition-[box-shadow] outline-hidden hover:ring-4 focus-visible:ring-4 motion-reduce:transition-none';

@Component({
  selector: 'label[gr-color-picker-label]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'color-picker-label',
    '[class]': 'hostClass()',
  },
})
export class ColorPickerLabel {
  readonly class = input<string>('');
  protected readonly hostClass = computed(() =>
    cn(
      'flex items-center gap-2 text-sm leading-none font-medium select-none',
      this.class(),
    ),
  );
}

@Component({
  selector: 'gr-color-picker-control',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'color-picker-control',
    '[class]': 'hostClass()',
  },
})
export class ColorPickerControl {
  readonly class = input<string>('');
  protected readonly hostClass = computed(() =>
    cn('flex items-center gap-2', this.class()),
  );
}

@Component({
  selector: 'gr-color-picker-transparency-grid',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    'aria-hidden': 'true',
    'data-slot': 'color-picker-transparency-grid',
    '[class]': 'hostClass()',
    style:
      'background-image: repeating-conic-gradient(var(--muted) 0 25%, var(--background) 0 50%); background-size: calc(var(--spacing) * 2) calc(var(--spacing) * 2)',
  },
})
export class ColorPickerTransparencyGrid {
  readonly class = input<string>('');
  protected readonly hostClass = computed(() =>
    cn('absolute inset-0', this.class()),
  );
}

@Component({
  selector: 'gr-color-picker-swatch',
  standalone: true,
  imports: [ColorPickerTransparencyGrid],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (shown().alpha < 1) {
      <gr-color-picker-transparency-grid />
    }
    <span
      class="absolute inset-0 rounded-[inherit] ring-1 ring-border ring-inset"
      [style.background]="css()"
    ></span>
  `,
  host: {
    'data-slot': 'color-picker-swatch',
    '[class]': 'hostClass()',
  },
})
export class ColorPickerSwatch {
  /** Colour to show: any CSS colour. */
  readonly value = input.required<string>();
  /** Show the colour's alpha over a checkerboard; off paints it opaque. */
  readonly respectAlpha = input(true, { transform: booleanAttribute });
  readonly class = input<string>('');
  protected readonly shown = computed(() => {
    const parsed = parseColor(this.value()) ?? BLACK;
    return this.respectAlpha() ? parsed : { ...parsed, alpha: 1 };
  });
  protected readonly css = computed(() => toCss(this.shown()));
  protected readonly hostClass = computed(() =>
    cn(
      'relative inline-block size-7 shrink-0 overflow-hidden rounded-full',
      this.class(),
    ),
  );
}

@Component({
  selector: 'button[gr-color-picker-trigger]',
  standalone: true,
  imports: [ColorPickerSwatch],
  hostDirectives: [BrnPopoverTrigger],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content
    ><gr-color-picker-swatch [value]="root.valueAsString()" class="size-5"
  /></ng-content>`,
  host: {
    type: 'button',
    'data-slot': 'color-picker-trigger',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-invalid]': 'root.invalid() || null',
    '[disabled]': 'root.isDisabled()',
    '[class]': 'hostClass()',
  },
})
export class ColorPickerTrigger {
  protected readonly root = inject(ColorPicker);
  readonly ariaLabel = input<string>('Pick a color', { alias: 'aria-label' });
  readonly class = input<string>('');
  protected readonly hostClass = computed(() =>
    cn(buttonVariants({ variant: 'outline', size: 'icon' }), this.class()),
  );
}

const CONTENT_CLASS = 'flex w-72 flex-col gap-3';

@Component({
  selector: 'gr-color-picker-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'color-picker-content',
    '[class]': 'hostClass()',
  },
})
export class ColorPickerContent {
  private readonly root = inject(ColorPicker);
  readonly class = input<string>('');
  // Same surface as the DS Popover, so the panel reads as one of the family.
  protected readonly hostClass = computed(() =>
    cn(
      !this.root.inline() &&
        'z-50 rounded-md border bg-popover-surface p-3 text-popover-foreground shadow-md outline-hidden',
      CONTENT_CLASS,
      this.class(),
    ),
  );
}

@Component({
  selector: 'gr-color-picker-area-thumb',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    role: 'slider',
    'aria-roledescription': '2D slider',
    'data-slot': 'color-picker-area-thumb',
    '[attr.tabindex]': 'root.isDisabled() ? -1 : 0',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-valuetext]': 'valueText()',
    '[attr.aria-disabled]': 'root.isDisabled() || null',
    '[class]': 'hostClass()',
    '[style.left.%]': 'position().x * 100',
    '[style.top.%]': 'position().y * 100',
    '[style.background]': 'css()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class ColorPickerAreaThumb {
  protected readonly root = inject(ColorPicker);
  private readonly area = inject(forwardRef(() => ColorPickerArea));
  readonly ariaLabel = input<string>('Color', { alias: 'aria-label' });
  readonly class = input<string>('');
  private readonly axes = computed(() => ({
    xChannel: this.area.xChannel(),
    yChannel: this.area.yChannel(),
  }));
  protected readonly position = computed(() =>
    areaThumbPosition(this.root.color(), this.axes()),
  );
  protected readonly valueText = computed(() => {
    const labels = this.root.channelLabels();
    const { xChannel, yChannel } = this.axes();
    return `${channelValueText(this.root.color(), xChannel, labels)}, ${channelValueText(this.root.color(), yChannel, labels)}`;
  });
  protected readonly css = computed(() =>
    toCss({ ...this.root.color(), alpha: 1 }),
  );
  protected readonly hostClass = computed(() => cn(THUMB_CLASS, this.class()));

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.root.interactive()) return;
    const step = areaStepFromKey(event.key, event, {
      dir: directionOf(event.currentTarget as Element),
    });
    if (!step) return;
    event.preventDefault();
    this.root.setColor(
      applyAreaStep(this.root.color(), step, this.axes()),
      true,
    );
  }
}

@Component({
  selector: 'gr-color-picker-area',
  standalone: true,
  imports: [ColorPickerAreaThumb],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas
      #canvas
      width="96"
      height="64"
      aria-hidden="true"
      data-slot="color-picker-area-background"
      class="absolute inset-0 size-full rounded-[inherit] ring-1 ring-border ring-inset"
    ></canvas>
    <ng-content><gr-color-picker-area-thumb /></ng-content>
  `,
  host: {
    'data-slot': 'color-picker-area',
    'data-vaul-no-drag': '',
    '[attr.data-disabled]': 'root.isDisabled() ? "" : null',
    '[class]': 'hostClass()',
    '(pointerdown)': 'onPointerDown($event)',
  },
})
export class ColorPickerArea {
  protected readonly root = inject(ColorPicker);
  /** Channel on the horizontal axis. */
  readonly xChannel = input<ColorChannel>('chroma');
  /** Channel on the vertical axis (grows upwards). */
  readonly yChannel = input<ColorChannel>('lightness');
  readonly class = input<string>('');
  private readonly canvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  protected readonly hostClass = computed(() =>
    cn(
      'relative block h-40 w-full touch-none rounded-md select-none data-disabled:opacity-50',
      this.class(),
    ),
  );
  // Only the channels off the axes change the picture.
  private readonly backdrop = computed(() =>
    formatColor(
      setChannelValue(
        setChannelValue({ ...this.root.color(), alpha: 1 }, this.xChannel(), 0),
        this.yChannel(),
        0,
      ),
      'oklch',
    ),
  );

  constructor() {
    afterRenderEffect(() => {
      const el = this.canvas().nativeElement;
      const text = this.backdrop();
      const xChannel = this.xChannel();
      const yChannel = this.yChannel();
      const ctx = el.getContext('2d');
      // Hue survives the round-trip through text even at chroma 0.
      const base = parseColor(text, untracked(() => this.root.color().h));
      if (ctx && base) {
        paintArea(ctx, base, {
          xChannel,
          yChannel,
          width: el.width,
          height: el.height,
        });
      }
    });
  }

  protected onPointerDown(event: PointerEvent): void {
    startDrag(this.root, event, (e, el) => {
      this.root.setColor(
        areaColorFromPoint(
          this.root.color(),
          { x: e.clientX, y: e.clientY },
          el.getBoundingClientRect(),
          {
            xChannel: this.xChannel(),
            yChannel: this.yChannel(),
            dir: directionOf(el),
          },
        ),
      );
    });
  }
}

@Component({
  selector: 'gr-color-picker-channel-slider',
  standalone: true,
  imports: [ColorPickerTransparencyGrid],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="absolute inset-0 overflow-hidden rounded-[inherit]">
      @if (channel() === 'alpha') {
        <gr-color-picker-transparency-grid />
      }
      <div
        class="absolute inset-0 rounded-[inherit] ring-1 ring-border ring-inset"
        [style.background]="gradient()"
      ></div>
    </div>
    <div
      role="slider"
      data-slot="color-picker-channel-slider-thumb"
      [attr.tabindex]="root.isDisabled() ? -1 : 0"
      [attr.aria-label]="name()"
      [attr.aria-valuemin]="range().min"
      [attr.aria-valuemax]="range().max"
      [attr.aria-valuenow]="valueNow()"
      [attr.aria-valuetext]="valueText()"
      [attr.aria-orientation]="orientation()"
      [attr.aria-disabled]="root.isDisabled() || null"
      [class]="thumbClass()"
      [style.left.%]="vertical() ? null : ratio() * 100"
      [style.top.%]="vertical() ? (1 - ratio()) * 100 : null"
      [style.background]="thumbCss()"
      (keydown)="onKeydown($event)"
    ></div>
  `,
  host: {
    'data-slot': 'color-picker-channel-slider',
    'data-vaul-no-drag': '',
    '[attr.data-channel]': 'channel()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-disabled]': 'root.isDisabled() ? "" : null',
    '[class]': 'hostClass()',
    '(pointerdown)': 'onPointerDown($event)',
  },
})
export class ColorPickerChannelSlider {
  protected readonly root = inject(ColorPicker);
  /** The channel this track edits. */
  readonly channel = input.required<ColorChannel>();
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly ariaLabel = input<string | undefined>(undefined, {
    alias: 'aria-label',
  });
  readonly class = input<string>('');

  protected readonly vertical = computed(
    () => this.orientation() === 'vertical',
  );
  protected readonly range = computed(() => CHANNEL_RANGE[this.channel()]);
  protected readonly ratio = computed(() =>
    channelRatio(this.root.color(), this.channel()),
  );
  protected readonly name = computed(
    () =>
      this.ariaLabel() ??
      this.root.channelLabels()[this.channel()] ??
      DEFAULT_NAMES[this.channel()],
  );
  protected readonly valueNow = computed(() =>
    Number(getChannelValue(this.root.color(), this.channel()).toFixed(3)),
  );
  protected readonly valueText = computed(() =>
    channelValueText(this.root.color(), this.channel(), {
      ...this.root.channelLabels(),
      [this.channel()]: this.name(),
    }),
  );
  protected readonly gradient = computed(() =>
    channelGradient(this.root.color(), this.channel(), this.orientation()),
  );
  protected readonly thumbCss = computed(() =>
    toCss(
      this.channel() === 'alpha'
        ? this.root.color()
        : { ...this.root.color(), alpha: 1 },
    ),
  );
  protected readonly thumbClass = computed(() =>
    cn(THUMB_CLASS, this.vertical() ? 'left-1/2' : 'top-1/2'),
  );
  protected readonly hostClass = computed(() =>
    cn(
      'relative block shrink-0 touch-none rounded-full select-none data-disabled:opacity-50',
      this.vertical() ? 'h-40 w-3' : 'h-3 w-full',
      this.class(),
    ),
  );

  protected onPointerDown(event: PointerEvent): void {
    startDrag(this.root, event, (e, el) => {
      const rect = el.getBoundingClientRect();
      let r = this.vertical()
        ? 1 - (e.clientY - rect.top) / rect.height
        : (e.clientX - rect.left) / rect.width;
      if (!this.vertical() && directionOf(el) === 'rtl') r = 1 - r;
      this.root.setColor(colorAtRatio(this.root.color(), this.channel(), r));
    });
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.root.interactive()) return;
    const step = stepFromKey(event.key, event, {
      dir: directionOf(event.currentTarget as Element),
      orientation: this.orientation(),
    });
    if (!step) return;
    event.preventDefault();
    const color = this.root.color();
    this.root.setColor(
      step.kind === 'delta'
        ? stepChannel(color, this.channel(), step.steps)
        : channelToEnd(color, this.channel(), step.kind),
      true,
    );
  }
}

type InputChannel = ColorChannel | 'hex' | 'css';

const toField = (color: Color, channel: ColorChannel) => {
  const v = getChannelValue(color, channel);
  if (channel === 'lightness' || channel === 'alpha')
    return String(Math.round(v * 100));
  if (channel === 'hue') return String(Math.round(v));
  return String(Number(v.toFixed(3)));
};
const fromField = (color: Color, channel: ColorChannel, text: string) => {
  const n = Number(text.trim().replace('%', ''));
  if (text.trim() === '' || Number.isNaN(n)) return null;
  const v = channel === 'lightness' || channel === 'alpha' ? n / 100 : n;
  return setChannelValue(color, channel, v);
};

@Component({
  selector: 'input[gr-color-picker-channel-input]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    type: 'text',
    spellcheck: 'false',
    autocomplete: 'off',
    'data-slot': 'color-picker-channel-input',
    '[attr.data-channel]': 'channel()',
    '[attr.aria-label]': 'label()',
    '[attr.aria-invalid]': 'root.invalid() || null',
    '[attr.inputmode]': 'numeric() ? "decimal" : null',
    '[disabled]': 'root.isDisabled()',
    '[readOnly]': 'root.readOnly()',
    '[value]': 'draft() ?? shown()',
    '[class]': 'hostClass()',
    '(input)': 'draft.set($any($event.target).value)',
    '(focus)': '$any($event.target).select()',
    '(blur)': 'accept()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class ColorPickerChannelInput {
  protected readonly root = inject(ColorPicker);
  /** `css` prints the current format, `hex` always hex, a channel its number. */
  readonly channel = input<InputChannel>('css');
  readonly ariaLabel = input<string | undefined>(undefined, {
    alias: 'aria-label',
  });
  readonly class = input<string>('');
  protected readonly draft = signal<string | null>(null);
  protected readonly numeric = computed(
    () => this.channel() !== 'css' && this.channel() !== 'hex',
  );
  protected readonly label = computed(
    () =>
      this.ariaLabel() ??
      (this.numeric()
        ? DEFAULT_NAMES[this.channel() as ColorChannel]
        : 'Color value'),
  );
  protected readonly shown = computed(() => {
    const color = this.root.color();
    const channel = this.channel();
    if (channel === 'css') return formatColor(color, this.root.format());
    if (channel === 'hex') return formatColor(color, 'hex');
    return toField(color, channel);
  });
  protected readonly hostClass = computed(() =>
    cn(
      'h-8 w-full min-w-0 rounded-sm border border-transparent bg-field px-3 py-1 font-mono text-sm tabular-nums transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
      this.class(),
    ),
  );

  protected accept(): void {
    const draft = this.draft();
    if (draft === null) return;
    const color = this.root.color();
    const channel = this.channel();
    const next =
      channel === 'css' || channel === 'hex'
        ? parseColor(draft, color.h)
        : fromField(color, channel, draft);
    this.draft.set(null);
    if (next && formatColor(next, 'oklch') !== formatColor(color, 'oklch')) {
      this.root.setColor(next, true);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.accept();
    } else if (event.key === 'Escape' && this.draft() !== null) {
      event.stopPropagation();
      this.draft.set(null);
    }
  }
}

const FORMATS: ColorFormat[] = ['oklch', 'hex', 'rgb', 'hsl'];

@Component({
  selector: 'gr-color-picker-format-select',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <select
      data-slot="color-picker-format-select"
      [attr.aria-label]="ariaLabel()"
      [disabled]="root.isDisabled()"
      [value]="root.format()"
      (change)="root.format.set($any($event.target).value)"
      [class]="selectClass()"
    >
      @for (f of formats; track f) {
        <option [value]="f" [selected]="f === root.format()">{{ f }}</option>
      }
    </select>
  `,
  host: { class: 'contents' },
})
export class ColorPickerFormatSelect {
  protected readonly root = inject(ColorPicker);
  protected readonly formats = FORMATS;
  readonly ariaLabel = input<string>('Color format', { alias: 'aria-label' });
  readonly class = input<string>('');
  protected readonly selectClass = computed(() =>
    cn(
      'h-8 shrink-0 rounded-sm border border-transparent bg-field px-2 text-sm uppercase outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50',
      this.class(),
    ),
  );
}

@Component({
  selector: 'gr-color-picker-swatch-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'group',
    'data-slot': 'color-picker-swatch-group',
    '[class]': 'hostClass()',
  },
})
export class ColorPickerSwatchGroup {
  readonly class = input<string>('');
  protected readonly hostClass = computed(() =>
    cn('flex flex-wrap gap-2', this.class()),
  );
}

const SWATCH_TRIGGER_CLASS =
  'inline-flex shrink-0 rounded-full outline-offset-2 transition-[outline-color] focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-pressed:outline-2 aria-pressed:outline-foreground';

@Component({
  selector: 'button[gr-color-picker-swatch-trigger]',
  standalone: true,
  imports: [ColorPickerSwatch],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content
    ><gr-color-picker-swatch [value]="value()"
  /></ng-content>`,
  host: {
    type: 'button',
    'data-slot': 'color-picker-swatch-trigger',
    '[attr.data-state]': 'selected() ? "checked" : "unchecked"',
    '[attr.aria-label]': 'ariaLabel() ?? value()',
    '[attr.title]': 'ariaLabel() ?? value()',
    '[attr.aria-pressed]': 'selected()',
    '[disabled]': 'root.isDisabled() || root.readOnly()',
    '[class]': 'hostClass()',
    '(click)': 'root.select(value())',
  },
})
export class ColorPickerSwatchTrigger {
  protected readonly root = inject(ColorPicker);
  /** The colour this swatch picks. */
  readonly value = input.required<string>();
  readonly ariaLabel = input<string | undefined>(undefined, {
    alias: 'aria-label',
  });
  readonly class = input<string>('');
  protected readonly selected = computed(() => {
    const parsed = parseColor(this.value());
    return !!parsed && sameColor(parsed, this.root.color());
  });
  protected readonly hostClass = computed(() =>
    cn(SWATCH_TRIGGER_CLASS, this.class()),
  );
}

@Component({
  selector: 'gr-color-picker-saved-colors',
  standalone: true,
  imports: [ColorPickerSwatchTrigger],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (color of root.savedColors(); track color) {
      <button
        gr-color-picker-swatch-trigger
        [value]="color"
        [aria-label]="color"
        aria-keyshortcuts="Delete"
        (keydown)="onKeydown($event, color)"
      ></button>
    }
    <ng-content />
  `,
  host: {
    role: 'group',
    'data-slot': 'color-picker-saved-colors',
    '[attr.aria-label]': 'ariaLabel()',
    '[class]': 'hostClass()',
  },
})
export class ColorPickerSavedColors {
  protected readonly root = inject(ColorPicker);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly ariaLabel = input<string>('Saved colors', { alias: 'aria-label' });
  readonly class = input<string>('');
  protected readonly hostClass = computed(() =>
    cn('flex flex-wrap gap-2', this.class()),
  );

  protected onKeydown(event: KeyboardEvent, color: string): void {
    if (event.key !== 'Delete' && event.key !== 'Backspace') return;
    event.preventDefault();
    this.root.forgetColor(color);
    // Keep focus in the group after the swatch goes away.
    requestAnimationFrame(() =>
      this.host.nativeElement.querySelector<HTMLElement>('button')?.focus(),
    );
  }
}

@Component({
  selector: 'button[gr-color-picker-save-trigger]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </ng-content>
  `,
  host: {
    type: 'button',
    'data-slot': 'color-picker-save-trigger',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.title]': 'ariaLabel()',
    '[disabled]': 'root.isDisabled() || root.readOnly()',
    '[class]': 'hostClass()',
    '(click)': 'root.saveColor()',
  },
})
export class ColorPickerSaveTrigger {
  protected readonly root = inject(ColorPicker);
  readonly ariaLabel = input<string>('Save color', { alias: 'aria-label' });
  readonly class = input<string>('');
  protected readonly hostClass = computed(() =>
    cn(
      'inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground transition-colors outline-offset-2 hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-3.5',
      this.class(),
    ),
  );
}

interface EyeDropperResult {
  sRGBHex: string;
}

@Component({
  selector: 'button[gr-color-picker-eye-dropper-trigger]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          d="m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"
        />
        <path
          d="m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"
        />
        <path d="m2 22 .414-.414" />
      </svg>
    </ng-content>
  `,
  host: {
    type: 'button',
    'data-slot': 'color-picker-eye-dropper-trigger',
    '[hidden]': '!supported()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.title]': 'ariaLabel()',
    '[disabled]': 'root.isDisabled() || root.readOnly()',
    '[class]': 'hostClass()',
    '(click)': 'pick()',
  },
})
export class ColorPickerEyeDropperTrigger {
  protected readonly root = inject(ColorPicker);
  readonly ariaLabel = input<string>('Pick a color from the screen', {
    alias: 'aria-label',
  });
  readonly class = input<string>('');
  // Known only in the browser; checking after render keeps hydration stable.
  protected readonly supported = signal(false);
  protected readonly hostClass = computed(() =>
    cn(buttonVariants({ variant: 'outline', size: 'icon' }), this.class()),
  );

  constructor() {
    afterNextRender(() => this.supported.set('EyeDropper' in window));
  }

  protected async pick(): Promise<void> {
    const Ctor = (
      window as unknown as {
        EyeDropper: new () => { open: () => Promise<EyeDropperResult> };
      }
    ).EyeDropper;
    try {
      const { sRGBHex } = await new Ctor().open();
      const color = this.root.color();
      const picked = parseColor(sRGBHex, color.h);
      if (picked) this.root.setColor({ ...picked, alpha: color.alpha }, true);
    } catch {
      // The user cancelled.
    }
  }
}

@Component({
  selector: 'gr-color-picker-value-text',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ text() }}`,
  host: {
    'data-slot': 'color-picker-value-text',
    '[class]': 'hostClass()',
  },
})
export class ColorPickerValueText {
  private readonly root = inject(ColorPicker);
  /** Print in this format instead of the picker's. */
  readonly format = input<ColorFormat | undefined>(undefined);
  readonly class = input<string>('');
  protected readonly text = computed(() => {
    const format = this.format();
    return format
      ? formatColor(this.root.color(), format)
      : this.root.valueAsString();
  });
  protected readonly hostClass = computed(() =>
    cn('font-mono text-sm tabular-nums', this.class()),
  );
}

/** Every ColorPicker part, for one import. */
export const ColorPickerImports = [
  ColorPicker,
  ColorPickerLabel,
  ColorPickerControl,
  ColorPickerTrigger,
  ColorPickerContent,
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerChannelSlider,
  ColorPickerChannelInput,
  ColorPickerFormatSelect,
  ColorPickerTransparencyGrid,
  ColorPickerSwatchGroup,
  ColorPickerSwatchTrigger,
  ColorPickerSwatch,
  ColorPickerSavedColors,
  ColorPickerSaveTrigger,
  ColorPickerEyeDropperTrigger,
  ColorPickerValueText,
] as const;
