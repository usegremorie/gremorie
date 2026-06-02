'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import * as React from 'react';
import { Toaster as Sonner, toast, type ToasterProps } from 'sonner';

/**
 * Toaster - root mount for transient toast notifications.
 *
 * Wraps `sonner` (by emil kowalski) with KDS tokens. Mount this
 * component **once** at the root of the app (typically in
 * `app/layout.tsx`) so any descendent can fire `toast()` without
 * an additional provider.
 *
 * Sonner is for transient feedback ("Salvo", "Convite enviado",
 * "Falhou - tentar novamente"). For persistent in-flow messages
 * use `Alert` (`@kalvner/kds/feedback/alert`). For critical errors
 * that need acknowledgment, use `AlertDialog`.
 *
 * Theme follows the document's `.dark` class - the KDS dark-mode
 * convention. Pass a `theme` prop explicitly when mounting outside
 * a themed context.
 */
const Toaster = ({ theme, ...props }: ToasterProps) => {
  const [resolvedTheme, setResolvedTheme] = React.useState<
    ToasterProps['theme']
  >(theme ?? 'system');

  React.useEffect(() => {
    if (theme || typeof document === 'undefined') return;
    const root = document.documentElement;
    const update = () =>
      setResolvedTheme(root.classList.contains('dark') ? 'dark' : 'light');
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [theme]);

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster, toast };
