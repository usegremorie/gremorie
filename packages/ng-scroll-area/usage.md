---
whenToUse: "Any scrollable region that should match the Gremorie look and feel - long chat threads, code blocks, virtualised lists."
whenNotToUse: "Document-level scroll (the browser handles that natively). Or short regions where the native scrollbar is fine."
bestPractices:
  - "Wrap the scrollable content in `gremorie-scroll-area` and set an explicit height on the host."
  - "Use `ScrollAreaImports` instead of importing the directive and ngx-scrollbar module separately."
antipatterns:
  - "Setting `overflow: scroll` on the host and nesting `gremorie-scroll-area` - they fight each other."
  - "Using the scroll area for the whole app shell - body scroll is usually the right answer."
examples:
  - title: "Chat thread"
    code: |
      <gremorie-scroll-area class="h-96">
        <gremorie-message *ngFor="let m of messages" [data]="m"></gremorie-message>
      </gremorie-scroll-area>
---

# Scroll Area

A thin wrapper over `ngx-scrollbar` that applies the Gremorie scrollbar styling
(slim, neutral colour, hover-grow).
