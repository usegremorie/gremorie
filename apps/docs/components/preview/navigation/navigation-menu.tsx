'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@gremorie/rx-navigation';

export function NavigationMenuPreview() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-4 w-[300px]">
              <li>
                <NavigationMenuLink href="#">AI primitives</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Forms</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Charts</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
