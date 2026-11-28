import { formatColor, type Color } from './color';

/** The channels a picker can edit. */
export type ColorChannel = 'lightness' | 'chroma' | 'hue' | 'alpha';

/** Range and keyboard step of each channel. */
export const CHANNEL_RANGE: Record<
  ColorChannel,
  { min: number; max: number; step: number }
> = {
  lightness: { min: 0, max: 1, step: 0.01 },
  chroma: { min: 0, max: 0.4, step: 0.005 },
  hue: { min: 0, max: 360, step: 1 },
  alpha: { min: 0, max: 1, step: 0.01 },
};

const KEY: Record<ColorChannel, keyof Color> = {
  lightness: 'l',
  chroma: 'c',
  hue: 'h',
  alpha: 'alpha',
};

const decimals = (step: number) => (String(step).split('.')[1] ?? '').length;
const fix = (value: number, step: number) =>
  Number(value.toFixed(decimals(step)));

export function getChannelValue(color: Color, channel: ColorChannel): number {
  return color[KEY[channel]];
}

/** Sets one channel: lightness, chroma and alpha clamp, hue wraps. */
export function setChannelValue(
  color: Color,
  channel: ColorChannel,
  value: number,
): Color {
  const { min, max } = CHANNEL_RANGE[channel];
  const next =
    channel === 'hue'
      ? ((value % 360) + 360) % 360
      : Math.min(max, Math.max(min, value));
  return { ...color, [KEY[channel]]: next };
}

/** Moves a channel by whole steps, rounded to the step's precision. */
export function stepChannel(
  color: Color,
  channel: ColorChannel,
  steps: number,
): Color {
  const { step } = CHANNEL_RANGE[channel];
  const moved = setChannelValue(
    color,
    channel,
    getChannelValue(color, channel) + steps * step,
  );
  return {
    ...moved,
    [KEY[channel]]: fix(getChannelValue(moved, channel), step),
  };
}

/** Sets a channel to its minimum or maximum. */
export function channelToEnd(
  color: Color,
  channel: ColorChannel,
  end: 'min' | 'max',
): Color {
  const { min, max } = CHANNEL_RANGE[channel];
  // Hue's max is the same angle as its min; stop one step short.
  const value =
    end === 'min'
      ? min
      : channel === 'hue'
        ? max - CHANNEL_RANGE.hue.step
        : max;
  return setChannelValue(color, channel, value);
}

/** Position 0..1 of the channel along its track. */
export function channelRatio(color: Color, channel: ColorChannel): number {
  const { min, max } = CHANNEL_RANGE[channel];
  return (getChannelValue(color, channel) - min) / (max - min);
}

/** The colour at a 0..1 position along the channel's track. */
export function colorAtRatio(
  color: Color,
  channel: ColorChannel,
  ratio: number,
): Color {
  const { min, max, step } = CHANNEL_RANGE[channel];
  const r = Math.min(1, Math.max(0, ratio));
  // A full drag to the end of the hue track stays at 359, not back to 0.
  const value =
    channel === 'hue' && r === 1 ? max - step : min + r * (max - min);
  const next = setChannelValue(color, channel, value);
  return {
    ...next,
    [KEY[channel]]: fix(getChannelValue(next, channel), step / 10),
  };
}

/** CSS gradient showing the channel's range for the current colour. */
export function channelGradient(
  color: Color,
  channel: ColorChannel,
  orientation: 'horizontal' | 'vertical' = 'horizontal',
): string {
  const { min, max } = CHANNEL_RANGE[channel];
  const count = channel === 'hue' ? 7 : 2;
  const stops = Array.from({ length: count }, (_, i) => {
    const value = min + ((max - min) * i) / (count - 1);
    // The hue track shows the spectrum at a fixed, vivid tone, so it reads
    // the same for any colour, a gray included.
    const at =
      channel === 'hue'
        ? { l: 0.7, c: 0.15, h: value, alpha: 1 }
        : { ...color, [KEY[channel]]: value };
    // The other channels show without alpha, so the track reads clearly.
    if (channel !== 'alpha') at.alpha = 1;
    return formatColor(at, 'oklch');
  });
  const direction = orientation === 'horizontal' ? 'to right' : 'to top';
  return `linear-gradient(${direction} in oklch, ${stops.join(', ')})`;
}

/** Words used in `channelValueText`. Override them to translate. */
export interface ChannelLabels {
  lightness?: string;
  chroma?: string;
  hue?: string;
  alpha?: string;
  degrees?: string;
}

const LABELS: Required<ChannelLabels> = {
  lightness: 'Lightness',
  chroma: 'Chroma',
  hue: 'Hue',
  alpha: 'Alpha',
  degrees: 'degrees',
};

/** Readable value for `aria-valuetext`, e.g. "Hue 200 degrees". */
export function channelValueText(
  color: Color,
  channel: ColorChannel,
  labels: ChannelLabels = {},
): string {
  const words = { ...LABELS, ...labels };
  const value = getChannelValue(color, channel);
  if (channel === 'hue')
    return `${words.hue} ${Math.round(value)} ${words.degrees}`;
  if (channel === 'chroma')
    return `${words.chroma} ${Number(value.toFixed(3))}`;
  return `${words[channel]} ${Math.round(value * 100)}%`;
}
