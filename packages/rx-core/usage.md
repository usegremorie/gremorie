---
whenToUse: "Any React project consuming Gremorie components - provides the cn() utility for merging class names with Tailwind merge."
whenNotToUse: "Plain class concatenation when no Tailwind conflict resolution is needed - a simple template literal is enough."
bestPractices:
  - "Use cn() inside React components when composing className from props with conditional or array inputs."
  - "Keep rx-core small - new utilities only when they are genuinely cross-category."
antipatterns:
  - "Importing clsx + twMerge directly instead of cn() - defeats the point of having a shared helper."
api:
  inputs: []
  outputs: []
examples:
  - title: "Compose class names"
    code: |
      import { cn } from '@gremorie/rx-core';

      function Button({ className, ...props }) {
        return (
          <button
            className={cn('rounded-md bg-primary px-3 py-1', className)}
            {...props}
          />
        );
      }
---

# rx-core

React cross-category utilities for Gremorie. Currently ships the `cn()` helper
used by every other `@gremorie/rx-*` package to merge class names with Tailwind
conflict resolution.
