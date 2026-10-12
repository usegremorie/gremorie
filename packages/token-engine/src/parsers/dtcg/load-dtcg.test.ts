import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import type { TokenGraph } from '../../graph/types.js';
import { parseCssFile } from '../css/parse-css-file.js';
import { buildDtcgGraph, readDtcgFiles } from './load-dtcg.js';

const tokensPkg = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../../tokens',
);
const styles = join(tokensPkg, 'styles');
const squash = (s: string) => s.replace(/\s+/g, ' ').trim();
const flat = (graph: TokenGraph) =>
  new Map<string, string>([
    ...Object.entries(graph.primitives).map(
      ([k, p]) => [k, squash(p.value)] as [string, string],
    ),
    ...Object.entries(graph.semantics).map(
      ([k, s]) =>
        [
          k,
          s.value.kind === 'reference'
            ? `ref:${s.value.targetName}`
            : squash(s.value.raw),
        ] as [string, string],
    ),
  ]);

describe('buildDtcgGraph', () => {
  it('builds the same graph the CSS parser builds from the generated CSS', () => {
    const dtcg = flat(buildDtcgGraph(readDtcgFiles(join(tokensPkg, 'tokens'))));
    const themeCss = readFileSync(join(styles, 'theme.css'), 'utf8');
    const wiring = new Set<string>();
    postcss.parse(themeCss).walkAtRules('theme', (rule) => {
      if (rule.params !== 'inline') return;
      rule.walkDecls((d) => {
        wiring.add(d.prop);
      });
    });
    const expected = new Map<string, string>();
    for (const file of [
      'theme.css',
      ...readdirSync(join(styles, 'themes')).map((f) => `themes/${f}`),
    ]) {
      const graph = parseCssFile(
        readFileSync(join(styles, file), 'utf8'),
        file,
      );
      for (const [k, v] of flat(graph)) {
        if (!wiring.has(k.split('::')[2] ?? '')) expected.set(k, v);
      }
    }
    expect([...dtcg.keys()].sort()).toEqual([...expected.keys()].sort());
    for (const [k, v] of expected) {
      expect(`${k} = ${dtcg.get(k)}`).toBe(`${k} = ${v}`);
    }
  });

  it('lists every theme, the default first', () => {
    const graph = buildDtcgGraph(readDtcgFiles(join(tokensPkg, 'tokens')));
    expect(graph.themes[0]).toBe('default');
    expect(graph.themes).toContain('claude');
  });
});
