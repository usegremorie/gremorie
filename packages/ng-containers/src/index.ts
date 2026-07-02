import { NgScrollbarModule } from 'ngx-scrollbar';
import { ScrollArea } from './lib/scroll-area/scroll-area';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './lib/resizable/resizable';

// Aspect Ratio
export { AspectRatio } from './lib/aspect-ratio/aspect-ratio';

// Resizable
export {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './lib/resizable/resizable';

/**
 * Convenience bundle — import this single const to wire up all three
 * resizable parts at once.
 *
 * @example
 * import { ResizableImports } from '@gremorie/ng-containers';
 *
 * @Component({ imports: [ResizableImports], ... })
 */
export const ResizableImports = [
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
];

// Stack
export {
  Stack,
  stackVariants,
  type StackGap,
  type StackAlign,
  type StackJustify,
} from './lib/stack/stack';

// Scroll Area
export { ScrollArea } from './lib/scroll-area/scroll-area';
export { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';

/**
 * Convenience bundle - import this single const to get both the ngx-scrollbar
 * <ng-scrollbar> component and the Gremorie [gremorie] styling directive.
 *
 * @example
 * import { ScrollAreaImports } from '@gremorie/ng-containers';
 *
 * @Component({ imports: [ScrollAreaImports], ... })
 */
export const ScrollAreaImports = [NgScrollbarModule, ScrollArea];
