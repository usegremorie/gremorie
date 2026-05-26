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
    name: 'ng-ai',
    framework: 'ng',
    title: 'AI (Angular)',
    description:
      'AI primitives for Angular - PromptInput family with state machine and drag-drop, plus composable Attachments parts. The cornerstone of any AI chat surface.',
    categories: ['ai', 'forms'],
    packageRoot: 'packages/ng-ai',
    sourceFiles: [
      'src/lib/attachments/attachment.types.ts',
      'src/lib/attachments/attachment.utils.ts',
      'src/lib/attachments/attachment-empty.ts',
      'src/lib/attachments/attachment-info.ts',
      'src/lib/attachments/attachment-item.ts',
      'src/lib/attachments/attachment-list.ts',
      'src/lib/attachments/attachment-name.ts',
      'src/lib/attachments/attachment-preview.ts',
      'src/lib/attachments/attachment-remove.ts',
      'src/lib/attachments/attachment-size.ts',
      'src/lib/prompt-input/prompt-input.types.ts',
      'src/lib/prompt-input/prompt-input.ts',
      'src/lib/prompt-input/prompt-input-textarea.ts',
      'src/lib/prompt-input/prompt-input-submit.ts',
      'src/lib/prompt-input/prompt-input-toolbar.ts',
      'src/lib/prompt-input/prompt-input-tools.ts',
      'src/lib/prompt-input/prompt-input-action-menu.ts',
      'src/lib/prompt-input/prompt-input-model-select.ts',
      'src/index.ts',
    ],
    targetPrefix: 'src/app/gremorie/ai',
    dependencies: [
      '@angular/core',
      '@angular/common',
      'class-variance-authority',
    ],
    registryDependencies: ['ng-core'],
  },
  {
    name: 'ng-containers',
    framework: 'ng',
    title: 'Containers (Angular)',
    description:
      'Container primitives - ScrollArea wrapper over ngx-scrollbar styled to match Gremorie.',
    categories: ['containers', 'layout'],
    packageRoot: 'packages/ng-containers',
    sourceFiles: ['src/lib/scroll-area/scroll-area.ts', 'src/index.ts'],
    targetPrefix: 'src/app/gremorie/containers',
    dependencies: ['@angular/core', 'ngx-scrollbar'],
    registryDependencies: [],
  },
  {
    name: 'ng-data',
    framework: 'ng',
    title: 'Data (Angular)',
    description:
      'Data visualisation primitives - charts on D3, headless plus styled presets (area, line, bar, scatter, pie, radar, radial).',
    categories: ['data', 'charts'],
    packageRoot: 'packages/ng-data',
    sourceFiles: [
      'src/lib/charts/headless/types.ts',
      'src/lib/charts/headless/format.ts',
      'src/lib/charts/headless/scales.ts',
      'src/lib/charts/headless/shape.ts',
      'src/lib/charts/headless/domain.ts',
      'src/lib/charts/headless/chart-context.ts',
      'src/lib/charts/headless/area.ts',
      'src/lib/charts/headless/line.ts',
      'src/lib/charts/headless/bar.ts',
      'src/lib/charts/headless/scatter.ts',
      'src/lib/charts/headless/polar.ts',
      'src/lib/charts/headless/pie.ts',
      'src/lib/charts/headless/radar.ts',
      'src/lib/charts/headless/radial-bar.ts',
      'src/lib/charts/headless/axis.ts',
      'src/lib/charts/headless/chart-frame.ts',
      'src/lib/charts/headless/cartesian-grid.ts',
      'src/lib/charts/styled/area-chart.ts',
      'src/lib/charts/styled/line-chart.ts',
      'src/lib/charts/styled/bar-chart.ts',
      'src/lib/charts/styled/scatter-chart.ts',
      'src/lib/charts/styled/pie-chart.ts',
      'src/lib/charts/styled/radar-chart.ts',
      'src/lib/charts/styled/radial-chart.ts',
      'src/index.ts',
    ],
    targetPrefix: 'src/app/gremorie/data',
    dependencies: ['@angular/core', 'd3-scale', 'd3-shape', 'd3-format'],
    registryDependencies: ['ng-core'],
  },
  {
    name: 'rx-core',
    framework: 'react',
    title: 'Core (React)',
    description:
      'React cross-category utilities - cn() helper for class name merging with Tailwind conflict resolution.',
    categories: ['core', 'primitives'],
    packageRoot: 'packages/rx-core',
    sourceFiles: ['src/lib/utils.ts', 'src/index.ts'],
    targetPrefix: 'src/components/gremorie/core',
    dependencies: ['react', 'clsx', 'tailwind-merge'],
    registryDependencies: [],
  },
  {
    name: 'rx-ai',
    framework: 'react',
    title: 'AI (React)',
    description:
      'React AI primitives - PromptInput family with state machine and drag-drop (pilot edition). Cornerstone of any AI chat surface.',
    categories: ['ai', 'forms'],
    packageRoot: 'packages/rx-ai',
    sourceFiles: [
      'src/lib/prompt-input/prompt-input.tsx',
      'src/lib/prompt-input/index.ts',
      'src/index.ts',
    ],
    targetPrefix: 'src/components/gremorie/ai',
    dependencies: ['react', 'react-dom'],
    registryDependencies: ['rx-core'],
  },
];
