'use client';

import { Slider as SliderPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@gremorie/rx-core';

/**
 * Slider - continuous numeric input via draggable thumb.
 *
 * Wraps Radix Slider. Single thumb
 * by default; pass `defaultValue={[low, high]}` (or `value`) for a
 * range slider. Honors `step`, `min`, `max`, and
 * `orientation="vertical"`.
 *
 * Use Slider when **approximate position is more useful than exact
 * precision** - volume, brightness, price filters. For exact values
 * use a number Input. For discrete choices, prefer RadioGroup or
 * Select. Always show the current value next to the slider -
 * silent sliders confuse users.
 */
type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /**
   * Accessible name for each thumb. Defaults to the prop `aria-label` of
   * the Root, then a generic "Slider thumb {index + 1}". Pass an array
   * when the slider has multiple thumbs (e.g. a range slider with low
   * and high handles): `thumbAriaLabel={["Minimum price", "Maximum price"]}`.
   *
   * Required for WCAG SC 4.1.2 (Name, Role, Value) when the slider is
   * not visually labelled by an adjacent <Label>.
   */
  thumbAriaLabel?: string | string[];
};

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbAriaLabel,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  const rootAriaLabel = props['aria-label'];

  function thumbLabel(index: number): string {
    if (Array.isArray(thumbAriaLabel)) {
      return thumbAriaLabel[index] ?? `Slider thumb ${index + 1}`;
    }
    if (typeof thumbAriaLabel === 'string') {
      return thumbAriaLabel;
    }
    if (typeof rootAriaLabel === 'string') {
      return rootAriaLabel;
    }
    return `Slider thumb ${index + 1}`;
  }

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            'absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={thumbLabel(index)}
          className="block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
