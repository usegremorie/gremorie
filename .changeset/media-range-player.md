---
'@gremorie/rx-display': minor
---

MediaRangePlayer: a video player scoped to one clip of a longer source.

The clip shows as a highlighted band inside a context window (`context`
seconds on each side, 30 by default). "Play clip" plays the clip and stops at
its out point; "Play with context" plays the whole window. A ref handle
(`seek`, `playRange`, `pause`) lets a sibling, such as a word timeline, drive
playback. `preload` defaults to `'metadata'`; pass `'none'` when a page shows
many players. Labels default to English and can be overridden.

React only for now (contract status `preview`); the Angular twin is not built
yet.
