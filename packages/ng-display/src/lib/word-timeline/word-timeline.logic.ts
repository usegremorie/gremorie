// Pure logic, kept byte-for-byte identical to the React edition
// (packages/rx-display/src/lib/word-timeline/word-timeline.logic.ts).
// The spec in this folder runs the same cases, so a change on one side that is
// not mirrored here fails a test instead of drifting silently.

export interface TimelineWord {
  w: string;
  start: number;
  end: number;
  speaker?: string | null;
}

export type TimelineMode = 'seek' | 'in' | 'out';

/** New [in, out] after clicking word `index` in `mode`. Never inverted. */
export function setBoundary(
  words: TimelineWord[],
  value: [number, number],
  index: number,
  mode: TimelineMode,
): [number, number] {
  const word = words[index];
  if (!word || mode === 'seek') return value;
  if (mode === 'in')
    return [word.start, value[1] > word.start ? value[1] : word.end];
  return [value[0] < word.end ? value[0] : word.start, word.end];
}

/** Whether `word` overlaps the [in, out] range. */
export function inRange(word: TimelineWord, value: [number, number]): boolean {
  return word.end > value[0] && word.start < value[1];
}

/** Index of the word under `t` (words sorted by start), or -1 between words. */
export function activeIndex(words: TimelineWord[], t: number): number {
  let lo = 0;
  let hi = words.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (words[mid].end <= t) lo = mid + 1;
    else if (words[mid].start > t) hi = mid - 1;
    else return mid;
  }
  return -1;
}

/** Indexes where the speaker changes (always includes 0). */
export function speakerTurns(words: TimelineWord[]): Set<number> {
  const turns = new Set<number>();
  words.forEach((w, i) => {
    if (i === 0 || (w.speaker ?? null) !== (words[i - 1].speaker ?? null))
      turns.add(i);
  });
  return turns;
}
