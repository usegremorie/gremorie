'use client';

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
import { PipetteIcon, PlusIcon } from 'lucide-react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@gremorie/rx-core';

import { buttonVariants } from '../button';

/**
 * ColorPicker - pick a colour on an OKLCH area and channel sliders, type it in
 * any CSS format, choose from swatches and keep saved colours.
 *
 * A composed set of parts sharing one state. The logic (colour model, keyboard,
 * geometry) lives in `@gremorie/color` and is the same in the Angular edition.
 * Values are OKLCH while editing; `format` only changes how the value is
 * printed. Renders in a popover from `ColorPickerTrigger`, or in place with
 * `inline`.
 */

const BLACK: Color = { l: 0, c: 0, h: 0, alpha: 1 };

export interface ColorPickerValueChangeDetails {
  value: Color;
  valueAsString: string;
}

export interface ColorPickerProps
  extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Controlled value: any CSS colour. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Fires on every change, while dragging too. */
  onValueChange?: (details: ColorPickerValueChangeDetails) => void;
  /** Fires when a change is committed: drag released, key, swatch or field. */
  onValueChangeEnd?: (details: ColorPickerValueChangeDetails) => void;
  /** Format of `valueAsString` and of the text field (controlled). */
  format?: ColorFormat;
  defaultFormat?: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
  /** Popover open state (controlled). */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Render the panel in place, without a popover. */
  inline?: boolean;
  /** Close the popover when a swatch is picked. */
  closeOnSelect?: boolean;
  /** Saved colours, newest first (controlled). */
  savedColors?: string[];
  defaultSavedColors?: string[];
  onSavedColorsChange?: (colors: string[]) => void;
  /** Most saved colours kept; the oldest goes first. */
  maxSavedColors?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  /** Form field name: renders a hidden input with the value. */
  name?: string;
  /** Words for channel names in assistive text, to translate them. */
  channelLabels?: ChannelLabels;
}

interface ColorPickerContextValue {
  color: Color;
  valueAsString: string;
  format: ColorFormat;
  setFormat: (format: ColorFormat) => void;
  setColor: (next: Color, end?: boolean) => void;
  commit: () => void;
  interactive: boolean;
  disabled: boolean;
  readOnly: boolean;
  inline: boolean;
  invalid: boolean;
  dragging: boolean;
  setDragging: (dragging: boolean) => void;
  savedColors: string[];
  saveColor: () => void;
  forgetColor: (value: string) => void;
  select: (value: string) => void;
  labels: ChannelLabels;
  labelId: string;
}

const ColorPickerContext = React.createContext<ColorPickerContextValue | null>(
  null,
);

function useColorPicker(): ColorPickerContextValue {
  const ctx = React.useContext(ColorPickerContext);
  if (!ctx) throw new Error('ColorPicker parts must be used inside <ColorPicker>.');
  return ctx;
}

function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [current, set];
}

const directionOf = (el: Element | null): 'ltr' | 'rtl' =>
  el && getComputedStyle(el).direction === 'rtl' ? 'rtl' : 'ltr';

