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
    name: 'rx-button',
    framework: 'rx',
    title: 'Button (React)',
    description:
      'Button primitive for the React edition - 6 variants x 8 sizes (including icon-only), `asChild` via Radix Slot. Mirrors the shadcn/ui Button surface.',
    categories: ['core', 'primitives', 'forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/button/button.tsx'],
    targetPrefix: 'src/components/gremorie/forms/button',
    srcStrip: 'src/lib/button/',
    dependencies: ['class-variance-authority', 'radix-ui'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-input',
    framework: 'rx',
    title: 'Input (React)',
    description:
      'Input primitive for the React edition - single-line text field that adopts every native HTML `type`. Token-driven visual states.',
    categories: ['forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/input/input.tsx'],
    targetPrefix: 'src/components/gremorie/forms/input',
    srcStrip: 'src/lib/input/',
    dependencies: [],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-label',
    framework: 'rx',
    title: 'Label (React)',
    description:
      'Label primitive built on `@radix-ui/react-label` (via `radix-ui` namespace). Pair with Input / form controls.',
    categories: ['forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/label/label.tsx'],
    targetPrefix: 'src/components/gremorie/forms/label',
    srcStrip: 'src/lib/label/',
    dependencies: ['radix-ui'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-select',
    framework: 'rx',
    title: 'Select (React)',
    description:
      'Select primitive built on Radix Select - portalled, animated listbox, grouped items, scroll buttons. For short fixed lists (5-30 options).',
    categories: ['forms', 'overlays'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/select/select.tsx'],
    targetPrefix: 'src/components/gremorie/forms/select',
    srcStrip: 'src/lib/select/',
    dependencies: ['radix-ui', 'lucide-react'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-textarea',
    framework: 'rx',
    title: 'Textarea (React)',
    description:
      'Multi-line text field that auto-grows via `field-sizing: content`. Use for free-form input where rows are unknown ahead of time.',
    categories: ['forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/textarea/textarea.tsx'],
    targetPrefix: 'src/components/gremorie/forms/textarea',
    srcStrip: 'src/lib/textarea/',
    dependencies: [],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-input-group',
    framework: 'rx',
    title: 'Input Group (React)',
    description:
      'Composable input layout - wraps Input or Textarea with inline / block addons (icons, buttons, kbd hints). Drives focus + invalid + disabled states from the inner control. Enables the InputGroupButton composition that powers PromptInput.',
    categories: ['forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/input-group/input-group.tsx'],
    targetPrefix: 'src/components/gremorie/forms/input-group',
    srcStrip: 'src/lib/input-group/',
    dependencies: ['class-variance-authority'],
    registryDependencies: [
      'rx-utils',
      'rx-button',
      'rx-input',
      'rx-textarea',
    ],
  },
  {
    name: 'rx-dropdown-menu',
    framework: 'rx',
    title: 'Dropdown Menu (React)',
    description:
      'DropdownMenu family built on Radix DropdownMenu - actions menu with checkbox / radio items, separators, nested submenus, destructive variant.',
    categories: ['overlays'],
    packageRoot: 'packages/rx-overlays',
    sourceFiles: ['src/lib/dropdown-menu/dropdown-menu.tsx'],
    targetPrefix: 'src/components/gremorie/overlays/dropdown-menu',
    srcStrip: 'src/lib/dropdown-menu/',
    dependencies: ['radix-ui', 'lucide-react'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-hover-card',
    framework: 'rx',
    title: 'Hover Card (React)',
    description:
      'HoverCard primitive built on Radix HoverCard - non-interactive preview pane shown on hover. Use for link previews, profile cards, image teasers.',
    categories: ['overlays'],
    packageRoot: 'packages/rx-overlays',
    sourceFiles: ['src/lib/hover-card/hover-card.tsx'],
    targetPrefix: 'src/components/gremorie/overlays/hover-card',
    srcStrip: 'src/lib/hover-card/',
    dependencies: ['radix-ui'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-dialog',
    framework: 'rx',
    title: 'Dialog (React)',
    description:
      'Modal overlay anchored at viewport center, built on Radix Dialog. Use for focused decisions or short flows that need to interrupt the user context - confirmations, single-step forms, detail cards.',
    categories: ['overlays'],
    packageRoot: 'packages/rx-overlays',
    sourceFiles: ['src/lib/dialog/dialog.tsx'],
    targetPrefix: 'src/components/gremorie/overlays/dialog',
    srcStrip: 'src/lib/dialog/',
    dependencies: ['radix-ui', 'lucide-react'],
    registryDependencies: ['rx-utils', 'rx-button'],
  },
  {
    name: 'rx-sheet',
    framework: 'rx',
    title: 'Sheet (React)',
    description:
      'Side-anchored panel for longer flows, built on Radix Dialog with a directional slide animation. Use for filters, settings panels, multi-section edit forms.',
    categories: ['overlays'],
    packageRoot: 'packages/rx-overlays',
    sourceFiles: ['src/lib/sheet/sheet.tsx'],
    targetPrefix: 'src/components/gremorie/overlays/sheet',
    srcStrip: 'src/lib/sheet/',
    dependencies: ['radix-ui', 'lucide-react'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-popover',
    framework: 'rx',
    title: 'Popover (React)',
    description:
      'Anchored interactive content overlay built on Radix Popover. Triggers on click and hosts interactive content - date pickers, mini forms, share menus. Distinct from Tooltip (hover-only) and HoverCard (hover previews).',
    categories: ['overlays'],
    packageRoot: 'packages/rx-overlays',
    sourceFiles: ['src/lib/popover/popover.tsx'],
    targetPrefix: 'src/components/gremorie/overlays/popover',
    srcStrip: 'src/lib/popover/',
    dependencies: ['radix-ui'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-tooltip',
    framework: 'rx',
    title: 'Tooltip (React)',
    description:
      'Short non-essential context on hover/focus, built on Radix Tooltip. Reserve for non-critical supporting information - keyboard shortcuts, icon labels, "what does this do" hints. Wrap your app root in `<TooltipProvider>` so all tooltips share a delay timer.',
    categories: ['overlays'],
    packageRoot: 'packages/rx-overlays',
    sourceFiles: ['src/lib/tooltip/tooltip.tsx'],
    targetPrefix: 'src/components/gremorie/overlays/tooltip',
    srcStrip: 'src/lib/tooltip/',
    dependencies: ['radix-ui'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-command',
    framework: 'rx',
    title: 'Command (React)',
    description:
      'Command palette primitive built on cmdk - inline picker (Combobox pattern) for keyboard-first navigation, plus CommandDialog for the canonical Cmd+K floating palette.',
    categories: ['overlays', 'navigation'],
    packageRoot: 'packages/rx-overlays',
    sourceFiles: ['src/lib/command/command.tsx'],
    targetPrefix: 'src/components/gremorie/overlays/command',
    srcStrip: 'src/lib/command/',
    dependencies: ['cmdk', 'lucide-react'],
    registryDependencies: ['rx-utils', 'rx-dialog'],
  },
  {
    name: 'rx-prompt-input',
    framework: 'rx',
    title: 'Prompt Input (React)',
    description:
      'PromptInput family for AI chat surfaces - state machine, drag-drop, paste-to-attach, status-driven Submit. Full Bridge parity: InputGroup composition (InputGroupButton + InputGroupTextarea), ActionMenu (dropdown), ModelSelector (select), attachment HoverCard previews, Speech button (Web Speech API), Command palette wrappers, Cmd+K floating palette via CommandDialog, and Tabs panels.',
    categories: ['ai', 'forms'],
    packageRoot: 'packages/rx-ai',
    sourceFiles: ['src/lib/prompt-input/prompt-input.tsx'],
    targetPrefix: 'src/components/gremorie/ai/prompt-input',
    srcStrip: 'src/lib/prompt-input/',
    dependencies: ['lucide-react'],
    registryDependencies: [
      'rx-utils',
      'rx-button',
      'rx-input-group',
      'rx-select',
      'rx-dialog',
      'rx-dropdown-menu',
      'rx-hover-card',
      'rx-command',
    ],
  },
];
