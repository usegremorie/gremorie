import { ChevronRight } from "lucide-react";
import type { ComponentInfo } from "@gremorie/token-engine/graph/types";

export function ButtonShowcase({ info }: { info: ComponentInfo | undefined }) {
  if (!info) {
    return <p className="text-xs text-muted-foreground">No Button cva found in project.</p>;
  }
  const variants = info.variants.variant ?? ["default"];
  const base = info.baseClasses;

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Button</h4>
      <div className="flex flex-wrap items-center gap-2">
        {variants.map((v) => {
          const classes = `${base} ${info.classesByVariant.variant?.[v] ?? ""} ${info.classesByVariant.size?.default ?? ""}`;
          return (
            <button key={v} className={classes}>
              <span>{v}</span>
              <ChevronRight className="ml-1 size-4" aria-hidden />
            </button>
          );
        })}
      </div>
    </div>
  );
}
