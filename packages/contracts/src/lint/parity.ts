import type { ComponentContract } from '../types';

export interface ParityResult {
  ok: boolean;
  /** Contract props absent from the React props. */
  missingInRx: string[];
  /** Contract props absent from the Angular inputs. */
  missingInNg: string[];
  /** Names present in code (rx or ng) but absent from the contract. */
  notInContract: string[];
}

/**
 * Compare a contract against the real React props and Angular inputs. A prop
 * with an `adapts` entry for a side is intentionally different there and is not
 * required on that side (e.g. React `className` -> Angular host class).
 */
export function checkParity(
  contract: ComponentContract,
  impl: { rx: string[]; ng: string[] },
): ParityResult {
  const rx = new Set(impl.rx);
  const ng = new Set(impl.ng);
  const missingInRx: string[] = [];
  const missingInNg: string[] = [];

  for (const p of contract.props) {
    if (!p.adapts?.rx && !rx.has(p.name)) missingInRx.push(p.name);
    if (!p.adapts?.ng && !ng.has(p.name)) missingInNg.push(p.name);
  }

  const known = new Set(contract.props.map((p) => p.name));
  const notInContract = [...new Set([...impl.rx, ...impl.ng])].filter(
    (n) => !known.has(n),
  );

  const ok =
    missingInRx.length === 0 &&
    missingInNg.length === 0 &&
    notInContract.length === 0;
  return { ok, missingInRx, missingInNg, notInContract };
}
