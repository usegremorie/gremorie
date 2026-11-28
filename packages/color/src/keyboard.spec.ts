import { describe, expect, it } from 'vitest';
import { areaStepFromKey, stepFromKey } from './keyboard';

const ltr = { dir: 'ltr', orientation: 'horizontal' } as const;

describe('stepFromKey (slider)', () => {
  it.each([
    ['ArrowRight', 1],
    ['ArrowUp', 1],
    ['ArrowLeft', -1],
    ['ArrowDown', -1],
    ['PageUp', 10],
    ['PageDown', -10],
  ])('%s moves %i steps', (key, steps) => {
    expect(stepFromKey(key, { shiftKey: false }, ltr)).toEqual({
      kind: 'delta',
      steps,
    });
  });

  it('multiplies arrows by 10 with Shift', () => {
    expect(stepFromKey('ArrowRight', { shiftKey: true }, ltr)).toEqual({
      kind: 'delta',
      steps: 10,
    });
  });

  it('jumps to the ends with Home and End', () => {
    expect(stepFromKey('Home', { shiftKey: false }, ltr)).toEqual({
      kind: 'min',
    });
    expect(stepFromKey('End', { shiftKey: false }, ltr)).toEqual({
      kind: 'max',
    });
  });

  it('flips horizontal arrows in RTL', () => {
    const rtl = { dir: 'rtl', orientation: 'horizontal' } as const;
    expect(stepFromKey('ArrowRight', { shiftKey: false }, rtl)).toEqual({
      kind: 'delta',
      steps: -1,
    });
    expect(stepFromKey('ArrowUp', { shiftKey: false }, rtl)).toEqual({
      kind: 'delta',
      steps: 1,
    });
  });

  it('ignores other keys', () => {
    expect(stepFromKey('a', { shiftKey: false }, ltr)).toBeNull();
    expect(stepFromKey('Enter', { shiftKey: false }, ltr)).toBeNull();
  });
});

describe('areaStepFromKey', () => {
  const opts = { dir: 'ltr' } as const;
  it('moves x with left/right and y with up/down', () => {
    expect(areaStepFromKey('ArrowRight', { shiftKey: false }, opts)).toEqual({
      x: 1,
    });
    expect(areaStepFromKey('ArrowLeft', { shiftKey: true }, opts)).toEqual({
      x: -10,
    });
    expect(areaStepFromKey('ArrowUp', { shiftKey: false }, opts)).toEqual({
      y: 1,
    });
    expect(areaStepFromKey('ArrowDown', { shiftKey: false }, opts)).toEqual({
      y: -1,
    });
  });

  it('pages y and jumps x to the ends', () => {
    expect(areaStepFromKey('PageUp', { shiftKey: false }, opts)).toEqual({
      y: 10,
    });
    expect(areaStepFromKey('PageDown', { shiftKey: false }, opts)).toEqual({
      y: -10,
    });
    expect(areaStepFromKey('Home', { shiftKey: false }, opts)).toEqual({
      x: 'min',
    });
    expect(areaStepFromKey('End', { shiftKey: false }, opts)).toEqual({
      x: 'max',
    });
  });

  it('flips x in RTL', () => {
    expect(
      areaStepFromKey('ArrowRight', { shiftKey: false }, { dir: 'rtl' }),
    ).toEqual({ x: -1 });
  });

  it('ignores other keys', () => {
    expect(areaStepFromKey('x', { shiftKey: false }, opts)).toBeNull();
  });
});
