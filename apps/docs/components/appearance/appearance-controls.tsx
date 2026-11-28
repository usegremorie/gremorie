'use client';

import { cn } from '@gremorie/rx-core';
import { Button } from '@gremorie/rx-forms';
import { Tooltip, TooltipContent, TooltipTrigger } from '@gremorie/rx-overlays';
import { BlendIcon, LayersIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState, type ReactNode } from 'react';

import {
  ACCENTS,
  DEFAULT_APPEARANCE,
  TRANSLUCENCIES,
  applyAppearance,
  readAppearance,
  writeAppearance,
  type Accent,
  type Appearance,
} from '@/lib/appearance';
import { copyFor } from './copy';
import { ResponsiveMenu } from './responsive-menu';
import { TranslucencyIllustration } from './translucency-illustration';

/** Swatch fill: the accent's 500 primitive; neutral is half foreground, half page. */
const swatch = (a: Accent) =>
  a === 'neutral'
    ? 'conic-gradient(var(--foreground) 0 50%, var(--background) 0)'
    : `var(--color-${a}-500)`;

function IconButton({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          aria-pressed={pressed}
          className="aria-pressed:bg-accent"
          onClick={onClick}
          size="icon-sm"
          variant="ghost"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/**
 * The site's appearance controls: accent colour, translucency, tonal and
 * light/dark, as icon buttons with tooltips. Menus open as popovers on desktop
 * and as bottom drawers on a phone. Must sit inside a TooltipProvider.
 */
export function AppearanceControls({ lang }: { lang: string }) {
  const t = copyFor(lang);
  const { resolvedTheme, setTheme } = useTheme();
  const [state, setState] = useState<Appearance>(DEFAULT_APPEARANCE);
  const [mounted, setMounted] = useState(false);

  // The pre-paint script already applied the saved choice to <html>. After
  // hydration the controls read it back and apply it again, in case React
  // redrew <html> and dropped the attributes.
  useEffect(() => {
    const saved = readAppearance();
    setState(saved);
    applyAppearance(saved);
    setMounted(true);
  }, []);

  const update = (patch: Partial<Appearance>) => {
    const next = { ...state, ...patch };
    setState(next);
    applyAppearance(next);
    writeAppearance(next);
  };

  // The server cannot know the theme: the first render is always the light
  // one, so the markup hydrates; the real theme shows once mounted.
  const dark = mounted && resolvedTheme === 'dark';
  const themeLabel = dark ? t.themeLight : t.themeDark;

  return (
    <div className="flex items-center gap-0.5" data-slot="appearance-controls">
      <ResponsiveMenu
        description={t.accentHint}
        icon={
          <span
            aria-hidden="true"
            className="size-3.5 rounded-full ring-1 ring-border"
            style={{ background: swatch(state.accent) }}
          />
        }
        label={t.accent}
        title={t.accent}
      >
        <div aria-label={t.accent} className="flex flex-wrap gap-2.5 p-1" role="radiogroup">
          {ACCENTS.map((a) => (
            <button
              aria-checked={state.accent === a}
              aria-label={t.colors[a]}
              className="size-7 rounded-full ring-1 ring-border ring-inset outline-offset-2 transition-[outline-color] focus-visible:outline-2 focus-visible:outline-ring aria-checked:outline-2 aria-checked:outline-foreground"
              key={a}
              onClick={() => update({ accent: a })}
              role="radio"
              style={{ background: swatch(a) }}
              title={t.colors[a]}
              type="button"
            />
          ))}
        </div>
      </ResponsiveMenu>

      <ResponsiveMenu
        description={t.translucencyHint}
        icon={<LayersIcon aria-hidden="true" />}
        label={t.translucency}
        title={t.translucency}
      >
        <div aria-label={t.translucency} className="grid gap-0.5" role="radiogroup">
          {TRANSLUCENCIES.map((mode) => (
            <button
              aria-checked={state.translucency === mode}
              className={cn(
                'grid grid-cols-[auto_1fr] items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring aria-checked:bg-accent',
              )}
              key={mode}
              onClick={() => update({ translucency: mode })}
              role="radio"
              type="button"
            >
              <TranslucencyIllustration mode={mode} />
              <span>
                <span className="block font-medium text-sm">{t.modes[mode].name}</span>
                <span className="block text-muted-foreground text-xs">
                  {t.modes[mode].hint}
                </span>
              </span>
            </button>
          ))}
        </div>
      </ResponsiveMenu>

      <IconButton
        label={state.tonal ? t.tonalOn : t.tonal}
        onClick={() => update({ tonal: !state.tonal })}
        pressed={state.tonal}
      >
        <BlendIcon aria-hidden="true" />
      </IconButton>

      <IconButton
        label={themeLabel}
        onClick={() => setTheme(dark ? 'light' : 'dark')}
      >
        {dark ? <SunIcon aria-hidden="true" /> : <MoonIcon aria-hidden="true" />}
      </IconButton>
    </div>
  );
}
