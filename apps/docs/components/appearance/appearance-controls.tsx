'use client';

import { parseColor } from '@gremorie/headless/color-picker';
import { cn } from '@gremorie/rx-core';
import {
  Button,
  ColorPicker,
  ColorPickerChannelInput,
  ColorPickerChannelSlider,
  ColorPickerContent,
  ColorPickerSaveTrigger,
  ColorPickerSavedColors,
  type ColorPickerValueChangeDetails,
} from '@gremorie/rx-forms';
import { Tooltip, TooltipContent, TooltipTrigger } from '@gremorie/rx-overlays';
import { BlendIcon, LayersIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { copyFor } from './copy';
import { ResponsiveMenu } from './responsive-menu';
import { TranslucencyIllustration } from './translucency-illustration';

import {
  ACCENTS,
  DEFAULT_APPEARANCE,
  TRANSLUCENCIES,
  applyAppearance,
  readAppearance,
  seedFromColor,
  writeAppearance,
  type Accent,
  type Appearance,
} from '@/lib/appearance';

/** Swatch fill: the accent's 500 primitive; neutral is half foreground, half page. */
const swatch = (a: Accent) =>
  a === 'neutral'
    ? 'conic-gradient(var(--foreground) 0 50%, var(--background) 0)'
    : `var(--color-${a}-500)`;

/**
 * What the picker shows for a DS colour: its 500 primitive, read from the
 * stylesheet, so dragging from it starts where the eye already is.
 */
function primitiveColor(a: Accent): string {
  const fallback = 'oklch(0.64 0 0)';
  if (typeof window === 'undefined') return fallback;
  const name = a === 'neutral' ? '--color-gray-500' : `--color-${a}-500`;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return parseColor(value) ? value : fallback;
}

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

  const stateRef = useRef(state);
  stateRef.current = state;
  const update = (patch: Partial<Appearance>, save = true) => {
    const next = { ...stateRef.current, ...patch };
    stateRef.current = next;
    setState(next);
    applyAppearance(next);
    if (save) writeAppearance(next);
  };

  // The picker edits a custom seed: hue and intensity, capped where the button
  // text keeps 4.5:1. While dragging the page follows; the choice is saved
  // when the drag ends.
  const pickerValue =
    state.accent === 'custom'
      ? state.seed
      : mounted
        ? primitiveColor(state.accent)
        : 'oklch(0.64 0 0)';
  const pick = (d: ColorPickerValueChangeDetails, save: boolean) => {
    const seed = seedFromColor(d.value);
    if (
      stateRef.current.accent === 'custom' &&
      stateRef.current.seed === seed &&
      !save
    )
      return;
    update({ accent: 'custom', seed }, save);
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
            style={{
              background:
                state.accent === 'custom' ? state.seed : swatch(state.accent),
            }}
          />
        }
        label={t.accent}
        title={t.accent}
      >
        <div
          aria-label={t.accent}
          className="flex flex-wrap gap-2.5 p-1"
          role="radiogroup"
        >
          {ACCENTS.map((a) => (
            <button
              aria-checked={state.accent === a}
              aria-label={t.colors[a]}
              className="size-7 rounded-full ring-1 ring-border ring-inset outline-offset-2 transition-[outline-color] focus-visible:outline-2 focus-visible:outline-ring aria-checked:outline-2 aria-checked:outline-foreground"
              key={a}
              onClick={() => update({ accent: a, seed: '' })}
              role="radio"
              style={{ background: swatch(a) }}
              title={t.colors[a]}
              type="button"
            />
          ))}
        </div>
        <div
          className="mt-3 grid gap-2.5 border-t pt-3"
          data-slot="appearance-custom-color"
        >
          <div>
            <p className="font-medium text-sm">{t.custom}</p>
            <p className="text-muted-foreground text-xs">{t.customHint}</p>
          </div>
          <ColorPicker
            inline
            value={pickerValue}
            defaultFormat="hex"
            onValueChange={(d) => pick(d, false)}
            onValueChangeEnd={(d) => pick(d, true)}
            savedColors={state.saved}
            onSavedColorsChange={(saved) => update({ saved })}
            channelLabels={{ hue: t.hue, chroma: t.chroma, degrees: t.degrees }}
          >
            <ColorPickerContent className="w-full">
              <ColorPickerChannelSlider aria-label={t.hue} channel="hue" />
              <ColorPickerChannelSlider
                aria-label={t.chroma}
                channel="chroma"
              />
              <div className="flex items-center gap-2">
                <ColorPickerChannelInput
                  aria-label={t.hex}
                  channel="hex"
                  className="flex-1"
                />
              </div>
              <ColorPickerSavedColors aria-label={t.savedColors}>
                <ColorPickerSaveTrigger aria-label={t.saveColor} />
              </ColorPickerSavedColors>
            </ColorPickerContent>
          </ColorPicker>
        </div>
      </ResponsiveMenu>

      <ResponsiveMenu
        description={t.translucencyHint}
        icon={<LayersIcon aria-hidden="true" />}
        label={t.translucency}
        title={t.translucency}
      >
        <div
          aria-label={t.translucency}
          className="grid gap-0.5"
          role="radiogroup"
        >
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
                <span className="block font-medium text-sm">
                  {t.modes[mode].name}
                </span>
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
        {dark ? (
          <SunIcon aria-hidden="true" />
        ) : (
          <MoonIcon aria-hidden="true" />
        )}
      </IconButton>
    </div>
  );
}
