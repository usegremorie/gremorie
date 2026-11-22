'use client';

import * as React from 'react';
import {
  useDropzone,
  type Accept,
  type FileError,
  type FileRejection,
} from 'react-dropzone';

import { cn } from '@gremorie/rx-core';
import { Button } from '../button';

/**
 * Dropzone - a drop target for files.
 *
 * Wraps `react-dropzone`: dropping files or activating the area (click, Enter
 * or Space) reports them split into accepted and rejected, validated against
 * `accept`, `maxSize` and `maxFiles`. The area is a single focus stop; the
 * title labels it and the description describes it. State is exposed as data
 * attributes (`data-drag-active`, `data-drag-reject`, `data-disabled`,
 * `data-invalid`), so children restyle with `group-data-[...]/dropzone`.
 *
 * Parts: `Dropzone`, `DropzoneIcon`, `DropzoneTitle`, `DropzoneDescription`,
 * `DropzoneAction`. The component reports files; it does not render the file
 * list or the rejection messages.
 */

type DropzoneParts = { title: boolean; description: boolean };

interface DropzoneContextValue {
  id: string;
  disabled: boolean;
  setPart: (part: keyof DropzoneParts, present: boolean) => void;
}

const DropzoneContext = React.createContext<DropzoneContextValue | null>(null);

function useDropzoneContext(part: string): DropzoneContextValue {
  const ctx = React.useContext(DropzoneContext);
  if (!ctx) throw new Error(`${part} must be used within <Dropzone>`);
  return ctx;
}

/** Register a part (title / description) so the root can reference its id. */
function usePart(ctx: DropzoneContextValue, part: keyof DropzoneParts) {
  const { setPart } = ctx;
  React.useEffect(() => {
    setPart(part, true);
    return () => setPart(part, false);
  }, [setPart, part]);
}

export interface DropzoneProps extends Omit<
  React.ComponentProps<'div'>,
  'onDrop'
> {
  /** Accepted types: MIME keys (wildcards allowed) mapped to extensions. */
  accept?: Accept;
  /** Allow more than one file per drop or pick. */
  multiple?: boolean;
  /** Largest accepted file, in bytes. */
  maxSize?: number;
  /** Most files accepted per drop; the surplus is rejected. */
  maxFiles?: number;
  /** Disables dropping, clicking and the keyboard. */
  disabled?: boolean;
  /** Marks the area invalid (destructive border). */
  invalid?: boolean;
  /** Name of the underlying file input. */
  name?: string;
  /** Fires after every drop or pick with the accepted and rejected files. */
  onDrop?: (accepted: File[], rejected: FileRejection[]) => void;
  /** Fires when at least one file was accepted. */
  onDropAccepted?: (accepted: File[]) => void;
  /** Fires when at least one file was rejected. */
  onDropRejected?: (rejected: FileRejection[]) => void;
  /** Merged onto the drop area. */
  className?: string;
}

function Dropzone({
  className,
  accept,
  multiple = true,
  maxSize,
  maxFiles,
  disabled = false,
  invalid = false,
  name,
  onDrop,
  onDropAccepted,
  onDropRejected,
  children,
  ref,
  ...props
}: DropzoneProps) {
  const id = React.useId();
  const [parts, setParts] = React.useState<DropzoneParts>({
    title: false,
    description: false,
  });
  const setPart = React.useCallback(
    (part: keyof DropzoneParts, present: boolean) =>
      setParts((prev) =>
        prev[part] === present ? prev : { ...prev, [part]: present },
      ),
    [],
  );

  const { getRootProps, getInputProps, rootRef, isDragActive, isDragReject } =
    useDropzone({
      accept,
      multiple,
      maxSize,
      maxFiles,
      disabled,
      onDrop: (accepted, rejected) => onDrop?.(accepted, rejected),
      onDropAccepted: (accepted) => onDropAccepted?.(accepted),
      onDropRejected: (rejected) => onDropRejected?.(rejected),
    });

  const rootProps = getRootProps({
    role: 'group',
    'aria-labelledby': parts.title ? `${id}-title` : undefined,
    'aria-describedby': parts.description ? `${id}-description` : undefined,
    ...props,
  });

  const mergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      (rootRef as React.RefObject<HTMLElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [rootRef, ref],
  );

  const ctx = React.useMemo(
    () => ({ id, disabled, setPart }),
    [id, disabled, setPart],
  );

  return (
    <DropzoneContext.Provider value={ctx}>
      <div
        {...rootProps}
        ref={mergedRef}
        data-slot="dropzone"
        data-drag-active={isDragActive ? '' : undefined}
        data-drag-reject={isDragActive && isDragReject ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        aria-disabled={disabled || undefined}
        className={cn(
          'group/dropzone relative flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-input bg-transparent p-6 text-center transition-colors outline-none',
          'hover:bg-muted/50',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          'data-drag-active:border-primary data-drag-active:bg-primary/5',
          'data-drag-reject:border-destructive data-drag-reject:bg-destructive/5',
          'data-invalid:border-destructive data-invalid:ring-destructive/20 dark:data-invalid:ring-destructive/40',
          'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
          className,
        )}
      >
        {/* react-dropzone hides the input visually but leaves it in the layout flow,
            which would add a flex gap; take it out of the flow. */}
        <input {...getInputProps({ name, className: 'absolute' })} />
        {children}
      </div>
    </DropzoneContext.Provider>
  );
}

function DropzoneIcon({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropzone-icon"
      aria-hidden="true"
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors [&_svg]:size-5 [&_svg]:shrink-0',
        'group-data-drag-active/dropzone:bg-primary/10 group-data-drag-active/dropzone:text-primary',
        'group-data-drag-reject/dropzone:bg-destructive/10 group-data-drag-reject/dropzone:text-destructive',
        className,
      )}
      {...props}
    />
  );
}

function DropzoneTitle({ className, ...props }: React.ComponentProps<'p'>) {
  const ctx = useDropzoneContext('DropzoneTitle');
  usePart(ctx, 'title');
  return (
    <p
      id={`${ctx.id}-title`}
      data-slot="dropzone-title"
      className={cn(
        'text-sm leading-snug font-medium text-foreground',
        className,
      )}
      {...props}
    />
  );
}

function DropzoneDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  const ctx = useDropzoneContext('DropzoneDescription');
  usePart(ctx, 'description');
  return (
    <p
      id={`${ctx.id}-description`}
      data-slot="dropzone-description"
      className={cn(
        'text-sm leading-normal text-balance text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

/**
 * A button that opens the picker. The click bubbles to the area, which owns
 * the picker, so the button needs no handler of its own.
 */
function DropzoneAction({
  variant = 'outline',
  size = 'sm',
  ...props
}: React.ComponentProps<typeof Button>) {
  const ctx = useDropzoneContext('DropzoneAction');
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={ctx.disabled}
      {...props}
      data-slot="dropzone-action"
    />
  );
}

export type { Accept, FileError, FileRejection };
export {
  Dropzone,
  DropzoneAction,
  DropzoneDescription,
  DropzoneIcon,
  DropzoneTitle,
};
