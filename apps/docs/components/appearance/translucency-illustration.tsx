import type { Translucency } from '@/lib/appearance';

/**
 * A tiny scene for each translucency option: a card with two text lines and a
 * coloured block, and a menu over it. Solid: the menu hides the block.
 * Subtle: the block shows through the menu, blurred. Immersive: the page
 * takes the colour and the card and the menu turn to glass.
 * Only tokens: it follows light, dark and the accent colour.
 */
export function TranslucencyIllustration({ mode }: { mode: Translucency }) {
  const id = `ill-${mode}`;
  const immersive = mode === 'immersive';
  const seed = 'var(--seed, var(--muted-foreground))';
  const glass = 'color-mix(in oklab, var(--popover) 55%, transparent)';
  const scene = (
    <>
      <rect fill="var(--background)" height="60" width="88" />
      {immersive && (
        <>
          <rect fill={seed} height="60" opacity="0.16" width="88" />
          <circle
            cx="14"
            cy="10"
            fill={seed}
            filter={`url(#${id}-soft)`}
            opacity="0.32"
            r="22"
          />
          <circle
            cx="80"
            cy="56"
            fill={seed}
            filter={`url(#${id}-soft)`}
            opacity="0.22"
            r="20"
          />
        </>
      )}
      <rect
        fill={immersive ? glass : 'var(--card)'}
        height="40"
        rx="5"
        stroke="var(--border)"
        width="50"
        x="6"
        y="7"
      />
      <g fill="var(--muted-foreground)" opacity="0.55">
        <rect height="3" rx="1.5" width="34" x="12" y="13" />
        <rect height="3" rx="1.5" width="24" x="12" y="20" />
      </g>
      <rect
        fill={seed}
        height="13"
        opacity="0.9"
        rx="3"
        width="38"
        x="12"
        y="28"
      />
    </>
  );

  return (
    <svg
      aria-hidden="true"
      className="h-15 w-22 shrink-0 rounded-lg ring-1 ring-border"
      viewBox="0 0 88 60"
    >
      <defs>
        <clipPath id={`${id}-frame`}>
          <rect height="60" rx="8" width="88" />
        </clipPath>
        <clipPath id={`${id}-menu`}>
          <rect height="30" rx="5" width="40" x="30" y="18" />
        </clipPath>
        <filter height="140%" id={`${id}-blur`} width="140%" x="-20%" y="-20%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <filter height="200%" id={`${id}-soft`} width="200%" x="-50%" y="-50%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <g clipPath={`url(#${id}-frame)`}>
        {scene}
        {mode !== 'solid' && (
          <g clipPath={`url(#${id}-menu)`}>
            <g filter={`url(#${id}-blur)`}>{scene}</g>
          </g>
        )}
        <rect
          fill={mode === 'solid' ? 'var(--popover)' : glass}
          height="30"
          rx="5"
          stroke="var(--border)"
          width="40"
          x="30"
          y="18"
        />
        <g fill="var(--foreground)" opacity="0.75">
          <rect height="2.5" rx="1.25" width="18" x="35" y="24" />
          <rect height="2.5" rx="1.25" width="24" x="35" y="31" />
          <rect height="2.5" rx="1.25" width="14" x="35" y="38" />
        </g>
        <rect
          fill="var(--primary)"
          height="6"
          opacity="0.14"
          rx="2"
          width="34"
          x="33"
          y="29.3"
        />
      </g>
    </svg>
  );
}
