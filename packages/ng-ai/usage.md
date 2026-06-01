---
whenToUse: 'Any AI chat surface - prompt input, attachments display, and the composable parts that build an AI conversation UI.'
whenNotToUse: 'Plain form inputs unrelated to a conversational AI flow - use ng-core Button + a native textarea instead. Single-file image preview without metadata - use a plain <img> tag plus ng-core.'
bestPractices:
  - 'Always nest a PromptInputTextarea inside PromptInput - the parent owns the state machine.'
  - 'Wire PromptInputSubmit as a child element; it picks up state automatically (idle / streaming / error).'
  - 'Use PromptInputToolbar for sticky bottom controls (model select, tools menu, submit).'
  - 'Compose AttachmentList + AttachmentItem + slot primitives rather than reaching for a god-component.'
  - 'Pass AttachmentData objects produced by toAttachmentData() rather than raw Files - it centralises media-type detection.'
antipatterns:
  - 'Listening to submit on the textarea directly - listen to the parent gremoriePromptSubmit output to receive the full payload.'
  - 'Re-implementing the state machine in the host component - drive state by setting state as input or letting the parent compute it.'
  - 'Mixing PromptInputSubmit with a custom submit button - the primitive already handles the keyboard contract (Cmd/Ctrl + Enter).'
  - 'Rendering attachments without an AttachmentRemove slot when the surface is editable - users expect a way to delete.'
  - 'Mixing attachment variants within the same list - inconsistency between items breaks scannability.'
api:
  inputs:
    - name: value
      type: string
      required: false
      description: 'Two-way bound textarea value.'
    - name: state
      type: "PromptInputState ('ready' | 'submitted' | 'streaming' | 'error')"
      required: false
      default: "'ready'"
    - name: size
      type: "'sm' | 'md' | 'lg'"
      required: false
      default: "'md'"
    - name: variant
      type: "'grid' | 'inline' | 'list'"
      required: false
      default: "'list'"
      description: 'AttachmentList variant - layout for the attachment row/grid.'
  outputs:
    - name: gremoriePromptSubmit
      payload: PromptInputSubmitEvent
      description: 'Fired when the user submits via Cmd/Ctrl+Enter or by clicking PromptInputSubmit.'
    - name: gremoriePromptAttachmentError
      payload: PromptInputAttachmentError
      description: 'Fired when an attachment is rejected (bad MIME, too large, etc.).'
examples:
  - title: 'Basic chat input'
    code: |
      <gremorie-prompt-input [(value)]="draft" (gremoriePromptSubmit)="onSubmit($event)">
        <gremorie-prompt-input-textarea placeholder="Ask anything"></gremorie-prompt-input-textarea>
        <gremorie-prompt-input-toolbar>
          <gremorie-prompt-input-submit></gremorie-prompt-input-submit>
        </gremorie-prompt-input-toolbar>
      </gremorie-prompt-input>
  - title: 'Inline attachment list'
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

# AI primitives

The full set of AI building blocks for an Angular chat surface: PromptInput
(textarea + toolbar + submit + state machine) and Attachments (composable
file list with grid, inline, and list variants).

The container component owns the state machine and orchestrates submission;
Attachments slot into PromptInput or stand on their own.
