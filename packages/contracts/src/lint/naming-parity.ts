import type { ComponentContract } from '../types';

/** PascalCase -> kebab-case ('ScrollArea' -> 'scroll-area'). */
export function kebab(s: string): string {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

export interface SelectorParityResult {
  ok: boolean;
  /** The selector we expected on the ng side. */
  expected?: string;
  /** Why it was skipped (no tags / attribute selector), if applicable. */
  skipped?: string;
}

/**
 * The Angular element selector must be `gr-` + kebab of the React name. A few
 * legacy contracts predate this rule; list them here so the build stays green
 * while the naming-parity sweep (separate task) shrinks the list to zero. Do NOT
 * add new entries — a new component must be born in parity.
 */
export const SELECTOR_ALLOWLIST = new Set<string>([
  // Legacy contracts predating the naming-parity rule, collected empirically by
  // running the drift gate below. Do NOT add new entries here — a new
  // component's tag.ng must be born as `gr-` + kebab(tag.rx). A future "naming
  // sweep" task fixes these selectors and shrinks this list to zero.
  'area-chart',
  'artifact',
  'assistant',
  'bar-chart',
  'button',
  'chain-of-thought',
  'chart-artifact',
  'chart-tooltip',
  'checkpoint',
  'code-block',
  'confirmation',
  'context',
  'conversation',
  'image',
  'inline-citation',
  'line-chart',
  'message',
  'model-selector',
  'open-in-chat',
  'pie-chart',
  'plan',
  'prompt-input',
  'queue',
  'radar-chart',
  'radial-chart',
  'reasoning',
  'scatter-chart',
  'sonner',
  'sources',
  'suggestion',
  'task',
  'tool',
  'web-preview',
]);

/**
 * Check one contract's Angular selector against the React name. Contracts without
 * both tags, or whose ng selector is an attribute/directive (contains `[`), are
 * skipped — those are intentional non-element selectors, not parity violations.
 */
export function checkSelectorParity(
  contract: ComponentContract,
): SelectorParityResult {
  const rx = contract.tag?.rx;
  const ng = contract.tag?.ng;
  if (!rx || !ng) return { ok: true, skipped: 'missing rx or ng tag' };
  if (ng.includes('['))
    return { ok: true, skipped: 'attribute/directive selector' };
  if (SELECTOR_ALLOWLIST.has(contract.name))
    return { ok: true, skipped: 'allowlisted' };
  const expected = 'gr-' + kebab(rx);
  return { ok: ng === expected, expected };
}
