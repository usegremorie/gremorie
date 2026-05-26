---
whenToUse: "Rendering a list of file attachments (chat messages, file pickers, drag-and-drop targets). Composable - pick the parts you need."
whenNotToUse: "Single-file image preview without metadata - use a plain `<img>` plus `ng-core` instead."
bestPractices:
  - "Compose the parts (`AttachmentList` + `AttachmentItem` + the slot primitives) rather than reaching for a god-component."
  - "Use the `variant` input on `AttachmentList` to pick the layout (grid, inline, list)."
  - "Pass `AttachmentData` objects produced by `toAttachmentData()` rather than raw `File`s - it centralises media-type detection."
antipatterns:
  - "Rendering attachments without an `AttachmentRemove` slot when the surface is editable - users expect a way to delete."
  - "Mixing variants within the same list - inconsistency between items breaks scannability."
api:
  inputs:
    - name: variant
      type: "'grid' | 'inline' | 'list'"
      required: false
      default: "'list'"
examples:
  - title: "Inline attachment list"
    code: |
      <gremorie-attachment-list variant="inline">
        <gremorie-attachment-item *ngFor="let a of attachments" [data]="a">
          <gremorie-attachment-preview></gremorie-attachment-preview>
          <gremorie-attachment-info>
            <gremorie-attachment-name></gremorie-attachment-name>
            <gremorie-attachment-size></gremorie-attachment-size>
          </gremorie-attachment-info>
          <gremorie-attachment-remove (remove)="onRemove(a)"></gremorie-attachment-remove>
        </gremorie-attachment-item>
      </gremorie-attachment-list>
---

# Attachments

Composable attachment list primitives. Used standalone or as a slot inside
`PromptInput` to render drag-dropped files.
