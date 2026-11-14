import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { buildOutputs } from '../pipeline/build.ts';
import { kotlinColor } from '../pipeline/platforms/kotlin.ts';
import { swiftColor } from '../pipeline/platforms/swift.ts';
import { PACKAGE_ROOT } from './support/paths.ts';

const outputs = await buildOutputs(PACKAGE_ROOT);
const output = (rel: string): string => {
  const content = outputs[rel];
  if (content === undefined) throw new Error(`No output ${rel}`);
  return content;
};

describe('colour literals, translucent ones included', () => {
  it('writes ARGB for Compose, alpha first', () => {
    expect(kotlinColor('#850aff')).toBe('Color(0xFF850AFF)');
    expect(kotlinColor('#ffffff1a')).toBe('Color(0x1AFFFFFF)');
  });
  it('writes sRGB components and opacity for SwiftUI', () => {
    expect(swiftColor('#ffffff1a')).toBe(
      'Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 0.101961)',
    );
  });
});

describe('dist outputs', () => {
  it('emits the five platform files', () => {
    expect(
      Object.keys(outputs)
        .filter((k) => k.startsWith('dist/'))
        .sort(),
    ).toEqual([
      'dist/compose/GremorieColorSchemes.kt',
      'dist/index.d.ts',
      'dist/index.js',
      'dist/swift/GremorieTokens.swift',
      'dist/tokens.json',
    ]);
  });

  it('gives every Kotlin scheme all 48 named arguments', () => {
    const kt = output('dist/compose/GremorieColorSchemes.kt');
    const schemes = kt
      .split(/ColorScheme = (?:light|dark)ColorScheme\(/)
      .slice(1);
    expect(schemes.length).toBe(14);
    for (const s of schemes) {
      expect(
        s
          .slice(0, s.indexOf('\n    )'))
          .match(/^ {8}\w+ = Color\(0x[0-9A-F]{8}\),$/gm)?.length,
      ).toBe(48);
    }
  });

  it('types the JS module so a consumer gets errors for unknown names', () => {
    const dir = mkdtempSync(join(tmpdir(), 'gremorie-dts-'));
    writeFileSync(join(dir, 'index.d.ts'), output('dist/index.d.ts'));
    writeFileSync(
      join(dir, 'consumer.ts'),
      [
        "import { themes, m3Roles, type M3Role, type ThemeName, type ThemeTokens } from './index.js';",
        'const t: ThemeTokens = themes.purple.dark;',
        'export const hex: string = t.colors.primary.hex;',
        'export const role: M3Role | undefined = m3Roles[0];',
        "export const name: ThemeName = 'purple';",
        '// @ts-expect-error unknown theme',
        'export const nope = themes.nope;',
        '// @ts-expect-error unknown colour',
        'export const missing = t.colors.nope;',
      ].join('\n'),
    );
    const program = ts.createProgram([join(dir, 'consumer.ts')], {
      strict: true,
      noEmit: true,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      target: ts.ScriptTarget.ES2022,
      types: [], // keep the workspace @types (mdx, react) out of this check
    });
    const diagnostics = ts
      .getPreEmitDiagnostics(program)
      .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'));
    expect(diagnostics).toEqual([]);
  });

  it('keeps the JSON and the JS module in step', async () => {
    const json = JSON.parse(output('dist/tokens.json')) as { themes: unknown };
    const dir = mkdtempSync(join(tmpdir(), 'gremorie-js-'));
    writeFileSync(join(dir, 'index.mjs'), output('dist/index.js'));
    const js = (await import(pathToFileURL(join(dir, 'index.mjs')).href)) as {
      themes: unknown;
    };
    expect(js.themes).toEqual(json.themes);
  });

  it('matches the reviewed Kotlin, Swift and d.ts snapshots', async () => {
    await expect(
      output('dist/compose/GremorieColorSchemes.kt'),
    ).toMatchFileSnapshot('__snapshots__/GremorieColorSchemes.kt');
    await expect(output('dist/swift/GremorieTokens.swift')).toMatchFileSnapshot(
      '__snapshots__/GremorieTokens.swift',
    );
    await expect(output('dist/index.d.ts')).toMatchFileSnapshot(
      '__snapshots__/index.d.ts.snap',
    );
  });
});
