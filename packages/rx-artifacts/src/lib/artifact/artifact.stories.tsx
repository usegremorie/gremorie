import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  BookmarkIcon,
  CodeIcon,
  CopyIcon,
  DownloadIcon,
  EllipsisIcon,
  EyeIcon,
  FileTextIcon,
  RefreshCwIcon,
  TableIcon,
} from 'lucide-react';

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactDescription,
  ArtifactFeaturedIcon,
  ArtifactHeader,
  ArtifactHeading,
  ArtifactMenu,
  ArtifactTitle,
  ArtifactViewToggle,
} from './artifact';

/**
 * # Artifact
 *
 * The generic, content-agnostic shell that wraps a piece of styled content (a
 * chart, table, markdown, preview, …) as a card with a header — featured icon ·
 * title · description · actions — and a content area. Typed presets
 * (`ChartArtifact`, …) compose it, filling the actions slot and dropping their
 * styled component into `ArtifactContent`. These stories document the reusable
 * shell on its own, independent of any preset.
 *
 * ## Anatomy
 *
 * ```text
 * Artifact                       rounded, bordered card root
 * ├─ ArtifactHeader              muted header strip
 * │  ├─ ArtifactFeaturedIcon     badge anchoring the header (wraps FeaturedIcon)
 * │  ├─ ArtifactHeading          flex column for title + description
 * │  │  ├─ ArtifactTitle         single-line heading (truncates)
 * │  │  └─ ArtifactDescription   single-line supporting text (truncates)
 * │  └─ ArtifactActions          right-aligned action cluster
 * │     ├─ ArtifactAction        ghost icon button (optional tooltip)
 * │     ├─ ArtifactViewToggle    segmented view switch (chart ⇄ table, …)
 * │     ├─ ArtifactMenu          icon-triggered dropdown of items
 * │     └─ ArtifactClose         X button
 * └─ ArtifactContent             scrollable body slot
 * ```
 *
 * ## Props
 *
 * | Component | Key props |
 * | --- | --- |
 * | `Artifact` / `ArtifactHeader` / `ArtifactHeading` / `ArtifactContent` | `HTMLAttributes<HTMLDivElement>` |
 * | `ArtifactFeaturedIcon` | `FeaturedIcon` props (defaults `size="md"`, `color="primary"`) |
 * | `ArtifactAction` | `Button` props + `tooltip?`, `label?`, `icon?: LucideIcon` |
 * | `ArtifactViewToggle` | `value`, `onValueChange`, `options: { value, icon, label }[]` |
 * | `ArtifactMenu` | `icon`, `label`, `items: (MenuItem \| "separator")[]`, `heading?`, `align?` |
 * | `ArtifactClose` | `Button` props (defaults to an X icon) |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `ArtifactHeader` | Header strip. |
 * | `ArtifactFeaturedIcon` | Anchoring badge. |
 * | `ArtifactHeading` / `ArtifactTitle` / `ArtifactDescription` | Title block. |
 * | `ArtifactActions` / `ArtifactAction` | Action cluster + buttons. |
 * | `ArtifactViewToggle` | Segmented view switch. |
 * | `ArtifactMenu` | Dropdown of header actions. |
 * | `ArtifactClose` | Close button. |
 * | `ArtifactContent` | Body slot. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--background` | Card surface |
 * | `--muted` | Header strip background |
 * | `--border` | Card border + header divider |
 * | `--foreground` | Title text |
 * | `--muted-foreground` | Description + action icons |
 * | `--primary` | `ArtifactFeaturedIcon` default badge color |
 */
const meta = {
  title: 'AI/Code/Artifact',
  component: Artifact,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Artifact>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The bare shell composition: featured icon, title + description, a couple of
 * ghost icon actions, and a generic content slot holding a placeholder.
 */
export const Default: Story = {
  render: () => (
    <Artifact>
      <ArtifactHeader>
        <ArtifactFeaturedIcon icon={FileTextIcon} />
        <ArtifactHeading>
          <ArtifactTitle>Quarterly summary</ArtifactTitle>
          <ArtifactDescription>
            Generated from the Q3 report.
          </ArtifactDescription>
        </ArtifactHeading>
        <ArtifactActions>
          <ArtifactAction icon={CopyIcon} tooltip="Copy" />
          <ArtifactAction icon={DownloadIcon} tooltip="Download" />
          <ArtifactClose />
        </ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent>
        <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
          Generic content slot
        </div>
      </ArtifactContent>
    </Artifact>
  ),
};

/**
 * The full action set: a segmented view toggle (preview ⇄ code) plus a Download
 * menu and a More menu — wiring the shell exactly as a preset would, but with
 * placeholder content.
 */
export const WithViewToggleAndMenus: Story = {
  render: () => {
    const ShellWithState = () => {
      const [view, setView] = useState('preview');
      return (
        <Artifact>
          <ArtifactHeader>
            <ArtifactFeaturedIcon icon={CodeIcon} color="primary" />
            <ArtifactHeading>
              <ArtifactTitle>Component snippet</ArtifactTitle>
              <ArtifactDescription>
                Toggle between the preview and its source.
              </ArtifactDescription>
            </ArtifactHeading>
            <ArtifactActions>
              <ArtifactViewToggle
                value={view}
                onValueChange={setView}
                options={[
                  { value: 'preview', icon: EyeIcon, label: 'Preview' },
                  { value: 'code', icon: CodeIcon, label: 'Code' },
                ]}
              />
              <ArtifactMenu
                icon={DownloadIcon}
                label="Download"
                heading="Download"
                items={[
                  { label: 'As image', icon: TableIcon },
                  { label: 'As data', icon: FileTextIcon },
                ]}
              />
              <ArtifactMenu
                icon={EllipsisIcon}
                label="More"
                items={[
                  { label: 'Regenerate', icon: RefreshCwIcon },
                  { label: 'Save', icon: BookmarkIcon },
                  'separator',
                  { label: 'Copy', icon: CopyIcon },
                ]}
              />
            </ArtifactActions>
          </ArtifactHeader>
          <ArtifactContent>
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              {view === 'preview' ? 'Preview view' : 'Code view'}
            </div>
          </ArtifactContent>
        </Artifact>
      );
    };
    return <ShellWithState />;
  },
};

/** Minimal: header with just a title and a single action, no description. */
export const Minimal: Story = {
  render: () => (
    <Artifact>
      <ArtifactHeader>
        <ArtifactFeaturedIcon icon={FileTextIcon} color="gray" />
        <ArtifactHeading>
          <ArtifactTitle>Untitled artifact</ArtifactTitle>
        </ArtifactHeading>
        <ArtifactActions>
          <ArtifactAction icon={EllipsisIcon} tooltip="More" />
        </ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent>
        <p className="text-sm text-muted-foreground">Body content goes here.</p>
      </ArtifactContent>
    </Artifact>
  ),
};
