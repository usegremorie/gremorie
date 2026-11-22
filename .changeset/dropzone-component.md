---
'@gremorie/rx-forms': minor
'@gremorie/ng-forms': minor
---

New Dropzone component in both editions: a drop target for files that also opens the native picker (click, Enter, Space), validates `accept`, `maxSize` and `maxFiles`, and reports accepted and rejected files. State in `data-drag-active`, `data-drag-reject`, `data-disabled` and `data-invalid`. React wraps `react-dropzone` (new dependency of `@gremorie/rx-forms`); Angular uses native drag and drop with the same rules and error codes, and `filesDropped` / `filesAccepted` / `filesRejected` outputs.
