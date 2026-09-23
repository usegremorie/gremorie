'use client';

import { Button } from '@gremorie/rx-forms';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

/**
 * One copyable shell command, drawn as a Fumadocs code block.
 *
 * Single definition of what a command looks like on this site: the hero's
 * install box stacks tabs on top of one of these, and the Assistant showcase
 * stacks two. The measurements come from a rendered tabbed code block in the
 * docs (`/get-started/installation`), so the landing and the docs show the
 * same object:
 *
 *   figure  bg-fd-card rounded-xl border shadow-sm, overflow hidden
 *   pre     13px mono, px-4 py-3
 *   copy    absolute top-3 right-2, backdrop-blur-lg, 24x24 hit area
 *
 * Dogfood: the copy control is an rx-forms Button; only the surface tokens
 * are Fumadocs', which is what makes it read as the docs' own chrome.
 */
export function CommandLine({
  command,
  label,
  className,
}: {
  /** The command, without the `$` prompt - that is drawn for you. */
  command: string;
  /** Accessible name for the copy control; defaults to the command itself. */
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const name = label ?? command;

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions / insecure context): no-op.
    }
  }

  return (
    <figure
      className={`relative m-0 overflow-hidden rounded-xl border bg-fd-card shadow-sm ${className ?? ''}`}
    >
      {/* Centred, not pinned to the top: this is a one-line field, and at
          top-3 the control sat 6px below the middle of a 46px box. */}
      <div className="-translate-y-1/2 absolute top-1/2 right-2 z-2 rounded-lg text-fd-muted-foreground backdrop-blur-lg">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={copy}
          aria-label={copied ? `Copied ${name}` : `Copy ${name}`}
        >
          {copied ? (
            <Check className="size-4 text-success" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
        </Button>
      </div>
      {/* No horizontal scroll. A command that overflows by a few pixels grew
          a scrollbar that ate 10px of height, so one field stood taller than
          the next. The field is for copying, not for reading long lines: the
          button takes the whole command either way. */}
      <pre className="overflow-hidden px-4 py-3 pr-12 font-mono text-[13px] text-fd-foreground">
        <code className="block truncate">
          <span
            className="select-none text-fd-muted-foreground"
            aria-hidden="true"
          >
            ${' '}
          </span>
          {command}
        </code>
      </pre>
    </figure>
  );
}
