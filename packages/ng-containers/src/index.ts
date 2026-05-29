import { NgScrollbarModule } from 'ngx-scrollbar';
import { ScrollArea } from './lib/scroll-area/scroll-area';

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
