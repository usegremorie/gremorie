# @gremorie/ng-navigation

## 0.6.0

### Patch Changes

- 9764bf2: Packaging consistency fixes.

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

## 0.5.1

### Patch Changes

- Security and packaging hardening.
  - **ng-ai**: fix a stored XSS in `MessageResponse` — model markdown was rendered
    through `marked` and `bypassSecurityTrustHtml`, bypassing Angular's sanitizer.
    Output is now sanitized. (GHSA-6546-2p2g-rxhq)
  - **rx-core**: remove React and Storybook from runtime `dependencies` so
    consumers no longer get a duplicate React install.
  - **rx-data**: validate series color/key before interpolating into the chart
    `<style>` block, closing a CSS/HTML injection vector on model-supplied data.
  - **rx-artifacts / ng-artifacts**: drop `allow-same-origin` from the WebPreview
    iframe sandbox and validate iframe/citation URL schemes.
  - **rx-ai**: scheme-validate citation `href`s (blocks `javascript:`).
  - **ng-ai / ng-artifacts / ng-data / ng-navigation**: remove build-only tooling
    (`vite`, `@nx/vite`, `@analogjs/*`, `@angular/compiler`) from
    `peerDependencies`; consumers no longer see spurious unmet-peer warnings.
