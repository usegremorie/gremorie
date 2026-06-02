import type { ReactNode } from 'react';

export function Layout({
  editor,
  showcase,
}: {
  editor: ReactNode;
  showcase: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,520px)] gap-6 px-6 py-4 min-h-[calc(100vh-3.5rem)]">
      <section aria-label="Editor">{editor}</section>
      <section aria-label="Preview" className="border-l border-border pl-6">
        {showcase}
      </section>
    </div>
  );
}
