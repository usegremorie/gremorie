import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { parseColor, toOklchString, toHex } from "../util/color";
import { useProject } from "../state/store";

export function RawColumn() {
  const { graph, selectedTheme, selectedMode, queueChange } = useProject();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  if (!graph) return null;
  const primitives = Object.values(graph.primitives).filter((p: any) =>
    p.name.startsWith("--color-") && p.theme === selectedTheme && p.mode === selectedMode
  );

  const current = primitives.find((p: any) => p.name === selectedToken);
  const currentColor = current ? parseColor((current as any).value) : undefined;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Raw</h3>
      <ul className="flex flex-col gap-1 max-h-[420px] overflow-auto">
        {primitives.map((p: any) => (
          <li key={p.name}>
            <button
              onClick={() => setSelectedToken(p.name)}
              className={`flex w-full items-center gap-2 rounded-md border border-input px-2 py-1 text-left text-xs hover:bg-accent ${
                selectedToken === p.name ? "ring-2 ring-ring" : ""
              }`}
            >
              <span
                className="size-4 rounded-sm border border-border"
                style={{ background: p.value }}
              />
              <span className="font-mono truncate">{p.name}</span>
            </button>
          </li>
        ))}
      </ul>
      {currentColor && (
        <div className="mt-3 flex flex-col gap-2">
          <HexColorPicker
            color={toHex(currentColor)}
            onChange={(hex) => {
              const next = parseColor(hex);
              if (!next || !selectedToken) return;
              queueChange({
                kind: "primitive-value",
                tokenName: selectedToken,
                newValue: toOklchString(next)
              });
            }}
          />
          <code className="text-xs">{(current as any).value}</code>
        </div>
      )}
    </div>
  );
}
