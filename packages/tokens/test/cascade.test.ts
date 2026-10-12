import { describe, expect, it } from 'vitest';
import { normalizeValue } from '../pipeline/compare.ts';
import { MODES, THEMES } from '../pipeline/model.ts';
import {
  resolvedCss,
  runAll,
  type Run,
  type RunToken,
} from '../pipeline/run.ts';
import { loadSource } from '../pipeline/source.ts';
import { referenceValues } from './support/reference-cascade.ts';
import { PACKAGE_ROOT } from './support/paths.ts';

const OLD_THEMES = [
  'default',
  'claude',
  'chatgpt',
  'gemini',
  'perplexity',
  'mistral',
] as const;
const runs = await runAll(loadSource(PACKAGE_ROOT, THEMES));

const runOf = (key: string): Run => {
  const run = runs.get(key);
  if (!run) throw new Error(`no run for ${key}`);
  return run;
};
const tokenOf = (key: string, name: string): RunToken => {
  const token = runOf(key).byName.get(name);
  if (!token) throw new Error(`${key} has no ${name}`);
  return token;
};

describe('every 0.8.0 theme and mode resolves as the browser resolves 0.8.0', () => {
  for (const theme of OLD_THEMES) {
    for (const mode of MODES) {
      it(`${theme}/${mode}`, () => {
        const expected = referenceValues(theme, mode);
        const run = runOf(`${theme}/${mode}`);
        const actual = new Map(
          run.tokens.map((t) => [t.name, normalizeValue(resolvedCss(t))]),
        );
        expect([...actual.keys()].sort()).toEqual([...expected.keys()].sort());
        for (const [name, value] of expected) {
          expect(`${name}: ${actual.get(name)}`).toBe(`${name}: ${value}`);
        }
      });
    }
  }

  it('claude/dark keeps the light font-serif and chatgpt/dark the light shadows', () => {
    expect(tokenOf('claude/dark', '--font-serif').layer).toBe('theme-light');
    expect(tokenOf('chatgpt/dark', '--shadow-md').layer).toBe('theme-light');
    expect(tokenOf('chatgpt/dark', '--card-foreground').value).toEqual(
      tokenOf('chatgpt/dark', '--foreground').value,
    );
  });
});
