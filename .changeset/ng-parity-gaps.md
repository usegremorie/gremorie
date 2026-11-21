---
'@gremorie/rx-forms': patch
'@gremorie/rx-navigation': patch
'@gremorie/ng-ai': patch
'@gremorie/ng-containers': patch
'@gremorie/ng-data': patch
'@gremorie/ng-display': patch
'@gremorie/ng-feedback': patch
'@gremorie/ng-forms': patch
'@gremorie/ng-navigation': patch
'@gremorie/ng-overlays': patch
---

Parity fixes between the React and Angular editions.

- `gr-dropdown-menu` no longer crashes on render. The trigger handed a template ref to the brain popover trigger, which expects a popover; it now opens the popover of the enclosing root, and the sibling `<ng-template brnPopoverContent>` needs no ref. `[content]` stays accepted (a template ref is ignored). The same fix applies to `gr-popover-trigger`, `gr-context-menu-trigger` and `open-in-trigger`. `gr-dropdown-menu-trigger` gains an `ariaLabel` input for icon-only triggers.
- `gr-accordion-content` hides closed panels (they kept their full height). Item, trigger and content take a `class` input merged with `cn`.
- Checkbox draws a dash when indeterminate, in both editions (it drew a check). The `gr-checkbox` host no longer adds a text line box, so a checkbox row is as tall as in React (16px, was 24px).
- `gr-input-group-input` stretches like React (`flex-1`), reaches the group's padding rules through its host, uses the React `Input` height (32px), and exposes `valueChange`, `ControlValueAccessor` and `inputmode`, like `gr-input`. `gr-input-group-textarea` lets its group grow, and an addon holding `gr-input-group-button` gets the same edge offset as in React.
- `gr-*` hosts merge a consumer `class` with `cn`, so it overrides built-in classes as `className` does in React (badge outline border, card, sidebar group and menu button, toggle-group item, alert, avatar, item, table, tabs, pagination, breadcrumb, menubar, navigation menu, progress, skeleton, spinner, resizable and others). `gr-toggle-group-item` keeps the outer corners rounded only on the first and last item.
- `gr-select-trigger` takes an `id`, so a `<label for>` points at the trigger button.
- React `SidebarSeparator` no longer overflows its sidebar by 16px.
- Angular AreaChart puts `aspect-video` on the padded frame, as React does, and strokes only the top edge (1px, the React default) instead of the whole closed area.
- `gr-slider` keeps the per-thumb `thumbAriaLabel` (the brain thumb overwrote it).
