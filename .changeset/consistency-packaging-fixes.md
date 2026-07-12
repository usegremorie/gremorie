---
'@gremorie/angular': patch
'@gremorie/ng-core': patch
'@gremorie/ng-display': patch
'@gremorie/ng-feedback': patch
'@gremorie/ng-forms': patch
'@gremorie/ng-navigation': patch
'@gremorie/ng-overlays': patch
'@gremorie/ng-ai': patch
---

Packaging consistency fixes.

- **@gremorie/angular** now includes the `ng-forms`, `ng-navigation` and
  `ng-overlays` categories (it previously shipped only 6 of 9, so the meta was
  missing forms, Sidebar/Tabs and Dialog/Popover/Command).
- Fixed a broken `exports` map in `ng-core`, `ng-display`, `ng-feedback`,
  `ng-forms`, `ng-navigation`, `ng-overlays` and `@gremorie/angular`: the
  `import` condition pointed at a non-existent `./fesm2022/<name>.mjs` file
  (ng-packagr emits `gremorie-<name>.mjs`). ng-packagr now generates the correct
  map.
- `@gremorie/ng-ai`: removed a stray `peerDependenciesMeta` block (`@angular/cdk`
  was never a dependency).
- Unified internal `@gremorie/*` peer/dependency version floors to `>=0.5.1`.
