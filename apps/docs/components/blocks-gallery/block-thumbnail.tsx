'use client';

import { cn } from '@gremorie/rx-core';
import dynamic from 'next/dynamic';

/** Pulsing placeholder shown while a block chunk streams in. */
function ThumbnailSkeleton() {
  return (
    <div className="size-full animate-pulse bg-muted" aria-hidden="true" />
  );
}

/**
 * Each featured block is loaded through `next/dynamic` so the /blocks
 * index only ships one small chunk per thumbnail instead of bundling
 * every block (the Assistant alone composes most of rx-ai) into the
 * page. `scale` is tuned per block so its natural layout width fits
 * the card: the inner frame renders at `100% / scale` of the card and
 * is scaled back down, the shadcn /blocks approach.
 */
const BLOCKS = {
  'sign-in': {
    Component: dynamic(
      () => import('@/components/preview/blocks/sign-in').then((m) => m.SignIn),
      { loading: ThumbnailSkeleton },
    ),
    scale: 0.5,
  },
  dashboard: {
    Component: dynamic(
      () =>
        import('@/components/preview/blocks/dashboard').then(
          (m) => m.Dashboard,
        ),
      { loading: ThumbnailSkeleton },
    ),
    scale: 0.35,
  },
  assistant: {
    Component: dynamic(
      () =>
        import('@/components/preview/blocks/assistant').then(
          (m) => m.Assistant,
        ),
      { loading: ThumbnailSkeleton },
    ),
    scale: 0.4,
  },
  'settings-form': {
    Component: dynamic(
      () =>
        import('@/components/preview/blocks/settings-form').then(
          (m) => m.SettingsForm,
        ),
      { loading: ThumbnailSkeleton },
    ),
    scale: 0.4,
  },
  'empty-state': {
    Component: dynamic(
      () =>
        import('@/components/preview/blocks/empty-state').then(
          (m) => m.EmptyState,
        ),
      { loading: ThumbnailSkeleton },
    ),
    scale: 0.45,
  },
} as const;

export type BlockThumbnailName = keyof typeof BLOCKS;

/**
 * Miniature live preview of a featured block for the /blocks index
 * cards. Renders the REAL block component (no screenshots, no drift)
 * inside a fixed-aspect, overflow-hidden frame, scaled down with
 * `transform: scale()` from a wider virtual canvas. Purely decorative:
 * inert, hidden from assistive tech, and click-through so the parent
 * card link stays the only interactive surface.
 */
export function BlockThumbnail({
  name,
  className,
}: {
  name: BlockThumbnailName;
  className?: string;
}) {
  const { Component, scale } = BLOCKS[name];
  return (
    <div
      aria-hidden="true"
      inert
      className={cn(
        'pointer-events-none aspect-video w-full select-none overflow-hidden rounded-lg border bg-muted/20',
        className,
      )}
    >
      <div
        className="flex justify-center p-6"
        style={{
          width: `${100 / scale}%`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <Component />
      </div>
    </div>
  );
}
