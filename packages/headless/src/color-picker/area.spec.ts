import { describe, expect, it } from 'vitest';
import {
  applyAreaStep,
  areaColorFromPoint,
  areaThumbPosition,
  paintArea,
} from './area';
import type { Color } from './color';

const axes = { xChannel: 'chroma', yChannel: 'lightness' } as const;
const rect = { left: 10, top: 20, width: 200, height: 100 };
const teal: Color = { l: 0.7, c: 0.1, h: 200, alpha: 0.5 };

describe('area geometry', () => {
  it('places the thumb by channel, max lightness at the top', () => {
    expect(areaThumbPosition({ ...teal, l: 1, c: 0 }, axes)).toEqual({
      x: 0,
      y: 0,
    });
    expect(areaThumbPosition({ ...teal, l: 0, c: 0.4 }, axes)).toEqual({
      x: 1,
      y: 1,
    });
  });

  it('turns a pointer into a colour, keeping hue and alpha', () => {
    const c = areaColorFromPoint(teal, { x: 110, y: 20 }, rect, axes);
    expect(c).toEqual({ l: 1, c: 0.2, h: 200, alpha: 0.5 });
  });

  it('clamps points outside the area', () => {
    const c = areaColorFromPoint(teal, { x: -50, y: 500 }, rect, axes);
    expect(c.c).toBe(0);
    expect(c.l).toBe(0);
  });

  it('mirrors x in RTL', () => {
    const c = areaColorFromPoint(teal, { x: 10, y: 20 }, rect, {
      ...axes,
      dir: 'rtl',
    });
    expect(c.c).toBe(0.4);
  });

  it('applies keyboard steps per axis', () => {
    expect(applyAreaStep(teal, { x: 1 }, axes).c).toBe(0.105);
    expect(applyAreaStep(teal, { y: -10 }, axes).l).toBe(0.6);
    expect(applyAreaStep(teal, { x: 'max' }, axes).c).toBe(0.4);
    expect(applyAreaStep(teal, { x: 'min' }, axes).c).toBe(0);
  });
});

describe('paintArea', () => {
  function fakeContext(width: number, height: number) {
    const image = {
      data: new Uint8ClampedArray(width * height * 4),
      width,
      height,
    };
    let put: typeof image | undefined;
    return {
      ctx: {
        createImageData: () => image,
        putImageData: (img: typeof image) => {
          put = img;
        },
      } as unknown as CanvasRenderingContext2D,
      pixel: (x: number, y: number) => {
        const i = (y * width + x) * 4;
        return Array.from(put!.data.slice(i, i + 4));
      },
    };
  }

  it('paints white at the top-left and dims colours outside sRGB', () => {
    const { ctx, pixel } = fakeContext(16, 16);
    paintArea(
      ctx,
      { l: 0.5, c: 0.1, h: 150, alpha: 1 },
      {
        ...axes,
        width: 16,
        height: 16,
      },
    );
    expect(pixel(0, 0)).toEqual([255, 255, 255, 255]);
    expect(pixel(15, 8)[3]).toBeLessThan(255);
    expect(pixel(0, 8)[3]).toBe(255);
  });
});
