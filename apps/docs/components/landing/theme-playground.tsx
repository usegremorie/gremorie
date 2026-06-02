'use client';

import { Card } from '@gremorie/rx-display';
import { Button, Slider } from '@gremorie/rx-forms';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Hue = {
  name: string;
  value: string;
  hsl: string;
};

const HUE_VIOLET: Hue = { name: 'Violet', value: 'violet', hsl: '262 83% 58%' };

const hues: Hue[] = [
  { name: 'Neutral', value: 'neutral', hsl: '240 5% 26%' },
  HUE_VIOLET,
  { name: 'Emerald', value: 'emerald', hsl: '160 84% 39%' },
  { name: 'Rose', value: 'rose', hsl: '346 84% 57%' },
  { name: 'Amber', value: 'amber', hsl: '38 92% 50%' },
  { name: 'Sky', value: 'sky', hsl: '199 89% 48%' },
];

const DEFAULT_RADIUS = 8;
const DEFAULT_FONT_SCALE = 1;

/**
 * Tweakcn-style live playground. Sliders/swatches mutate CSS variables
 * scoped to the preview card. No global token mutation, no theme writer
 * tied to localStorage, just a self-contained demo so visitors get the
 * shape of how Gremorie tokens flow.
 *
 * Visual additions (Deanna refresh):
 * - LIVE PREVIEW pulse indicator at top-right of preview - tells the user
 *   the area below reacts to controls
 * - Reset button restores violet/8px/1.0x default
 * - Preview area now shows 4 elements (button, secondary, input, badge)
 *   instead of just 1 - the original "shows only Button" was thin
 *
 * Dogfood: controls use rx-forms Slider + Button, preview uses
 * rx-display Card. Inner preview elements stay as raw HTML by design -
 * they re-style with scoped CSS variables and don't need to be primitives.
 */
export function ThemePlayground() {
  const [hue, setHue] = useState<Hue>(HUE_VIOLET);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [fontScale, setFontScale] = useState(DEFAULT_FONT_SCALE);

  const isDirty =
    hue.value !== HUE_VIOLET.value ||
    radius !== DEFAULT_RADIUS ||
    fontScale !== DEFAULT_FONT_SCALE;

  const reset = () => {
    setHue(HUE_VIOLET);
    setRadius(DEFAULT_RADIUS);
    setFontScale(DEFAULT_FONT_SCALE);
  };

  return (
    <section className="border-t border-border/60 bg-muted/20 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Theme everything with tokens
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Three layers: primitive, semantic, chart. Override at any layer to
              retheme your entire app. Try a few changes below.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/tokens">
              Customize tokens
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          {/* Controls */}
          <Card className="gap-6 px-6 py-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Controls
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={reset}
                disabled={!isDirty}
                aria-label="Reset playground to defaults"
                className="-mr-2 h-7 gap-1.5 text-xs"
              >
                <RotateCcw className="size-3" aria-hidden="true" />
                Reset
              </Button>
            </div>

            <div>
              <label
                htmlFor="hue-buttons"
                className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Primary hue
              </label>
              <div id="hue-buttons" className="flex flex-wrap gap-2">
                {hues.map((h) => (
                  <button
                    key={h.value}
                    type="button"
                    onClick={() => setHue(h)}
                    aria-pressed={hue.value === h.value}
                    aria-label={`Primary hue: ${h.name}`}
                    className={`size-9 rounded-full border-2 transition-all ${
                      hue.value === h.value
                        ? 'scale-110 border-foreground'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ background: `hsl(${h.hsl})` }}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{hue.name}</p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Border radius</span>
                <span className="font-mono normal-case tracking-normal text-foreground">
                  {radius}px
                </span>
              </div>
              <Slider
                value={[radius]}
                min={0}
                max={24}
                step={1}
                onValueChange={(v) => setRadius(v[0] ?? 0)}
                thumbAriaLabel="Border radius"
              />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Font scale</span>
                <span className="font-mono normal-case tracking-normal text-foreground">
                  {fontScale.toFixed(2)}x
                </span>
              </div>
              <Slider
                value={[fontScale]}
                min={0.9}
                max={1.1}
                step={0.01}
                onValueChange={(v) => setFontScale(v[0] ?? 1)}
                thumbAriaLabel="Font scale"
              />
            </div>
          </Card>

          {/* Preview: scoped via inline CSS variables. Plain divs inside
              so token changes stay local to the preview. */}
          <Card
            className="relative px-8 py-8"
            style={{
              ['--demo-primary' as string]: `hsl(${hue.hsl})`,
              ['--demo-radius' as string]: `${radius}px`,
              ['--demo-font-scale' as string]: fontScale,
              fontSize: `calc(1rem * var(--demo-font-scale))`,
            }}
          >
            {/* LIVE PREVIEW pulse - small pulsing dot + label. Tells user
                the area is responsive to the controls. */}
            <div
              className="absolute right-4 top-4 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              aria-hidden="true"
            >
              <span className="relative inline-flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              Live preview
            </div>

            <div
              className="border border-border p-6"
              style={{ borderRadius: 'var(--demo-radius)' }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="inline-flex size-6 items-center justify-center text-white"
                  style={{
                    background: 'var(--demo-primary)',
                    borderRadius: 'calc(var(--demo-radius) * 0.6)',
                  }}
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  Project Phoenix
                </h3>
                <span
                  className="ml-auto inline-flex h-6 items-center px-2 text-[10px] font-medium uppercase tracking-wider text-white"
                  style={{
                    background: 'var(--demo-primary)',
                    borderRadius: 'calc(var(--demo-radius) * 0.5)',
                  }}
                >
                  Active
                </span>
              </div>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Tokens propagate from primitive through semantic and into every
                primitive. Change one variable, restyle the system.
              </p>

              {/* Mini form row - input + button - shows form controls
                  picking up the radius token. */}
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  defaultValue="hello@gremorie.dev"
                  aria-label="Demo email input"
                  className="flex-1 border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-[var(--demo-primary)]"
                  style={{ borderRadius: 'var(--demo-radius)' }}
                />
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{
                    background: 'var(--demo-primary)',
                    borderRadius: 'var(--demo-radius)',
                  }}
                >
                  Subscribe
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{
                    background: 'var(--demo-primary)',
                    borderRadius: 'var(--demo-radius)',
                  }}
                >
                  Primary action
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  style={{ borderRadius: 'var(--demo-radius)' }}
                >
                  Secondary
                </button>
                <span
                  className="inline-flex h-7 items-center justify-center px-3 text-xs font-medium"
                  style={{
                    background:
                      'color-mix(in srgb, var(--demo-primary) 14%, transparent)',
                    color: 'var(--demo-primary)',
                    borderRadius: 'calc(var(--demo-radius) * 0.7)',
                  }}
                >
                  Badge
                </span>
              </div>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              Scoped preview. Try the sliders above.
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
