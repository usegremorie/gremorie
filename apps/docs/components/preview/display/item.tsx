'use client';

import { Button } from '@gremorie/rx-forms';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@gremorie/rx-display';
import { ChevronRightIcon, FileTextIcon, FolderIcon } from 'lucide-react';

export function ItemPreview() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">
          group with icon media + actions
        </span>
        <ItemGroup className="rounded-lg border">
          <Item interactive>
            <ItemMedia variant="icon">
              <FolderIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Design tokens</ItemTitle>
              <ItemDescription>
                Colors, spacing, radius and typography scales.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4 text-muted-foreground" />
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item interactive>
            <ItemMedia variant="icon">
              <FileTextIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Documentation</ItemTitle>
              <ItemDescription>
                Anatomy, usage and API for every primitive.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Open
              </Button>
            </ItemActions>
          </Item>
        </ItemGroup>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">
          size cascade (sm · md · lg)
        </span>
        <div className="flex flex-col gap-2">
          <Item size="sm" variant="outline">
            <ItemMedia variant="featured">
              <FileTextIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Small row</ItemTitle>
              <ItemDescription>Compact density.</ItemDescription>
            </ItemContent>
          </Item>
          <Item size="md" variant="outline">
            <ItemMedia variant="featured">
              <FileTextIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Medium row</ItemTitle>
              <ItemDescription>Default density.</ItemDescription>
            </ItemContent>
          </Item>
          <Item size="lg" variant="outline">
            <ItemMedia variant="featured">
              <FileTextIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Large row</ItemTitle>
              <ItemDescription>Roomy density.</ItemDescription>
            </ItemContent>
          </Item>
        </div>
      </div>
    </div>
  );
}
