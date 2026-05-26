---
whenToUse: "Any React-based AI chat surface - the input area where the user composes their prompt, optionally attaches files, and submits."
whenNotToUse: "Plain form inputs unrelated to a conversational AI flow - use a native textarea + button instead."
bestPractices:
  - "Always nest a PromptInputTextarea inside PromptInput - the parent owns the state machine."
  - "Wire PromptInputSubmit as a child element; it picks up status automatically (ready / submitted / streaming / error)."
  - "Use PromptInputFooter for sticky bottom controls (tools on the left, submit on the right)."
  - "Wrap the tree in PromptInputProvider only when you need to control attachments or text input from outside the form (eg. drag-to-drop across the whole page)."
antipatterns:
  - "Listening to onSubmit on the textarea directly - listen to the parent PromptInput onSubmit to receive the full payload."
  - "Mixing PromptInputSubmit with a custom submit button - the primitive already handles the Enter / Cmd+Enter keyboard contract."
  - "Re-implementing attachment state in the host component - drive it via the controller hook usePromptInputAttachments() or the provider."
api:
  inputs:
    - name: onSubmit
      type: "(message: PromptInputMessage, e: FormEvent) => void | Promise<void>"
      required: true
      description: "Fired when the user submits via Enter or by clicking PromptInputSubmit."
    - name: status
      type: "ChatStatus ('ready' | 'submitted' | 'streaming' | 'error')"
      required: false
      default: "'ready'"
      description: "Drives the PromptInputSubmit icon (arrow / spinner / stop / X)."
    - name: maxFiles
      type: number
      required: false
    - name: maxFileSize
      type: number
      required: false
      description: "Bytes."
    - name: accept
      type: string
      required: false
      description: "MIME pattern list like 'image/*,application/pdf'."
examples:
  - title: "Basic chat input"
    code: |
      <PromptInput onSubmit={(message) => sendMessage(message.text, message.files)}>
        <PromptInputBody>
          <PromptInputTextarea placeholder="Ask anything" />
          <PromptInputFooter>
            <span />
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInputBody>
      </PromptInput>
  - title: "With toolbar"
    code: |
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputButton aria-label="Attach"><Paperclip /></PromptInputButton>
              <PromptInputButton aria-label="Web"><Globe /></PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInputBody>
      </PromptInput>
---

# rx-ai

React AI primitives for Gremorie - the cornerstone of any AI chat surface.

This piloto ships a simplified PromptInput family: state machine, drag-drop,
keyboard contract (Enter / Shift+Enter / Backspace removes last attachment),
paste-to-attach, and a status-driven Submit button. Speech, command palette,
hover-card previews, model selector, and dropdown action menus are reserved
for the next iteration once @gremorie/rx-forms and @gremorie/rx-overlays
ship.

The Angular edition lives in @gremorie/ng-ai and exposes the same surface
shape (different idioms - signals and outputs rather than hooks and props).
