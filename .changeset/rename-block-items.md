---
'gremorie': minor
---

Registry: the five blocks are now `rx-*`, like every other React item.

`block-assistant`, `block-dashboard`, `block-empty-state`,
`block-settings-form` and `block-sign-in` became `rx-assistant`,
`rx-dashboard`, `rx-empty-state`, `rx-settings-form` and `rx-sign-in`. An
item's prefix now means its edition and nothing else: the category prefix
only ever existed on the React side, so the same block was
`block-assistant` in React and `ng-assistant` in Angular.

**The old names keep working.** `gremorie add block-assistant` resolves to
`rx-assistant` and prints the new name once. Nothing to change in an
existing project.

The six `artifact-*` items keep their name.
