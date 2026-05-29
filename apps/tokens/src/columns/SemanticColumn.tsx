import { useState } from "react";
import { useProject } from "../state/store";

export function SemanticColumn() {
  const { graph, selectedTheme, selectedMode, queueChange } = useProject();
  const [editing, setEditing] = useState<string | null>(null);

  if (!graph) return null;
  const semantics = Object.values(graph.semantics).filter((s: any) =>
    s.theme === selectedTheme && s.mode === selectedMode
  );
  const primitives = Object.values(graph.primitives).filter((p: any) =>
    p.theme === selectedTheme && p.mode === selectedMode && p.name.startsWith("--color-")
  );

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Semantic</h3>
      <ul className="flex flex-col gap-1 max-h-[480px] overflow-auto">
        {semantics.map((s: any) => {
          const targetName = s.value.kind === "reference" ? s.value.targetName : null;
          const target = targetName ? graph.primitives[`${s.theme}::${s.mode}::${targetName}`] : null;
          return (
            <li key={s.name} className="flex flex-col gap-1 rounded-md border border-input px-2 py-1">
              <div className="flex items-center gap-2">
                <span
                  className="size-4 rounded-sm border border-border"
                  style={{ background: target ? target.value : (s.value.raw ?? "transparent") }}
                />
                <code className="text-xs font-mono">{s.name}</code>
              </div>
              <button
                onClick={() => setEditing(editing === s.name ? null : s.name)}
                className="text-left text-xs text-muted-foreground hover:text-foreground"
              >
                → {targetName ?? s.value.raw}
              </button>
              {editing === s.name && (
                <select
                  className="rounded-sm border border-input bg-background px-2 py-1 text-xs"
                  value={targetName ?? ""}
                  onChange={(e) => {
                    queueChange({
                      kind: "semantic-value",
                      tokenName: s.name,
                      theme: s.theme,
                      mode: s.mode,
                      newValue: { kind: "reference", targetName: e.target.value }
                    });
                    setEditing(null);
                  }}
                >
                  <option value="" disabled>Pick primitive…</option>
                  {primitives.map((p: any) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              )}
              <a
                href={`https://gremorie.com/foundations/tokens#${s.name.replace(/^--/, "")}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-muted-foreground underline hover:text-foreground"
              >
                Learn →
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
