---
'@gremorie/rx-ai': minor
'@gremorie/ng-ai': minor
---

Context: `ContextTrigger` takes `display` (`full`, `compact`, `auto`). `compact` shows the ring alone; `auto` drops the percentage once the PromptInput is narrower than 24rem. Angular selectors are now `gr-context`, `gr-context-trigger` and so on; the unprefixed names still work and are deprecated. The Angular ring now clamps at 100% and the trigger carries the same accessible name as React.
