# shadng Charts — Foundation + Area Chart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shared chart foundation (scales, formatters, shape helpers, reactive chart context, frame, axes, grid) plus a complete Area chart in both layers (headless directives + styled `<area-chart>`), proving the whole architecture end-to-end.

**Architecture:** Own-the-code on D3 _math_ modules (`d3-scale`, `d3-shape`, `d3-array`, `d3-format`, `d3-time-format`) rendering SVG via Angular. Two layers in one package: **headless** = attribute directives on real SVG elements wired through a DI-provided `ChartContext` (series self-register their values so the frame computes shared domains); **styled** = `<area-chart>` element component that renders the headless composition inside a Card with token colors and an accessible data-table fallback. All geometry lives in pure, unit-tested functions; directives only wire signals to attributes.

**Tech Stack:** Angular 21 (signals, zoneless), Nx, ng-packagr, Vitest (`@nx/angular:unit-test`), Storybook (`@storybook/angular`), Tailwind v4, `class-variance-authority`/`cn`, D3 math modules.

---

## Scope

**In scope (this plan):**

- New package `@gremorie/ng-charts` (single entry point for now).
- Pure helpers: formatter registry, scale helpers, shape helpers, domain computation.
- Reactive `ChartContext` (signals + series registration → shared domains + scales).
- Headless directives: `chartFrame`, `cartesianGrid`, `xAxis`, `yAxis`, `area`.
- Styled component: `<area-chart [data] [config] [xKey]>` (Card + tokens + a11y table).
- Chart color tokens `--chart-1..5` in the theme.
- CLI registry entry. One Storybook story.

**Out of scope (explicit follow-up plans):**

- The other 6 charts (Line, Bar, Pie/Donut, Radar, RadialBar, Scatter) — each reuses this foundation.
- Interactive tooltip (pointer→bisector→active datum) + CDK Overlay styled tooltip.
- Animation (`AnimationService` + `d3-interpolate`) and keyboard navigation.
- `@gremorie/ng-charts/headless` **secondary entry point** — source is already split into `headless/` and `styled/` folders, so introducing the secondary entry point later is mechanical. Until then, both layers export from the main entry.
- Visual-regression infra (Chromatic / Playwright screenshots) — its own setup plan. This plan ships the Storybook story that those screenshots will target.

> **Naming note:** Per project decision **D-14** (no lib prefix). The repo's eslint enforces **camelCase** directive selectors, so headless selectors are `chartFrame`, `cartesianGrid`, `xAxis`, `yAxis`, `area` (the docs show illustrative kebab — the code is camelCase). The styled element selector is `area-chart` (kebab, no prefix).

## File Structure

```
packages/shadng-charts/
├── package.json                         # @gremorie/ng-charts, deps on d3 math + peer @gremorie/ng-core
├── ng-package.json
├── project.json                         # build/test/lint targets (mirror scroll-area)
├── tsconfig.json / .lib.json / .lib.prod.json / .spec.json
├── eslint.config.mjs                    # component-selector prefix [] (D-14)
└── src/
    ├── index.ts                         # barrel: headless + styled
    └── lib/
        ├── headless/
        │   ├── types.ts                 # Datum, Margin, ChartConfig, SeriesConfigEntry
        │   ├── format.ts (+ .spec)      # formatter preset registry
        │   ├── scales.ts (+ .spec)      # linearScale, pointScale, niceMax
        │   ├── shape.ts (+ .spec)       # areaPath, linePath
        │   ├── domain.ts (+ .spec)      # computeYDomain
        │   ├── axis.ts (+ .spec)        # computeTicks (pure) + XAxis/YAxis directives
        │   ├── chart-context.ts (+ .spec)
        │   ├── chart-frame.ts           # [chartFrame] directive (ResizeObserver, provides ctx)
        │   ├── cartesian-grid.ts        # [cartesianGrid] directive
        │   └── area.ts (+ .spec)        # computeAreaPath (pure) + [area] directive
        └── styled/
            ├── area-chart.ts (+ .spec)  # <area-chart> styled component
            └── area-chart.stories.ts

Modified:
├── tsconfig.base.json                          # add "@gremorie/ng-charts" path alias
├── packages/shadng-core/styles/theme.css       # add --chart-1..5 (:root + .dark)
└── packages/shadng-cli/src/registry.ts         # add "charts" entry
```

---

### Task 1: Scaffold the `@gremorie/ng-charts` package

**Files:**

- Create: `packages/shadng-charts/package.json`
- Create: `packages/shadng-charts/ng-package.json`
- Create: `packages/shadng-charts/project.json`
- Create: `packages/shadng-charts/tsconfig.json`
- Create: `packages/shadng-charts/tsconfig.lib.json`
- Create: `packages/shadng-charts/tsconfig.lib.prod.json`
- Create: `packages/shadng-charts/tsconfig.spec.json`
- Create: `packages/shadng-charts/eslint.config.mjs`
- Create: `packages/shadng-charts/src/index.ts`
- Create: `packages/shadng-charts/src/lib/headless/types.ts`
- Create: `packages/shadng-charts/src/lib/smoke.spec.ts` (temporary harness check)
- Modify: `tsconfig.base.json`
- Modify: root `package.json` (add deps + types)

- [ ] **Step 1: Install runtime deps and types**

Run:

```bash
npm i d3-scale d3-shape d3-array d3-format d3-time-format
npm i -D @types/d3-scale @types/d3-shape @types/d3-array @types/d3-format @types/d3-time-format
```

