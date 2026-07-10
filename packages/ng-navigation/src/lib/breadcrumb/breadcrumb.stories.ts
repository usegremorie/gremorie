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
 * markup; the current page renders as `gn-breadcrumb-page` so the trail
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
      <gn-breadcrumb>
        <gn-breadcrumb-list>
          <gn-breadcrumb-item>
            <a gn-breadcrumb-link href="#">Home</a>
          </gn-breadcrumb-item>
          <gn-breadcrumb-separator />
          <gn-breadcrumb-item>
            <a gn-breadcrumb-link href="#">Components</a>
          </gn-breadcrumb-item>
          <gn-breadcrumb-separator />
          <gn-breadcrumb-item>
            <gn-breadcrumb-page>Breadcrumb</gn-breadcrumb-page>
          </gn-breadcrumb-item>
        </gn-breadcrumb-list>
      </gn-breadcrumb>
    `,
  }),
};

/** WithEllipsis — collapsed middle segments via `gn-breadcrumb-ellipsis`. */
export const WithEllipsis: Story = {
  render: () => ({
    template: `
      <gn-breadcrumb>
        <gn-breadcrumb-list>
          <gn-breadcrumb-item>
            <a gn-breadcrumb-link href="#">Home</a>
          </gn-breadcrumb-item>
          <gn-breadcrumb-separator />
          <gn-breadcrumb-item>
            <gn-breadcrumb-ellipsis />
          </gn-breadcrumb-item>
          <gn-breadcrumb-separator />
          <gn-breadcrumb-item>
            <gn-breadcrumb-page>Settings</gn-breadcrumb-page>
          </gn-breadcrumb-item>
        </gn-breadcrumb-list>
      </gn-breadcrumb>
    `,
  }),
};
