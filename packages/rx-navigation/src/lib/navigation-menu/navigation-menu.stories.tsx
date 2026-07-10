import type { Meta, StoryObj } from '@storybook/react';
import { BookOpenIcon, LayersIcon, SparklesIcon, ZapIcon } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './navigation-menu';

/**
 * # NavigationMenu
 *
 * Marketing-site primary navigation with rich content panels, built on Radix
 * NavigationMenu. Designed for header-level nav with multi-column dropdowns —
 * the Vercel/Stripe pattern of "Products / Solutions / Pricing". For
 * app-internal nav use Sidebar or Tabs; for action menus use DropdownMenu.
 *
 * ## Anatomy
 *
 * ```text
 * NavigationMenu                       the root; auto-mounts a Viewport when viewport is on
 * ├─ NavigationMenuList                the horizontal list of items
 * │  └─ NavigationMenuItem             one slot: trigger + panel, or a plain link
 * │     ├─ NavigationMenuTrigger       the label that opens a content panel
 * │     ├─ NavigationMenuContent       the dropdown panel (multi-column friendly)
 * │     │  └─ NavigationMenuLink       a link, inside a panel or standalone
 * │     └─ navigationMenuTriggerStyle  CVA helper to style plain links like triggers
 * ├─ NavigationMenuIndicator           pointer arrow that tracks the active trigger
 * └─ NavigationMenuViewport            shared sliding container (auto-mounted)
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `viewport` | `boolean` | `true` | Render the shared animated viewport (vs per-item panels). |
 * | `...props` | Radix `NavigationMenu.Root` props | — | Forwarded to the root. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `NavigationMenuList` | The horizontal item list. |
 * | `NavigationMenuItem` | One navigation slot. |
 * | `NavigationMenuTrigger` | Opens a content panel. |
 * | `NavigationMenuContent` | The dropdown panel. |
 * | `NavigationMenuLink` | A link (in-panel or standalone). |
 * | `NavigationMenuIndicator` / `NavigationMenuViewport` | Animation primitives. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--background` | Trigger surface |
 * | `--popover` / `--popover-foreground` | Panel surface |
 * | `--accent` / `--accent-foreground` | Hover / open state |
 * | `--muted-foreground` | Panel link descriptions + icons |
 * | `--ring` | Keyboard focus ring |
 */
const meta = {
  title: 'Interaction/Navigation/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="flex min-h-[22rem] justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

type FeatureLink = {
  title: string;
  href: string;
  description: string;
  icon: typeof ZapIcon;
};

const PRODUCTS: FeatureLink[] = [
  {
    title: 'Analytics',
    href: '#',
    description: 'Real-time insight into product usage and funnels.',
    icon: ZapIcon,
  },
  {
    title: 'Components',
    href: '#',
    description: 'A composable, themeable design-system library.',
    icon: LayersIcon,
  },
  {
    title: 'AI Elements',
    href: '#',
    description: 'Generative-UI primitives for LLM-driven surfaces.',
    icon: SparklesIcon,
  },
  {
    title: 'Docs',
    href: '#',
    description: 'Guides, references, and recipes to get started.',
    icon: BookOpenIcon,
  },
];

/**
 * Workbench preset: a single trigger revealing a small panel of links — the
 * IDENTICAL use case as the Angular `Workbench` story. Keep both in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[320px] gap-1 p-2">
              <li>
                <NavigationMenuLink href="#">
                  <div className="font-medium">Analytics</div>
                  <p className="text-muted-foreground">
                    Understand your traffic.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <div className="font-medium">Storage</div>
                  <p className="text-muted-foreground">
                    Fast, durable object storage.
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * A header nav with a rich multi-column dropdown panel under "Products" and
 * plain links styled with `navigationMenuTriggerStyle`.
 */
export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[26rem] grid-cols-2 gap-2 p-2">
              {PRODUCTS.map((item) => (
                <li key={item.title}>
                  <NavigationMenuLink href={item.href}>
                    <div className="flex items-center gap-2 font-medium">
                      <item.icon />
                      {item.title}
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[16rem] gap-1 p-2">
              <li>
                <NavigationMenuLink href="#">
                  <div className="font-medium">For startups</div>
                  <p className="text-muted-foreground">
                    Ship faster from day one.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <div className="font-medium">For enterprise</div>
                  <p className="text-muted-foreground">
                    Scale with confidence.
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * With `viewport={false}` each panel renders inline beneath its own trigger
 * instead of in a shared animated viewport.
 */
export const WithoutViewport: Story = {
  render: () => (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[16rem] gap-1 p-2">
              {PRODUCTS.slice(0, 3).map((item) => (
                <li key={item.title}>
                  <NavigationMenuLink href={item.href}>
                    <div className="flex items-center gap-2 font-medium">
                      <item.icon />
                      {item.title}
                    </div>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
