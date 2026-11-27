import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  Button,
  cn,
  type ButtonSize,
  type ButtonVariant,
} from '@gremorie/ng-core';

/** Accepted types: MIME keys (wildcards allowed) mapped to extensions. */
export type DropzoneAccept = Record<string, string[]>;

export interface FileError {
  code: string;
  message: string;
}

export interface FileRejection {
  file: File;
  errors: FileError[];
}

/** Payload of `filesDropped`: every drop or pick, split in two. */
export interface DropzoneFilesDropped {
  accepted: File[];
  rejected: FileRejection[];
}

const FILE_INVALID_TYPE = 'file-invalid-type';
const FILE_TOO_LARGE = 'file-too-large';
const TOO_MANY_FILES = 'too-many-files';

const SIZE_UNITS = ['KB', 'MB', 'GB', 'TB', 'PB'];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} ${bytes === 1 ? 'byte' : 'bytes'}`;
  let size = bytes / 1024;
  let unit = 0;
  while (size >= 1024 && unit < SIZE_UNITS.length - 1) {
    size /= 1024;
    unit++;
  }
  return `${Number(size.toFixed(2))} ${SIZE_UNITS[unit]}`;
}

/** The `accept` map as the comma list a native file input understands. */
function acceptTokens(accept: DropzoneAccept | undefined): string[] {
  if (!accept) return [];
  return Object.entries(accept).flatMap(([mime, exts]) => [mime, ...exts]);
}

/**
 * Does `file` match one of the tokens? A token is an extension (`.png`), a
 * MIME wildcard (`image/*`) or an exact MIME type. Same rules as the native
 * `accept` attribute and as the React edition.
 */
function matchesAccept(
  file: { name?: string; type: string },
  tokens: string[],
): boolean {
  if (tokens.length === 0) return true;
  const name = (file.name ?? '').toLowerCase();
  const type = file.type.toLowerCase();
  const base = type.replace(/\/.*$/, '');
  return tokens.some((raw) => {
    const token = raw.trim().toLowerCase();
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return base === token.replace(/\/.*$/, '');
    return type === token;
  });
}

function hasFiles(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files');
}

let nextId = 0;

/**
 * Dropzone — a drop target for files. Mirrors React `Dropzone` from
 * `@gremorie/rx-forms`.
 *
 * Dropping files or activating the area (click, Enter or Space) reports them
 * split into accepted and rejected, validated against `accept`, `maxSize` and
 * `maxFiles` with the same rules and error codes as the React edition. The
 * area is a single focus stop; the title labels it and the description
 * describes it. State is exposed as data attributes (`data-drag-active`,
 * `data-drag-reject`, `data-disabled`, `data-invalid`), so children restyle
 * with `group-data-[...]/dropzone`.
 *
 * ## React → Angular mapping
 *
 * - React wraps `react-dropzone`; Angular uses native HTML drag and drop and a
 *   hidden `<input type="file">`, so no dependency is added.
 * - React `onDrop` / `onDropAccepted` / `onDropRejected` are the outputs
 *   `filesDropped` (`{ accepted, rejected }`) / `filesAccepted` /
 *   `filesRejected`.
 * - Parts: `gr-dropzone-icon`, `gr-dropzone-title`, `gr-dropzone-description`,
 *   `gr-dropzone-action`. The component reports files; it does not render the
 *   file list or the rejection messages.
 *
 * @example
 * ```html
 * <gr-dropzone [accept]="{ 'image/*': [] }" (filesAccepted)="add($event)">
 *   <gr-dropzone-title>Drop images here</gr-dropzone-title>
 *   <gr-dropzone-description>PNG or JPG</gr-dropzone-description>
 *   <gr-dropzone-action>Browse files</gr-dropzone-action>
 * </gr-dropzone>
 * ```
 */
