import { useEffect, useRef } from 'react';

const SHORTCUTS = [
  { keys: 'Mod+Shift+L', action: 'Toggle light/dark' },
  { keys: 'Mod+S', action: 'Apply changes' },
  { keys: '?', action: 'Show this sheet' },
  { keys: 'Esc', action: 'Close modal' },
];

export function CheatSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="rounded-lg border border-border bg-card p-6 shadow-xl outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold">Keyboard shortcuts</h2>
        <table className="text-sm">
          <tbody>
            {SHORTCUTS.map((s) => (
              <tr key={s.keys}>
                <td className="pr-6 font-mono text-xs">{s.keys}</td>
                <td>{s.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