function ColorPicker({
  value,
  defaultValue = 'oklch(0 0 0)',
  onValueChange,
  onValueChangeEnd,
  format: formatProp,
  defaultFormat = 'oklch',
  onFormatChange,
  open,
  defaultOpen = false,
  onOpenChange,
  inline = false,
  closeOnSelect = false,
  savedColors: savedProp,
  defaultSavedColors = [],
  onSavedColorsChange,
  maxSavedColors = 16,
  disabled = false,
  readOnly = false,
  required,
  invalid = false,
  name,
  channelLabels,
  className,
  children,
  ...props
}: ColorPickerProps) {
  const [format, setFormat] = useControllable(
    formatProp,
    defaultFormat,
    onFormatChange,
  );
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [savedColors, setSaved] = useControllable(
    savedProp,
    defaultSavedColors,
    onSavedColorsChange,
  );
  const [color, setColorState] = React.useState<Color>(
    () => parseColor(value ?? defaultValue) ?? BLACK,
  );
  const [dragging, setDragging] = React.useState(false);
  const colorRef = React.useRef(color);
  colorRef.current = color;
  const lastEmitted = React.useRef<string | undefined>(undefined);

  // A controlled value is read back unless it is the one just emitted, so a
  // hex round-trip never snaps the exact OKLCH value being dragged.
  React.useEffect(() => {
    if (value === undefined || value === lastEmitted.current) return;
    const parsed = parseColor(value, colorRef.current.h);
    if (parsed) setColorState(parsed);
  }, [value]);

  const interactive = !disabled && !readOnly;
  const details = (next: Color): ColorPickerValueChangeDetails => ({
    value: next,
    valueAsString: formatColor(next, format),
  });

  const setColor = (next: Color, end = false) => {
    if (!interactive) return;
    setColorState(next);
    colorRef.current = next;
    const d = details(next);
    lastEmitted.current = d.valueAsString;
    onValueChange?.(d);
    if (end) onValueChangeEnd?.(d);
  };

  const commit = () => onValueChangeEnd?.(details(colorRef.current));

  const labelId = React.useId();
  const valueAsString = formatColor(color, format);

  const ctx: ColorPickerContextValue = {
    color,
    valueAsString,
    format,
    setFormat,
    setColor,
    commit,
    interactive,
    disabled,
    readOnly,
    inline,
    invalid,
    dragging,
    setDragging,
    savedColors,
    saveColor: () => {
      if (!interactive) return;
      setSaved(addSavedColor(savedColors, valueAsString, maxSavedColors));
    },
    forgetColor: (v) => {
      if (!interactive) return;
      setSaved(removeSavedColor(savedColors, v));
    },
    select: (v) => {
      const parsed = parseColor(v, colorRef.current.h);
      if (!parsed) return;
      setColor(parsed, true);
      if (closeOnSelect && !inline) setOpen(false);
    },
    labels: channelLabels ?? {},
    labelId,
  };

  const body = inline ? (
    children
  ) : (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={setOpen}>
      {children}
    </PopoverPrimitive.Root>
  );

  return (
    <ColorPickerContext.Provider value={ctx}>
      <div
        data-slot="color-picker"
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        data-dragging={dragging ? '' : undefined}
        className={cn('grid gap-2', className)}
        {...props}
      >
        {body}
        {name ? (
          <input
            type="hidden"
            name={name}
            value={valueAsString}
            required={required}
            disabled={disabled}
          />
        ) : null}
      </div>
    </ColorPickerContext.Provider>
  );
}

function ColorPickerLabel({ className, ...props }: React.ComponentProps<'label'>) {
  const { labelId } = useColorPicker();
  return (
    <label
      id={labelId}
      data-slot="color-picker-label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none',
        className,
      )}
      {...props}
    />
  );
}

function ColorPickerControl({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="color-picker-control"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  );
}

function ColorPickerTransparencyGrid({
  className,
  style,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      aria-hidden="true"
      data-slot="color-picker-transparency-grid"
      className={cn('absolute inset-0', className)}
      style={{
        backgroundImage:
          'repeating-conic-gradient(var(--muted) 0 25%, var(--background) 0 50%)',
        backgroundSize: 'calc(var(--spacing) * 2) calc(var(--spacing) * 2)',
        ...style,
      }}
      {...props}
    />
  );
}

interface ColorPickerSwatchProps extends React.ComponentProps<'span'> {
  /** Colour to show: any CSS colour. */
  value: string;
  /** Show the colour's alpha over a checkerboard; off paints it opaque. */
  respectAlpha?: boolean;
}

function ColorPickerSwatch({
  value,
  respectAlpha = true,
  className,
  ...props
}: ColorPickerSwatchProps) {
  const parsed = parseColor(value) ?? BLACK;
  const shown = respectAlpha ? parsed : { ...parsed, alpha: 1 };
  return (
    <span
      data-slot="color-picker-swatch"
      className={cn(
        'relative inline-block size-7 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      {...props}
    >
      {shown.alpha < 1 ? <ColorPickerTransparencyGrid /> : null}
      <span
        className="absolute inset-0 rounded-[inherit] ring-1 ring-border ring-inset"
        style={{ background: toCss(shown) }}
      />
    </span>
  );
}

function ColorPickerTrigger({
  className,
  children,
  'aria-label': ariaLabel = 'Pick a color',
  ...props
}: React.ComponentProps<'button'>) {
  const { valueAsString, disabled, invalid } = useColorPicker();
  return (
    <PopoverPrimitive.Trigger asChild>
      <button
        type="button"
        data-slot="color-picker-trigger"
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), className)}
        {...props}
      >
        {children ?? <ColorPickerSwatch value={valueAsString} className="size-5" />}
      </button>
    </PopoverPrimitive.Trigger>
  );
}

