import { describe, expect, it } from 'vitest';
import {
  CHANNEL_RANGE,
  channelGradient,
  channelRatio,
  colorAtRatio,
  channelValueText,
  getChannelValue,
  setChannelValue,
  stepChannel,
} from './channels';
import type { Color } from './color';

const teal: Color = { l: 0.7, c: 0.1, h: 200, alpha: 0.5 };

describe('channels', () => {
  it('defines the range and step of each channel', () => {
    expect(CHANNEL_RANGE).toEqual({
      lightness: { min: 0, max: 1, step: 0.01 },
      chroma: { min: 0, max: 0.4, step: 0.005 },
      hue: { min: 0, max: 360, step: 1 },
      alpha: { min: 0, max: 1, step: 0.01 },
    });
  });

  it('reads each channel', () => {
    expect(getChannelValue(teal, 'lightness')).toBe(0.7);
    expect(getChannelValue(teal, 'chroma')).toBe(0.1);
    expect(getChannelValue(teal, 'hue')).toBe(200);
    expect(getChannelValue(teal, 'alpha')).toBe(0.5);
  });

  it('clamps lightness, chroma and alpha, and wraps hue', () => {
    expect(setChannelValue(teal, 'lightness', 1.2).l).toBe(1);
    expect(setChannelValue(teal, 'chroma', -1).c).toBe(0);
    expect(setChannelValue(teal, 'alpha', 2).alpha).toBe(1);
    expect(setChannelValue(teal, 'hue', 370).h).toBe(10);
    expect(setChannelValue(teal, 'hue', -10).h).toBe(350);
    expect(setChannelValue(teal, 'hue', 360).h).toBe(0);
  });

  it('never mutates the input colour', () => {
    setChannelValue(teal, 'hue', 10);
    expect(teal.h).toBe(200);
  });

  it('steps by the channel step, without float drift', () => {
    expect(stepChannel({ ...teal, l: 0.5 }, 'lightness', 1).l).toBe(0.51);
    expect(stepChannel({ ...teal, l: 0.5 }, 'lightness', -10).l).toBe(0.4);
    expect(stepChannel({ ...teal, h: 359 }, 'hue', 1).h).toBe(0);
    expect(stepChannel({ ...teal, c: 0.1 }, 'chroma', 1).c).toBe(0.105);
    expect(stepChannel({ ...teal, l: 1 }, 'lightness', 1).l).toBe(1);
  });

  it('maps a track position to a value, hue ending at 359', () => {
    expect(colorAtRatio(teal, 'hue', 1).h).toBe(359);
    expect(colorAtRatio(teal, 'lightness', 0.5).l).toBe(0.5);
    expect(colorAtRatio(teal, 'chroma', 2).c).toBe(0.4);
    expect(channelRatio(teal, 'chroma')).toBeCloseTo(0.25);
  });

  it('keeps the hue while chroma passes through zero', () => {
    const gray = setChannelValue(teal, 'chroma', 0);
    expect(stepChannel(gray, 'chroma', 4)).toMatchObject({ c: 0.02, h: 200 });
  });

  it('draws a gradient across the channel in oklch', () => {
    const hue = channelGradient(teal, 'hue');
    expect(hue).toMatch(/^linear-gradient\(to right in oklch/);
    expect(hue).toContain('oklch(0.7 0.1 0)');
    expect(hue).toContain('oklch(0.7 0.1 360)');
    const alpha = channelGradient(teal, 'alpha');
    expect(alpha).toContain('oklch(0.7 0.1 200 / 0)');
    expect(alpha).toContain('oklch(0.7 0.1 200)');
    expect(channelGradient(teal, 'lightness', 'vertical')).toMatch(
      /^linear-gradient\(to top in oklch/,
    );
  });

  it('describes the value for assistive technology', () => {
    expect(channelValueText(teal, 'lightness')).toBe('Lightness 70%');
    expect(channelValueText(teal, 'chroma')).toBe('Chroma 0.1');
    expect(channelValueText(teal, 'hue')).toBe('Hue 200 degrees');
    expect(channelValueText(teal, 'alpha')).toBe('Alpha 50%');
    expect(
      channelValueText(teal, 'hue', { hue: 'Matiz', degrees: 'graus' }),
    ).toBe('Matiz 200 graus');
  });
});
