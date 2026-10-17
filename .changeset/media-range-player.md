---
'@gremorie/rx-display': minor
---

MediaRangePlayer: a video player scoped to one clip of a longer source.

The clip shows as a highlighted band inside a context window (`context`
seconds on each side, 30 by default). "Play clip" plays the clip and stops at
its out point; "Play with context" plays the whole window. A ref handle
(`seek`, `playRange`, `pause`) lets a sibling, such as a word timeline, drive
playback. `preload` defaults to `'metadata'`; pass `'none'` when a page shows
many players. The stop is frame-accurate (checked every animation frame while
playing, not only on `timeupdate`), and a `seek` or `playRange` issued before
the metadata loads is kept. `controls` adds the native video controls for
keyboard seeking, volume and fullscreen. Labels, including the video's
`aria-label`, default to English and can be overridden.

React only for now (contract status `preview`); the Angular twin is not built
yet.
