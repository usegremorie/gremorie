import { describe, expect, it } from 'vitest';
import { applyDtcgChanges, DtcgChangeError } from './apply-dtcg-changes.js';

const json = (v: unknown) => JSON.stringify(v, null, 2) + '\n';
const color = (l: number) => ({
  $type: 'color',
  $value: { colorSpace: 'oklch', components: [l, 0, 0] },
});
const files = () => ({
  'primitive/color.json': json({
    color: { gray: { '50': color(0.98), '900': color(0.2) } },
  }),
  'primitive/font.json': json({
    font: { sans: { $type: 'fontFamily', $value: ['Inter'] } },
  }),
  'semantic/light.json': json({
    background: {
      $type: 'color',
      $value: '{color.gray.50}',
      $description: 'page',
    },
    secondary: { $type: 'color', $value: '{color.gray.50}' },
  }),
  'semantic/dark.json': json({}),
  'themes/chatgpt.json': json({
    $description: 'ChatGPT',
    light: {},
    dark: { background: color(0.25) },
  }),
});
const parse = (out: Record<string, string>, rel: string) =>
  JSON.parse(out[rel] ?? 'null');

describe('applyDtcgChanges', () => {
  it('writes a new primitive colour and touches only that file', () => {
    const out = applyDtcgChanges(files(), [
      {
        kind: 'primitive-value',
        tokenName: '--color-gray-50',
        newValue: 'oklch(0.99 0 0)',
      },
    ]);
    expect(Object.keys(out)).toEqual(['primitive/color.json']);
    expect(parse(out, 'primitive/color.json').color.gray['50'].$value).toEqual({
      colorSpace: 'oklch',
      components: [0.99, 0, 0],
    });
  });

  it('repoints a semantic token and keeps its description', () => {
    const out = applyDtcgChanges(files(), [
      {
        kind: 'semantic-value',
        tokenName: '--background',
        theme: 'default',
        mode: 'light',
        newValue: { kind: 'reference', targetName: '--color-gray-900' },
      },
    ]);
    expect(parse(out, 'semantic/light.json').background).toEqual({
      $type: 'color',
      $value: '{color.gray.900}',
      $description: 'page',
    });
  });

  it('creates a dark override a theme did not have, typed from the base', () => {
    const out = applyDtcgChanges(files(), [
      {
        kind: 'semantic-value',
        tokenName: '--secondary',
        theme: 'chatgpt',
        mode: 'dark',
        newValue: { kind: 'literal', raw: 'oklch(0.3 0.05 160)' },
      },
    ]);
    const theme = parse(out, 'themes/chatgpt.json');
    expect(theme.dark.secondary).toEqual({
      $type: 'color',
      $value: { colorSpace: 'oklch', components: [0.3, 0.05, 160] },
    });
    expect(theme.dark.background).toEqual(color(0.25));
    expect(theme.$description).toBe('ChatGPT');
  });

  it('refuses what the editor cannot express', () => {
    expect(() =>
      applyDtcgChanges(files(), [
        {
          kind: 'primitive-value',
          tokenName: '--font-sans',
          newValue: 'Arial',
        },
      ]),
    ).toThrow(DtcgChangeError);
    expect(() =>
      applyDtcgChanges(files(), [
        {
          kind: 'primitive-value',
          tokenName: '--color-nope-1',
          newValue: 'oklch(0 0 0)',
        },
      ]),
    ).toThrow(/Unknown primitive/);
    expect(() =>
      applyDtcgChanges(files(), [
        {
          kind: 'semantic-value',
          tokenName: '--nothing',
          theme: 'default',
          mode: 'dark',
          newValue: { kind: 'reference', targetName: '--color-gray-50' },
        },
      ]),
    ).toThrow(/not in the base layer/);
  });

  it('answers a malformed colour with a change error, not a crash', () => {
    expect(() =>
      applyDtcgChanges(files(), [
        {
          kind: 'primitive-value',
          tokenName: '--color-gray-50',
          newValue: '#ffffff',
        },
      ]),
    ).toThrow(DtcgChangeError);
  });
});
