'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@gremorie/rx-navigation';

export function NavigationMenuMegaPreview() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[500px] grid-cols-2 gap-2 p-4">
              <li>
                <NavigationMenuLink href="#" className="space-y-1">
                  <div className="font-medium">AI primitives</div>
                  <p className="text-sm text-muted-foreground">
                    Chat, prompt, response, tool.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#" className="space-y-1">
                  <div className="font-medium">Forms</div>
                  <p className="text-sm text-muted-foreground">
                    Inputs, selects, validation.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#" className="space-y-1">
                  <div className="font-medium">Charts</div>
                  <p className="text-sm text-muted-foreground">
                    Sequential, categorical, divergent palettes.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#" className="space-y-1">
                  <div className="font-medium">Navigation</div>
                  <p className="text-sm text-muted-foreground">
                    Tabs, sidebar, breadcrumb.
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
