---
whenToUse: "Any AI chat surface - the input area where the user composes their prompt, optionally attaches files, picks a model, and submits."
whenNotToUse: "Plain form inputs unrelated to a conversational AI flow - use `ng-core` Button + a native textarea instead."
bestPractices:
  - "Always nest a `PromptInputTextarea` inside `PromptInput` - the parent owns the state machine."
  - "Wire `PromptInputSubmit` as a child element; it picks up state automatically (idle / streaming / error)."
  - "Use `PromptInputToolbar` for sticky bottom controls (model select, tools menu, submit)."
  - "Use the `attachmentsAccept` input to constrain accepted MIME types when drag-and-drop is enabled."
antipatterns:
  - "Listening to `submit` on the textarea directly - listen to the parent's `gremoriePromptSubmit` output to receive the full payload."
  - "Re-implementing the state machine in the host component - drive state by setting `state` as input or letting the parent compute it."
  - "Mixing PromptInputSubmit with a custom submit button - the primitive already handles the keyboard contract (Cmd/Ctrl + Enter)."
api:
  inputs:
    - name: value
      type: string
      required: false
      description: "Two-way bound textarea value."
    - name: state
      type: "PromptInputState ('ready' | 'submitted' | 'streaming' | 'error')"
      required: false
      default: "'ready'"
    - name: size
      type: "'sm' | 'md' | 'lg'"
      required: false
      default: "'md'"
  outputs:
    - name: gremoriePromptSubmit
      payload: PromptInputSubmitEvent
      description: "Fired when the user submits via Cmd/Ctrl+Enter or by clicking PromptInputSubmit."
    - name: gremoriePromptAttachmentError
      payload: PromptInputAttachmentError
      description: "Fired when an attachment is rejected (bad MIME, too large, etc.)."
examples:
  - title: "Basic chat input"
    code: |
      <gremorie-prompt-input [(value)]="draft" (gremoriePromptSubmit)="onSubmit($event)">
        <gremorie-prompt-input-textarea placeholder="Ask anything"></gremorie-prompt-input-textarea>
        <gremorie-prompt-input-toolbar>
          <gremorie-prompt-input-submit></gremorie-prompt-input-submit>
        </gremorie-prompt-input-toolbar>
      </gremorie-prompt-input>
  - title: "With model selector and tools"
    code: |
      <gremorie-prompt-input [(value)]="draft" (gremoriePromptSubmit)="onSubmit($event)">
        <gremorie-prompt-input-textarea></gremorie-prompt-input-textarea>
        <gremorie-prompt-input-toolbar>
          <gremorie-prompt-input-tools></gremorie-prompt-input-tools>
          <gremorie-prompt-input-model-select [options]="models"></gremorie-prompt-input-model-select>
          <gremorie-prompt-input-submit></gremorie-prompt-input-submit>
        </gremorie-prompt-input-toolbar>
      </gremorie-prompt-input>
---

# Prompt Input

A composable family of primitives for AI prompt entry: textarea, toolbar,
submit, model select, tools menu, action menu. The container component owns
the state machine and orchestrates submission.