const CONTENT_CLASS = 'flex w-72 flex-col gap-3';

function ColorPickerContent({
  className,
  align = 'start',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const { inline } = useColorPicker();
  if (inline) {
    return (
      <div
        data-slot="color-picker-content"
        className={cn(CONTENT_CLASS, className)}
        {...(props as React.ComponentProps<'div'>)}
      />
    );
  }
  // Same surface as the DS Popover, so the panel reads as one of the family.
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="color-picker-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover-surface p-3 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          CONTENT_CLASS,
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

/** Pointer drag on an element: maps each point to a colour until release. */
function useDrag(onPoint: (event: React.PointerEvent<HTMLElement>, el: HTMLElement) => void) {
  const { interactive, setDragging, commit } = useColorPicker();
  const active = React.useRef(false);
  return {
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      if (!interactive || event.button !== 0) return;
      const el = event.currentTarget;
      el.setPointerCapture?.(event.pointerId);
      active.current = true;
      setDragging(true);
      onPoint(event, el);
      const thumb = el.querySelector<HTMLElement>('[role="slider"]');
      thumb?.focus({ preventScroll: true });
      event.preventDefault();
    },
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
      if (active.current) onPoint(event, event.currentTarget);
    },
    onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
      if (!active.current) return;
      active.current = false;
      setDragging(false);
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      commit();
    },
  };
}

const THUMB_CLASS =
  'absolute block size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md ring-ring/50 transition-[box-shadow] outline-hidden hover:ring-4 focus-visible:ring-4 motion-reduce:transition-none';

interface ColorPickerAreaProps extends React.ComponentProps<'div'> {
  /** Channel on the horizontal axis. */
  xChannel?: ColorChannel;
  /** Channel on the vertical axis (grows upwards). */
  yChannel?: ColorChannel;
}

const AreaContext = React.createContext<{ x: ColorChannel; y: ColorChannel }>({
  x: 'chroma',
  y: 'lightness',
});

function ColorPickerArea({
  xChannel = 'chroma',
  yChannel = 'lightness',
  className,
  children,
  ...props
}: ColorPickerAreaProps) {
  const { color, setColor, disabled } = useColorPicker();
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const axes = { xChannel, yChannel };
  // Only the channels off the axes change the picture.
  const backdrop = formatColor(
    setChannelValue(setChannelValue({ ...color, alpha: 1 }, xChannel, 0), yChannel, 0),
    'oklch',
  );

  React.useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const base = parseColor(backdrop);
    if (base) {
      paintArea(ctx, base, { xChannel, yChannel, width: el.width, height: el.height });
    }
  }, [backdrop, xChannel, yChannel]);

  const drag = useDrag((event, el) => {
    setColor(
      areaColorFromPoint(
        color,
        { x: event.clientX, y: event.clientY },
        el.getBoundingClientRect(),
        { ...axes, dir: directionOf(el) },
      ),
    );
  });

  return (
    <AreaContext.Provider value={{ x: xChannel, y: yChannel }}>
      <div
        data-slot="color-picker-area"
        data-disabled={disabled ? '' : undefined}
        data-drawer-no-drag=""
        className={cn(
          'relative h-40 w-full touch-none rounded-md select-none data-disabled:opacity-50',
          className,
        )}
        {...drag}
        {...props}
      >
        <canvas
          ref={canvas}
          width={96}
          height={64}
          aria-hidden="true"
          data-slot="color-picker-area-background"
          className="absolute inset-0 size-full rounded-[inherit] ring-1 ring-border ring-inset"
        />
        {children ?? <ColorPickerAreaThumb />}
      </div>
    </AreaContext.Provider>
  );
}

function ColorPickerAreaThumb({
  className,
  'aria-label': ariaLabel = 'Color',
  ...props
}: React.ComponentProps<'div'>) {
  const { color, setColor, interactive, disabled, labels } = useColorPicker();
  const { x, y } = React.useContext(AreaContext);
  const axes = { xChannel: x, yChannel: y };
  const pos = areaThumbPosition(color, axes);
  return (
    <div
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-roledescription="2D slider"
      aria-valuetext={`${channelValueText(color, x, labels)}, ${channelValueText(color, y, labels)}`}
      aria-disabled={disabled || undefined}
      data-slot="color-picker-area-thumb"
      className={cn(THUMB_CLASS, className)}
      style={{
        left: `${pos.x * 100}%`,
        top: `${pos.y * 100}%`,
        background: toCss({ ...color, alpha: 1 }),
      }}
      onKeyDown={(event) => {
        if (!interactive) return;
        const step = areaStepFromKey(event.key, event, {
          dir: directionOf(event.currentTarget),
        });
        if (!step) return;
        event.preventDefault();
        setColor(applyAreaStep(color, step, axes), true);
      }}
      {...props}
    />
  );
}

