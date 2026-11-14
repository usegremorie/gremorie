---
'@gremorie/ng-forms': patch
---

`gr-toggle-group` now matches the React `ToggleGroup`

- With the default `spacing` of 0 the items fuse into one segmented control:
  rounded outer corners, square inner ones, shared borders. Before, every item
  rendered as its own rounded pill.
- `type="single"` is announced as a radio group (`role="radiogroup"`, items
  `role="radio"` with `aria-checked`); `type="multiple"` as a toolbar of
  buttons with `aria-pressed`. Same as Radix.
- The group is one tab stop. Arrow keys move focus between items (looping,
  skipping disabled ones), Home and End jump to the ends, and Tab lands on the
  pressed item.

`nullable` still defaults to `true`, as in Radix: clicking the pressed item of a
single group clears the value. Pass `[nullable]="false"` when a value is
required.