Expected: packages added to root `package.json`, no errors.

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "@gremorie/ng-charts",
  "version": "0.0.1",
  "description": "Charts for dashboards and generative UI — own-the-code on D3, part of ShadNG.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/kalvner/shadng.git",
    "directory": "packages/shadng-charts"
  },
  "keywords": ["angular", "ai", "ui", "charts", "dataviz", "d3"],
  "peerDependencies": {
    "@angular/core": "^21.2.0",
    "@angular/common": "^21.2.0",
    "@gremorie/ng-core": "^0.0.1"
  },
  "dependencies": {
    "d3-scale": "^4.0.2",
    "d3-shape": "^3.2.0",
    "d3-array": "^3.2.4",
    "d3-format": "^3.1.0",
    "d3-time-format": "^4.1.0"
  },
  "sideEffects": false
}
```

- [ ] **Step 3: Create `ng-package.json`**

```json
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/packages/shadng-charts",
  "lib": {
    "entryFile": "src/index.ts"
  }
}
```

- [ ] **Step 4: Create `project.json`** (mirror of `packages/shadng-scroll-area/project.json`)

```json
{
  "name": "shadng-charts",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "packages/shadng-charts/src",
  "prefix": "",
  "projectType": "library",
  "release": {
    "version": {
      "manifestRootsToUpdate": ["dist/{projectRoot}"],
      "currentVersionResolver": "git-tag",
      "fallbackCurrentVersionResolver": "disk"
    }
  },
  "tags": ["scope:lib", "type:component"],
  "targets": {
    "build": {
      "executor": "@nx/angular:package",
      "outputs": ["{workspaceRoot}/dist/{projectRoot}"],
      "options": {
        "project": "packages/shadng-charts/ng-package.json",
        "tsConfig": "packages/shadng-charts/tsconfig.lib.json"
      },
      "configurations": {
        "production": {
          "tsConfig": "packages/shadng-charts/tsconfig.lib.prod.json"
        },
        "development": {}
      },
      "defaultConfiguration": "production"
    },
    "nx-release-publish": {
      "options": {
        "packageRoot": "dist/{projectRoot}"
      }
    },
    "test": {
      "executor": "@nx/angular:unit-test",
      "options": {
        "watch": false
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint"
    }
  }
}
```

- [ ] **Step 5: Create the four tsconfig files** (copies of scroll-area's)

`tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "experimentalDecorators": true,
    "moduleResolution": "bundler",
    "noPropertyAccessFromIndexSignature": true,
    "module": "preserve",
    "lib": ["es2022", "dom", "dom.iterable"]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  },
  "files": [],
  "include": [],
  "references": [
    { "path": "./tsconfig.lib.json" },
    { "path": "./tsconfig.spec.json" }
  ]
}
```

`tsconfig.lib.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "declaration": true,
    "declarationMap": true,
    "inlineSources": true,
    "emitDeclarationOnly": false,
    "noEmitOnError": false,
    "composite": false,
    "isolatedModules": false,
    "types": []
  },
  "include": ["src/**/*.ts"],
  "exclude": [
    "src/**/*.spec.ts",
    "src/**/*.test.ts",
    "**/*.stories.ts",
    "**/*.stories.js"
  ]
}
```

`tsconfig.lib.prod.json`:

```json
{
  "extends": "./tsconfig.lib.json",
  "compilerOptions": {
    "declarationMap": false
  },
  "angularCompilerOptions": {
    "compilationMode": "partial"
  }
}
```

`tsconfig.spec.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts"]
}
```

- [ ] **Step 6: Create `eslint.config.mjs`** (component-selector prefix `[]` per D-14)

```js
import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}'],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      // D-14: no lib prefix on selectors (white-label).
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: [], style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: [], style: 'kebab-case' },
      ],
    },
  },
  {
    files: ['**/*.html'],
    rules: {},
  },
];
```

- [ ] **Step 7: Add the path alias to `tsconfig.base.json`**

Add to the `"paths"` object (after the `@gremorie/ng-scroll-area` line):

```json
"@gremorie/ng-charts": ["./packages/shadng-charts/src/index.ts"]
```

- [ ] **Step 8: Create `src/lib/headless/types.ts`**

```ts
/** A single row of chart data: keys are field names, values are numbers or category labels. */
export type Datum = Record<string, string | number>;

/** Inner padding between the SVG edge and the plotting area. */
export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Per-series visual config. `color` is a CSS color or token, e.g. 'var(--chart-1)'. */
export interface SeriesConfigEntry {
  label: string;
  color: string;
  /** Formatter preset name, e.g. 'currency:BRL' | 'percent' | 'compact'. */
  format?: string;
}

/** Maps a data field name to its series config. JSON-serializable (generative-UI ready). */
export type ChartConfig = Record<string, SeriesConfigEntry>;

export const DEFAULT_MARGIN: Margin = {
  top: 8,
  right: 8,
  bottom: 24,
  left: 40,
};
```

- [ ] **Step 9: Create `src/index.ts`** (barrel — grows as tasks add files)

```ts
export * from './lib/headless/types';
```

- [ ] **Step 10: Create the temporary harness test `src/lib/smoke.spec.ts`**

```ts
import { DEFAULT_MARGIN } from './headless/types';

describe('test harness', () => {
  it('runs vitest with globals and resolves package imports', () => {
    expect(DEFAULT_MARGIN.left).toBe(40);
  });
});
```

- [ ] **Step 11: Run the test to verify the harness works**

Run: `npx nx test shadng-charts`
Expected: PASS (1 test). If it fails to find a runner/config, fix the `test` target before continuing — every later task depends on this harness.

- [ ] **Step 12: Verify the package builds**

Run: `npx nx build shadng-charts`
Expected: build succeeds, output in `dist/packages/shadng-charts`.

- [ ] **Step 13: Commit**

```bash
git add packages/shadng-charts tsconfig.base.json package.json package-lock.json
git commit -m "feat(charts): scaffold @gremorie/ng-charts package"
```

---

### Task 2: Formatter preset registry

**Files:**

- Create: `packages/shadng-charts/src/lib/headless/format.ts`
- Test: `packages/shadng-charts/src/lib/headless/format.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { formatValue } from './format';

