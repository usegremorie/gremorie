import postcss, { type Container } from 'postcss';
import {
  parseColor,
  parseDimension,
  parseFontFamily,
  parseShadow,
} from '../css-value.ts';
import { round6 } from '../format-number.ts';
import {
  CSS_EXTENSION,
  DERIVE_EXTENSION,
  PRIMITIVE_FILES,
  type DtcgDimension,
  type DtcgGroup,
  type DtcgToken,
  type DtcgType,
  type NamedTheme,
} from '../model.ts';
import { cssNameToPath } from '../names.ts';
import { getPath, setPath } from '../tree.ts';
import { selectorKey } from '../compare.ts';

export interface CssDecl {
  prop: string;
  value: string;
  description?: string;
}
export interface CssBlockRead {
  key: string;
  decls: CssDecl[];
  /** Comment right before the block. */
  lead?: string;
  /** Comments inside the block after its last declaration. */
  trailing?: string;
}

/** Comment text as plain prose: no stars, no box rules, no em or en dashes. */
export function cleanComment(text: string): string {
  return (
    text
      .split('\n')
      .map((line) => line.replace(/^\s*\*+ ?/, '').trim())
      .join('\n')
      // A box rule ends a heading: whatever follows it is a new paragraph.
      .replace(/[ \t]*─{2,}[ \t]*/g, '\n\n')
      .split(/\n\s*\n/)
      .map((para) =>
        para
          .replace(/\s+/g, ' ')
          .replace(/^[─\s]+|[─\s]+$/g, '')
          .replaceAll(' \u2014 ', ', ')
          .replaceAll('\u2014', ', ')
          .replaceAll('\u2013', '-')
          .trim(),
      )
      .filter((para) => para !== '')
      .join('\n\n')
  );
}

const join = (parts: (string | undefined)[]) => {
  const text = parts.filter((p): p is string => !!p).join('\n\n');
  return text === '' ? undefined : text;
};

