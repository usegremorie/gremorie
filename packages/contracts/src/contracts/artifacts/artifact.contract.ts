import { defineContract } from '../../types';

/**
 * Artifact - the generic, content-agnostic shell that wraps a piece of styled
 * content (a chart, table, markdown, preview, …) as a card: a header (featured
 * icon · title · description · actions) over a scrollable content slot. Typed
 * presets (`ChartArtifact`, …) compose it. Exposed as a family of subcomponents,
 * not a single configured component.
 * React: `@gremorie/rx-artifacts`. Angular: `@gremorie/ng-artifacts`.
 */
export const artifact = defineContract({
  name: 'artifact',
  category: 'artifacts',
  status: 'stable',
  anatomy: `
    <artifact>
    └─ artifact (card root, @container/artifact)
       ├─ artifact-header
       │  ├─ artifact-featured-icon       (optional anchoring badge)
       │  ├─ artifact-heading
       │  │  ├─ artifact-title            (truncates)
       │  │  └─ artifact-description       (optional, truncates)
       │  └─ artifact-actions
       │     ├─ artifact-view-toggle       (segmented switch)
       │     ├─ artifact-menu              (icon-triggered dropdown)
       │     ├─ artifact-action            (ghost icon button)
       │     ├─ artifact-close             (X button)
       │     ├─ artifact-actions-expanded  (shown >=448px)
       │     └─ artifact-actions-collapsed (shown <448px)
       └─ artifact-content (scrollable body slot)`,
  props: [
    {
      name: 'icon',
      type: 'LucideIcon',
      adapts: {
        ng: 'input: icon (registered lucide name string, e.g. "lucideChartColumn")',
      },
      desc: 'ArtifactFeaturedIcon / ArtifactAction glyph.',
    },
    {
      name: 'color',
      type: 'ArtifactFeaturedIconColor',
      default: 'primary',
      options: ['primary', 'gray', 'success', 'error'],
      desc: 'ArtifactFeaturedIcon color.',
    },
    {
      name: 'value',
      type: 'string',
      required: true,
      desc: 'ArtifactViewToggle / active option value.',
    },
    {
      name: 'options',
      type: 'ArtifactViewOption[]',
      required: true,
      desc: 'ArtifactViewToggle options: { value, icon, label }[].',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      adapts: { ng: 'output: valueChange' },
      desc: 'ArtifactViewToggle change handler.',
    },
    {
      name: 'label',
      type: 'string',
      desc: 'ArtifactMenu / ArtifactAction accessible label (and trigger aria-label).',
    },
    {
      name: 'items',
      type: "(ArtifactMenuItem | 'separator')[]",
      desc: 'ArtifactMenu rows: { label, icon?, onSelect? } or the literal "separator".',
    },
    {
      name: 'align',
      type: "'start' | 'end'",
      default: 'end',
      options: ['start', 'end'],
      desc: 'ArtifactMenu dropdown alignment.',
    },
    {
      name: 'tooltip',
      type: 'string',
      adapts: {
        ng: 'input: tooltip (wraps the button in the gn-tooltip compound from @gremorie/ng-overlays)',
      },
      desc: 'ArtifactAction hover tooltip (also the fallback label).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto each subcomponent surface.',
    },
  ],
  guidance: {
    summary:
      'A content-agnostic card shell (header + actions + scrollable body) that typed presets compose.',
    whenToUse: [
      'Build a NEW artifact preset (markdown, table, …): compose the shell and drop your styled content into ArtifactContent.',
      'Wrap any generated content as a titled, action-bearing card.',
    ],
    whenNotToUse: [
      {
        text: 'A ready-made chart artifact with toggle + downloads',
        use: 'chart-artifact',
      },
      { text: 'Highlighted source code only', use: 'code-block' },
      { text: 'A live sandboxed site preview', use: 'web-preview' },
    ],
    rules: [
      'The shell never knows what it holds; presets fill the actions slot and project content into ArtifactContent.',
      'Put primary actions in artifact-actions-expanded; mirror them in a collapsed artifact-menu so they survive narrow widths (<448px).',
      'The view toggle is intentionally NOT collapsed — it stays visible at every width.',
      'Width-responsive behavior keys off the card (@container/artifact), not the viewport.',
    ],
    example:
      '<artifact><artifact-header><artifact-title>Summary</artifact-title></artifact-header><artifact-content>…</artifact-content></artifact>',
  },
  // NG ships artifact-action (mirrors RX ArtifactAction via the gn-tooltip
  // compound from @gremorie/ng-overlays) but has no standalone story for the
  // shell itself (only the typed presets chart-artifact / code-block /
  // web-preview each have their own stories).
  preview: {
    rx: 'ai-code-artifact--default',
  },
  tag: { rx: 'Artifact', ng: 'artifact' },
  // No NG Workbench story for the bare shell (only the typed presets have one);
  // these scalar seeds mirror the canonical RX `WithViewToggleAndMenus` usage.
  example: {
    value: 'preview',
    color: 'primary',
    align: 'end',
  },
  figma: { nodeId: null },
});