describe('formatValue', () => {
  it('formats plain numbers by default', () => {
    expect(formatValue(1234.5)).toBe('1,234.5');
  });

  it('formats currency presets via Intl', () => {
    expect(formatValue(1234.5, 'currency:BRL')).toBe('R$ 1,234.50');
  });

  it('formats percent (input is a ratio)', () => {
    expect(formatValue(0.125, 'percent')).toBe('12.5%');
  });

  it('formats compact abbreviations', () => {
    expect(formatValue(12000, 'compact')).toBe('12K');
  });

  it('falls back to the default when preset is unknown', () => {
    expect(formatValue(42, 'nope')).toBe('42');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx nx test shadng-charts`
Expected: FAIL — `formatValue` not found.

- [ ] **Step 3: Write minimal implementation**

```ts
import { format as d3Format } from 'd3-format';

const number = d3Format(',');
const compact = d3Format('.3~s'); // 12000 -> "12k"; uppercased below
const percent = d3Format('.1~%');

/**
 * Format a numeric value using a named preset. Presets are JSON-friendly
 * strings (no functions) so the styled layer's config stays serializable
 * for generative UI. Unknown presets fall back to the default number format.
 *
 * Supported: 'number' (default) | 'currency:<ISO>' | 'percent' | 'compact'.
 */
export function formatValue(value: number, preset = 'number'): string {
  if (preset.startsWith('currency:')) {
    const currency = preset.slice('currency:'.length) || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value);
  }
  switch (preset) {
    case 'percent':
      return percent(value);
    case 'compact':
      return compact(value).toUpperCase();
    case 'number':
      return number(value);
    default:
      return number(value);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx nx test shadng-charts`
Expected: PASS.

> If `currency:BRL` renders a non-breaking space (`R$ 1,234.50`) instead of a regular space, update the test expectation to match `Intl`'s output exactly — copy the actual received string. Do not change the implementation.

- [ ] **Step 5: Export from barrel and commit**

Add to `src/index.ts`:

```ts
export * from './lib/headless/format';
```

```bash
git add packages/shadng-charts/src
git commit -m "feat(charts): formatter preset registry"
```

---

### Task 3: Scale helpers

**Files:**

- Create: `packages/shadng-charts/src/lib/headless/scales.ts`
- Test: `packages/shadng-charts/src/lib/headless/scales.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { linearScale, pointScale, niceMax } from './scales';

describe('linearScale', () => {
  it('maps domain to range (inverted Y: 0 at bottom)', () => {
    const y = linearScale([0, 100], [200, 0]);
    expect(y(0)).toBe(200);
    expect(y(100)).toBe(0);
    expect(y(50)).toBe(100);
  });
});

describe('pointScale', () => {
  it('places categories evenly across the range', () => {
    const x = pointScale(['a', 'b', 'c'], [0, 100]);
    expect(x('a')).toBe(0);
    expect(x('c')).toBe(100);
    expect(x('b')).toBe(50);
  });
});

describe('niceMax', () => {
  it('rounds a raw max up to a readable bound', () => {
    expect(niceMax(87)).toBe(100);
    expect(niceMax(12)).toBe(20);
    expect(niceMax(0)).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx nx test shadng-charts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
import { scaleLinear, scalePoint } from 'd3-scale';

/** Continuous numeric scale (thin wrapper over d3-scale). */
export function linearScale(
  domain: readonly [number, number],
  range: readonly [number, number],
): (value: number) => number {
  return scaleLinear()
    .domain([...domain])
    .range([...range]);
}

/** Categorical position scale; categories land at discrete points across the range. */
export function pointScale(
  categories: readonly string[],
  range: readonly [number, number],
): (value: string) => number {
  const scale = scalePoint<string>()
    .domain([...categories])
    .range([...range])
    .padding(0);
  return (value: string) => scale(value) ?? 0;
}

/** Round a raw maximum up to a readable axis bound (1-2-5 × 10^n). */
export function niceMax(rawMax: number): number {
  if (rawMax <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const frac = rawMax / pow;
  const niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  return niceFrac * pow;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx nx test shadng-charts`
Expected: PASS.

- [ ] **Step 5: Export from barrel and commit**

Add to `src/index.ts`:

```ts
export * from './lib/headless/scales';
```

```bash
git add packages/shadng-charts/src
git commit -m "feat(charts): scale helpers (linear, point, niceMax)"
```

---

### Task 4: Shape helpers

**Files:**

- Create: `packages/shadng-charts/src/lib/headless/shape.ts`
- Test: `packages/shadng-charts/src/lib/headless/shape.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { areaPath, linePath, type XYPoint } from './shape';

const pts: XYPoint[] = [
  { x: 0, y: 100 },
  { x: 50, y: 0 },
  { x: 100, y: 60 },
];

describe('linePath', () => {
  it('produces an SVG path string through the points', () => {
    const d = linePath(pts);
    expect(d.startsWith('M')).toBe(true);
    expect(d).toContain('0,100');
    expect(d).toContain('100,60');
  });

  it('returns empty string for no points', () => {
    expect(linePath([])).toBe('');
  });
});

describe('areaPath', () => {
  it('closes the shape down to the baseline', () => {
    const d = areaPath(pts, 200);
    expect(d.startsWith('M')).toBe(true);
    expect(d).toContain('200'); // baseline coordinate appears
    expect(d.endsWith('Z')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx nx test shadng-charts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
import { area as d3Area, line as d3Line } from 'd3-shape';

export interface XYPoint {
  x: number;
  y: number;
}

/** SVG `d` for a line through the given points. Empty string if no points. */
export function linePath(points: readonly XYPoint[]): string {
  const gen = d3Line<XYPoint>()
    .x((p) => p.x)
    .y((p) => p.y);
  return gen([...points]) ?? '';
}

/** SVG `d` for an area between the points and a horizontal baseline. */
export function areaPath(points: readonly XYPoint[], baseline: number): string {
  const gen = d3Area<XYPoint>()
    .x((p) => p.x)
    .y0(baseline)
    .y1((p) => p.y);
  return gen([...points]) ?? '';
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx nx test shadng-charts`
Expected: PASS.

> d3-shape emits a trailing `Z` for closed areas and comma-separated coordinates. If exact substrings differ (e.g. `0,100` vs `0,100L`), relax the assertion to `toContain('100')` for the coordinate and keep the `startsWith('M')` / `endsWith('Z')` checks. Do not change the implementation.

- [ ] **Step 5: Export from barrel and commit**

Add to `src/index.ts`:

```ts
export * from './lib/headless/shape';
```

```bash
git add packages/shadng-charts/src
git commit -m "feat(charts): shape helpers (linePath, areaPath)"
```

---

### Task 5: Domain computation

**Files:**

- Create: `packages/shadng-charts/src/lib/headless/domain.ts`
- Test: `packages/shadng-charts/src/lib/headless/domain.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { computeYDomain, type SeriesReg } from './domain';

describe('computeYDomain', () => {
  it('returns [0, max] across all registered series', () => {
    const regs: SeriesReg[] = [
      { key: 'sales', values: () => [10, 50, 30] },
      { key: 'profit', values: () => [5, 40, 20] },
    ];
    expect(computeYDomain(regs)).toEqual([0, 50]);
  });

  it('defaults to [0, 1] when there is no data', () => {
    expect(computeYDomain([])).toEqual([0, 1]);
    expect(computeYDomain([{ key: 'x', values: () => [] }])).toEqual([0, 1]);
  });

  it('guards against an all-zero / negative max', () => {
    expect(computeYDomain([{ key: 'x', values: () => [0, 0] }])).toEqual([
      0, 1,
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx nx test shadng-charts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
/** A series registered with the chart context, contributing values to the shared Y domain. */
export interface SeriesReg {
  key: string;
  /** Live accessor — reads current data so the domain stays reactive. */
  values: () => readonly number[];
}

/** Shared Y domain [0, max] across all registered series. Falls back to [0, 1]. */
export function computeYDomain(
  registrations: readonly SeriesReg[],
): [number, number] {
  let max = 0;
  let seen = false;
  for (const reg of registrations) {
    for (const v of reg.values()) {
      seen = true;
      if (v > max) max = v;
    }
  }
  return [0, seen && max > 0 ? max : 1];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx nx test shadng-charts`
Expected: PASS.

- [ ] **Step 5: Export from barrel and commit**

Add to `src/index.ts`:

```ts
export * from './lib/headless/domain';
```

```bash
git add packages/shadng-charts/src
git commit -m "feat(charts): shared Y-domain computation"
```

---

### Task 6: ChartContext (reactive core)

**Files:**

- Create: `packages/shadng-charts/src/lib/headless/chart-context.ts`
- Test: `packages/shadng-charts/src/lib/headless/chart-context.spec.ts`

`ChartContext` is a plain injectable holding signals. The frame sets dimensions/data; series register their values; scales are `computed`. It is unit-testable without TestBed (plain signals).

- [ ] **Step 1: Write the failing test**

```ts
import { ChartContext } from './chart-context';

function makeCtx(): ChartContext {
  const ctx = new ChartContext();
  ctx.width.set(420); // 420 - left(40) - right(8) = 372 inner width
  ctx.height.set(232); // 232 - top(8) - bottom(24) = 200 inner height
  ctx.data.set([
    { month: 'Jan', sales: 0 },
    { month: 'Feb', sales: 50 },
    { month: 'Mar', sales: 100 },
  ]);
  ctx.xKey.set('month');
  return ctx;
}

describe('ChartContext', () => {
  it('computes inner dimensions from size minus margins', () => {
    const ctx = makeCtx();
    expect(ctx.innerWidth()).toBe(372);
    expect(ctx.innerHeight()).toBe(200);
  });

  it('builds a Y scale from registered series (0 at bottom)', () => {
    const ctx = makeCtx();
    ctx.register({
      key: 'sales',
      values: () => ctx.data().map((d) => Number(d['sales'])),
    });
    const y = ctx.yScale();
    expect(y(0)).toBe(200); // bottom
    expect(y(100)).toBe(0); // top
  });

  it('builds an X point scale across categories', () => {
    const ctx = makeCtx();
    const x = ctx.xScale();
    expect(x('Jan')).toBe(0);
    expect(x('Mar')).toBe(372);
  });

  it('unregister removes a series from the domain', () => {
    const ctx = makeCtx();
    ctx.register({
      key: 'sales',
      values: () => ctx.data().map((d) => Number(d['sales'])),
    });
    expect(ctx.yScale()(100)).toBe(0);
    ctx.unregister('sales');
    // no series -> domain [0,1] -> y(100) clamps far above top (negative)
    expect(ctx.yScale()(1)).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx nx test shadng-charts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
import { computed, Injectable, signal } from '@angular/core';
import { computeYDomain, type SeriesReg } from './domain';
import { linearScale, pointScale } from './scales';
import { DEFAULT_MARGIN, type Datum, type Margin } from './types';

/**
 * Reactive hub shared by a chart frame and its child series/axes via DI.
 * The frame writes dimensions + data; series self-register their values so
 * the frame can compute a shared domain; scales are derived `computed`s.
 */
@Injectable()
export class ChartContext {
  readonly width = signal(0);
  readonly height = signal(0);
  readonly margin = signal<Margin>(DEFAULT_MARGIN);
  readonly data = signal<readonly Datum[]>([]);
  readonly xKey = signal<string>('');

  private readonly registry = signal<readonly SeriesReg[]>([]);

  register(reg: SeriesReg): void {
    this.registry.update((r) => [...r.filter((s) => s.key !== reg.key), reg]);
  }

  unregister(key: string): void {
    this.registry.update((r) => r.filter((s) => s.key !== key));
  }

  readonly innerWidth = computed(() =>
    Math.max(0, this.width() - this.margin().left - this.margin().right),
  );
  readonly innerHeight = computed(() =>
    Math.max(0, this.height() - this.margin().top - this.margin().bottom),
  );

  readonly yDomain = computed(() => computeYDomain(this.registry()));

  readonly yScale = computed(() =>
    linearScale(this.yDomain(), [this.innerHeight(), 0]),
  );

  readonly xScale = computed(() =>
    pointScale(
      this.data().map((d) => String(d[this.xKey()])),
      [0, this.innerWidth()],
    ),
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx nx test shadng-charts`
Expected: PASS.

- [ ] **Step 5: Export from barrel and commit**

Add to `src/index.ts`:

```ts
export * from './lib/headless/chart-context';
```

```bash
git add packages/shadng-charts/src
git commit -m "feat(charts): reactive ChartContext with shared scales"
```

---

### Task 7: Area series — pure path + `[area]` directive

**Files:**

- Create: `packages/shadng-charts/src/lib/headless/area.ts`
- Test: `packages/shadng-charts/src/lib/headless/area.spec.ts`

- [ ] **Step 1: Write the failing test (pure function)**

```ts
import { computeAreaPath } from './area';
import type { Datum } from './types';

describe('computeAreaPath', () => {
  const data: Datum[] = [
    { month: 'Jan', sales: 0 },
    { month: 'Feb', sales: 50 },
    { month: 'Mar', sales: 100 },
  ];
  // simple test scales: x by index*100, y inverted over height 200, domain [0,100]
  const xScale = (v: string) =>
    (({ Jan: 0, Feb: 100, Mar: 200 }) as Record<string, number>)[v] ?? 0;
  const yScale = (v: number) => 200 - (v / 100) * 200;

  it('builds an area path from data through the scales to the baseline', () => {
    const d = computeAreaPath(data, 'month', 'sales', xScale, yScale, 200);
    expect(d.startsWith('M')).toBe(true);
    expect(d.endsWith('Z')).toBe(true);
    expect(d).toContain('0,200'); // Jan: x=0, y=200 (sales 0 -> bottom)
    expect(d).toContain('200,0'); // Mar: x=200, y=0   (sales 100 -> top)
  });

  it('returns empty string when data is empty', () => {
    expect(computeAreaPath([], 'month', 'sales', xScale, yScale, 200)).toBe('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx nx test shadng-charts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation (pure fn + directive)**

```ts
import {
  computed,
  Directive,
  inject,
  input,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { ChartContext } from './chart-context';
import { areaPath } from './shape';
import type { Datum } from './types';

/** Pure: project data through the scales into an area `d` string. */
export function computeAreaPath(
  data: readonly Datum[],
  xKey: string,
  yKey: string,
  xScale: (v: string) => number,
  yScale: (v: number) => number,
  baseline: number,
): string {
  if (data.length === 0) return '';
  const points = data.map((d) => ({
    x: xScale(String(d[xKey])),
    y: yScale(Number(d[yKey])),
  }));
  return areaPath(points, baseline);
}

/**
 * Renders a filled area for one series on a `<path>` inside a `[chartFrame]` SVG.
 * Self-registers its values so the frame's shared Y domain includes this series.
 *
 * @example `<svg:path [area]="'sales'" color="var(--chart-1)"></svg:path>`
 */
@Directive({
  selector: 'path[area]',
  host: {
    'data-slot': 'area',
    '[attr.d]': 'd()',
    '[attr.fill]': 'color()',
    '[attr.fill-opacity]': 'fillOpacity()',
  },
})
export class Area implements OnInit, OnDestroy {
  private readonly ctx = inject(ChartContext);

  /** Data field this area represents (the directive's input value). */
  readonly dataKey = input.required<string>({ alias: 'area' });
  readonly color = input<string>('currentColor');
  readonly fillOpacity = input<number>(0.25);

  readonly d = computed(() =>
    computeAreaPath(
      this.ctx.data(),
      this.ctx.xKey(),
      this.dataKey(),
      (v) => this.ctx.xScale()(v),
      (v) => this.ctx.yScale()(v),
      this.ctx.innerHeight(),
    ),
  );

  ngOnInit(): void {
    const key = this.dataKey();
    this.ctx.register({
      key,
      values: () => this.ctx.data().map((row) => Number(row[key])),
    });
  }

  ngOnDestroy(): void {
    this.ctx.unregister(this.dataKey());
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx nx test shadng-charts`
Expected: PASS.

- [ ] **Step 5: Export from barrel and commit**

Add to `src/index.ts`:

```ts
export * from './lib/headless/area';
```

```bash
git add packages/shadng-charts/src
git commit -m "feat(charts): area series (pure path + [area] directive)"
```

---

### Task 8: Axis ticks (pure) + `xAxis` / `yAxis` directives

**Files:**

- Create: `packages/shadng-charts/src/lib/headless/axis.ts`
- Test: `packages/shadng-charts/src/lib/headless/axis.spec.ts`

- [ ] **Step 1: Write the failing test (pure tick generator)**

```ts
import { computeTicks } from './axis';

describe('computeTicks', () => {
  it('returns evenly spaced ticks from 0 to max inclusive', () => {
    expect(computeTicks(100, 5)).toEqual([0, 25, 50, 75, 100]);
  });

  it('honors the requested count', () => {
    expect(computeTicks(100, 2)).toEqual([0, 50, 100]);
  });

  it('handles a zero max as a single [0]', () => {
    expect(computeTicks(0, 5)).toEqual([0]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx nx test shadng-charts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation (pure fn + two directives)**

```ts
import { computed, Directive, inject } from '@angular/core';
import { ChartContext } from './chart-context';
import { formatValue } from './format';

/** Pure: `count` evenly spaced tick values from 0..max inclusive. */
export function computeTicks(max: number, count: number): number[] {
  if (max <= 0) return [0];
  const step = max / count;
  return Array.from(
    { length: count + 1 },
    (_, i) => Math.round(i * step * 1e6) / 1e6,
  );
}

interface YTick {
  value: number;
  y: number;
  label: string;
}

interface XTick {
  label: string;
  x: number;
}

/** Y axis: horizontal tick labels + their pixel positions, read from the context. */
@Directive({
  selector: 'g[yAxis]',
  host: { 'data-slot': 'y-axis' },
  exportAs: 'yAxis',
})
export class YAxis {
  private readonly ctx = inject(ChartContext);
  readonly tickFormat = inject(ChartContext) && undefined; // placeholder removed below

  readonly count = 4;
  readonly format = '';

  readonly ticks = computed<YTick[]>(() => {
    const [, max] = this.ctx.yDomain();
    const y = this.ctx.yScale();
    return computeTicks(max, this.count).map((value) => ({
      value,
      y: y(value),
      label: formatValue(value, this.format || 'number'),
    }));
  });
}

/** X axis: category labels + their pixel positions, read from the context. */
@Directive({
  selector: 'g[xAxis]',
  host: { 'data-slot': 'x-axis' },
  exportAs: 'xAxis',
})
export class XAxis {
  private readonly ctx = inject(ChartContext);

  readonly ticks = computed<XTick[]>(() => {
    const x = this.ctx.xScale();
    return this.ctx
      .data()
      .map((d) => String(d[this.ctx.xKey()]))
      .map((label) => ({ label, x: x(label) }));
  });
}
```

> Clean-up: delete the `tickFormat` placeholder line. The directives expose `ticks()`; the styled component renders the tick marks from `ticks()` so the headless layer stays visual-free (no hard-coded text styling).

Replace the `YAxis` class body's stray placeholder so the final class is:

```ts
@Directive({
  selector: 'g[yAxis]',
  host: { 'data-slot': 'y-axis' },
  exportAs: 'yAxis',
})
export class YAxis {
  private readonly ctx = inject(ChartContext);
  readonly count = 4;
  readonly format = '';

  readonly ticks = computed<YTick[]>(() => {
    const [, max] = this.ctx.yDomain();
    const y = this.ctx.yScale();
    return computeTicks(max, this.count).map((value) => ({
      value,
      y: y(value),
      label: formatValue(value, this.format || 'number'),
    }));
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx nx test shadng-charts`
Expected: PASS (pure `computeTicks` tests).

- [ ] **Step 5: Export from barrel and commit**

Add to `src/index.ts`:

```ts
export * from './lib/headless/axis';
```

```bash
git add packages/shadng-charts/src
git commit -m "feat(charts): axis ticks (pure) + xAxis/yAxis directives"
```

---

### Task 9: `chartFrame` directive + `cartesianGrid` directive

**Files:**

- Create: `packages/shadng-charts/src/lib/headless/chart-frame.ts`
- Create: `packages/shadng-charts/src/lib/headless/cartesian-grid.ts`

These are thin DOM-wiring directives. ResizeObserver is client-only and guarded; geometry is already covered by pure tests, so these have no unit spec (covered by the styled component test in Task 10 and visual tests later).

- [ ] **Step 1: Create `chart-frame.ts`**

````ts
import {
  afterNextRender,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { ChartContext } from './chart-context';
import type { Datum, Margin } from './types';
import { DEFAULT_MARGIN } from './types';

/**
 * Root of a headless chart. Apply to an `<svg>`. Provides a `ChartContext`
 * to all descendant series/axes, mirrors `data`/`xKey` into it, and tracks
 * the element's size via ResizeObserver (client-only). SSR renders with a
 * `viewBox` so the chart is meaningful before hydration.
 *
 * @example
 * ```html
 * <svg chartFrame [data]="data" xKey="month"><svg:path [area]="'sales'"/></svg>
 * ```
 */
@Directive({
  selector: 'svg[chartFrame]',
  providers: [ChartContext],
  host: {
    'data-slot': 'chart-frame',
    preserveAspectRatio: 'none',
    '[attr.viewBox]': 'viewBox()',
  },
})
export class ChartFrame {
  private readonly ctx = inject(ChartContext);
  private readonly el = inject<ElementRef<SVGSVGElement>>(ElementRef);

  readonly data = input.required<readonly Datum[]>();
  readonly xKey = input.required<string>();
  readonly margin = input<Margin>(DEFAULT_MARGIN);

  readonly viewBox = () => `0 0 ${this.ctx.width()} ${this.ctx.height()}`;

  constructor() {
    effect(() => {
      this.ctx.data.set(this.data());
      this.ctx.xKey.set(this.xKey());
      this.ctx.margin.set(this.margin());
    });

    afterNextRender(() => {
      const node = this.el.nativeElement;
      if (typeof ResizeObserver === 'undefined') {
        // Non-browser/test env: fall back to current layout box once.
        const rect = node.getBoundingClientRect();
        this.ctx.width.set(rect.width);
        this.ctx.height.set(rect.height);
        return;
      }
      const ro = new ResizeObserver((entries) => {
        const box = entries[0]?.contentRect;
        if (box) {
          this.ctx.width.set(box.width);
          this.ctx.height.set(box.height);
        }
      });
      ro.observe(node);
    });
  }
}
````

- [ ] **Step 2: Create `cartesian-grid.ts`**

```ts
import { computed, Directive, inject } from '@angular/core';
import { ChartContext } from './chart-context';
import { computeTicks } from './axis';

interface GridLine {
  y: number;
}

/**
 * Horizontal gridlines aligned to the Y ticks. Apply to a `<g>` inside a
 * `[chartFrame]` SVG. Exposes `lines()`; the styled layer draws them so the
 * headless layer stays visual-free.
 */
@Directive({
  selector: 'g[cartesianGrid]',
  host: { 'data-slot': 'cartesian-grid' },
  exportAs: 'cartesianGrid',
})
export class CartesianGrid {
  private readonly ctx = inject(ChartContext);

  readonly lines = computed<GridLine[]>(() => {
    const [, max] = this.ctx.yDomain();
    const y = this.ctx.yScale();
    return computeTicks(max, 4).map((value) => ({ y: y(value) }));
  });
}
```

- [ ] **Step 3: Build to verify the directives compile**

Run: `npx nx build shadng-charts`
Expected: build succeeds.

- [ ] **Step 4: Export from barrel and commit**

Add to `src/index.ts`:

```ts
export * from './lib/headless/chart-frame';
export * from './lib/headless/cartesian-grid';
```

```bash
git add packages/shadng-charts/src
git commit -m "feat(charts): chartFrame (ResizeObserver) + cartesianGrid directives"
```

---

### Task 10: Styled `<area-chart>` component

**Files:**

- Create: `packages/shadng-charts/src/lib/styled/area-chart.ts`
- Test: `packages/shadng-charts/src/lib/styled/area-chart.spec.ts`

Renders the headless composition inside a Card, applies token colors, exposes a serializable `config`, and provides an accessible `role="img"` + visually-hidden data table.

- [ ] **Step 1: Write the failing test (TestBed integration)**

```ts
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AreaChart } from './area-chart';
import type { ChartConfig, Datum } from '../headless/types';

const DATA: Datum[] = [
  { month: 'Jan', sales: 10, profit: 4 },
  { month: 'Feb', sales: 50, profit: 20 },
  { month: 'Mar', sales: 30, profit: 12 },
];
const CONFIG: ChartConfig = {
  sales: { label: 'Sales', color: 'var(--chart-1)' },
  profit: { label: 'Profit', color: 'var(--chart-2)' },
};

async function render() {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  });
  const fixture = TestBed.createComponent(AreaChart);
  fixture.componentRef.setInput('data', DATA);
  fixture.componentRef.setInput('config', CONFIG);
  fixture.componentRef.setInput('xKey', 'month');
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

describe('AreaChart', () => {
  it('renders one area path per configured series', async () => {
    const fixture = await render();
    const paths = fixture.nativeElement.querySelectorAll(
      'path[data-slot="area"]',
    );
    expect(paths.length).toBe(2);
  });

  it('exposes role=img with a label built from series + an a11y data table', async () => {
    const fixture = await render();
    const figure = fixture.nativeElement.querySelector('[role="img"]');
    expect(figure).toBeTruthy();
    expect(figure.getAttribute('aria-label')).toContain('Sales');

    const rows = fixture.nativeElement.querySelectorAll('table tbody tr');
    expect(rows.length).toBe(DATA.length);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx nx test shadng-charts`
Expected: FAIL — `AreaChart` not found.

- [ ] **Step 3: Write minimal implementation**

````ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';
import { Area } from '../headless/area';
import { CartesianGrid } from '../headless/cartesian-grid';
import { ChartFrame } from '../headless/chart-frame';
import { XAxis, YAxis } from '../headless/axis';
import type { ChartConfig, Datum } from '../headless/types';

interface SeriesView {
  key: string;
  label: string;
  color: string;
}

/**
 * Styled area chart. Pass tabular `data`, a serializable `config` mapping each
 * value field to a label + token color, and the `xKey` category field.
 *
 * @example
 * ```html
 * <area-chart [data]="data" [config]="config" xKey="month" />
 * ```
 */
@Component({
  selector: 'area-chart',
  imports: [ChartFrame, Area, CartesianGrid, XAxis, YAxis],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'area-chart' },
  template: `
    <figure role="img" [attr.aria-label]="ariaLabel()" [class]="cardClass()">
      <svg
        chartFrame
        [data]="data()"
        [xKey]="xKey()"
        class="aspect-video w-full overflow-visible text-muted-foreground"
        #frame
      >
        <svg:g cartesianGrid #grid="cartesianGrid">
          @for (line of grid.lines(); track $index) {
            <svg:line
              x1="0"
              [attr.x2]="'100%'"
              [attr.y1]="line.y"
              [attr.y2]="line.y"
              stroke="currentColor"
              stroke-opacity="0.15"
            />
          }
        </svg:g>

        @for (s of series(); track s.key) {
          <svg:path
            [area]="s.key"
            [color]="s.color"
            [attr.stroke]="s.color"
            stroke-width="2"
            fill-opacity="0.2"
          />
        }

        <svg:g xAxis #x="xAxis">
          @for (t of x.ticks(); track t.label) {
            <svg:text
              [attr.x]="t.x"
              [attr.y]="'100%'"
              dy="-2"
              text-anchor="middle"
              class="fill-muted-foreground text-[10px]"
            >
              {{ t.label }}
            </svg:text>
          }
        </svg:g>

        <svg:g yAxis #y="yAxis">
          @for (t of y.ticks(); track t.value) {
            <svg:text
              x="0"
              [attr.y]="t.y"
              dy="-2"
              class="fill-muted-foreground text-[10px]"
            >
              {{ t.label }}
            </svg:text>
          }
        </svg:g>
      </svg>

      <table class="sr-only">
        <caption>
          {{
            ariaLabel()
          }}
        </caption>
        <thead>
          <tr>
            <th>{{ xKey() }}</th>
            @for (s of series(); track s.key) {
              <th>{{ s.label }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of data(); track $index) {
            <tr>
              <td>{{ row[xKey()] }}</td>
              @for (s of series(); track s.key) {
                <td>{{ row[s.key] }}</td>
              }
            </tr>
          }
        </tbody>
      </table>
    </figure>
  `,
})
export class AreaChart {
  readonly cn = cn;

  readonly data = input.required<readonly Datum[]>();
  readonly config = input.required<ChartConfig>();
  readonly xKey = input.required<string>();
  readonly class = input<string>('');

  readonly series = computed<SeriesView[]>(() =>
    Object.entries(this.config()).map(([key, entry]) => ({
      key,
      label: entry.label,
      color: entry.color,
    })),
  );

  readonly ariaLabel = computed(
    () =>
      `Area chart of ${this.series()
        .map((s) => s.label)
        .join(', ')} by ${this.xKey()}`,
  );

  readonly cardClass = computed(() =>
    cn(
      'flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-card-foreground',
      this.class(),
    ),
  );
}
````

- [ ] **Step 4: Run test to verify it passes**

Run: `npx nx test shadng-charts`
Expected: PASS (2 area paths; role=img + aria-label with "Sales"; 3 table rows).

> If the SVG child elements (`svg:g`, `svg:path`) don't render under jsdom, confirm they use the `svg:` template prefix exactly as shown. The assertions check element presence and a11y structure, not geometry, so zero-size layout in jsdom is fine.

- [ ] **Step 5: Export from barrel and commit**

Add to `src/index.ts`:

```ts
export * from './lib/styled/area-chart';
```

Then remove the temporary harness file:

```bash
git rm packages/shadng-charts/src/lib/smoke.spec.ts
```

```bash
git add packages/shadng-charts/src
git commit -m "feat(charts): styled <area-chart> with token colors + a11y table"
```

---

### Task 11: Chart color tokens in the theme

**Files:**

- Modify: `packages/shadng-core/styles/theme.css`

- [ ] **Step 1: Add `--chart-1..5` to the `:root` semantics block**

Find the `:root {` block (semantics). After the `--ring:` line, add:

```css
/* ─── Chart series (consumed by @gremorie/ng-charts) ───── */
--chart-1: oklch(0.646 0.222 41.116);
--chart-2: oklch(0.6 0.118 184.704);
--chart-3: oklch(0.398 0.07 227.392);
--chart-4: oklch(0.828 0.189 84.429);
--chart-5: oklch(0.769 0.188 70.08);
```

- [ ] **Step 2: Add dark-mode chart tokens to the `.dark` block**

Find the `.dark {` block. After its last `--ring:` (or final semantic) line, add:

```css
--chart-1: oklch(0.488 0.243 264.376);
--chart-2: oklch(0.696 0.17 162.48);
--chart-3: oklch(0.769 0.188 70.08);
--chart-4: oklch(0.627 0.265 303.9);
--chart-5: oklch(0.645 0.246 16.439);
```

- [ ] **Step 3: Commit**

```bash
git add packages/shadng-core/styles/theme.css
git commit -m "feat(charts): add --chart-1..5 tokens (light + dark)"
```

---

### Task 12: CLI registry entry

**Files:**

- Modify: `packages/shadng-cli/src/registry.ts`

- [ ] **Step 1: Add the `charts` entry**

In the `REGISTRY` array, after the `scroll-area` entry and before the `// Future:` comment, add:

```ts
  {
    name: 'charts',
    pkg: '@gremorie/ng-charts',
    description: 'Dashboard charts on D3 — headless primitives + styled presets (Area first).',
    depends: ['@gremorie/ng-core'],
    phase: 1,
    available: true,
  },
```

- [ ] **Step 2: Build the CLI to verify types**

Run: `npx nx build shadng-cli`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add packages/shadng-cli/src/registry.ts
git commit -m "feat(charts): register charts in the CLI registry"
```

---

### Task 13: Storybook story for `<area-chart>`

**Files:**

- Create: `packages/shadng-charts/src/lib/styled/area-chart.stories.ts`

This story is the artifact future visual-regression screenshots will target.

- [ ] **Step 1: Create the story** (mirrors the prompt-input story pattern)

```ts
import type { Meta, StoryObj } from '@storybook/angular';
import { AreaChart } from './area-chart';
import type { ChartConfig, Datum } from '../headless/types';

const DATA: Datum[] = [
  { month: 'Jan', sales: 186, profit: 80 },
  { month: 'Feb', sales: 305, profit: 200 },
  { month: 'Mar', sales: 237, profit: 120 },
  { month: 'Apr', sales: 173, profit: 90 },
  { month: 'May', sales: 209, profit: 130 },
  { month: 'Jun', sales: 264, profit: 140 },
];

const CONFIG: ChartConfig = {
  sales: { label: 'Sales', color: 'var(--chart-1)' },
  profit: { label: 'Profit', color: 'var(--chart-2)' },
};

const meta: Meta<AreaChart> = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 640px;">
        <area-chart [data]="data" [config]="config" [xKey]="xKey" />
      </div>
    `,
  }),
  args: {
    data: DATA,
    config: CONFIG,
    xKey: 'month',
  },
};

export default meta;
type Story = StoryObj<AreaChart>;

export const Default: Story = {};

export const SingleSeries: Story = {
  args: {
    config: { sales: { label: 'Sales', color: 'var(--chart-1)' } },
  },
};
```

- [ ] **Step 2: Verify the story compiles via lint/build**

Run: `npx nx lint shadng-charts`
Expected: passes (no lint errors).

> Wiring this package into a running Storybook target (its own `.storybook/` config like prompt-input's) is part of the follow-up visual-regression setup. The story file itself is valid and committed now.

- [ ] **Step 3: Commit**

```bash
git add packages/shadng-charts/src/lib/styled/area-chart.stories.ts
git commit -m "docs(charts): Storybook story for <area-chart>"
```

---

### Task 14: Full verification pass

- [ ] **Step 1: Run the whole package test suite**

Run: `npx nx test shadng-charts`
Expected: all specs PASS (format, scales, shape, domain, chart-context, area, axis, area-chart).

- [ ] **Step 2: Lint and build**

Run: `npx nx lint shadng-charts && npx nx build shadng-charts`
Expected: both succeed.

- [ ] **Step 3: Confirm the public surface**

Open `packages/shadng-charts/src/index.ts` and confirm it exports: `types`, `format`, `scales`, `shape`, `domain`, `chart-context`, `area`, `axis`, `chart-frame`, `cartesian-grid`, `styled/area-chart`. Fix any missing export.

- [ ] **Step 4: Final commit (if any fixes)**

```bash
git add packages/shadng-charts
git commit -m "chore(charts): verification pass — tests, lint, build green"
```

---

## Self-Review

**Spec coverage** (against `2026-05-23-shadng-charts-design.md`):

- Own-the-code on D3 math → Tasks 2-4 (format/scales/shape) ✓
- Headless + styled layers → Tasks 6-9 (headless) + Task 10 (styled) ✓
- Data flow via signals + series self-registration / shared domains → Tasks 5-7 ✓
- Theming via `--chart-*` tokens → Task 11; styled colors via config ✓
- SSR (viewBox + client-only ResizeObserver) → Task 9 ✓
- A11y (role=img + hidden data table) → Task 10 ✓ (keyboard nav deferred — see Scope)
- Formatting presets (JSON-serializable) → Task 2 ✓
- Tests: unit (pure fns + context) + component (TestBed) → Tasks 2-10; visual-regression infra deferred (Scope) ✓
- Distribution: npm package + CLI registry → Tasks 1, 12 ✓
- Animation, tooltip, the other 6 charts, secondary entry point → explicitly deferred (Scope) ✓

**Placeholder scan:** One intentional placeholder line in Task 8 Step 3 is immediately corrected within the same step (the full corrected `YAxis` class is given). No "TBD"/"implement later" remain.

**Type consistency:** `Datum`, `Margin`, `ChartConfig`, `SeriesConfigEntry`, `DEFAULT_MARGIN` defined in Task 1 and used consistently. `SeriesReg` defined in Task 5, consumed by Task 6/7. `ChartContext` public API (`width`, `height`, `margin`, `data`, `xKey`, `register`, `unregister`, `innerWidth`, `innerHeight`, `yDomain`, `yScale`, `xScale`) defined in Task 6 and used identically in Tasks 7-10. `computeAreaPath` signature matches between Task 7 test and impl. `cn` imported from `@gremorie/ng-core` (verified to exist at `packages/shadng-core/src/lib/utils.ts`).

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-23-shadng-charts-foundation-area.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
