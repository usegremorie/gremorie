---
whenToUse: "Foundational utilities and the Button primitive. Install before any other Gremorie package."
whenNotToUse: "Standalone primitive usage outside an Angular app - this package depends on @angular/core."
bestPractices:
  - "Import `cn` from @gremorie/ng-core to merge Tailwind classes; do not pull in clsx or tailwind-merge directly."
  - "Use the Button primitive as-is. Variants and sizes are consistent with the React edition."
  - "Apply the theme.css once at the root of the app (`@import '@gremorie/ng-core/theme.css';`)."
antipatterns:
  - "Re-implementing a Button via raw `<button>` plus Tailwind classes - the primitive already covers variants, sizes, icons, disabled states."
  - "Forking the cva calls in button.ts - extend through composition instead so future upstream updates flow in."
api:
  inputs:
    - name: variant
      type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'"
      required: false
      default: "'default'"
    - name: size
      type: "'default' | 'sm' | 'lg' | 'icon'"
      required: false
      default: "'default'"
    - name: disabled
      type: boolean
      required: false
      default: "false"
  outputs:
    - name: gremorieClick
      payload: MouseEvent
      description: "Emitted on click when the button is not disabled."
examples:
  - title: "Default button"
    code: |
      <button gButton>Save</button>
  - title: "Destructive icon button"
    code: |
      <button gButton variant="destructive" size="icon">
        <trash-icon />
      </button>
---

# Core

The `@gremorie/ng-core` package ships the design tokens (via `theme.css`), the
`cn()` Tailwind merger, and the `Button` primitive. Everything else in Gremorie
builds on top of it.
