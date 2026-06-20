/**
 * The agnostic component contract — the single source of truth for one
 * component across the React (`rx-*`) and Angular (`ng-*`) editions, Figma, and
 * the MCP. Three blocks: `anatomy`, `props`, `guidance`. Everything else (docs
 * prop tables, Figma Code Connect, MCP docs, the workbench) is generated from it.
 *
 * This module is framework-agnostic: it MUST NOT import from any `rx-*` or
 * `ng-*` package. Per-framework deltas are recorded only via {@link PropSpec.adapts}.
 */

/** One public prop/input, named identically across React, Angular, and Figma. */
export interface PropSpec {
  /** Prop name (same in every edition). */
  name: string;
  /** Display type, e.g. `'ChartDatum[]'` or `'boolean'`. Ignored when `options` is set. */
  type: string;
  /** Whether the prop is required. */
  required?: boolean;
  /** Default value (omit when required). */
  default?: string | number | boolean;
  /** Allowed values for an enum prop; rendered as a string union and a `select` control. */
  options?: string[];
  /** One-line description. */
  desc?: string;
  /**
   * Per-framework deviation. A value here means "this side intentionally differs",
   * so the parity lint will not flag the prop as missing on that side. Example:
   * `{ ng: 'host class' }` for React's `className`.
   */
  adapts?: { rx?: string; ng?: string };
}

/** A "when not to use" entry, optionally pointing at the component to use instead. */
export interface WhenNot {
  text: string;
  /** Name of the component to use instead (another contract's `name`). */
  use?: string;
}

/** AI- and human-facing usage guidance. Powers the Figma description and MCP doc. */
export interface Guidance {
  /** One-line purpose. */
  summary: string;
  /** When to reach for this component. */
  whenToUse: string[];
  /** When NOT to use it (and what to use instead) - steers AIs to the right component. */
  whenNotToUse?: WhenNot[];
  /** Composition / usage rules and gotchas. */
  rules?: string[];
  /** A minimal canonical usage example. */
  example?: string;
}

/** The full contract for one component. */
export interface ComponentContract {
  /** Canonical component name, e.g. `'chart-artifact'`. */
  name: string;
  /** Doc category, e.g. `'data'`, `'forms'`, `'artifacts'`. */
  category: string;
  status?: 'stable' | 'preview' | 'deprecated';
  /** Subcomponent anatomy tree (shared RX/NG), as a fenced text block. */
  anatomy: string;
  /** The agnostic public API. */
  props: PropSpec[];
  /** Usage guidance. */
  guidance: Guidance;
  /** Storybook story ids per edition, used by the workbench. */
  preview?: { rx?: string; ng?: string };
  /** Optional Figma node id for Code Connect. */
  figma?: { nodeId: string | null };
}

/**
 * Identity helper that asserts the minimal shape at module load, so a malformed
 * contract fails fast (and with the component name) instead of producing silent,
 * empty generated output.
 */
export function defineContract(c: ComponentContract): ComponentContract {
  if (!c.name) throw new Error('contract.name is required');
  if (!Array.isArray(c.props)) throw new Error(`contract ${c.name}: props array required`);
  if (!c.guidance?.summary) throw new Error(`contract ${c.name}: guidance.summary required`);
  return c;
}
