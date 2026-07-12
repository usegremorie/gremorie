import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

/**
 * Breadcrumb — hierarchical trail. Mirrors React `Breadcrumb`. Plain semantic
 * markup; the current page renders as `gr-breadcrumb-page` so the trail
 * terminates explicitly.
 */
const meta: Meta<Breadcrumb> = {
  title: 'Interaction/Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        Breadcrumb,
        BreadcrumbList,
        BreadcrumbItem,
        BreadcrumbLink,
        BreadcrumbPage,
        BreadcrumbSeparator,
        BreadcrumbEllipsis,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Breadcrumb>;

/** Workbench — a typical three-level trail ending on the current page. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gr-breadcrumb>
        <gr-breadcrumb-list>
          <gr-breadcrumb-item>
            <a gr-breadcrumb-link href="#">Home</a>
          </gr-breadcrumb-item>
          <gr-breadcrumb-separator />
          <gr-breadcrumb-item>
            <a gr-breadcrumb-link href="#">Components</a>
          </gr-breadcrumb-item>
          <gr-breadcrumb-separator />
          <gr-breadcrumb-item>
            <gr-breadcrumb-page>Breadcrumb</gr-breadcrumb-page>
          </gr-breadcrumb-item>
        </gr-breadcrumb-list>
      </gr-breadcrumb>
    `,
  }),
};

/** WithEllipsis — collapsed middle segments via `gr-breadcrumb-ellipsis`. */
export const WithEllipsis: Story = {
  render: () => ({
    template: `
      <gr-breadcrumb>
        <gr-breadcrumb-list>
          <gr-breadcrumb-item>
            <a gr-breadcrumb-link href="#">Home</a>
          </gr-breadcrumb-item>
          <gr-breadcrumb-separator />
          <gr-breadcrumb-item>
            <gr-breadcrumb-ellipsis />
          </gr-breadcrumb-item>
          <gr-breadcrumb-separator />
          <gr-breadcrumb-item>
            <gr-breadcrumb-page>Settings</gr-breadcrumb-page>
          </gr-breadcrumb-item>
        </gr-breadcrumb-list>
      </gr-breadcrumb>
    `,
  }),
};
