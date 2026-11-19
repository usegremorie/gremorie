---
'@gremorie/rx-forms': minor
'@gremorie/ng-forms': minor
---

Add the `Field` family, a port of shadcn/ui `Field`, to both editions: `Field`, `FieldLabel`, `FieldTitle`, `FieldDescription`, `FieldError`, `FieldContent`, `FieldGroup`, `FieldSet`, `FieldLegend` and `FieldSeparator` (Angular: `gr-field`, `gr-field-label`, and so on). It composes a label, a control, helper text and an error into one accessible field, with `vertical`, `horizontal` and `responsive` orientations, and a `Field` inside a `FieldLabel` becomes a choice card for a radio, checkbox or switch. The selected card takes the `--primary` border and the `--accent` fill, both existing semantic tokens, so no token changes.

Angular fixes that Field depends on: `gr-input`, `gr-textarea`, `gr-checkbox`, `gr-switch`, `gr-radio-group-item` and the input-group controls no longer leave a duplicate `id` on the host element, so a `for` pointing at the control reaches it (a label click now focuses or toggles it). `gr-radio-group-item` exposes `data-state` (`checked` or `unchecked`), as the Radix item does.
