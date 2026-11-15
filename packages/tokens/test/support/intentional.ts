import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { IntentionalChange } from '../../pipeline/compare.ts';
import { PACKAGE_ROOT } from './paths.ts';

/**
 * Changes made on purpose since 0.8.0 (reference/intentional-changes.json).
 * Every regression check against the 0.8.0 reference reads this one list, so
 * a declared change is accepted everywhere and an undeclared one fails
 * everywhere.
 */
export const INTENTIONAL = JSON.parse(
  readFileSync(
    join(PACKAGE_ROOT, 'reference', 'intentional-changes.json'),
    'utf8',
  ),
) as IntentionalChange[];

/** The reference value of a token after the intentional changes. */
export function applyIntentional(
  file: string,
  selector: string,
  decls: Map<string, string>,
): Map<string, string> {
  for (const change of INTENTIONAL) {
    if (change.file !== file || change.selector !== selector) continue;
    if (change.to === null) decls.delete(change.prop);
    else decls.set(change.prop, change.to);
  }
  return decls;
}
