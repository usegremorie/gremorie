import type { ItemConfig } from './types.js';

/**
 * The list of registry items to generate. One entry per package — sub-components
 * ship as files inside `files[]` rather than as separate items, mirroring how
 * the Angular barrel `index.ts` exposes them.
 *
 * The generator reads each `packageRoot/src/lib/*.ts` referenced here and
 * embeds the content in the emitted JSON. Each item gets a co-located
 * `usage.md` (or a placeholder when missing) read from `<packageRoot>/usage.md`.
 */
export const ITEMS: ItemConfig[] = [
  {
    name: 'ng-core',
    framework: 'ng',
    title: 'Core',
    description:
      'Shared utilities, design tokens, and the Button primitive.',
    categories: ['core', 'primitives'],
    packageRoot: 'packages/ng-core',
    sourceFiles: ['src/lib/utils.ts', 'src/lib/button.ts', 'src/index.ts'],
    assetFiles: ['styles/theme.css'],
    targetPrefix: 'src/app/gremorie/core',
    dependencies: [
      '@angular/core',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
    registryDependencies: [],
  },
  {
    name: 'ng-attachments',
    framework: 'ng',
    title: 'Attachments',
    description:
      'Composable attachment list with grid, inline, and list variants. Built on top of ng-core.',
    categories: ['ai', 'forms'],
    packageRoot: 'packages/ng-attachments',
    sourceFiles: [
      'src/lib/attachment.types.ts',
      'src/lib/attachment.utils.ts',
      'src/lib/attachment-empty.ts',
      'src/lib/attachment-info.ts',
      'src/lib/attachment-item.ts',
      'src/lib/attachment-list.ts',
      'src/lib/attachment-name.ts',
      'src/lib/attachment-preview.ts',
      'src/lib/attachment-remove.ts',
      'src/lib/attachment-size.ts',
      'src/index.ts',
    ],
    targetPrefix: 'src/app/gremorie/attachments',
    dependencies: ['@angular/core', '@angular/common', 'class-variance-authority'],
    registryDependencies: ['ng-core'],
  },
  {
    name: 'ng-prompt-input',
    framework: 'ng',
    title: 'Prompt Input',
    description:
      'Prompt input family with state machine, drag-drop, and submit. The cornerstone of any AI chat surface.',
    categories: ['ai', 'forms'],
    packageRoot: 'packages/ng-prompt-input',
    sourceFiles: [
      'src/lib/prompt-input.types.ts',
      'src/lib/prompt-input.ts',
      'src/lib/prompt-input-textarea.ts',
      'src/lib/prompt-input-submit.ts',
      'src/lib/prompt-input-toolbar.ts',
      'src/lib/prompt-input-tools.ts',
      'src/lib/prompt-input-action-menu.ts',
      'src/lib/prompt-input-model-select.ts',
      'src/index.ts',
    ],
    targetPrefix: 'src/app/gremorie/prompt-input',
    dependencies: ['@angular/core', 'class-variance-authority'],
    registryDependencies: ['ng-core', 'ng-attachments'],
  },
  {
    name: 'ng-scroll-area',
    framework: 'ng',
    title: 'Scroll Area',
    description:
      'Design-system styled scrollbar — wrapper over ngx-scrollbar with the Gremorie look.',
    categories: ['layout'],
    packageRoot: 'packages/ng-scroll-area',
    sourceFiles: ['src/lib/scroll-area.ts', 'src/index.ts'],
    targetPrefix: 'src/app/gremorie/scroll-area',
    dependencies: ['@angular/core', 'ngx-scrollbar'],
    registryDependencies: [],
  },
  {
    name: 'ng-charts',
    framework: 'ng',
    title: 'Charts',
    description:
      'Charts for dashboards and generative UI. Headless primitives plus styled presets (area, line, bar, scatter, pie, radar, radial) on D3.',
    categories: ['ai', 'data', 'charts'],
    packageRoot: 'packages/ng-charts',
    sourceFiles: [
      'src/lib/headless/types.ts',
      'src/lib/headless/format.ts',
      'src/lib/headless/scales.ts',
      'src/lib/headless/shape.ts',
      'src/lib/headless/domain.ts',
      'src/lib/headless/chart-context.ts',
      'src/lib/headless/area.ts',
      'src/lib/headless/line.ts',
      'src/lib/headless/bar.ts',
      'src/lib/headless/scatter.ts',
      'src/lib/headless/polar.ts',
      'src/lib/headless/pie.ts',
      'src/lib/headless/radar.ts',
      'src/lib/headless/radial-bar.ts',
      'src/lib/headless/axis.ts',
      'src/lib/headless/chart-frame.ts',
      'src/lib/headless/cartesian-grid.ts',
      'src/lib/styled/area-chart.ts',
      'src/lib/styled/line-chart.ts',
      'src/lib/styled/bar-chart.ts',
      'src/lib/styled/scatter-chart.ts',
      'src/lib/styled/pie-chart.ts',
      'src/lib/styled/radar-chart.ts',
      'src/lib/styled/radial-chart.ts',
      'src/index.ts',
    ],
    targetPrefix: 'src/app/gremorie/charts',
    dependencies: [
      '@angular/core',
      'd3-scale',
      'd3-shape',
      'd3-format',
    ],
    registryDependencies: ['ng-core'],
  },
];
