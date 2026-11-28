'use client';

import * as React from 'react';

import { cn } from '@gremorie/rx-core';

/**
 * Textarea - multi-line text field.
 *
 * Uses `field-sizing: content` so the field grows automatically as
 * the user types - no manual rows or JS measurement needed in modern
 * browsers. Pair with descriptive labels and validation messages.
 */
export type TextareaProps = React.ComponentProps<'textarea'> & {
  /**
   * Show the browser's resize handle (vertical only). Off by default: the
   * field grows with its content up to max-h-64, then scrolls.
   */
  resizable?: boolean;
};

function Textarea({ className, resizable = false, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-16 max-h-64 w-full rounded-sm border border-transparent bg-field px-3 py-2 text-base transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm',
        resizable ? 'resize-y' : 'resize-none',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
