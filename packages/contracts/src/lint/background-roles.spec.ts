import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { findBackgroundRoleViolations } from './background-roles';

const values = (src: string) =>
  findBackgroundRoleViolations(src).map((f) => f.value);

describe('findBackgroundRoleViolations', () => {
  it.each([
    ['bg-foreground/5'],
    ['hover:bg-foreground/10'],
    ['ring-foreground/10'],
    ['dark:bg-input/30'],
    ['dark:hover:bg-input/30'],
    ['dark:aria-invalid:ring-destructive/40'],
    ['dark:data-[state=active]:border-input'],
    ['dark:bg-transparent'],
    ['bg-input/50'],
    ['bg-input/30'],
    ['hover:bg-primary/90'],
    ['hover:bg-secondary/80'],
    ['hover:bg-destructive/90'],
    ['aria-expanded:bg-secondary/80'],
  ])('flags %s', (cls) => {
    expect(values(`const c = 'flex ${cls} px-2';`)).toEqual([cls]);
  });

  it('flags a component redefining --accent or --muted', () => {
    expect(values(`const s = '--accent: red; --muted: blue;';`)).toEqual([
      '--accent:',
      '--muted:',
    ]);
  });

  it.each([
    ['border-input'],
    ['dark:text-muted-foreground'],
    ['dark:shadow-md'],
    ['bg-field'],
    ['hover:bg-field-hover'],
    ['hover:bg-primary-hover'],
    ['data-[state=unchecked]:bg-input'],
    ['ring-ring/50'],
    ['ring-destructive/20'],
    ['focus:bg-destructive/10'],
    ['bg-selected'],
    ['ring-edge'],
    ['var(--accent)'],
  ])('allows %s', (cls) => {
    expect(values(`const c = 'flex ${cls} px-2';`)).toEqual([]);
  });

  it('ignores comment lines', () => {
    expect(values('// was bg-foreground/5 dark:bg-input/30')).toEqual([]);
    expect(values(' * hover:bg-primary/90 lightens on light')).toEqual([]);
  });

  it('reports the 1-based line', () => {
    expect(findBackgroundRoleViolations('a\nb bg-foreground/5')[0]?.line).toBe(
      2,
    );
  });
});

function componentSources(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (
        /\.(tsx?|html|css)$/.test(name) &&
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

describe('background roles in components (drift gate)', () => {
  const root = resolve(process.cwd(), '../..');
  const files = componentSources(root);

  it('finds the component sources', () => {
    expect(files.length).toBeGreaterThan(100);
  });

  it('every component background uses one token of the right role', () => {
    const problems: string[] = [];
    for (const file of files) {
      const rel = relative(root, file);
      for (const f of findBackgroundRoleViolations(readFileSync(file, 'utf8')))
        problems.push(`${rel}:${f.line}  ${f.value}  (${f.reason})`);
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });
});