interface ColorPickerChannelSliderProps extends React.ComponentProps<'div'> {
  /** The channel this track edits. */
  channel: ColorChannel;
  orientation?: 'horizontal' | 'vertical';
}

const CHANNEL_NAMES: Record<ColorChannel, keyof ChannelLabels> = {
  lightness: 'lightness',
  chroma: 'chroma',
  hue: 'hue',
  alpha: 'alpha',
};
const DEFAULT_NAMES: Record<ColorChannel, string> = {
  lightness: 'Lightness',
  chroma: 'Chroma',
  hue: 'Hue',
  alpha: 'Alpha',
};

function ColorPickerChannelSlider({
  channel,
  orientation = 'horizontal',
  className,
  'aria-label': ariaLabel,
  ...props
}: ColorPickerChannelSliderProps) {
  const { color, setColor, interactive, disabled, labels } = useColorPicker();
  const vertical = orientation === 'vertical';
  const ratio = channelRatio(color, channel);
  const name = ariaLabel ?? labels[CHANNEL_NAMES[channel]] ?? DEFAULT_NAMES[channel];

  const drag = useDrag((event, el) => {
    const rect = el.getBoundingClientRect();
    let r = vertical
      ? 1 - (event.clientY - rect.top) / rect.height
      : (event.clientX - rect.left) / rect.width;
    if (!vertical && directionOf(el) === 'rtl') r = 1 - r;
    setColor(colorAtRatio(color, channel, r));
  });

  const { min, max } = CHANNEL_RANGE[channel];
  return (
    <div
      data-slot="color-picker-channel-slider"
      data-channel={channel}
      data-orientation={orientation}
      data-disabled={disabled ? '' : undefined}
      data-drawer-no-drag=""
      className={cn(
        'relative shrink-0 touch-none rounded-full select-none data-disabled:opacity-50',
        vertical ? 'h-40 w-3' : 'h-3 w-full',
        className,
      )}
      {...drag}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        {channel === 'alpha' ? <ColorPickerTransparencyGrid /> : null}
        <div
          className="absolute inset-0 rounded-[inherit] ring-1 ring-border ring-inset"
          style={{ background: channelGradient(color, channel, orientation) }}
        />
      </div>
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={name}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Number(getChannelValue(color, channel).toFixed(3))}
        aria-valuetext={channelValueText(color, channel, {
          ...labels,
          [CHANNEL_NAMES[channel]]: name,
        })}
        aria-orientation={orientation}
        aria-disabled={disabled || undefined}
        data-slot="color-picker-channel-slider-thumb"
        className={cn(THUMB_CLASS, vertical ? 'left-1/2' : 'top-1/2')}
        style={{
          [vertical ? 'top' : 'left']: `${(vertical ? 1 - ratio : ratio) * 100}%`,
          background: toCss(channel === 'alpha' ? color : { ...color, alpha: 1 }),
        }}
        onKeyDown={(event) => {
          if (!interactive) return;
          const step = stepFromKey(event.key, event, {
            dir: directionOf(event.currentTarget),
            orientation,
          });
          if (!step) return;
          event.preventDefault();
          setColor(
            step.kind === 'delta'
              ? stepChannel(color, channel, step.steps)
              : channelToEnd(color, channel, step.kind),
            true,
          );
        }}
      />
    </div>
  );
}

type InputChannel = ColorChannel | 'hex' | 'css';

interface ColorPickerChannelInputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'defaultValue'> {
  /** `css` prints the current format, `hex` always hex, a channel its number. */
  channel?: InputChannel;
}

/** Display units of a channel in a field: percent for L and alpha. */
const toField = (color: Color, channel: ColorChannel) => {
  const v = getChannelValue(color, channel);
  if (channel === 'lightness' || channel === 'alpha') return String(Math.round(v * 100));
  if (channel === 'hue') return String(Math.round(v));
  return String(Number(v.toFixed(3)));
};
const fromField = (color: Color, channel: ColorChannel, text: string) => {
  const n = Number(text.trim().replace('%', ''));
  if (text.trim() === '' || Number.isNaN(n)) return null;
  const v = channel === 'lightness' || channel === 'alpha' ? n / 100 : n;
  return setChannelValue(color, channel, v);
};

