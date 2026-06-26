import type { ComponentProps, ReactNode } from 'react';

/**
 * Curated UI glyphs vendored in the Gremorie icon style, following lucide's
 * geometry: a 24x24 viewBox, no fill, and a 2px round `currentColor` stroke.
 * Size them via `className` (e.g. `size-4`), the same way the project uses
 * lucide. Decorative by default (`aria-hidden`); pass an `aria-label` for
 * standalone use and it stops being hidden.
 *
 * These live in `@gremorie/rx-icons` so a UI glyph the design system leans on
 * is owned by the project (stable name, vendored path) instead of reached for
 * ad hoc from `lucide-react` at every call site.
 */
export type UiIconProps = ComponentProps<'svg'>;

const UiIcon = ({
  children,
  ...props
}: UiIconProps & { children: ReactNode }) => (
  <svg
    aria-hidden={props['aria-label'] ? undefined : true}
    fill="none"
    height="1em"
    role="img"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {children}
  </svg>
);

/** Chat / conversation glyph (lucide `message-circle`). */
export const MessageCircle = (props: UiIconProps) => (
  <UiIcon {...props}>
    <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
  </UiIcon>
);
