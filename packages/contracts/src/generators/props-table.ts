import type { ComponentContract } from '../types';

/** A display-ready prop row for the docs table and the workbench. */
export interface PropRow {
  name: string;
  type: string;
  default: string;
  required: boolean;
  description: string;
}

/**
 * Project a contract's `props` into display rows. Enum props render as a string
 * union of their `options`; string defaults are quoted; `required` props show a
 * `-` default.
 */
export function toPropRows(contract: ComponentContract): PropRow[] {
  return contract.props.map((p) => ({
    name: p.name,
    type: p.options ? p.options.map((o) => `'${o}'`).join(' | ') : p.type,
    default:
      p.default === undefined
        ? '-'
        : typeof p.default === 'string'
          ? `'${p.default}'`
          : String(p.default),
    required: !!p.required,
    description: p.desc ?? '',
  }));
}
