import type { ItemConfig } from './types.js';

/**
 * The list of registry items to generate.
 *
 * Granularity rule (shadcn-style): 1 item = 1 primitive (or a tight family of
 * sub-components that ALWAYS ship together). The npm packages stay as bundle
 * dist outputs (`@gremorie/ng-ai`, `@gremorie/ng-data`); the registry exposes
 * the same source per-primitive so consumers can `gremorie add ng-button`
 * without pulling in PromptInput.
 *
 * For Angular charts: a shared `ng-chart` base item carries the headless
 * primitives (chart-context, scales, axis, etc. plus all shape helpers).
 * Each styled chart (`ng-area-chart`, `ng-line-chart`, ...) ships only its
 * own styled wrapper and depends on `ng-chart` for the rest.
 *
 * `srcStrip` controls how source paths land in the consumer project. Using
 * the right value yields semantic target paths like
 * `src/app/gremorie/ai/prompt-input/prompt-input.ts` instead of the noisier
 * `src/app/gremorie/ai/lib/prompt-input/prompt-input.ts`.
 */
export const ITEMS: ItemConfig[] = [
  // ---------------------------------------------------------------------------
  // Angular: utilities & core primitives
  // ---------------------------------------------------------------------------
  {
    name: 'ng-utils',
    framework: 'ng',
    title: 'Utils (Angular)',
    description:
      'Shared utilities for the Angular edition - cn() helper that merges Tailwind class names with conflict resolution (clsx + tailwind-merge).',
    categories: ['core', 'utils'],
    packageRoot: 'packages/ng-core',
    sourceFiles: ['src/lib/utils.ts'],
    assetFiles: ['styles/theme.css'],
    targetPrefix: 'src/app/gremorie/utils',
    srcStrip: 'src/lib/',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: [],
  },
  {
    name: 'ng-button',
    framework: 'ng',
    title: 'Button (Angular)',
    description:
      'Button primitive for the Angular edition - 6 variants x 4 sizes, mirrors the shadcn/ui Button surface.',
    categories: ['core', 'primitives', 'forms'],
    packageRoot: 'packages/ng-core',
    sourceFiles: ['src/lib/button.ts'],
    targetPrefix: 'src/app/gremorie/button',
    srcStrip: 'src/lib/',
    dependencies: ['@angular/core', 'class-variance-authority'],
    registryDependencies: ['ng-utils'],
  },

  // ---------------------------------------------------------------------------
  // Angular: containers
  // ---------------------------------------------------------------------------
  {
    name: 'ng-scroll-area',
    framework: 'ng',
    title: 'Scroll Area (Angular)',
    description:
      'Thin design-system styling layer over ngx-scrollbar - overlay scrollbars with Gremorie tokens (thin, rounded, --border-colored thumb).',
    categories: ['containers', 'layout'],
    packageRoot: 'packages/ng-containers',
    sourceFiles: ['src/lib/scroll-area/scroll-area.ts'],
    targetPrefix: 'src/app/gremorie/scroll-area',
    srcStrip: 'src/lib/scroll-area/',
    dependencies: ['@angular/core', 'ngx-scrollbar'],
    registryDependencies: [],
  },

  // ---------------------------------------------------------------------------
  // Angular: AI primitives
  // ---------------------------------------------------------------------------
  {
    name: 'ng-attachments',
    framework: 'ng',
    title: 'Attachments (Angular)',
    description:
      'Composable Attachment* family - List, Item, Preview, Info, Name, Size, Remove, Empty - plus type and util files. Lays out file attachments for chat surfaces.',
    categories: ['ai', 'forms', 'media'],
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
    ],
    targetPrefix: 'src/app/gremorie/ai/attachments',
    srcStrip: 'src/lib/attachments/',
    dependencies: [
      '@angular/core',
      '@angular/common',
      'class-variance-authority',
    ],
    registryDependencies: [],
  },
  {
    name: 'ng-prompt-input',
    framework: 'ng',
    title: 'Prompt Input (Angular)',
    description:
      'PromptInput family for AI chat surfaces - state machine (ready -> submitted -> streaming -> error), drag-drop, paste-to-attach. Ships textarea, submit, toolbar, tools, action-menu, model-select sub-components that compose together.',
    categories: ['ai', 'forms'],
    packageRoot: 'packages/ng-ai',
    sourceFiles: [
      'src/lib/prompt-input/prompt-input.types.ts',
      'src/lib/prompt-input/prompt-input.ts',
      'src/lib/prompt-input/prompt-input-textarea.ts',
      'src/lib/prompt-input/prompt-input-submit.ts',
      'src/lib/prompt-input/prompt-input-toolbar.ts',
      'src/lib/prompt-input/prompt-input-tools.ts',
      'src/lib/prompt-input/prompt-input-action-menu.ts',
      'src/lib/prompt-input/prompt-input-model-select.ts',
    ],
    targetPrefix: 'src/app/gremorie/ai/prompt-input',
    srcStrip: 'src/lib/prompt-input/',
    dependencies: [
      '@angular/core',
      '@angular/common',
      'class-variance-authority',
    ],
    // ng-utils for cn(); ng-attachments for the relative imports from
    // prompt-input.ts (../attachments/attachment.utils + types). The
    // relative imports resolve when both items live under
    // src/app/gremorie/ai/.
    registryDependencies: ['ng-utils', 'ng-attachments'],
  },

  // ---------------------------------------------------------------------------
  // Angular: data viz - shared chart engine
  // ---------------------------------------------------------------------------
  {
    name: 'ng-chart',
    framework: 'ng',
    title: 'Chart (Angular)',
    description:
      'Headless chart engine for the Angular edition - chart-context, scales, axis, cartesian-grid, chart-frame, plus shape helpers (area, line, bar, scatter, pie, polar, radar, radial-bar). Shared base for every styled chart.',
    categories: ['data', 'charts'],
    packageRoot: 'packages/ng-data',
    sourceFiles: [
      'src/lib/charts/headless/types.ts',
      'src/lib/charts/headless/format.ts',
      'src/lib/charts/headless/scales.ts',
      'src/lib/charts/headless/shape.ts',
      'src/lib/charts/headless/domain.ts',
      'src/lib/charts/headless/chart-context.ts',
      'src/lib/charts/headless/axis.ts',
      'src/lib/charts/headless/chart-frame.ts',
      'src/lib/charts/headless/cartesian-grid.ts',
      'src/lib/charts/headless/area.ts',
      'src/lib/charts/headless/line.ts',
      'src/lib/charts/headless/bar.ts',
      'src/lib/charts/headless/scatter.ts',
      'src/lib/charts/headless/polar.ts',
      'src/lib/charts/headless/pie.ts',
      'src/lib/charts/headless/radar.ts',
      'src/lib/charts/headless/radial-bar.ts',
    ],
    targetPrefix: 'src/app/gremorie/data/headless',
    srcStrip: 'src/lib/charts/headless/',
    dependencies: ['@angular/core', 'd3-scale', 'd3-shape', 'd3-format'],
    registryDependencies: ['ng-utils'],
  },

  // ---------------------------------------------------------------------------
  // Angular: data viz - styled charts (one per shape)
  // ---------------------------------------------------------------------------
  {
    name: 'ng-area-chart',
    framework: 'ng',
    title: 'Area Chart (Angular)',
    description:
      'Styled area chart - cumulative quantity over a continuous domain. Uses the ng-chart headless primitives.',
    categories: ['data', 'charts'],
    packageRoot: 'packages/ng-data',
    sourceFiles: ['src/lib/charts/styled/area-chart.ts'],
    targetPrefix: 'src/app/gremorie/data/area-chart',
    srcStrip: 'src/lib/charts/styled/',
    dependencies: ['@angular/core'],
    registryDependencies: ['ng-utils', 'ng-chart'],
  },
  {
    name: 'ng-line-chart',
    framework: 'ng',
    title: 'Line Chart (Angular)',
    description:
      'Styled line chart - trends over a continuous domain. Uses the ng-chart headless primitives.',
    categories: ['data', 'charts'],
    packageRoot: 'packages/ng-data',
    sourceFiles: ['src/lib/charts/styled/line-chart.ts'],
    targetPrefix: 'src/app/gremorie/data/line-chart',
    srcStrip: 'src/lib/charts/styled/',
    dependencies: ['@angular/core'],
    registryDependencies: ['ng-utils', 'ng-chart'],
  },
  {
    name: 'ng-bar-chart',
    framework: 'ng',
    title: 'Bar Chart (Angular)',
    description:
      'Styled bar chart - categorical comparison. Uses the ng-chart headless primitives.',
    categories: ['data', 'charts'],
    packageRoot: 'packages/ng-data',
    sourceFiles: ['src/lib/charts/styled/bar-chart.ts'],
    targetPrefix: 'src/app/gremorie/data/bar-chart',
    srcStrip: 'src/lib/charts/styled/',
    dependencies: ['@angular/core'],
    registryDependencies: ['ng-utils', 'ng-chart'],
  },
  {
    name: 'ng-scatter-chart',
    framework: 'ng',
    title: 'Scatter Chart (Angular)',
    description:
      'Styled scatter chart - x/y distribution. Uses the ng-chart headless primitives.',
    categories: ['data', 'charts'],
    packageRoot: 'packages/ng-data',
    sourceFiles: ['src/lib/charts/styled/scatter-chart.ts'],
    targetPrefix: 'src/app/gremorie/data/scatter-chart',
    srcStrip: 'src/lib/charts/styled/',
    dependencies: ['@angular/core'],
    registryDependencies: ['ng-utils', 'ng-chart'],
  },
  {
    name: 'ng-pie-chart',
    framework: 'ng',
    title: 'Pie Chart (Angular)',
    description:
      'Styled pie chart - part-to-whole. Uses the ng-chart headless primitives.',
    categories: ['data', 'charts'],
    packageRoot: 'packages/ng-data',
    sourceFiles: ['src/lib/charts/styled/pie-chart.ts'],
    targetPrefix: 'src/app/gremorie/data/pie-chart',
    srcStrip: 'src/lib/charts/styled/',
    dependencies: ['@angular/core'],
    registryDependencies: ['ng-utils', 'ng-chart'],
  },
  {
    name: 'ng-radar-chart',
    framework: 'ng',
    title: 'Radar Chart (Angular)',
    description:
      'Styled radar chart - multi-axis comparison. Uses the ng-chart headless primitives.',
    categories: ['data', 'charts'],
    packageRoot: 'packages/ng-data',
    sourceFiles: ['src/lib/charts/styled/radar-chart.ts'],
    targetPrefix: 'src/app/gremorie/data/radar-chart',
    srcStrip: 'src/lib/charts/styled/',
    dependencies: ['@angular/core'],
    registryDependencies: ['ng-utils', 'ng-chart'],
  },
  {
    name: 'ng-radial-chart',
    framework: 'ng',
    title: 'Radial Chart (Angular)',
    description:
      'Styled radial-bar chart - progress / gauge metaphor. Uses the ng-chart headless primitives.',
    categories: ['data', 'charts'],
    packageRoot: 'packages/ng-data',
    sourceFiles: ['src/lib/charts/styled/radial-chart.ts'],
    targetPrefix: 'src/app/gremorie/data/radial-chart',
    srcStrip: 'src/lib/charts/styled/',
    dependencies: ['@angular/core'],
    registryDependencies: ['ng-utils', 'ng-chart'],
  },

  // ---------------------------------------------------------------------------
  // React (rx-*): pilot
  // ---------------------------------------------------------------------------
  {
    name: 'rx-utils',
    framework: 'rx',
    title: 'Utils (React)',
    description:
      'Shared utilities for the React edition - cn() helper that merges Tailwind class names with conflict resolution (clsx + tailwind-merge).',
    categories: ['core', 'utils'],
    packageRoot: 'packages/rx-core',
    sourceFiles: ['src/lib/utils.ts'],
    targetPrefix: 'src/components/gremorie/utils',
    srcStrip: 'src/lib/',
    dependencies: ['clsx', 'tailwind-merge'],
    registryDependencies: [],
  },
  {
    name: 'rx-prompt-input',
    framework: 'rx',
    title: 'Prompt Input (React)',
    description:
      'PromptInput pilot for the React edition - state machine, drag-drop, paste-to-attach, status-driven Submit. Single-file primitive that composes header, body, footer, tools, and attachments via a shared context.',
    categories: ['ai', 'forms'],
    packageRoot: 'packages/rx-ai',
    sourceFiles: ['src/lib/prompt-input/prompt-input.tsx'],
    targetPrefix: 'src/components/gremorie/ai/prompt-input',
    srcStrip: 'src/lib/prompt-input/',
    dependencies: ['react', 'react-dom'],
    registryDependencies: ['rx-utils'],
  },
];
