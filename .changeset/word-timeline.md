---
'@gremorie/rx-display': minor
---

WordTimeline: transcript words as a clickable strip for picking a clip's in
and out points at word boundaries.

A mode toggle (Seek, Set in, Set out) decides what a word click does: seek
calls `onSeek` with the word start; set in and set out call `onValueChange`
with the new `[in, out]`. The range never inverts: setting out on a word
before the current in moves in to that word, and setting in after the current
out moves out to that word's end. Words in the range carry
`data-in-range="true"`, the word under `currentTime` carries
`data-current="true"`, and a speaker label marks each speaker turn
(`speakerNames` maps ids to display names). Every word is a `type="button"`,
safe inside forms and reachable with Tab. Labels default to English and can be
overridden. The pure helpers (`setBoundary`, `inRange`, `activeIndex`,
`speakerTurns`) are exported too.

React only for now (contract status `preview`); the Angular twin is not built
yet. Pairs with MediaRangePlayer.
