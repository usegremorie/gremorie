---
whenToUse: 'Any scrollable region that should match the Gremorie look and feel - long chat threads, code blocks, virtualised lists.'
whenNotToUse: 'Document-level scroll (the browser handles that natively). Or short regions where the native scrollbar is fine.'
bestPractices:
  - 'Wrap the scrollable content in gr-scroll-area and set an explicit height on the host.'
  - 'Import ScrollArea from @gremorie/ng-containers and add it to the component imports array.'
antipatterns:
  - 'Setting overflow: scroll on the host and nesting gr-scroll-area - they fight each other.'
  - 'Using the scroll area for the whole app shell - body scroll is usually the right answer.'
examples:
  - title: 'Chat thread'
    code: |
      <gr-scroll-area class="h-96">
        <gremorie-message *ngFor="let m of messages" [data]="m"></gremorie-message>
      </gr-scroll-area>
---

# Containers

Container primitives that organise scroll, overflow, and layout. Currently
ships with ScrollArea (thin scroll container with the Gremorie look,
implemented natively with signals and a ResizeObserver - the overlay thumb
fades in on hover, with no external scrollbar dependency).
