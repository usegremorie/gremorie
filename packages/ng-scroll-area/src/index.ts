import { NgScrollbarModule } from 'ngx-scrollbar';
import { ScrollArea } from './lib/scroll-area';

export { ScrollArea } from './lib/scroll-area';
export { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';

/**
 * Convenience bundle — import this single const to get both the ngx-scrollbar
 * `<ng-scrollbar>` component and the Gremorie NG `[gremorie]` styling directive.
 *
 * @example
 * ```ts
 * @Component({ imports: [ScrollAreaImports], ... })
 * ```
 */
export const ScrollAreaImports = [NgScrollbarModule, ScrollArea];
