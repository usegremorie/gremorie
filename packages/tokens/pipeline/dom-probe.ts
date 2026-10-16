import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { collectDeclarations } from './compare.ts';

export type ProbeKind =
  'color' | 'length' | 'font' | 'shadow' | 'letter-spacing';

export function probeKind(name: string): ProbeKind {
  if (name.startsWith('--radius') || name === '--spacing') return 'length';
  if (name.startsWith('--font-')) return 'font';
  if (name === '--shadow' || name.startsWith('--shadow-')) return 'shadow';
  if (name.startsWith('--tracking-')) return 'letter-spacing';
  return 'color';
}

/** Every token declared in the files, minus the `@theme inline` Tailwind wiring. */
export function probeTargets(
  cssFiles: string[],
): { name: string; kind: ProbeKind }[] {
  const names = new Set<string>();
  for (const css of cssFiles) {
    for (const [selector, decls] of collectDeclarations(css)) {
      if (selector === '@theme inline') continue;
      for (const name of decls.keys()) names.add(name);
    }
  }
  return [...names].sort().map((name) => ({ name, kind: probeKind(name) }));
}

/**
 * A browser expression (paste into the browser devtools console) that
 * switches every theme and mode on <html>, resolves each token through a
 * real CSS property and returns, per theme/mode, a count and an FNV-1a hash
 * of `name=value` lines.
 * With `only` ("claude/dark"), it returns that theme/mode's lines instead.
 */
export function probeScript(
  targets: { name: string; kind: ProbeKind }[],
  themes: string[],
  only?: string,
): string {
  return `(() => {
  const targets = ${JSON.stringify(targets)};
  const themes = ${JSON.stringify(themes)};
  const only = ${JSON.stringify(only ?? null)};
  const prop = { color: 'color', length: 'width', font: 'font-family', shadow: 'box-shadow', 'letter-spacing': 'letter-spacing' };
  const root = document.documentElement;
  const saved = { theme: root.getAttribute('data-theme'), dark: root.classList.contains('dark') };
  const host = document.createElement('div');
  host.style.cssText = 'position:absolute;left:-9999px;top:0;width:100px';
  document.body.appendChild(host);
  const out = {};
  for (const theme of themes) {
    for (const mode of ['light', 'dark']) {
      const key = theme + '/' + mode;
      if (only && only !== key) continue;
      if (theme === 'default') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', theme);
      root.classList.toggle('dark', mode === 'dark');
      const lines = [];
      for (const t of targets) {
        const el = document.createElement('div');
        el.style.setProperty(prop[t.kind], 'var(' + t.name + ')');
        host.appendChild(el);
        lines.push(t.name + '=' + getComputedStyle(el).getPropertyValue(prop[t.kind]));
      }
      host.replaceChildren();
      if (only) {
        out[key] = lines;
      } else {
        let h = 0x811c9dc5;
        for (const ch of lines.join('\\n')) {
          h ^= ch.codePointAt(0);
          h = Math.imul(h, 0x01000193) >>> 0;
        }
        out[key] = { count: lines.length, hash: h.toString(16) };
      }
    }
  }
  host.remove();
  if (saved.theme) root.setAttribute('data-theme', saved.theme);
  else root.removeAttribute('data-theme');
  root.classList.toggle('dark', saved.dark);
  return out;
})()`;
}

function main(): void {
  const args = process.argv.slice(2);
  const flag = (name: string) => {
    const i = args.indexOf(name);
    return i === -1 ? undefined : args[i + 1];
  };
  const themes = (flag('--themes') ?? 'default').split(',');
  const styles = fileURLToPath(new URL('../styles/', import.meta.url));
  const files = [
    readFileSync(join(styles, 'theme.css'), 'utf8'),
    ...themes
      .filter((t) => t !== 'default')
      .map((t) => readFileSync(join(styles, 'themes', `${t}.css`), 'utf8')),
  ];
  process.stdout.write(
    probeScript(probeTargets(files), themes, flag('--only')),
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
