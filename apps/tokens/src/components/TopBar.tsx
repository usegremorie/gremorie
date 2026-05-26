import { useProject } from "../state/store";

export function TopBar() {
  const { selectedMode, toggleMode, project, pendingChanges, apply } = useProject();

  const onApply = async () => {
    const gs = useProject.getState().gitStatus;
    if (gs?.dirty) {
      const ok = window.confirm(
        `Your git tree is dirty on branch ${gs.branch ?? "detached HEAD"}.\nApply changes anyway?`
      );
      if (!ok) return;
    }
    await apply();
  };

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-3">
        <span className="font-semibold">Tokens</span>
        {project && (
          <span className="text-sm text-muted-foreground truncate max-w-[40ch]">
            {project.root}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMode}
          className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent"
          aria-label="Toggle light/dark"
          title="Mod+Shift+L"
        >
          {selectedMode === "light" ? "Light" : "Dark"}
        </button>
        <button
          onClick={onApply}
          disabled={pendingChanges.length === 0}
          className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50"
        >
          Apply ({pendingChanges.length})
        </button>
      </div>
    </header>
  );
}
