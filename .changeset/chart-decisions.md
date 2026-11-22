---
'@gremorie/rx-data': patch
'@gremorie/ng-data': patch
'@gremorie/tokens': patch
---

Chart decisions.

- The tooltip `dashed` indicator is a 3px left border (`border-l-3`) in both editions: at 1px or 2px it read as a solid line.
- The sequential palette is one scale for both themes: `--chart-seq-1` to `--chart-seq-5` are blue 100/300/500/700/900, and a bigger value is always darker. The dark override is gone.
- Angular line and area charts key their points by index, not label: repeated x labels (J, F, M, A, M, J...) keep one point each, as in React. The label is only the tick text.
