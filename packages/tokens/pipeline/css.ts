import { toHex } from './color.ts';
import { formatValue } from './css-value.ts';
import { fmt } from './format-number.ts';
import { aliasPath, isAlias, type DtcgColor, type DtcgValue } from './model.ts';
import { pathToCssName } from './names.ts';
import type { RunToken } from './run.ts';

/** The declaration value, keeping references so the cascade still works. */
export function cssText(t: RunToken): string {
  if (t.cssValue !== undefined) return t.cssValue;
  if (t.derive) {
    return `calc(var(${pathToCssName(aliasPath(t.derive.from))}) * ${fmt(t.derive.multiply)})`;
  }
  if (isAlias(t.original))
    return `var(${pathToCssName(aliasPath(t.original))})`;
  return formatValue(t.type, t.original as DtcgValue);
}

export function wrapComment(text: string, indent: string, width = 80): string {
  const lines: string[] = [];
  const paragraphs = text.replaceAll('*/', '* /').split(/\n{2,}/);
  paragraphs.forEach((para, i) => {
    if (i > 0) lines.push('');
    let line = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      if (line && indent.length + 3 + line.length + 1 + word.length > width) {
        lines.push(line);
        line = word;
      } else {
        line = line ? `${line} ${word}` : word;
      }
    }
    if (line) lines.push(line);
  });
  return [
    `${indent}/*`,
    ...lines.map((l) => (l ? `${indent} * ${l}` : `${indent} *`)),
    `${indent} */`,
  ].join('\n');
}

export function renderBlock(
  selector: string,
  tokens: readonly RunToken[],
  description?: string,
  hex = false,
): string {
  const body: string[] = [];
  for (const t of [...tokens].sort((a, b) => a.order - b.order)) {
    if (t.description) body.push(wrapComment(t.description, '  '));
    const comment =
      hex && t.type === 'color' && !isAlias(t.original)
        ? ` /* ${toHex(t.value as DtcgColor)} */`
        : '';
    body.push(`  ${t.name}: ${cssText(t)};${comment}`);
  }
  return [
    ...(description ? [wrapComment(description, '')] : []),
    `${selector} {`,
    ...body,
    '}',
  ].join('\n');
}
