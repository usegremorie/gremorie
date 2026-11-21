import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import {
  ARBITRARY_VALUE_ALLOWLIST,
  EXTERNAL_CUSTOM_PROPERTY_PREFIXES,
  arbitraryValueViolation,
  customPropertyUsage,
  declaredCustomProperties,
  findArbitraryValues,
} from './arbitrary-values';

describe('arbitraryValueViolation', () => {
  it.each([
    ['4px'],
    ['0.625rem'],
    ['-0.35rem'],
    ['1'],
    ['#fff'],
    ['oklch(0.5_0.1_40)'],
    ['0_0_0_1px_hsl(var(--sidebar-border))'],
    ['gremorie-pop-in_120ms_ease-out'],
    ['calc(100%-2rem)'],
  ])('flags %s', (value) => {
    expect(arbitraryValueViolation(value)).not.toBeNull();
  });

  it.each([
    ['calc(var(--radius-base)*0.2)'],
    ['calc(100%-(--spacing(8)))'],
    ['max(env(safe-area-inset-bottom),--spacing(4))'],
    ['calc(var(--spacing)*3-var(--field-set-gap,0px))'],
    ['calc(100%-1px)'],
    ['80vh'],
    ['95%'],
    ['min(--spacing(72),56.25cqw)'],
    ['auto_1fr'],
    ['color,box-shadow'],
    ['inherit'],
    ['0_0_0_1px_var(--sidebar-border)'],
  ])('allows %s', (value) => {
    expect(arbitraryValueViolation(value)).toBeNull();
  });
});

describe('findArbitraryValues', () => {
  it('reports utility values with their line', () => {
    const src = "const a = 'size-4';\nconst b = 'peer rounded-[4px] border';";
    expect(findArbitraryValues(src)).toEqual([
      expect.objectContaining({ line: 2, value: 'rounded-[4px]' }),
    ]);
  });

  it('ignores arbitrary variants and token-built values', () => {
    const src =
      "'data-[state=open]:bg-accent [&_svg]:size-4 has-[>kbd]:ml-1 group-data-[collapsible=icon]/sidebar:hidden origin-(--radix-x) w-[calc(var(--sidebar-width)*-1)]'";
    expect(findArbitraryValues(src)).toEqual([]);
  });

  it('checks arbitrary properties and skips comments', () => {
    const src =
      "// rounded-[4px] in a comment\n'[scrollbar-width:none] [--gap:12px]'";
    expect(findArbitraryValues(src)).toEqual([
      expect.objectContaining({ line: 2, value: '[--gap:12px]' }),
    ]);
  });

  it('reports hex colors outside class strings but not attribute selectors', () => {
    const src =
      "\"[&_.grid[stroke='#ccc']]:stroke-border\"\nconst bg = 'var(--background, #ffffff)';";
    expect(findArbitraryValues(src)).toEqual([
      expect.objectContaining({ line: 2, value: '#ffffff' }),
    ]);
  });
});

/** Component sources of both editions, minus stories and tests. */
function componentSources(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (
        /\.(tsx?|html)$/.test(name) &&
        !/\.(stories|spec|test)\./.test(name)
      )
        out.push(path);
    }
  };
  for (const pkg of readdirSync(join(root, 'packages'))) {
    if (!/^(rx|ng)-/.test(pkg)) continue;
    const src = join(root, 'packages', pkg, 'src');
    try {
      if (statSync(src).isDirectory()) walk(src);
    } catch {
      // package without src/
    }
  }
  return out;
}

describe('no hard-coded values in components (drift gate)', () => {
  const root = resolve(process.cwd(), '../..');
  const files = componentSources(root);

  it('finds the component sources', () => {
    expect(files.length).toBeGreaterThan(100);
  });

  it('every arbitrary value is token-built or allowlisted', () => {
    const problems: string[] = [];
    const usedAllowlist = new Set<string>();
    for (const file of files) {
      const rel = relative(root, file);
      for (const f of findArbitraryValues(readFileSync(file, 'utf8'))) {
        const key = `${rel}::${f.value}`;
        if (ARBITRARY_VALUE_ALLOWLIST.has(key)) {
          usedAllowlist.add(key);
          continue;
        }
        problems.push(`${rel}:${f.line}  ${f.value}  (${f.reason})`);
      }
    }
    expect(problems, problems.join('\n')).toEqual([]);
    // A stale allowlist entry means the literal is gone: drop the entry.
    const stale = [...ARBITRARY_VALUE_ALLOWLIST.keys()].filter(
      (k) => !usedAllowlist.has(k),
    );
    expect(stale, 'stale allowlist entries').toEqual([]);
  });
});

describe('customPropertyUsage', () => {
  it('splits references from local declarations', () => {
    const src =
      "style={{ '--gap': spacing }}\n'gap-[--spacing(var(--gap))] w-(--sidebar-width) rounded-[var(--radius)]'";
    const { references, local } = customPropertyUsage(src);
    expect(references.map((r) => r.name)).toEqual([
      '--gap',
      '--sidebar-width',
      '--radius',
    ]);
    expect(local.has('--gap')).toBe(true);
    expect(local.has('--radius')).toBe(false);
  });
});

describe('no references to undefined tokens (drift gate)', () => {
  const root = resolve(process.cwd(), '../..');
  const files = componentSources(root);
  const defined = new Set<string>();
  const cssFiles = [
    join(root, 'packages/tokens/styles/theme.css'),
    join(root, 'node_modules/tailwindcss/theme.css'),
    ...readdirSync(join(root, 'packages/tokens/styles/themes')).map((f) =>
      join(root, 'packages/tokens/styles/themes', f),
    ),
  ];
  for (const css of cssFiles)
    for (const name of declaredCustomProperties(readFileSync(css, 'utf8')))
      defined.add(name);

  it('every var(--x) is a token, a Tailwind theme variable or declared in the components', () => {
    const usages = files.map((file) => ({
      rel: relative(root, file),
      ...customPropertyUsage(readFileSync(file, 'utf8')),
    }));
    // A property declared by any component (e.g. --sidebar-width on the
    // provider) may be read by another one.
    const local = new Set(usages.flatMap((u) => [...u.local]));
    const problems: string[] = [];
    for (const u of usages)
      for (const ref of u.references) {
        if (defined.has(ref.name) || local.has(ref.name)) continue;
        if (
          EXTERNAL_CUSTOM_PROPERTY_PREFIXES.some((p) => ref.name.startsWith(p))
        )
          continue;
        problems.push(`${u.rel}:${ref.line}  ${ref.name} is not defined`);
      }
    expect(problems, problems.join('\n')).toEqual([]);
  });
});
