import { describe, expect, it } from 'vitest';
import { addSavedColor, removeSavedColor } from './saved';

describe('saved colours', () => {
  it('adds the newest first', () => {
    expect(addSavedColor(['#00ff00'], '#ff0000')).toEqual([
      '#ff0000',
      '#00ff00',
    ]);
  });

  it('treats equivalent colours as one, keeping the newest spelling', () => {
    expect(addSavedColor(['#ff0000', '#00ff00'], 'rgb(255 0 0)')).toEqual([
      'rgb(255 0 0)',
      '#00ff00',
    ]);
  });

  it('keeps alpha apart', () => {
    expect(addSavedColor(['#ff0000'], '#ff000080')).toHaveLength(2);
  });

  it('drops the oldest past the limit', () => {
    const list = Array.from({ length: 16 }, (_, i) => `oklch(0.5 0.1 ${i * 10})`);
    const next = addSavedColor(list, '#ff0000');
    expect(next).toHaveLength(16);
    expect(next[0]).toBe('#ff0000');
    expect(next).not.toContain('oklch(0.5 0.1 150)');
    expect(addSavedColor(['#000000', '#ffffff'], '#ff0000', 2)).toEqual([
      '#ff0000',
      '#000000',
    ]);
  });

  it('ignores invalid colours', () => {
    const list = ['#ff0000'];
    expect(addSavedColor(list, 'nope')).toBe(list);
  });

  it('removes a colour by value, equivalent spellings included', () => {
    expect(removeSavedColor(['#ff0000', '#00ff00'], 'rgb(255, 0, 0)')).toEqual(
      ['#00ff00'],
    );
  });
});