/** Comment written on the same line as a declaration: drop a bare hex. */
function inlineText(text: string): string | undefined {
  const cleaned = cleanComment(text).replace(/^#[0-9a-f]{6}\b\s*/i, '');
  return cleaned === '' ? undefined : cleaned;
}

export function readBlocks(css: string): CssBlockRead[] {
  const blocks: CssBlockRead[] = [];
  let pendingTop: string[] = [];
  postcss.parse(css).each((node) => {
    if (node.type === 'comment') {
      pendingTop.push(node.text);
      return;
    }
    const key = selectorKey(node);
    if (key === null || key === '@theme inline') {
      pendingTop = [];
      return;
    }
    const block: CssBlockRead = { key, decls: [] };
    const lead = join(pendingTop.map(cleanComment));
    if (lead) block.lead = lead;
    pendingTop = [];
    let pending: string[] = [];
    (node as Container).each((child) => {
      if (child.type === 'comment') {
        const prev = child.prev();
        const sameLine =
          prev?.type === 'decl' &&
          prev.source?.end?.line === child.source?.start?.line;
        const last = block.decls[block.decls.length - 1];
        if (sameLine && last) {
          const description = join([last.description, inlineText(child.text)]);
          if (description) last.description = description;
        } else {
          pending.push(child.text);
        }
        return;
      }
      if (child.type === 'decl' && child.prop.startsWith('--')) {
        const decl: CssDecl = { prop: child.prop, value: child.value };
        const description = join(pending.map(cleanComment));
        if (description) decl.description = description;
        pending = [];
        block.decls.push(decl);
      }
    });
    const trailing = join(pending.map(cleanComment));
    if (trailing) block.trailing = trailing;
    blocks.push(block);
  });
  return blocks;
}

export function typeForProp(prop: string): DtcgType {
  const name = prop.slice(2);
  if (
    name.startsWith('radius-') ||
    name === 'spacing' ||
    name.startsWith('tracking-')
  ) {
    return 'dimension';
  }
  if (name.startsWith('font-')) return 'fontFamily';
  if (name === 'shadow' || name.startsWith('shadow-')) return 'shadow';
  return 'color';
}

const alias = (cssName: string) => `{${cssNameToPath(cssName).join('.')}}`;

export function declToToken(
  decl: CssDecl,
  lookup: (path: string[]) => DtcgToken | undefined,
): DtcgToken {
  const $type = typeForProp(decl.prop);
  const value = decl.value.replace(/\s+/g, ' ').trim();
  const token: DtcgToken = { $type, $value: '' };
  const varRef = /^var\((--[\w-]+)\)$/.exec(value)?.[1];
  const scaled = /^calc\(var\((--[\w-]+)\) \* (\d*\.?\d+)\)$/.exec(value);
  if (varRef !== undefined) {
    token.$value = alias(varRef);
  } else if (scaled) {
    const [, baseName = '', factor = ''] = scaled;
    const from = alias(baseName);
    const base = lookup(cssNameToPath(baseName));
    if (!base || typeof base.$value === 'string') {
      throw new Error(`${decl.prop}: ${baseName} must be a literal dimension`);
    }
    const d = base.$value as DtcgDimension;
    const multiply = round6(Number(factor));
    token.$value = { value: round6(d.value * multiply), unit: d.unit };
    token.$extensions = { [DERIVE_EXTENSION]: { from, multiply } };
  } else if ($type === 'color') {
    token.$value = parseColor(value);
  } else if ($type === 'dimension' && /[\d.]em$/.test(value)) {
    // DTCG has no em unit. Only a zero length has an exact rem twin, so the
    // CSS keeps the em text and any other em length is refused.
    const em = /^(-?(?:\d+\.?\d*|\.\d+))em$/.exec(value)?.[1];
    if (em === undefined || round6(Number(em)) !== 0) {
      throw new Error(
        `${decl.prop}: only a zero em length is supported: ${value}`,
      );
    }
    token.$value = { value: 0, unit: 'rem' };
    token.$extensions = { [CSS_EXTENSION]: { value } };
  } else if ($type === 'dimension') {
    token.$value = parseDimension(value);
  } else if ($type === 'fontFamily') {
    token.$value = parseFontFamily(value);
  } else {
    token.$value = parseShadow(value);
  }
  if (decl.description) token.$description = decl.description;
  return token;
}

const primitiveFileOf = (path: string[]): string => {
  const [head = ''] = path;
  if (head === 'color') return 'primitive/color.json';
  if (head === 'radius') return 'primitive/radius.json';
  if (head === 'font') return 'primitive/font.json';
  if (head === 'spacing' || head === 'tracking') {
    return 'primitive/spacing.json';
  }
  if (head === 'shadow' || head.startsWith('shadow-')) {
    return 'primitive/shadow.json';
  }
  throw new Error(`No primitive file for ${path.join('.')}`);
};

export function seedPrimitives(themeCss: string): Record<string, DtcgGroup> {
  const files: Record<string, DtcgGroup> = {};
  for (const file of Object.keys(PRIMITIVE_FILES)) files[file] = {};
  const groupFor = (path: string[]): DtcgGroup => {
    const file = primitiveFileOf(path);
    const group = files[file];
    if (!group) throw new Error(`${file} is not a primitive file`);
    return group;
  };
  const lookup = (path: string[]) =>
    getPath(groupFor(path), path) as DtcgToken | undefined;
  for (const block of readBlocks(themeCss)) {
    const decls =
      block.key === '@theme'
        ? block.decls
        : block.key === ':root'
          ? block.decls.filter((d) => typeForProp(d.prop) === 'shadow')
          : [];
    for (const decl of decls) {
      const path = cssNameToPath(decl.prop);
      setPath(groupFor(path), path, declToToken(decl, lookup));
    }
  }
  return files;
}

export function seedSemantic(themeCss: string): {
  light: DtcgGroup;
  dark: DtcgGroup;
} {
  const out = { light: {} as DtcgGroup, dark: {} as DtcgGroup };
  const noLookup = () => undefined;
  for (const block of readBlocks(themeCss)) {
    const target =
      block.key === ':root'
        ? out.light
        : block.key === '.dark'
          ? out.dark
          : null;
    if (!target) continue;
    for (const decl of block.decls) {
      if (typeForProp(decl.prop) === 'shadow') continue;
      setPath(target, cssNameToPath(decl.prop), declToToken(decl, noLookup));
    }
  }
  return out;
}

export function seedTheme(themeFileCss: string, theme: NamedTheme): DtcgGroup {
  const out: DtcgGroup = { light: {}, dark: {} };
  const noLookup = () => undefined;
  const selector = `:root[data-theme='${theme}']`;
  for (const block of readBlocks(themeFileCss)) {
    const mode =
      block.key === selector
        ? 'light'
        : block.key === `${selector}.dark`
          ? 'dark'
          : null;
    if (!mode) continue;
    const group = out[mode] as DtcgGroup;
    if (mode === 'light' && block.lead) out.$description = block.lead;
    const description = [
      mode === 'dark' ? block.lead : undefined,
      block.trailing,
    ]
      .filter(Boolean)
      .join('\n\n');
    if (description) group.$description = description;
    for (const decl of block.decls) {
      setPath(group, cssNameToPath(decl.prop), declToToken(decl, noLookup));
    }
  }
  return { $description: out.$description, light: out.light, dark: out.dark };
}
