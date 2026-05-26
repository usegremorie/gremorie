import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { cva } from 'class-variance-authority';
import { cn } from '@gremorie/ng-core';
import { toAttachmentData, type AttachmentData } from '@gremorie/ng-attachments';

import {
  PromptInputAttachmentError,
  PromptInputSize,
  PromptInputState,
  PromptInputSubmitEvent,
  PromptInputVariant,
} from './prompt-input.types';

const containerVariants = cva(
  'relative flex w-full flex-col rounded-md transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
  {
    variants: {
      size: {
        sm: 'gap-1.5 p-2.5 text-sm',
        md: 'gap-2 p-3 text-sm',
        lg: 'gap-3 p-4 text-base',
      },
      variant: {
        default: 'border border-input bg-background',
        ghost: 'border border-transparent bg-transparent',
        bordered: 'border-2 border-input bg-background',
      },
      state: {
        ready: '',
        submitted: '',
        streaming: '',
        error: 'border-destructive focus-within:ring-destructive',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      state: 'ready',
    },
  },
);

@Component({
  selector: 'prompt-input',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    <span class="sr-only" aria-live="polite" aria-atomic="true">{{ statusAnnouncement() }}</span>
  `,
  host: {
    role: 'form',
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.data-state]': 'state()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-dragging]': 'isDragging() ? "" : null',
    '(keydown)': 'handleKeydown($event)',
    '(dragover)': 'handleDragOver($event)',
    '(dragenter)': 'handleDragEnter($event)',
    '(dragleave)': 'handleDragLeave($event)',
    '(drop)': 'handleDrop($event)',
  },
})
export class PromptInput {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  readonly value = model<string>('');
  readonly attachments = model<readonly AttachmentData[]>([]);

  readonly state = input<PromptInputState>('ready');
  readonly size = input<PromptInputSize>('md');
  readonly variant = input<PromptInputVariant>('default');
  readonly disabled = input<boolean>(false);
  readonly submitOnEnter = input<boolean>(true);
  readonly ariaLabel = input<string>('AI prompt input');

  /**
   * When `false`, file attachments are disabled (drag-drop and paste ignored).
   * Otherwise, an array of MIME patterns (`image/*`, `application/pdf`, etc.)
   * that are accepted.
   */
  readonly acceptAttachments = input<readonly string[] | false>(false);
  readonly maxAttachments = input<number>(10);
  readonly maxAttachmentSize = input<number>(10 * 1024 * 1024); // 10MB

  readonly submitted = output<PromptInputSubmitEvent>();
  readonly canceled = output<void>();
  readonly retried = output<void>();
  readonly attachmentError = output<PromptInputAttachmentError>();

  private readonly dragCounter = signal(0);

  readonly isDragging = computed(() => this.dragCounter() > 0);

  readonly attachmentsEnabled = computed(() => {
    const accept = this.acceptAttachments();
    return accept !== false && !this.disabled();
  });

  readonly statusAnnouncement = computed(() => {
    switch (this.state()) {
      case 'submitted':
        return 'Message submitted. Waiting for response.';
      case 'streaming':
        return 'AI is responding.';
      case 'error':
        return 'Submission failed. Press the button to retry.';
      default:
        return '';
    }
  });

  readonly hostClass = computed(() =>
    cn(
      containerVariants({
        size: this.size(),
        variant: this.variant(),
        state: this.state(),
      }),
      this.disabled() && 'pointer-events-none opacity-50',
      this.isDragging() && 'ring-2 ring-ring ring-offset-2',
    ),
  );

  handleKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    const isEnter = event.key === 'Enter';
    const isMod = event.metaKey || event.ctrlKey;

    if (isEnter && isMod) {
      event.preventDefault();
      this.submit();
      return;
    }

    if (isEnter && !event.shiftKey && this.submitOnEnter()) {
      event.preventDefault();
      this.submit();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.handleEscape();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleGlobalKeydown(event: KeyboardEvent): void {
    const isMod = event.metaKey || event.ctrlKey;
    if (isMod && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.focusTextarea();
    }
  }

  @HostListener('paste', ['$event'])
  handlePaste(event: ClipboardEvent): void {
    if (!this.attachmentsEnabled()) {
      return;
    }
    const items = event.clipboardData?.items;
    if (!items) {
      return;
    }
    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }
    if (files.length > 0) {
      event.preventDefault();
      this.addFiles(files);
    }
  }

  handleDragOver(event: DragEvent): void {
    if (!this.attachmentsEnabled()) {
      return;
    }
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  handleDragEnter(event: DragEvent): void {
    if (!this.attachmentsEnabled()) {
      return;
    }
    event.preventDefault();
    this.dragCounter.update((n) => n + 1);
  }

  handleDragLeave(event: DragEvent): void {
    if (!this.attachmentsEnabled()) {
      return;
    }
    event.preventDefault();
    this.dragCounter.update((n) => Math.max(0, n - 1));
  }

  handleDrop(event: DragEvent): void {
    if (!this.attachmentsEnabled()) {
      return;
    }
    event.preventDefault();
    this.dragCounter.set(0);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.addFiles(Array.from(files));
    }
  }

  submit(): void {
    if (this.disabled()) {
      return;
    }

    const currentState = this.state();

    if (currentState === 'streaming') {
      this.canceled.emit();
      return;
    }

    if (currentState === 'error') {
      this.retried.emit();
      return;
    }

    const event: PromptInputSubmitEvent = {
      value: this.value(),
      attachments: this.attachments(),
      preventDefault: () => {
        /* Consumer can short-circuit clearing/UI by calling this. */
      },
    };
    this.submitted.emit(event);
  }

  clear(): void {
    this.value.set('');
    this.attachments.set([]);
  }

  focusTextarea(): void {
    const textarea = this.elementRef.nativeElement.querySelector('textarea');
    textarea?.focus();
  }

  addFiles(files: readonly File[]): void {
    for (const file of files) {
      const error = this.validateFile(file);
      if (error) {
        this.attachmentError.emit(error);
        continue;
      }
      this.attachments.update((prev) => [...prev, toAttachmentData(file)]);
    }
  }

  /**
   * Remove an attachment by reference, by id, or by underlying File. The
   * three signatures let consumers match whatever they have in hand
   * (full object, just the id, or the original File from drag-drop).
   */
  removeAttachment(target: AttachmentData | string | File): void {
    this.attachments.update((prev) =>
      prev.filter((item) => {
        if (typeof target === 'string') return item.id !== target;
        if (target instanceof File) return item.file !== target;
        return item.id !== target.id;
      }),
    );
  }

  private validateFile(file: File): PromptInputAttachmentError | null {
    const accept = this.acceptAttachments();
    if (accept !== false && accept.length > 0) {
      const isAccepted = accept.some((pattern) => {
        if (pattern.endsWith('/*')) {
          return file.type.startsWith(pattern.slice(0, -1));
        }
        return file.type === pattern;
      });
      if (!isAccepted) {
        return {
          file,
          reason: 'invalid-mime',
          message: `MIME type "${file.type}" not accepted`,
        };
      }
    }

    if (file.size > this.maxAttachmentSize()) {
      const mb = (this.maxAttachmentSize() / (1024 * 1024)).toFixed(1);
      return {
        file,
        reason: 'too-large',
        message: `File "${file.name}" exceeds maximum size of ${mb} MB`,
      };
    }

    if (this.attachments().length >= this.maxAttachments()) {
      return {
        file,
        reason: 'max-count',
        message: `Maximum of ${this.maxAttachments()} attachments reached`,
      };
    }

    return null;
  }

  private handleEscape(): void {
    const currentState = this.state();
    if (currentState === 'streaming') {
      this.canceled.emit();
      return;
    }
    this.clear();
  }
}