function ColorPickerChannelInput({
  channel = 'css',
  className,
  onKeyDown,
  onBlur,
  onFocus,
  'aria-label': ariaLabel,
  ...props
}: ColorPickerChannelInputProps) {
  const { color, format, setColor, disabled, readOnly, invalid } = useColorPicker();
  const shown =
    channel === 'css'
      ? formatColor(color, format)
      : channel === 'hex'
        ? formatColor(color, 'hex')
        : toField(color, channel);
  const [draft, setDraft] = React.useState<string | null>(null);

  const accept = () => {
    if (draft === null) return;
    const next =
      channel === 'css' || channel === 'hex'
        ? parseColor(draft, color.h)
        : fromField(color, channel, draft);
    setDraft(null);
    if (next && formatColor(next, 'oklch') !== formatColor(color, 'oklch')) {
      setColor(next, true);
    }
  };

  return (
    <input
      type="text"
      spellCheck={false}
      autoComplete="off"
      data-slot="color-picker-channel-input"
      data-channel={channel}
      aria-label={
        ariaLabel ??
        (channel === 'css' || channel === 'hex'
          ? 'Color value'
          : DEFAULT_NAMES[channel])
      }
      aria-invalid={invalid || undefined}
      disabled={disabled}
      readOnly={readOnly}
      inputMode={channel === 'css' || channel === 'hex' ? undefined : 'decimal'}
      value={draft ?? shown}
      onChange={(event) => setDraft(event.target.value)}
      onFocus={(event) => {
        event.currentTarget.select();
        onFocus?.(event);
      }}
      onBlur={(event) => {
        accept();
        onBlur?.(event);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          accept();
        } else if (event.key === 'Escape' && draft !== null) {
          event.stopPropagation();
          setDraft(null);
        }
        onKeyDown?.(event);
      }}
      className={cn(
        'h-8 w-full min-w-0 rounded-sm border border-transparent bg-field px-3 py-1 font-mono text-sm tabular-nums transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    />
  );
}

const FORMATS: ColorFormat[] = ['oklch', 'hex', 'rgb', 'hsl'];

function ColorPickerFormatSelect({
  className,
  'aria-label': ariaLabel = 'Color format',
  ...props
}: Omit<React.ComponentProps<'select'>, 'value' | 'onChange'>) {
  const { format, setFormat, disabled } = useColorPicker();
  return (
    <select
      data-slot="color-picker-format-select"
      aria-label={ariaLabel}
      disabled={disabled}
      value={format}
      onChange={(event) => setFormat(event.target.value as ColorFormat)}
      className={cn(
        'h-8 shrink-0 rounded-sm border border-transparent bg-field px-2 text-sm uppercase outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {FORMATS.map((f) => (
        <option key={f} value={f}>
          {f}
        </option>
      ))}
    </select>
  );
}

function ColorPickerSwatchGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="group"
      data-slot="color-picker-swatch-group"
      className={cn('flex flex-wrap gap-2', className)}
      {...props}
    />
  );
}

interface ColorPickerSwatchTriggerProps extends React.ComponentProps<'button'> {
  /** The colour this swatch picks. */
  value: string;
}

const SWATCH_TRIGGER_CLASS =
  'rounded-full outline-offset-2 transition-[outline-color] focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-pressed:outline-2 aria-pressed:outline-foreground';

function ColorPickerSwatchTrigger({
  value,
  className,
  children,
  onClick,
  'aria-label': ariaLabel,
  ...props
}: ColorPickerSwatchTriggerProps) {
  const { color, select, disabled, readOnly } = useColorPicker();
  const parsed = parseColor(value);
  const selected = !!parsed && sameColor(parsed, color);
  return (
    <button
      type="button"
      data-slot="color-picker-swatch-trigger"
      data-state={selected ? 'checked' : 'unchecked'}
      aria-label={ariaLabel ?? value}
      aria-pressed={selected}
      title={ariaLabel ?? value}
      disabled={disabled || readOnly}
      onClick={(event) => {
        select(value);
        onClick?.(event);
      }}
      className={cn(SWATCH_TRIGGER_CLASS, className)}
      {...props}
    >
      {children ?? <ColorPickerSwatch value={value} />}
    </button>
  );
}

