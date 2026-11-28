import type { ReactNode } from 'react';

/** A phone-sized frame so a fixed bottom bar renders inside the preview. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-[480px] w-full max-w-[375px] overflow-hidden rounded-[2.5rem] border border-border bg-background">
      <div className="space-y-3 p-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-20 rounded-xl bg-muted" />
        ))}
      </div>
      {children}
    </div>
  );
}