@Component({
  selector: 'gr-dropzone',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      #fileInput
      type="file"
      class="hidden"
      tabindex="-1"
      aria-hidden="true"
      [attr.accept]="acceptAttr()"
      [attr.name]="name() ?? null"
      [multiple]="multiple()"
      [disabled]="disabled()"
      (click)="$event.stopPropagation()"
      (change)="onInputChange($event)"
    />
    <ng-content />
  `,
  host: {
    role: 'group',
    'data-slot': 'dropzone',
    '[class]': 'mergedClass()',
    '[attr.tabindex]': 'disabled() ? null : 0',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.aria-labelledby]': 'hasTitle() ? uid + "-title" : null',
    '[attr.aria-describedby]': 'hasDescription() ? uid + "-description" : null',
    '[attr.data-drag-active]': 'dragActive() ? "" : null',
    '[attr.data-drag-reject]': 'dragActive() && dragReject() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-invalid]': 'invalid() ? "" : null',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
    '(dragenter)': 'onDragEnter($event)',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave()',
    '(drop)': 'onDrop($event)',
  },
})
export class Dropzone {
  /** Extra classes merged over the defaults via `cn`. Mirrors React `className`. */
  readonly class = input<string>();
  /** Accepted types: MIME keys (wildcards allowed) mapped to extensions. */
  readonly accept = input<DropzoneAccept>();
  /** Allow more than one file per drop or pick. */
  readonly multiple = input(true, { transform: booleanAttribute });
  /** Largest accepted file, in bytes. */
  readonly maxSize = input<number>();
  /** Most files accepted per drop; the surplus is rejected. */
  readonly maxFiles = input<number>();
  /** Disables dropping, clicking and the keyboard. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Marks the area invalid (destructive border). */
  readonly invalid = input(false, { transform: booleanAttribute });
  /** Name of the underlying file input. */
  readonly name = input<string>();

  /** Every drop or pick, split into accepted and rejected. Mirrors React `onDrop`. */
  readonly filesDropped = output<DropzoneFilesDropped>();
  /** At least one file was accepted. Mirrors React `onDropAccepted`. */
  readonly filesAccepted = output<File[]>();
  /** At least one file was rejected. Mirrors React `onDropRejected`. */
  readonly filesRejected = output<FileRejection[]>();

  /** @internal id prefix shared with the parts. */
  readonly uid = `gr-dropzone-${nextId++}`;
  /** @internal set by the title part while it exists. */
  readonly hasTitle = signal(false);
  /** @internal set by the description part while it exists. */
  readonly hasDescription = signal(false);

  protected readonly dragActive = signal(false);
  protected readonly dragReject = signal(false);

  private readonly fileInput =
    viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private dragDepth = 0;

  protected readonly acceptAttr = computed(() => {
    const tokens = acceptTokens(this.accept());
    return tokens.length ? tokens.join(',') : null;
  });

  protected readonly mergedClass = computed(() =>
    cn(
      'group/dropzone relative flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-input bg-transparent p-6 text-center transition-colors outline-none',
      'hover:bg-muted/50',
      'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
      'data-drag-active:border-primary data-drag-active:bg-primary/5',
      'data-drag-reject:border-destructive data-drag-reject:bg-destructive/5',
      'data-invalid:border-destructive data-invalid:ring-destructive/20',
      'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
      this.class(),
    ),
  );

  constructor() {
    const destroyRef = inject(DestroyRef);
    // A file dropped outside the area must not make the browser navigate to it.
    afterNextRender(() => {
      const doc = this.host.nativeElement.ownerDocument;
      const guard = (event: Event) => {
        if (this.host.nativeElement.contains(event.target as Node)) return;
        if (hasFiles(event as DragEvent)) event.preventDefault();
      };
      doc.addEventListener('dragover', guard);
      doc.addEventListener('drop', guard);
      destroyRef.onDestroy(() => {
        doc.removeEventListener('dragover', guard);
        doc.removeEventListener('drop', guard);
      });
    });
  }

  /** Open the native file picker. */
  open(): void {
    if (this.disabled()) return;
    this.fileInput().nativeElement.click();
  }

  protected onClick(): void {
    this.open();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.target !== this.host.nativeElement) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.open();
    }
  }

  protected onDragEnter(event: DragEvent): void {
    if (this.disabled() || !hasFiles(event)) return;
    event.preventDefault();
    this.dragDepth++;
    this.dragActive.set(true);
    this.dragReject.set(this.draggedFilesRejected(event));
  }

  protected onDragOver(event: DragEvent): void {
    if (this.disabled() || !hasFiles(event)) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }

  protected onDragLeave(): void {
    if (this.dragDepth > 0) this.dragDepth--;
    if (this.dragDepth === 0) this.resetDrag();
  }

  protected onDrop(event: DragEvent): void {
    if (!hasFiles(event)) return;
    event.preventDefault();
    this.resetDrag();
    if (this.disabled()) return;
    this.receive(Array.from(event.dataTransfer?.files ?? []));
  }

  protected onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    // Let the same file be picked again.
    input.value = '';
    this.receive(files);
  }

  private resetDrag(): void {
    this.dragDepth = 0;
    this.dragActive.set(false);
    this.dragReject.set(false);
  }

  /** The limit on accepted files per drop; Infinity when there is none. */
  private acceptedLimit(): number {
    if (!this.multiple()) return 1;
    const max = this.maxFiles();
    return max !== undefined && max >= 1 ? max : Number.POSITIVE_INFINITY;
  }

  /**
   * While dragging the browser exposes only each item's MIME type (no name or
   * size), so the check is optimistic about anything it cannot see.
   */
  private draggedFilesRejected(event: DragEvent): boolean {
    const items = Array.from(event.dataTransfer?.items ?? []).filter(
      (item) => item.kind === 'file',
    );
    const tokens = acceptTokens(this.accept());
    let accepted = 0;
    for (const item of items) {
      const typeUnknown = item.type === '';
      if (!typeUnknown && !matchesAccept({ type: item.type }, tokens))
        return true;
      accepted++;
    }
    return accepted > this.acceptedLimit();
  }

  private receive(files: File[]): void {
    const tokens = acceptTokens(this.accept());
    const maxSize = this.maxSize();
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];

    for (const file of files) {
      const errors: FileError[] = [];
      if (!matchesAccept(file, tokens)) {
        const list = tokens.join(', ');
        errors.push({
          code: FILE_INVALID_TYPE,
          message: `File type must be ${tokens.length > 1 ? `one of ${list}` : list}`,
        });
      }
      if (maxSize !== undefined && file.size > maxSize) {
        errors.push({
          code: FILE_TOO_LARGE,
          message: `File is larger than ${formatBytes(maxSize)}`,
        });
      }
      if (errors.length) rejected.push({ file, errors });
      else accepted.push(file);
    }

    const limit = this.acceptedLimit();
    if (accepted.length > limit) {
      for (const file of accepted.splice(limit)) {
        rejected.push({
          file,
          errors: [{ code: TOO_MANY_FILES, message: 'Too many files' }],
        });
      }
    }

    this.filesDropped.emit({ accepted, rejected });
    if (accepted.length) this.filesAccepted.emit(accepted);
    if (rejected.length) this.filesRejected.emit(rejected);
  }
}

/** Themed container for a glyph (project an svg or icon). Decorative. */
@Component({
  selector: 'gr-dropzone-icon',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'dropzone-icon',
    'aria-hidden': 'true',
    '[class]': 'mergedClass()',
  },
})
export class DropzoneIcon {
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>();
  protected readonly mergedClass = computed(() =>
    cn(
      'inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors [&_svg]:size-5 [&_svg]:shrink-0',
      'group-data-drag-active/dropzone:bg-primary/10 group-data-drag-active/dropzone:text-primary',
      'group-data-drag-reject/dropzone:bg-destructive/10 group-data-drag-reject/dropzone:text-destructive',
      this.class(),
    ),
  );
}

/** Names the area; the root references it with `aria-labelledby`. */
@Component({
  selector: 'gr-dropzone-title',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'dropzone-title',
    '[attr.id]': 'id',
    '[class]': 'mergedClass()',
  },
})
export class DropzoneTitle {
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>();
  private readonly dropzone = inject(Dropzone);
  protected readonly id = `${this.dropzone.uid}-title`;
  protected readonly mergedClass = computed(() =>
    cn('block text-sm leading-snug font-medium text-foreground', this.class()),
  );

  constructor() {
    this.dropzone.hasTitle.set(true);
    inject(DestroyRef).onDestroy(() => this.dropzone.hasTitle.set(false));
  }
}

/** Hint (accepted types, limits); the root references it with `aria-describedby`. */
@Component({
  selector: 'gr-dropzone-description',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'dropzone-description',
    '[attr.id]': 'id',
    '[class]': 'mergedClass()',
  },
})
export class DropzoneDescription {
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>();
  private readonly dropzone = inject(Dropzone);
  protected readonly id = `${this.dropzone.uid}-description`;
  protected readonly mergedClass = computed(() =>
    cn(
      'block text-sm leading-normal text-balance text-muted-foreground',
      this.class(),
    ),
  );

  constructor() {
    this.dropzone.hasDescription.set(true);
    inject(DestroyRef).onDestroy(() => this.dropzone.hasDescription.set(false));
  }
}

/**
 * A button that opens the picker. The click bubbles to the area, which owns
 * the picker, so the button needs no handler of its own.
 */
@Component({
  selector: 'gr-dropzone-action',
  standalone: true,
  imports: [Button],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ai-button
      [variant]="variant()"
      [size]="size()"
      [disabled]="dropzone.disabled()"
      [class]="class() ?? ''"
    >
      <ng-content />
    </ai-button>
  `,
  host: { 'data-slot': 'dropzone-action', class: 'contents' },
})
export class DropzoneAction {
  readonly variant = input<ButtonVariant>('outline');
  readonly size = input<ButtonSize>('sm');
  /** Extra classes merged onto the button. Mirrors React `className`. */
  readonly class = input<string>();
  protected readonly dropzone = inject(Dropzone);
}
