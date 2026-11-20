import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { TabBar, TabBarItem } from './tab-bar';

/**
 * # Tab Bar
 *
 * The app's top-level destinations, docked to the bottom of a phone screen.
 * Three looks share one API: `material` (full-width bar with a pill
 * indicator), `ios` (floating translucent capsule) and `floating` (compact
 * icon-only pill). Mirrors React `TabBar`.
 *
 * Anatomy: `gr-tab-bar` (nav) → `gr-tab-bar-item` (icon, label, badge). The
 * icon is projected as content. For router links use
 * `<a gr-tab-bar-item …>`: the host is then the single focusable control.
 */
const meta: Meta<TabBar> = {
  title: 'Interaction/Navigation/Tab Bar',
  component: TabBar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [moduleMetadata({ imports: [TabBar, TabBarItem] })],
  args: { variant: 'material', labels: 'always' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['material', 'ios', 'floating'],
    },
    labels: { control: 'inline-radio', options: ['always', 'active', 'never'] },
  },
};

export default meta;
type Story = StoryObj<TabBar>;

const SVG = (paths: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const HOME = SVG(
  '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
);
const SEARCH = SVG(
  '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
);
const LIBRARY = SVG(
  '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
);
const BELL = SVG(
  '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
);
const USER = SVG(
  '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
);

/** A phone-sized frame so the fixed bar sits inside the story. */
const phone = (bar: string) => `
  <div class="relative h-[560px] w-[375px] overflow-hidden rounded-[2.5rem] border border-border bg-background">
    <div class="space-y-3 p-6">
      <div class="h-20 rounded-xl bg-muted"></div>
      <div class="h-20 rounded-xl bg-muted"></div>
      <div class="h-20 rounded-xl bg-muted"></div>
      <div class="h-20 rounded-xl bg-muted"></div>
      <div class="h-20 rounded-xl bg-muted"></div>
      <div class="h-20 rounded-xl bg-muted"></div>
    </div>
    ${bar}
  </div>
`;

const demo: Story['render'] = (args) => ({
  props: { ...args, tab: 'home' },
  template: phone(`
    <gr-tab-bar class="absolute" [variant]="variant" [labels]="labels" [(value)]="tab">
      <gr-tab-bar-item value="home" label="Home">${HOME}</gr-tab-bar-item>
      <gr-tab-bar-item value="search" label="Search">${SEARCH}</gr-tab-bar-item>
      <gr-tab-bar-item value="library" label="Library">${LIBRARY}</gr-tab-bar-item>
      <gr-tab-bar-item value="inbox" label="Inbox" [badge]="3">${BELL}</gr-tab-bar-item>
      <gr-tab-bar-item value="profile" label="Profile">${USER}</gr-tab-bar-item>
    </gr-tab-bar>
  `),
});

/**
 * Workbench preset: material bar, Home active, a badge on Inbox, in a 375px
 * phone frame. The IDENTICAL use case as the React `Workbench` story.
 */
export const Workbench: Story = { render: demo };

/** Full-width bar; the active icon sits on a pill indicator. */
export const Material: Story = { args: { variant: 'material' }, render: demo };

/** Floating translucent capsule, icon over label. */
export const IOS: Story = {
  name: 'iOS',
  args: { variant: 'ios' },
  render: demo,
};

/** Compact icon-only pill; labels become the accessible name and a tooltip. */
export const Floating: Story = { args: { variant: 'floating' }, render: demo };

/** Only the active item shows its label. */
export const ActiveLabelOnly: Story = {
  args: { variant: 'material', labels: 'active' },
  render: demo,
};