function ColorPickerSavedColors({
  className,
  children,
  'aria-label': ariaLabel = 'Saved colors',
  ...props
}: React.ComponentProps<'div'>) {
  const { savedColors, forgetColor } = useColorPicker();
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-slot="color-picker-saved-colors"
      className={cn('flex flex-wrap gap-2', className)}
      {...props}
    >
      {savedColors.map((value) => (
        <ColorPickerSwatchTrigger
          key={value}
          value={value}
          aria-keyshortcuts="Delete"
          onKeyDown={(event) => {
            if (event.key === 'Delete' || event.key === 'Backspace') {
              event.preventDefault();
              const group = event.currentTarget.parentElement;
              forgetColor(value);
              // Keep focus in the group after the swatch goes away.
              requestAnimationFrame(() =>
                group?.querySelector<HTMLElement>('button')?.focus(),
              );
            }
          }}
        />
      ))}
      {children}
    </div>
  );
}

function ColorPickerSaveTrigger({
  className,
  children,
  onClick,
  'aria-label': ariaLabel = 'Save color',
  ...props
}: React.ComponentProps<'button'>) {
  const { saveColor, disabled, readOnly } = useColorPicker();
  return (
    <button
      type="button"
      data-slot="color-picker-save-trigger"
      aria-label={ariaLabel}
      title={ariaLabel}
      disabled={disabled || readOnly}
      onClick={(event) => {
        saveColor();
        onClick?.(event);
      }}
      className={cn(
        'inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground transition-colors outline-offset-2 hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-3.5',
        className,
      )}
      {...props}
    >
      {children ?? <PlusIcon aria-hidden="true" />}
    </button>
  );
}

interface EyeDropperResult {
  sRGBHex: string;
}

function ColorPickerEyeDropperTrigger({
  className,
  children,
  'aria-label': ariaLabel = 'Pick a color from the screen',
  ...props
}: React.ComponentProps<'button'>) {
  const { setColor, color, disabled, readOnly } = useColorPicker();
  // Known only in the browser; rendering after mount keeps hydration stable.
  const [supported, setSupported] = React.useState(false);
  React.useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'EyeDropper' in window);
  }, []);
  if (!supported) return null;
  return (
    <button
      type="button"
      data-slot="color-picker-eye-dropper-trigger"
      aria-label={ariaLabel}
      title={ariaLabel}
      disabled={disabled || readOnly}
      onClick={async () => {
        const Ctor = (
          window as unknown as {
            EyeDropper: new () => { open: () => Promise<EyeDropperResult> };
          }
        ).EyeDropper;
        try {
          const { sRGBHex } = await new Ctor().open();
          const picked = parseColor(sRGBHex, color.h);
          if (picked) setColor({ ...picked, alpha: color.alpha }, true);
        } catch {
          // The user cancelled.
        }
      }}
      className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), className)}
      {...props}
    >
      {children ?? <PipetteIcon aria-hidden="true" />}
    </button>
  );
}

interface ColorPickerValueTextProps extends React.ComponentProps<'span'> {
  /** Print in this format instead of the picker's. */
  format?: ColorFormat;
}

function ColorPickerValueText({ format, className, ...props }: ColorPickerValueTextProps) {
  const { color, valueAsString } = useColorPicker();
  return (
    <span
      data-slot="color-picker-value-text"
      className={cn('font-mono text-sm tabular-nums', className)}
      {...props}
    >
      {format ? formatColor(color, format) : valueAsString}
    </span>
  );
}

export {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerChannelInput,
  ColorPickerChannelSlider,
  ColorPickerContent,
  ColorPickerControl,
  ColorPickerEyeDropperTrigger,
  ColorPickerFormatSelect,
  ColorPickerLabel,
  ColorPickerSaveTrigger,
  ColorPickerSavedColors,
  ColorPickerSwatch,
  ColorPickerSwatchGroup,
  ColorPickerSwatchTrigger,
  ColorPickerTransparencyGrid,
  ColorPickerTrigger,
  ColorPickerValueText,
  useColorPicker,
};
export type {
  ColorPickerAreaProps,
  ColorPickerChannelInputProps,
  ColorPickerChannelSliderProps,
  ColorPickerSwatchProps,
  ColorPickerSwatchTriggerProps,
  ColorPickerValueTextProps,
};
