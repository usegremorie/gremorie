'use client';

import { cn } from '@gremorie/rx-core';
import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import { Progress } from '@gremorie/rx-feedback';
import { Button, Input, Label, Slider, Switch } from '@gremorie/rx-forms';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gremorie/rx-navigation';
import { ArrowRight, MoonIcon, RotateCcw, SunIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import type { CSSProperties } from 'react';

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

const SEATS_USED = 8;
const SEATS_TOTAL = 12;

/**
 * Tweakcn-style live playground. The controls column stays; the preview is
 * now ONE Card with a header row (title, live dot, dark/light toggle) whose
 * body composes a credible mini product surface from REAL Gremorie
 * primitives: Tabs, Label + Input, Switch, Badge, Progress and Buttons.
 *
 * Scoped variable wiring: instead of one-off `--demo-*` variables consumed
 * by fake divs, the controls now override the REAL semantic tokens
 * (`--primary`, `--radius-*`, `--text-*`) inline on the preview body, so the
 * genuine primitives restyle themselves - the same mechanism a consumer
 * uses to retheme an app, just scoped to this card.
 *
 * Two scoping gotchas encoded below:
 * - `--radius-sm/md/lg/xl` are DERIVED from `--radius-base` at :root, and
 *   CSS resolves `var()` inside custom properties at the element that
 *   declares them - so the derived radii must be re-declared here to
 *   re-bind them to the scoped `--radius-base`.
 * - The dark/light header toggle applies the `dark` class to the preview
 *   body only (assistant-showcase.tsx pattern); the inline `--primary`
 *   override intentionally wins over `.dark`'s remap so the chosen hue
 *   persists across both modes.
 */
export function ThemePlayground() {
  const [hue, setHue] = useState<Hue>(HUE_VIOLET);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [fontScale, setFontScale] = useState(DEFAULT_FONT_SCALE);
  const [previewDark, setPreviewDark] = useState(false);

  const isDirty =
    hue.value !== HUE_VIOLET.value ||
    radius !== DEFAULT_RADIUS ||
    fontScale !== DEFAULT_FONT_SCALE;

  const reset = () => {
    setHue(HUE_VIOLET);
    setRadius(DEFAULT_RADIUS);
    setFontScale(DEFAULT_FONT_SCALE);
  };

  // Scoped token overrides for the preview body. `--primary-foreground`
  // pins to the gray-50 primitive (the same value the default token uses)
  // so every hue keeps readable on-primary text in both modes.
  const previewVars: CSSProperties = {
    ['--primary' as string]: `hsl(${hue.hsl})`,
    ['--primary-foreground' as string]: 'var(--color-gray-50)',
    ['--ring' as string]: `hsl(${hue.hsl})`,
    ['--radius-base' as string]: `${radius}px`,
    ['--radius-sm' as string]: 'calc(var(--radius-base) * 0.6)',
    ['--radius-md' as string]: 'calc(var(--radius-base) * 0.8)',
    ['--radius-lg' as string]: 'var(--radius-base)',
    ['--radius-xl' as string]: 'calc(var(--radius-base) * 1.2)',
    ['--text-xs' as string]: `calc(0.75rem * ${fontScale})`,
    ['--text-sm' as string]: `calc(0.875rem * ${fontScale})`,
    ['--text-base' as string]: `calc(1rem * ${fontScale})`,
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
              retheme your entire app. The settings panel below is built from
              real Gremorie primitives; try a few changes.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/tokens">
              Customize tokens
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_2fr]">
          {/* Controls */}
          <Card className="gap-6 py-6">
            <CardHeader>
              <CardTitle className="text-sm">Controls</CardTitle>
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  disabled={!isDirty}
                  aria-label="Reset playground to defaults"
                  className="-my-1 h-7 gap-1.5 text-xs"
                >
                  <RotateCcw className="size-3" aria-hidden="true" />
                  Reset
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
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
            </CardContent>
          </Card>

          {/* Preview: one Card. Header row = title + live dot + dark/light
              toggle; body = the scoped mini product surface. */}
          <Card className="gap-0 overflow-hidden py-0">
            <CardHeader className="py-4">
              <CardTitle className="text-sm">Live preview</CardTitle>
              <CardDescription className="text-xs">
                Real components, restyled by the controls
              </CardDescription>
              <CardAction className="flex items-center gap-3 self-center">
                <span
                  className="relative inline-flex size-2"
                  aria-hidden="true"
                >
                  <span className="absolute inline-flex size-full rounded-full bg-success opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => setPreviewDark((d) => !d)}
                  aria-label={
                    previewDark
                      ? 'Switch preview to light'
                      : 'Switch preview to dark'
                  }
                >
                  {previewDark ? (
                    <SunIcon className="size-4" aria-hidden="true" />
                  ) : (
                    <MoonIcon className="size-4" aria-hidden="true" />
                  )}
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent className="border-t p-0">
              <div
                className={cn(
                  'bg-background p-6 text-foreground sm:p-10',
                  previewDark && 'dark',
                )}
                style={previewVars}
              >
                <div className="mx-auto w-full max-w-lg">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        Workspace settings
                      </h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Manage your workspace profile and billing.
                      </p>
                    </div>
                    <Badge>Pro plan</Badge>
                  </div>

                  <Tabs defaultValue="general">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="billing">Billing</TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="general"
                      className="mt-5 flex flex-col gap-5"
                    >
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="tp-workspace-name">
                          Workspace name
                        </Label>
                        <Input
                          id="tp-workspace-name"
                          defaultValue="Gremorie Labs"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-0.5">
                          <Label htmlFor="tp-notifications">
                            Email notifications
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Product updates and billing alerts.
                          </p>
                        </div>
                        <Switch id="tp-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Button>Save changes</Button>
                        <Button variant="outline">Cancel</Button>
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="billing"
                      className="mt-5 flex flex-col gap-5"
                    >
                      <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-medium text-foreground">
                            Pro plan
                          </p>
                          <p className="text-xs text-muted-foreground">
                            USD 24 per seat, billed monthly.
                          </p>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">
                            Seats used
                          </span>
                          <span className="text-muted-foreground">
                            {SEATS_USED} of {SEATS_TOTAL}
                          </span>
                        </div>
                        <Progress
                          value={(SEATS_USED / SEATS_TOTAL) * 100}
                          aria-label={`Seats used: ${SEATS_USED} of ${SEATS_TOTAL}`}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Button>Upgrade plan</Button>
                        <Button variant="outline">Manage billing</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
