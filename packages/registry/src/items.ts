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
    name: 'rx-alert-dialog',
    framework: 'rx',
    title: 'Alert Dialog (React)',
    description:
      'Modal-blocking confirmation dialog built on Radix AlertDialog. Use for destructive confirmations and irreversible actions - the user must choose, no close-on-overlay or close-on-escape.',
    categories: ['overlays'],
    packageRoot: 'packages/rx-overlays',
    sourceFiles: ['src/lib/alert-dialog/alert-dialog.tsx'],
    targetPrefix: 'src/components/gremorie/overlays/alert-dialog',
    srcStrip: 'src/lib/alert-dialog/',
    dependencies: ['radix-ui'],
    registryDependencies: ['rx-utils', 'rx-button'],
  },
  {
    name: 'rx-context-menu',
    framework: 'rx',
    title: 'Context Menu (React)',
    description:
      'Secondary action menu invoked via right-click, built on Radix ContextMenu. Power-user accelerator with the same shape as DropdownMenu (items, groups, separators, sub-menus, checkbox/radio variants).',
    categories: ['overlays'],
    packageRoot: 'packages/rx-overlays',
    sourceFiles: ['src/lib/context-menu/context-menu.tsx'],
    targetPrefix: 'src/components/gremorie/overlays/context-menu',
    srcStrip: 'src/lib/context-menu/',
    dependencies: ['radix-ui', 'lucide-react'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-drawer',
    framework: 'rx',
    title: 'Drawer (React)',
    description:
      'Bottom-up sheet for mobile contexts, built on vaul. Slides up from the bottom by default with native gesture support (drag-to-dismiss, momentum). Best for mobile confirmations, quick actions, simple forms.',
    categories: ['overlays'],
    packageRoot: 'packages/rx-overlays',
    sourceFiles: ['src/lib/drawer/drawer.tsx'],
    targetPrefix: 'src/components/gremorie/overlays/drawer',
    srcStrip: 'src/lib/drawer/',
    dependencies: ['vaul'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-sonner',
    framework: 'rx',
    title: 'Sonner (React)',
    description:
      'Toast notification root, wraps `sonner` with Gremorie tokens. Mount once at the app root - any descendant can fire `toast()` without an additional provider. For transient feedback only - for persistent in-flow messages use Alert; for critical confirmations use AlertDialog.',
    categories: ['overlays', 'feedback'],
    packageRoot: 'packages/rx-overlays',
    sourceFiles: ['src/lib/sonner/sonner.tsx'],
    targetPrefix: 'src/components/gremorie/overlays/sonner',
    srcStrip: 'src/lib/sonner/',
    dependencies: ['sonner', 'lucide-react'],
    registryDependencies: [],
  },
  {
    name: 'rx-date-picker',
    framework: 'rx',
    title: 'Date Picker (React)',
    description:
      'Composite of Popover + Calendar wired with shadcn defaults. Single-mode by default. Lives in rx-overlays because it composes Popover (rx-overlays) with Button + Calendar (rx-forms).',
    categories: ['forms', 'overlays'],
    packageRoot: 'packages/rx-overlays',
    sourceFiles: ['src/lib/date-picker/date-picker.tsx'],
    targetPrefix: 'src/components/gremorie/forms/date-picker',
    srcStrip: 'src/lib/date-picker/',
    dependencies: ['date-fns', 'lucide-react'],
    registryDependencies: ['rx-utils', 'rx-button', 'rx-calendar', 'rx-popover'],
  },

  // ---------------------------------------------------------------------------
  // React (rx-*): display primitives
  // ---------------------------------------------------------------------------
  {
    name: 'rx-accordion',
    framework: 'rx',
    title: 'Accordion (React)',
    description:
      'Vertically stacked, coordinated expandable sections built on Radix Accordion. Use when multiple sections share a common rhythm (FAQ, settings groups). For a single expandable region, use Collapsible.',
    categories: ['display'],
    packageRoot: 'packages/rx-display',
    sourceFiles: ['src/lib/accordion/accordion.tsx'],
    targetPrefix: 'src/components/gremorie/display/accordion',
    srcStrip: 'src/lib/accordion/',
    dependencies: ['radix-ui', 'lucide-react'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-avatar',
    framework: 'rx',
    title: 'Avatar (React)',
    description:
      'User identity glyph built on Radix Avatar - image with graceful fallback to initials or icon. Use for user surfaces (header, comments, mention chips, settings).',
    categories: ['display'],
    packageRoot: 'packages/rx-display',
    sourceFiles: ['src/lib/avatar/avatar.tsx'],
    targetPrefix: 'src/components/gremorie/display/avatar',
    srcStrip: 'src/lib/avatar/',
    dependencies: ['radix-ui'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-badge',
    framework: 'rx',
    title: 'Badge (React)',
    description:
      'Compact label for status, count, or category. Variants: default, secondary, destructive, outline. Supports `asChild` via Radix Slot for composition with links/buttons.',
    categories: ['display'],
    packageRoot: 'packages/rx-display',
    sourceFiles: ['src/lib/badge/badge.tsx'],
    targetPrefix: 'src/components/gremorie/display/badge',
    srcStrip: 'src/lib/badge/',
    dependencies: ['class-variance-authority', 'radix-ui'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-card',
    framework: 'rx',
    title: 'Card (React)',
    description:
      'Surface container for grouped content - composes CardHeader, CardTitle, CardDescription, CardContent, CardFooter. The base building block for dashboards, lists, and modal-less detail views.',
    categories: ['display'],
    packageRoot: 'packages/rx-display',
    sourceFiles: ['src/lib/card/card.tsx'],
    targetPrefix: 'src/components/gremorie/display/card',
    srcStrip: 'src/lib/card/',
    dependencies: [],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-carousel',
    framework: 'rx',
    title: 'Carousel (React)',
    description:
      'Horizontal slider built on embla-carousel-react - touch / drag, keyboard navigation, pagination dots, prev/next controls. Best for hero rotators, image galleries, onboarding tours.',
    categories: ['display'],
    packageRoot: 'packages/rx-display',
    sourceFiles: ['src/lib/carousel/carousel.tsx'],
    targetPrefix: 'src/components/gremorie/display/carousel',
    srcStrip: 'src/lib/carousel/',
    dependencies: ['embla-carousel-react', 'lucide-react'],
    registryDependencies: ['rx-utils', 'rx-button'],
  },
  {
    name: 'rx-collapsible',
    framework: 'rx',
    title: 'Collapsible (React)',
    description:
      'Single-section expandable region built on Radix Collapsible. Minimal building block for "show more" toggles, sidebar group expand/collapse, inline disclosures.',
    categories: ['display'],
    packageRoot: 'packages/rx-display',
    sourceFiles: ['src/lib/collapsible/collapsible.tsx'],
    targetPrefix: 'src/components/gremorie/display/collapsible',
    srcStrip: 'src/lib/collapsible/',
    dependencies: ['radix-ui'],
    registryDependencies: [],
  },
  {
    name: 'rx-separator',
    framework: 'rx',
    title: 'Separator (React)',
    description:
      'Horizontal or vertical visual divider built on Radix Separator. Use sparingly - prefer spacing for visual grouping; reach for Separator only when a hard line carries semantic meaning.',
    categories: ['display'],
    packageRoot: 'packages/rx-display',
    sourceFiles: ['src/lib/separator/separator.tsx'],
    targetPrefix: 'src/components/gremorie/display/separator',
    srcStrip: 'src/lib/separator/',
    dependencies: ['radix-ui'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-table',
    framework: 'rx',
    title: 'Table (React)',
    description:
      'Styled wrapper over native HTML `<table>` - composable Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption. Use for tabular data; pair with a data-grid library for sorting, filtering, virtualization.',
    categories: ['display'],
    packageRoot: 'packages/rx-display',
    sourceFiles: ['src/lib/table/table.tsx'],
    targetPrefix: 'src/components/gremorie/display/table',
    srcStrip: 'src/lib/table/',
    dependencies: [],
    registryDependencies: ['rx-utils'],
  },

  // ---------------------------------------------------------------------------
  // React (rx-*): feedback primitives
  // ---------------------------------------------------------------------------
  {
    name: 'rx-alert',
    framework: 'rx',
    title: 'Alert (React)',
    description:
      'Persistent in-flow feedback message - distinct from Sonner (transient) and AlertDialog (modal). Two variants (default, destructive); convey informational/success/warning via a leading icon rather than expanding variants.',
    categories: ['feedback'],
    packageRoot: 'packages/rx-feedback',
    sourceFiles: ['src/lib/alert/alert.tsx'],
    targetPrefix: 'src/components/gremorie/feedback/alert',
    srcStrip: 'src/lib/alert/',
    dependencies: ['class-variance-authority'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-progress',
    framework: 'rx',
    title: 'Progress (React)',
    description:
      'Determinate progress indicator (0-100) built on Radix Progress. Use when percent complete is known (uploads, multi-step forms, batch jobs); for unknown duration prefer Skeleton or a spinner.',
    categories: ['feedback'],
    packageRoot: 'packages/rx-feedback',
    sourceFiles: ['src/lib/progress/progress.tsx'],
    targetPrefix: 'src/components/gremorie/feedback/progress',
    srcStrip: 'src/lib/progress/',
    dependencies: ['radix-ui'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-skeleton',
    framework: 'rx',
    title: 'Skeleton (React)',
    description:
      'Placeholder block for loading states - a pulsing rectangle that reserves layout space so there is no shift when data arrives. Honors `prefers-reduced-motion` automatically.',
    categories: ['feedback'],
    packageRoot: 'packages/rx-feedback',
    sourceFiles: ['src/lib/skeleton/skeleton.tsx'],
    targetPrefix: 'src/components/gremorie/feedback/skeleton',
    srcStrip: 'src/lib/skeleton/',
    dependencies: [],
    registryDependencies: ['rx-utils'],
  },

  // ---------------------------------------------------------------------------
  // React (rx-*): navigation primitives
  // ---------------------------------------------------------------------------
  {
    name: 'rx-breadcrumb',
    framework: 'rx',
    title: 'Breadcrumb (React)',
    description:
      'Hierarchical trail - composable Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis. Use to show the current location within a nested structure.',
    categories: ['navigation'],
    packageRoot: 'packages/rx-navigation',
    sourceFiles: ['src/lib/breadcrumb/breadcrumb.tsx'],
    targetPrefix: 'src/components/gremorie/navigation/breadcrumb',
    srcStrip: 'src/lib/breadcrumb/',
    dependencies: ['radix-ui', 'lucide-react'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-menubar',
    framework: 'rx',
    title: 'Menubar (React)',
    description:
      'Horizontal multi-menu bar built on Radix Menubar - desktop-style File/Edit/View menus with full keyboard navigation, sub-menus, checkbox and radio items.',
    categories: ['navigation'],
    packageRoot: 'packages/rx-navigation',
    sourceFiles: ['src/lib/menubar/menubar.tsx'],
    targetPrefix: 'src/components/gremorie/navigation/menubar',
    srcStrip: 'src/lib/menubar/',
    dependencies: ['radix-ui', 'lucide-react'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-navigation-menu',
    framework: 'rx',
    title: 'Navigation Menu (React)',
    description:
      'Top-level mega-menu built on Radix NavigationMenu - reveals secondary content panels on hover/focus. Use for site headers with grouped link clusters and feature highlights.',
    categories: ['navigation'],
    packageRoot: 'packages/rx-navigation',
    sourceFiles: ['src/lib/navigation-menu/navigation-menu.tsx'],
    targetPrefix: 'src/components/gremorie/navigation/navigation-menu',
    srcStrip: 'src/lib/navigation-menu/',
    dependencies: ['radix-ui', 'lucide-react', 'class-variance-authority'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-pagination',
    framework: 'rx',
    title: 'Pagination (React)',
    description:
      'Page navigation surface - composable Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis. Anchor tags by default; pass a custom component via PaginationLink for client-side routers.',
    categories: ['navigation'],
    packageRoot: 'packages/rx-navigation',
    sourceFiles: ['src/lib/pagination/pagination.tsx'],
    targetPrefix: 'src/components/gremorie/navigation/pagination',
    srcStrip: 'src/lib/pagination/',
    dependencies: ['lucide-react'],
    registryDependencies: ['rx-utils', 'rx-button'],
  },
  {
    name: 'rx-sidebar',
    framework: 'rx',
    title: 'Sidebar (React)',
    description:
      'Composable app-shell sidebar - SidebarProvider, Sidebar, SidebarTrigger, SidebarMenu plus mobile drawer integration. Cookie-persisted collapsed state, keyboard shortcut, full keyboard navigation. The largest navigation primitive in the registry.',
    categories: ['navigation'],
    packageRoot: 'packages/rx-navigation',
    sourceFiles: ['src/lib/sidebar/sidebar.tsx'],
    targetPrefix: 'src/components/gremorie/navigation/sidebar',
    srcStrip: 'src/lib/sidebar/',
    dependencies: ['radix-ui', 'lucide-react', 'class-variance-authority'],
    registryDependencies: [
      'rx-utils',
      'rx-button',
      'rx-input',
      'rx-separator',
      'rx-skeleton',
      'rx-sheet',
      'rx-tooltip',
    ],
  },
  {
    name: 'rx-tabs',
    framework: 'rx',
    title: 'Tabs (React)',
    description:
      'Tabbed content switcher built on Radix Tabs - Tabs, TabsList, TabsTrigger, TabsContent. Use for sibling content panels that share a context (settings sections, profile pages).',
    categories: ['navigation'],
    packageRoot: 'packages/rx-navigation',
    sourceFiles: ['src/lib/tabs/tabs.tsx'],
    targetPrefix: 'src/components/gremorie/navigation/tabs',
    srcStrip: 'src/lib/tabs/',
    dependencies: ['radix-ui'],
    registryDependencies: ['rx-utils'],
  },

  // ---------------------------------------------------------------------------
  // React (rx-*): forms - extended (added after pilot)
  // ---------------------------------------------------------------------------
  {
    name: 'rx-button-group',
    framework: 'rx',
    title: 'Button Group (React)',
    description:
      'Cluster of related buttons that share a stroke. Composable ButtonGroup, ButtonGroupText, ButtonGroupSeparator. Horizontal or vertical, with optional inner Separator.',
    categories: ['forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/button-group/button-group.tsx'],
    targetPrefix: 'src/components/gremorie/forms/button-group',
    srcStrip: 'src/lib/button-group/',
    dependencies: ['class-variance-authority', 'radix-ui'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-calendar',
    framework: 'rx',
    title: 'Calendar (React)',
    description:
      'Date grid built on react-day-picker - single or range selection, multi-month layout, weekday header, keyboard navigation. Pair with Popover for the canonical DatePicker pattern.',
    categories: ['forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/calendar/calendar.tsx'],
    targetPrefix: 'src/components/gremorie/forms/calendar',
    srcStrip: 'src/lib/calendar/',
    dependencies: ['lucide-react', 'react-day-picker'],
    registryDependencies: ['rx-utils', 'rx-button'],
  },
  {
    name: 'rx-checkbox',
    framework: 'rx',
    title: 'Checkbox (React)',
    description:
      'Binary or tri-state checkbox built on Radix Checkbox. Use for multi-select lists, terms acceptance, settings toggles. For mutually exclusive choices use RadioGroup; for on/off use Switch.',
    categories: ['forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/checkbox/checkbox.tsx'],
    targetPrefix: 'src/components/gremorie/forms/checkbox',
    srcStrip: 'src/lib/checkbox/',
    dependencies: ['radix-ui', 'lucide-react'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-form',
    framework: 'rx',
    title: 'Form (React)',
    description:
      'React Hook Form integration - Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage. Wires field state, validation errors, and accessibility attributes.',
    categories: ['forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/form/form.tsx'],
    targetPrefix: 'src/components/gremorie/forms/form',
    srcStrip: 'src/lib/form/',
    dependencies: ['radix-ui', 'react-hook-form'],
    registryDependencies: ['rx-utils', 'rx-label'],
  },
  {
    name: 'rx-input-otp',
    framework: 'rx',
    title: 'Input OTP (React)',
    description:
      'One-time password input built on input-otp - keyboard-driven, paste-friendly, slot-based. Use for 2FA codes, magic links, SMS verification.',
    categories: ['forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/input-otp/input-otp.tsx'],
    targetPrefix: 'src/components/gremorie/forms/input-otp',
    srcStrip: 'src/lib/input-otp/',
    dependencies: ['input-otp', 'lucide-react'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-radio-group',
    framework: 'rx',
    title: 'Radio Group (React)',
    description:
      'Mutually exclusive choice group built on Radix RadioGroup. Use for 2-7 distinct options. For binary on/off use Switch; for many options use Select.',
    categories: ['forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/radio-group/radio-group.tsx'],
    targetPrefix: 'src/components/gremorie/forms/radio-group',
    srcStrip: 'src/lib/radio-group/',
    dependencies: ['radix-ui', 'lucide-react'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-slider',
    framework: 'rx',
    title: 'Slider (React)',
    description:
      'Range slider built on Radix Slider - single value or range (two thumbs), with step + min/max. Use for continuous values (volume, opacity, price range).',
    categories: ['forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/slider/slider.tsx'],
    targetPrefix: 'src/components/gremorie/forms/slider',
    srcStrip: 'src/lib/slider/',
    dependencies: ['radix-ui'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-switch',
    framework: 'rx',
    title: 'Switch (React)',
    description:
      'Binary on/off toggle built on Radix Switch. Use for instant-effect settings (dark mode, notifications). For form fields that need explicit "save", prefer Checkbox.',
    categories: ['forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/switch/switch.tsx'],
    targetPrefix: 'src/components/gremorie/forms/switch',
    srcStrip: 'src/lib/switch/',
    dependencies: ['radix-ui'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-toggle',
    framework: 'rx',
    title: 'Toggle (React)',
    description:
      'Two-state press-button built on Radix Toggle. Use for inline formatting controls (bold, italic) or visibility toggles. For multi-option clusters use ToggleGroup.',
    categories: ['forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/toggle/toggle.tsx'],
    targetPrefix: 'src/components/gremorie/forms/toggle',
    srcStrip: 'src/lib/toggle/',
    dependencies: ['radix-ui', 'class-variance-authority'],
    registryDependencies: ['rx-utils'],
  },
  {
    name: 'rx-toggle-group',
    framework: 'rx',
    title: 'Toggle Group (React)',
    description:
      'Mutually exclusive or multi-select cluster of Toggle items, built on Radix ToggleGroup. Use for inline option pickers (text alignment, view mode, filter chips).',
    categories: ['forms'],
    packageRoot: 'packages/rx-forms',
    sourceFiles: ['src/lib/toggle-group/toggle-group.tsx'],
    targetPrefix: 'src/components/gremorie/forms/toggle-group',
    srcStrip: 'src/lib/toggle-group/',
    dependencies: ['radix-ui', 'class-variance-authority'],
    registryDependencies: ['rx-utils', 'rx-toggle'],
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
