import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu';

/**
 * NavigationMenu — marketing-site primary nav with rich panels. Mirrors React
 * `NavigationMenu`. Header-level navigation with multi-column dropdown content
 * under each trigger.
 */
const meta: Meta<NavigationMenu> = {
  title: 'Interaction/Navigation/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        NavigationMenu,
        NavigationMenuList,
        NavigationMenuItem,
        NavigationMenuTrigger,
        NavigationMenuContent,
        NavigationMenuLink,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<NavigationMenu>;

/** Workbench — a single trigger revealing a small panel of links. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gn-navigation-menu>
        <gn-navigation-menu-list>
          <gn-navigation-menu-item>
            <gn-navigation-menu-trigger>Products</gn-navigation-menu-trigger>
            <gn-navigation-menu-content>
              <ul class="grid w-[320px] gap-1 p-2">
                <li>
                  <a gn-navigation-menu-link href="#">
                    <div class="font-medium">Analytics</div>
                    <p class="text-muted-foreground">Understand your traffic.</p>
                  </a>
                </li>
                <li>
                  <a gn-navigation-menu-link href="#">
                    <div class="font-medium">Storage</div>
                    <p class="text-muted-foreground">Fast, durable object storage.</p>
                  </a>
                </li>
              </ul>
            </gn-navigation-menu-content>
          </gn-navigation-menu-item>
          <gn-navigation-menu-item>
            <a gn-navigation-menu-link href="#" class="px-4 py-2">Pricing</a>
          </gn-navigation-menu-item>
        </gn-navigation-menu-list>
      </gn-navigation-menu>
    `,
  }),
};

/** WithoutViewport — content renders inline under the item (no shared panel). */
export const WithoutViewport: Story = {
  render: () => ({
    template: `
      <gn-navigation-menu [viewport]="false">
        <gn-navigation-menu-list>
          <gn-navigation-menu-item>
            <gn-navigation-menu-trigger>Solutions</gn-navigation-menu-trigger>
            <gn-navigation-menu-content>
              <ul class="grid w-[260px] gap-1 p-2">
                <li><a gn-navigation-menu-link href="#">For startups</a></li>
                <li><a gn-navigation-menu-link href="#">For enterprise</a></li>
              </ul>
            </gn-navigation-menu-content>
          </gn-navigation-menu-item>
        </gn-navigation-menu-list>
      </gn-navigation-menu>
    `,
  }),
};
