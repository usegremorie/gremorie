import type { CSSProperties } from 'react';
import { useProject } from '../state/store';
import { ButtonShowcase } from './templates/Button';
import type { Change } from '@gremorie/token-engine/serializer/apply-changes';

function buildInlineStyle(
  graph: any,
  theme: string,
  mode: 'light' | 'dark',
  changes: Change[],
): CSSProperties {
  const style: Record<string, string> = {};
  if (!graph) return style as CSSProperties;

  // primitives → CSS custom properties
  for (const p of Object.values(graph.primitives) as any[]) {
    if (p.theme === theme && p.mode === mode) style[p.name] = p.value;
  }
  // semantics: literals set directly; references use CSS var() so the browser cascades automatically
  for (const s of Object.values(graph.semantics) as any[]) {
    if (s.theme !== theme || s.mode !== mode) continue;
    if (s.value.kind === 'literal') style[s.name] = s.value.raw;
    else style[s.name] = `var(${s.value.targetName})`;
  }
  // overlay pending changes
  for (const c of changes) {
    if (c.kind === 'primitive-value') style[c.tokenName] = c.newValue;
    else if (c.theme === theme && c.mode === mode) {
      if (c.newValue.kind === 'literal') style[c.tokenName] = c.newValue.raw;
      else style[c.tokenName] = `var(${c.newValue.targetName})`;
    }
  }
  return style as CSSProperties;
}

export function Showcase() {
  const { graph, selectedTheme, selectedMode, pendingChanges } = useProject();
  if (!graph) return null;
  const style = buildInlineStyle(
    graph,
    selectedTheme,
    selectedMode,
    pendingChanges,
  );
  return (
    <div className="flex flex-col gap-6" style={style}>
      <ButtonShowcase info={graph.components.Button} />
    </div>
  );
}
