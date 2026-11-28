import {
  channelRatio,
  channelToEnd,
  colorAtRatio,
  stepChannel,
  type ColorChannel,
} from './channels';
import { isInGamut, toGamut, type Color } from './color';
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

/**
 * Paints the area into a canvas: each pixel is the colour at that point.
 * Colours outside sRGB show their mapped colour at reduced opacity, so the
 * reachable region reads at a glance.
 */
export function paintArea(
  ctx: CanvasRenderingContext2D,
  color: Color,
  { xChannel, yChannel, width, height }: AreaAxes & { width: number; height: number },
): void {
  const image = ctx.createImageData(width, height);
  const base: Color = { ...color, alpha: 1 };
  for (let py = 0; py < height; py++) {
    const yRatio = height === 1 ? 1 : 1 - py / (height - 1);
    const row = colorAtRatio(base, yChannel, yRatio);
    for (let px = 0; px < width; px++) {
      const xRatio = width === 1 ? 0 : px / (width - 1);
      const at = colorAtRatio(row, xChannel, xRatio);
      const shown = toGamut(at);
      const rgb = toRgb({ mode: 'oklch', l: shown.l, c: shown.c, h: shown.h } as Oklch);
      const i = (py * width + px) * 4;
      const ch = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 255);
      image.data[i] = ch(rgb.r);
      image.data[i + 1] = ch(rgb.g);
      image.data[i + 2] = ch(rgb.b);
      image.data[i + 3] = isInGamut(at) ? 255 : 96;
    }
  }
  ctx.putImageData(image, 0, 0);
}
