import {
  CHANNEL_RANGE,
  channelRatio,
  channelToEnd,
  colorAtRatio,
  stepChannel,
  type ColorChannel,
} from './channels';
import type { Color } from './color';
import { converter, type Oklch } from 'culori/fn';
import type { AreaStep } from './keyboard';

export interface AreaAxes {
  xChannel: ColorChannel;
  yChannel: ColorChannel;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Thumb position 0..1 from the top-left; the y channel grows upwards. */
export function areaThumbPosition(
  color: Color,
  { xChannel, yChannel }: AreaAxes,
): { x: number; y: number } {
  return {
    x: channelRatio(color, xChannel),
    y: 1 - channelRatio(color, yChannel),
  };
}

/** The colour under a pointer, clamped to the area. Other channels are kept. */
export function areaColorFromPoint(
  color: Color,
  point: { x: number; y: number },
  rect: Rect,
  { xChannel, yChannel, dir = 'ltr' }: AreaAxes & { dir?: 'ltr' | 'rtl' },
): Color {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  let x = clamp((point.x - rect.left) / rect.width);
  if (dir === 'rtl') x = 1 - x;
  const y = 1 - clamp((point.y - rect.top) / rect.height);
  return colorAtRatio(colorAtRatio(color, xChannel, x), yChannel, y);
}

/** Applies a keyboard move to the area. */
export function applyAreaStep(
  color: Color,
  step: AreaStep,
  { xChannel, yChannel }: AreaAxes,
): Color {
  let next = color;
  const apply = (channel: ColorChannel, move: AreaStep['x']) => {
    if (move === undefined) return;
    next =
      typeof move === 'number'
        ? stepChannel(next, channel, move)
        : channelToEnd(next, channel, move);
  };
  apply(xChannel, step.x);
  apply(yChannel, step.y);
  return next;
}

const toRgb = converter('rgb');
const EPS = 1e-5;

/**
 * Paints the area into a canvas: each pixel is the colour at that point.
 * Colours outside sRGB show clipped at reduced opacity, so the reachable
 * region reads at a glance. One conversion per pixel keeps a repaint cheap
 * enough to follow a hue drag.
 */
export function paintArea(
  ctx: CanvasRenderingContext2D,
  color: Color,
  { xChannel, yChannel, width, height }: AreaAxes & { width: number; height: number },
): void {
  const image = ctx.createImageData(width, height);
  const ch = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 255);
  const key = { lightness: 'l', chroma: 'c', hue: 'h', alpha: 'alpha' } as const;
  const xr = CHANNEL_RANGE[xChannel];
  const yr = CHANNEL_RANGE[yChannel];
  // One mutable sample, reused: a repaint follows a hue drag frame by frame.
  const at: Oklch = { mode: 'oklch', l: color.l, c: color.c, h: color.h };
  for (let py = 0; py < height; py++) {
    const yRatio = height === 1 ? 1 : 1 - py / (height - 1);
    (at as unknown as Record<string, number>)[key[yChannel]] = yr.min + yRatio * (yr.max - yr.min);
    for (let px = 0; px < width; px++) {
      const xRatio = width === 1 ? 0 : px / (width - 1);
      (at as unknown as Record<string, number>)[key[xChannel]] = xr.min + xRatio * (xr.max - xr.min);
      const { r, g, b } = toRgb(at);
      const inside = [r, g, b].every((v) => v >= -EPS && v <= 1 + EPS);
      const i = (py * width + px) * 4;
      image.data[i] = ch(r);
      image.data[i + 1] = ch(g);
      image.data[i + 2] = ch(b);
      image.data[i + 3] = inside ? 255 : 96;
    }
  }
  ctx.putImageData(image, 0, 0);
}
