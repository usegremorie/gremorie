import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactFeaturedIcon,
  ArtifactHeader,
  ArtifactHeading,
  ArtifactMenu,
  ArtifactTitle,
  ArtifactViewToggle,
  type ArtifactMenuEntry,
  type ArtifactViewOption,
} from './artifact';

/**
 * Artifact — the generic, content-agnostic shell that wraps a piece of styled
 * content (a chart, table, markdown, preview, …) as a card with a header
 * (featured icon · title · description · actions) and a content area. Typed
 * presets (`ChartArtifact`, …) compose it. These stories document the reusable
 * shell on its own, independent of any preset. Parity port of the React
 * `Artifact` stories (`@gremorie/rx-artifacts`).
 *
 * ## Anatomy
 *
 * ```text
 * <artifact>                       rounded, bordered card root
 * ├─ <artifact-header>             header strip
 * │  ├─ <artifact-featured-icon>   badge anchoring the header ([icon], [color])
 * │  ├─ <artifact-heading>         flex column for title + description
 * │  │  ├─ <artifact-title>        single-line heading (truncates)
 * │  │  └─ <artifact-description>  single-line supporting text (truncates)
 * │  └─ <artifact-actions>         right-aligned action cluster
 * │     ├─ <artifact-action>       ghost icon button (optional [tooltip])
 * │     ├─ <artifact-view-toggle>  segmented view switch ([value], [options])
 * │     └─ <artifact-menu>         icon-triggered dropdown ([icon], [items])
 * └─ <artifact-content>            scrollable body slot
 * ```
 *
 * Angular deltas from React: `icon` inputs take a registered lucide **name
 * string** (from `ARTIFACT_ICONS`), not a component; there is **no
 * `ArtifactClose`** — use an `<artifact-action>` when a close affordance is
 * wanted; the view toggle emits `(valueChange)` instead of `onValueChange`.
 */
const meta: Meta<Artifact> = {
  title: 'AI/Code/Artifact',
  component: Artifact,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        Artifact,
        ArtifactHeader,
        ArtifactFeaturedIcon,
        ArtifactHeading,
        ArtifactTitle,
        ArtifactDescription,
        ArtifactActions,
        ArtifactAction,
        ArtifactViewToggle,
        ArtifactMenu,
        ArtifactContent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Artifact>;

/**
 * The bare shell composition: featured icon, title + description, a couple of
 * ghost icon actions, and a generic content slot holding a placeholder.
 */
export const Default: Story = {
  render: () => ({
    template: `
      <div class="w-full">
        <artifact>
          <artifact-header>
            <artifact-featured-icon icon="lucideSheet" />
            <artifact-heading>
              <artifact-title>Quarterly summary</artifact-title>
              <artifact-description>Generated from the Q3 report.</artifact-description>
            </artifact-heading>
            <artifact-actions>
              <artifact-action icon="lucideCopy" tooltip="Copy" />
              <artifact-action icon="lucideDownload" tooltip="Download" />
            </artifact-actions>
          </artifact-header>
          <artifact-content>
            <div class="flex h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              Generic content slot
            </div>
          </artifact-content>
        </artifact>
      </div>
    `,
  }),
};

/**
 * The full action set: a segmented view toggle (preview ⇄ code) plus a Download
 * menu and a More menu — wiring the shell exactly as a preset would, but with
 * placeholder content. `[value]`/`(valueChange)` drive the toggle locally.
 */
export const WithViewToggleAndMenus: Story = {
  name: 'With view toggle and menus',
  render: () => {
    const viewOptions: ArtifactViewOption[] = [
      { value: 'preview', icon: 'lucideChartColumn', label: 'Preview' },
      { value: 'code', icon: 'lucideSheet', label: 'Code' },
    ];
    const downloadItems: ArtifactMenuEntry[] = [
      { label: 'As image', icon: 'lucideImageDown' },
      { label: 'As data', icon: 'lucideSheet' },
    ];
    const moreItems: ArtifactMenuEntry[] = [
      { label: 'Regenerate', icon: 'lucideRefreshCw' },
      { label: 'Save', icon: 'lucideBookmark' },
      'separator',
      { label: 'Copy', icon: 'lucideCopy' },
    ];

    return {
      props: { view: 'preview', viewOptions, downloadItems, moreItems },
      template: `
        <div class="w-full">
          <artifact>
            <artifact-header>
              <artifact-featured-icon icon="lucideChartColumn" color="primary" />
              <artifact-heading>
                <artifact-title>Component snippet</artifact-title>
                <artifact-description>Toggle between the preview and its source.</artifact-description>
              </artifact-heading>
              <artifact-actions>
                <artifact-view-toggle
                  [value]="view"
                  [options]="viewOptions"
                  (valueChange)="view = $event"
                />
                <artifact-menu icon="lucideDownload" label="Download" [items]="downloadItems" />
                <artifact-menu icon="lucideEllipsis" label="More" [items]="moreItems" />
              </artifact-actions>
            </artifact-header>
            <artifact-content>
              <div class="flex h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                {{ view === 'preview' ? 'Preview view' : 'Code view' }}
              </div>
            </artifact-content>
          </artifact>
        </div>
      `,
    };
  },
};

/** Minimal: header with just a title and a single action, no description. */
export const Minimal: Story = {
  render: () => ({
    template: `
      <div class="w-full">
        <artifact>
          <artifact-header>
            <artifact-featured-icon icon="lucideSheet" color="gray" />
            <artifact-heading>
              <artifact-title>Untitled artifact</artifact-title>
            </artifact-heading>
            <artifact-actions>
              <artifact-action icon="lucideEllipsis" tooltip="More" />
            </artifact-actions>
          </artifact-header>
          <artifact-content>
            <p class="text-sm text-muted-foreground">Body content goes here.</p>
          </artifact-content>
        </artifact>
      </div>
    `,
  }),
};
