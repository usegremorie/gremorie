'use client';

import {
  type ChangeEvent,
  type ChangeEventHandler,
  Children,
  type ClipboardEventHandler,
  type ComponentProps,
  createContext,
  type FormEvent,
  type FormEventHandler,
  Fragment,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { cn } from '@gremorie/rx-core';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gremorie/rx-forms';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/rx-overlays';
import {
  CornerDownLeftIcon,
  Loader2Icon,
  MicIcon,
  PaperclipIcon,
  PlusIcon,
  SquareIcon,
  XIcon,
} from 'lucide-react';

import {
  Attachment,
  AttachmentHoverCard,
  AttachmentHoverCardContent,
  AttachmentHoverCardTrigger,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  type AttachmentVariant,
  getAttachmentLabel,
  getMediaCategory,
} from '../attachments';

// ============================================================================
// Types - portable subset of FileUIPart / ChatStatus (no @ai-sdk dep here)
// ============================================================================

export type ChatStatus = 'ready' | 'submitted' | 'streaming' | 'error';

export type FileUIPart = {
  type: 'file';
  url: string;
  mediaType: string;
  filename?: string;
};

export type AttachmentFile = FileUIPart & { id: string };

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `attachment-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

// ============================================================================
// Provider Context & Types
// ============================================================================

export type AttachmentsContext = {
  files: AttachmentFile[];
  add: (files: File[] | FileList) => void;
  remove: (id: string) => void;
  clear: () => void;
  openFileDialog: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
};

export type TextInputContext = {
  value: string;
  setInput: (v: string) => void;
  clear: () => void;
};

export type PromptInputControllerProps = {
  textInput: TextInputContext;
  attachments: AttachmentsContext;
  /** INTERNAL: Allows PromptInput to register its file input + open callback */
  __registerFileInput: (
    ref: RefObject<HTMLInputElement | null>,
    open: () => void,
  ) => void;
};

const PromptInputController = createContext<PromptInputControllerProps | null>(
  null,
);
const ProviderAttachmentsContext = createContext<AttachmentsContext | null>(
  null,
);

export const usePromptInputController = () => {
  const ctx = useContext(PromptInputController);
  if (!ctx) {
    throw new Error(
      'Wrap your component inside <PromptInputProvider> to use usePromptInputController().',
    );
  }
  return ctx;
};

const useOptionalPromptInputController = () =>
  useContext(PromptInputController);

export const useProviderAttachments = () => {
  const ctx = useContext(ProviderAttachmentsContext);
  if (!ctx) {
    throw new Error(
      'Wrap your component inside <PromptInputProvider> to use useProviderAttachments().',
    );
  }
  return ctx;
};

const useOptionalProviderAttachments = () =>
  useContext(ProviderAttachmentsContext);

export type PromptInputProviderProps = PropsWithChildren<{
  initialInput?: string;
}>;

/**
 * Optional global provider that lifts PromptInput state outside of PromptInput.
 * If you don't use it, PromptInput stays fully self-managed.
 */
export function PromptInputProvider({
  initialInput: initialTextInput = '',
  children,
}: PromptInputProviderProps) {
  const [textInput, setTextInput] = useState(initialTextInput);
  const clearInput = useCallback(() => setTextInput(''), []);

  const [attachmentFiles, setAttachmentFiles] = useState<AttachmentFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const openRef = useRef<() => void>(() => {
    // intentional no-op until a file input is registered
  });

  const add = useCallback((files: File[] | FileList) => {
    const incoming = Array.from(files);
    if (incoming.length === 0) {
      return;
    }
    setAttachmentFiles((prev) =>
      prev.concat(
        incoming.map((file) => ({
          id: generateId(),
          type: 'file' as const,
          url: URL.createObjectURL(file),
          mediaType: file.type,
          filename: file.name,
        })),
      ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setAttachmentFiles((prev) => {
      const found = prev.find((f) => f.id === id);
      if (found?.url) {
        URL.revokeObjectURL(found.url);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clear = useCallback(() => {
    setAttachmentFiles((prev) => {
      for (const f of prev) {
        if (f.url) {
          URL.revokeObjectURL(f.url);
        }
      }
      return [];
    });
  }, []);

  const attachmentsRef = useRef(attachmentFiles);
  attachmentsRef.current = attachmentFiles;

  useEffect(() => {
    return () => {
      for (const f of attachmentsRef.current) {
        if (f.url) {
          URL.revokeObjectURL(f.url);
        }
      }
    };
  }, []);

  const openFileDialog = useCallback(() => {
    openRef.current?.();
  }, []);

  const attachments = useMemo<AttachmentsContext>(
    () => ({
      files: attachmentFiles,
      add,
      remove,
      clear,
      openFileDialog,
      fileInputRef,
    }),
    [attachmentFiles, add, remove, clear, openFileDialog],
  );

  const __registerFileInput = useCallback(
    (ref: RefObject<HTMLInputElement | null>, open: () => void) => {
      fileInputRef.current = ref.current;
      openRef.current = open;
    },
    [],
  );

  const controller = useMemo<PromptInputControllerProps>(
    () => ({
      textInput: {
        value: textInput,
        setInput: setTextInput,
        clear: clearInput,
      },
      attachments,
      __registerFileInput,
    }),
    [textInput, clearInput, attachments, __registerFileInput],
  );

  return (
    <PromptInputController.Provider value={controller}>
      <ProviderAttachmentsContext.Provider value={attachments}>
        {children}
      </ProviderAttachmentsContext.Provider>
    </PromptInputController.Provider>
  );
}

// ============================================================================
// Component Context & Hooks
// ============================================================================

const LocalAttachmentsContext = createContext<AttachmentsContext | null>(null);

export const usePromptInputAttachments = () => {
  const provider = useOptionalProviderAttachments();
  const local = useContext(LocalAttachmentsContext);
  const context = provider ?? local;
  if (!context) {
    throw new Error(
      'usePromptInputAttachments must be used within a PromptInput or PromptInputProvider',
    );
  }
  return context;
};

// ============================================================================
// PromptInputAttachment - one attachment chip with HoverCard preview
// ============================================================================

export type PromptInputAttachmentProps = HTMLAttributes<HTMLDivElement> & {
  data: AttachmentFile;
  className?: string;
};

export function PromptInputAttachment({
  data,
  className,
  ...props
}: PromptInputAttachmentProps) {
  const attachments = usePromptInputAttachments();
  const mediaCategory = getMediaCategory(data);
  const label = getAttachmentLabel(data);

  // Delegates to the standalone Attachment module (inline variant) so the chip
  // stays in lock-step with the canonical component used elsewhere (messages,
  // file lists). The inline layout context comes from PromptInputAttachments.
  return (
    <AttachmentHoverCard>
      <AttachmentHoverCardTrigger asChild>
        <Attachment
          className={className}
          data={data}
          onRemove={() => attachments.remove(data.id)}
          {...props}
        >
          <div className="relative size-5 shrink-0">
            <div className="absolute inset-0 transition-opacity group-hover:opacity-0">
              <AttachmentPreview />
            </div>
            <AttachmentRemove className="absolute inset-0" />
          </div>
          <AttachmentInfo />
        </Attachment>
      </AttachmentHoverCardTrigger>
      <AttachmentHoverCardContent>
        <div className="space-y-3">
          {mediaCategory === 'image' && data.url ? (
            <div className="flex max-h-96 w-80 items-center justify-center overflow-hidden rounded-md border">
              <img
                alt={label}
                className="max-h-full max-w-full object-contain"
                height={384}
                src={data.url}
                width={320}
              />
            </div>
          ) : null}
          <div className="space-y-1 px-0.5">
            <h4 className="font-semibold text-sm leading-none">{label}</h4>
            {data.mediaType ? (
              <p className="font-mono text-muted-foreground text-xs">
                {data.mediaType}
              </p>
            ) : null}
          </div>
        </div>
      </AttachmentHoverCardContent>
    </AttachmentHoverCard>
  );
}

// ============================================================================
// PromptInputAttachments - container that renders each file via a child fn
// ============================================================================

export type PromptInputAttachmentsProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  children: (attachment: AttachmentFile) => ReactNode;
  /** Layout variant for the attachment row. Defaults to `inline` badges. */
  variant?: AttachmentVariant;
};

export function PromptInputAttachments({
  children,
  className,
  variant = 'inline',
  ...props
}: PromptInputAttachmentsProps) {
  const attachments = usePromptInputAttachments();

  if (!attachments.files.length) {
    return null;
  }

  return (
    <Attachments
      className={cn('w-full p-3', className)}
      variant={variant}
      {...props}
    >
      {attachments.files.map((file) => (
        <Fragment key={file.id}>{children(file)}</Fragment>
      ))}
    </Attachments>
  );
}

// ============================================================================
// PromptInputActionAddAttachments - drop-in DropdownMenuItem
// ============================================================================

export type PromptInputActionAddAttachmentsProps = ComponentProps<
  typeof DropdownMenuItem
> & {
  label?: string;
};

export const PromptInputActionAddAttachments = ({
  label = 'Add photos or files',
  ...props
}: PromptInputActionAddAttachmentsProps) => {
  const attachments = usePromptInputAttachments();

  return (
    <DropdownMenuItem
      {...props}
      onSelect={(e) => {
        e.preventDefault();
        attachments.openFileDialog();
      }}
    >
      {/* Paperclip, as the inline attach button: one action, one icon. */}
      <PaperclipIcon className="size-4" /> {label}
    </DropdownMenuItem>
  );
};

// ============================================================================
// PromptInput - form root with state machine
// ============================================================================

export type PromptInputMessage = {
  text: string;
  files: FileUIPart[];
};

export type PromptInputProps = Omit<
  HTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'onError'
> & {
  accept?: string;
  multiple?: boolean;
  globalDrop?: boolean;
  syncHiddenInput?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  onError?: (err: {
    code: 'max_files' | 'max_file_size' | 'accept';
    message: string;
  }) => void;
  onSubmit: (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>,
  ) => void | Promise<void>;
  /**
   * `stacked` (default): header, text and footer in rows. `inline`: one row,
   * e.g. a "+" menu, the text, then mic and send; the buttons stay at the
   * bottom as the text grows.
   */
  layout?: 'stacked' | 'inline';
};

export const PromptInput = ({
  className,
  accept,
  multiple,
  globalDrop,
  syncHiddenInput,
  maxFiles,
  maxFileSize,
  onError,
  onSubmit,
  children,
  layout = 'stacked',
  ...props
}: PromptInputProps) => {
  const controller = useOptionalPromptInputController();
  const usingProvider = !!controller;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [items, setItems] = useState<AttachmentFile[]>([]);
  const files = usingProvider ? controller.attachments.files : items;

  const filesRef = useRef(files);
  filesRef.current = files;

  const openFileDialogLocal = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const matchesAccept = useCallback(
    (f: File) => {
      if (!accept || accept.trim() === '') {
        return true;
      }
      const patterns = accept
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return patterns.some((pattern) => {
        if (pattern.endsWith('/*')) {
          const prefix = pattern.slice(0, -1);
          return f.type.startsWith(prefix);
        }
        return f.type === pattern;
      });
    },
    [accept],
  );

  const addLocal = useCallback(
    (fileList: File[] | FileList) => {
      const incoming = Array.from(fileList);
      const accepted = incoming.filter((f) => matchesAccept(f));
      if (incoming.length && accepted.length === 0) {
        onError?.({
          code: 'accept',
          message: 'No files match the accepted types.',
        });
        return;
      }
      const withinSize = (f: File) =>
        maxFileSize ? f.size <= maxFileSize : true;
      const sized = accepted.filter(withinSize);
      if (accepted.length > 0 && sized.length === 0) {
        onError?.({
          code: 'max_file_size',
          message: 'All files exceed the maximum size.',
        });
        return;
      }

      setItems((prev) => {
        const capacity =
          typeof maxFiles === 'number'
            ? Math.max(0, maxFiles - prev.length)
            : undefined;
        const capped =
          typeof capacity === 'number' ? sized.slice(0, capacity) : sized;
        if (typeof capacity === 'number' && sized.length > capacity) {
          onError?.({
            code: 'max_files',
            message: 'Too many files. Some were not added.',
          });
        }
        const next: AttachmentFile[] = [];
        for (const file of capped) {
          next.push({
            id: generateId(),
            type: 'file',
            url: URL.createObjectURL(file),
            mediaType: file.type,
            filename: file.name,
          });
        }
        return prev.concat(next);
      });
    },
    [matchesAccept, maxFiles, maxFileSize, onError],
  );

  const removeLocal = useCallback(
    (id: string) =>
      setItems((prev) => {
        const found = prev.find((file) => file.id === id);
        if (found?.url) {
          URL.revokeObjectURL(found.url);
        }
        return prev.filter((file) => file.id !== id);
      }),
    [],
  );

  const clearLocal = useCallback(
    () =>
      setItems((prev) => {
        for (const file of prev) {
          if (file.url) {
            URL.revokeObjectURL(file.url);
          }
        }
        return [];
      }),
    [],
  );

  const add = usingProvider ? controller.attachments.add : addLocal;
  const remove = usingProvider ? controller.attachments.remove : removeLocal;
  const clear = usingProvider ? controller.attachments.clear : clearLocal;
  const openFileDialog = usingProvider
    ? controller.attachments.openFileDialog
    : openFileDialogLocal;

  useEffect(() => {
    if (!usingProvider) return;
    controller.__registerFileInput(inputRef, () => inputRef.current?.click());
  }, [usingProvider, controller]);

  useEffect(() => {
    if (syncHiddenInput && inputRef.current && files.length === 0) {
      inputRef.current.value = '';
    }
  }, [files, syncHiddenInput]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    if (globalDrop) return;

    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
    };
    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        add(e.dataTransfer.files);
      }
    };
    form.addEventListener('dragover', onDragOver);
    form.addEventListener('drop', onDrop);
    return () => {
      form.removeEventListener('dragover', onDragOver);
      form.removeEventListener('drop', onDrop);
    };
  }, [add, globalDrop]);

  useEffect(() => {
    if (!globalDrop) return;
    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
    };
    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        add(e.dataTransfer.files);
      }
    };
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDrop);
    return () => {
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('drop', onDrop);
    };
  }, [add, globalDrop]);

  useEffect(
    () => () => {
      if (!usingProvider) {
        for (const f of filesRef.current) {
          if (f.url) URL.revokeObjectURL(f.url);
        }
      }
    },
    [usingProvider],
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.currentTarget.files) {
      add(event.currentTarget.files);
    }
    event.currentTarget.value = '';
  };

  const convertBlobUrlToDataUrl = async (
    url: string,
  ): Promise<string | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const ctx = useMemo<AttachmentsContext>(
    () => ({
      files: files.map((item) => ({ ...item, id: item.id })),
      add,
      remove,
      clear,
      openFileDialog,
      fileInputRef: inputRef,
    }),
    [files, add, remove, clear, openFileDialog],
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const text = usingProvider
      ? controller.textInput.value
      : (() => {
          const formData = new FormData(form);
          return (formData.get('message') as string) || '';
        })();

    if (!usingProvider) {
      form.reset();
    }

    Promise.all(
      files.map(async (item) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = item;
        if (rest.url && rest.url.startsWith('blob:')) {
          const dataUrl = await convertBlobUrlToDataUrl(rest.url);
          return { ...rest, url: dataUrl ?? rest.url } as FileUIPart;
        }
        return rest as FileUIPart;
      }),
    )
      .then((convertedFiles: FileUIPart[]) => {
        try {
          const result = onSubmit({ text, files: convertedFiles }, event);

          if (result instanceof Promise) {
            result
              .then(() => {
                clear();
                if (usingProvider) {
                  controller.textInput.clear();
                }
              })
              .catch(() => {
                // Don't clear on error - user may want to retry
              });
          } else {
            clear();
            if (usingProvider) {
              controller.textInput.clear();
            }
          }
        } catch {
          // Don't clear on error - user may want to retry
        }
      })
      .catch(() => {
        // Don't clear on error - user may want to retry
      });
  };

  const inner = (
    <TooltipProvider>
      <input
        accept={accept}
        aria-label="Upload files"
        className="hidden"
        multiple={multiple}
        onChange={handleChange}
        ref={inputRef}
        title="Upload files"
        type="file"
      />
      <form
        className={cn('w-full', className)}
        onSubmit={handleSubmit}
        ref={formRef}
        {...props}
      >
        {/* A filled field like every other Gremorie input: no border, no
            shadow. Controls inside use outline or secondary, never a fill. */}
        <InputGroup
          className={cn(
            '@container/prompt-input overflow-hidden rounded-xl border-transparent bg-input/50 shadow-none dark:bg-input/50',
            layout === 'inline' &&
              'h-auto flex-row items-end gap-1 p-2 [&_[data-slot=input-group-control]]:min-h-8 [&_[data-slot=input-group-control]]:px-1.5 [&_[data-slot=input-group-control]]:py-1.5',
          )}
          data-layout={layout}
        >
          {children}
        </InputGroup>
      </form>
    </TooltipProvider>
  );

  return usingProvider ? (
    inner
  ) : (
    <LocalAttachmentsContext.Provider value={ctx}>
      {inner}
    </LocalAttachmentsContext.Provider>
  );
};

// ============================================================================
// PromptInputBody / Header / Footer / Tools
// ============================================================================

export type PromptInputBodyProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputBody = ({
  className,
  ...props
}: PromptInputBodyProps) => (
  <div className={cn('contents', className)} {...props} />
);

export type PromptInputHeaderProps = Omit<
  ComponentProps<typeof InputGroupAddon>,
  'align'
>;

export const PromptInputHeader = ({
  className,
  ...props
}: PromptInputHeaderProps) => (
  <InputGroupAddon
    align="block-start"
    className={cn('flex-wrap gap-1', className)}
    {...props}
  />
);

export type PromptInputFooterProps = Omit<
  ComponentProps<typeof InputGroupAddon>,
  'align'
>;

export const PromptInputFooter = ({
  className,
  ...props
}: PromptInputFooterProps) => (
  <InputGroupAddon
    align="block-end"
    className={cn('justify-between gap-1', className)}
    {...props}
  />
);

export type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>;

/**
 * How the tools fit the composer. `auto` (default) shows them inline and
 * swaps to the overflow menu when the composer is narrower than 28rem;
 * `never` always shows them inline; `always` always uses the menu.
 */
export type PromptInputToolsCollapse = 'auto' | 'always' | 'never';

export const PromptInputTools = ({
  className,
  collapse = 'auto',
  ...props
}: PromptInputToolsProps & { collapse?: PromptInputToolsCollapse }) => (
  <div
    className={cn(
      'group/prompt-input-tools flex items-center gap-1',
      className,
    )}
    data-collapse={collapse}
    {...props}
  />
);

/** The tools shown inline. Hidden while `PromptInputTools` is collapsed. */
export const PromptInputToolsExpanded = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'contents group-data-[collapse=always]/prompt-input-tools:hidden group-data-[collapse=auto]/prompt-input-tools:@max-md/prompt-input:hidden',
      className,
    )}
    data-slot="prompt-input-tools-expanded"
    {...props}
  />
);

/** The overflow menu that replaces the inline tools while collapsed. */
export const PromptInputToolsCollapsed = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'hidden group-data-[collapse=always]/prompt-input-tools:contents group-data-[collapse=auto]/prompt-input-tools:@max-md/prompt-input:contents',
      className,
    )}
    data-slot="prompt-input-tools-collapsed"
    {...props}
  />
);

// ============================================================================
// PromptInputTextarea
// ============================================================================

export type PromptInputTextareaProps = ComponentProps<
  typeof InputGroupTextarea
>;

export const PromptInputTextarea = ({
  onChange,
  className,
  placeholder = 'What would you like to know?',
  ...props
}: PromptInputTextareaProps) => {
  const controller = useOptionalPromptInputController();
  const attachments = usePromptInputAttachments();
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter') {
      if (isComposing || e.nativeEvent.isComposing) {
        return;
      }
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
      const form = e.currentTarget.form;
      const submitButton = form?.querySelector(
        'button[type="submit"]',
      ) as HTMLButtonElement | null;
      if (submitButton?.disabled) {
        return;
      }
      form?.requestSubmit();
    }

    if (
      e.key === 'Backspace' &&
      e.currentTarget.value === '' &&
      attachments.files.length > 0
    ) {
      e.preventDefault();
      const lastAttachment = attachments.files.at(-1);
      if (lastAttachment) {
        attachments.remove(lastAttachment.id);
      }
    }
  };

  const handlePaste: ClipboardEventHandler<HTMLTextAreaElement> = (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;
    const files: File[] = [];
    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }
    if (files.length > 0) {
      event.preventDefault();
      attachments.add(files);
    }
  };

  const controlledProps = controller
    ? {
        value: controller.textInput.value,
        onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
          controller.textInput.setInput(e.currentTarget.value);
          onChange?.(e);
        },
      }
    : {
        onChange,
      };

  return (
    <InputGroupTextarea
      className={cn('field-sizing-content max-h-48 min-h-16', className)}
      name="message"
      onCompositionEnd={() => setIsComposing(false)}
      onCompositionStart={() => setIsComposing(true)}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder={placeholder}
      {...props}
      {...controlledProps}
    />
  );
};

// ============================================================================
// PromptInputButton - InputGroupButton wrapper for in-input actions
// ============================================================================

export type PromptInputButtonProps = ComponentProps<typeof InputGroupButton> & {
  /**
   * Makes the button a toggle (e.g. web search): sets `aria-pressed` and,
   * when on, the translucent active fill that reads on the filled prompt.
   */
  active?: boolean;
  /**
   * Optional hover/focus tooltip. When set, the button is wrapped in a
   * `Tooltip` (the `PromptInput` root already provides a `TooltipProvider`,
   * so this works out of the box). Reserve it for non-critical hints such as
   * icon labels or keyboard shortcuts.
   */
  tooltip?: ReactNode;
};

export const PromptInputButton = ({
  variant = 'ghost',
  active,
  className,
  size,
  tooltip,
  ...props
}: PromptInputButtonProps) => {
  const newSize =
    size ?? (Children.count(props.children) > 1 ? 'sm' : 'icon-sm');

  const button = (
    <InputGroupButton
      aria-pressed={active}
      data-state={active === undefined ? undefined : active ? 'on' : 'off'}
      className={cn(
        // Rest in the secondary text, like the secondary chips beside it; hover
        // changes only the background. Only the active (pressed) state moves to
        // the full foreground.
        'text-secondary-foreground',
        active &&
          'bg-foreground/10 text-foreground hover:bg-foreground/15 dark:bg-foreground/15 dark:hover:bg-foreground/20',
        className,
      )}
      size={newSize}
      type="button"
      variant={variant}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

// ============================================================================
// PromptInputSubmit - status-driven submit InputGroupButton
// ============================================================================

export type PromptInputSubmitProps = ComponentProps<typeof InputGroupButton> & {
  status?: ChatStatus;
  /** Optional hover/focus tooltip, wrapped via the root `TooltipProvider`. */
  tooltip?: ReactNode;
  /**
   * Visible label (e.g. "Chat"). When ready, the button reads the label with
   * the enter icon and the label is its accessible name; while submitting,
   * streaming or on error it falls back to the icon-only status button.
   */
  label?: string;
};

export const PromptInputSubmit = ({
  className,
  variant = 'default',
  size,
  status,
  children,
  tooltip,
  label,
  ...props
}: PromptInputSubmitProps) => {
  const labelled = Boolean(label) && (!status || status === 'ready');
  let Icon: ReactNode = <CornerDownLeftIcon className="size-4" />;

  if (status === 'submitted') {
    Icon = <Loader2Icon className="size-4 animate-spin" />;
  } else if (status === 'streaming') {
    Icon = <SquareIcon className="size-4" />;
  } else if (status === 'error') {
    Icon = <XIcon className="size-4" />;
  }

  const button = (
    <InputGroupButton
      aria-label={labelled ? label : 'Submit'}
      className={cn(
        labelled && 'gap-2 pr-2.5 pl-3 has-[>svg]:pr-2.5 has-[>svg]:pl-3',
        className,
      )}
      size={size ?? (labelled ? 'sm' : 'icon-sm')}
      type="submit"
      variant={variant}
      {...props}
    >
      {children ??
        (labelled ? (
          <>
            <span>{label}</span>
            <CornerDownLeftIcon className="size-4" />
          </>
        ) : (
          Icon
        ))}
    </InputGroupButton>
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

// ============================================================================
// PromptInputAttachButton - paperclip button that opens the file picker
// ============================================================================

export type PromptInputAttachButtonProps = Omit<
  PromptInputButtonProps,
  'onClick'
>;

export const PromptInputAttachButton = ({
  children,
  ...props
}: PromptInputAttachButtonProps) => {
  const attachments = usePromptInputAttachments();

  return (
    <PromptInputButton
      aria-label="Attach files"
      onClick={() => attachments.openFileDialog()}
      {...props}
    >
      {children ?? <PaperclipIcon className="size-4" />}
    </PromptInputButton>
  );
};

// ============================================================================
// PromptInputActionMenu - DropdownMenu wrapper for in-input actions
// ============================================================================

export type PromptInputActionMenuProps = ComponentProps<typeof DropdownMenu>;
export const PromptInputActionMenu = (props: PromptInputActionMenuProps) => (
  <DropdownMenu {...props} />
);

export type PromptInputActionMenuTriggerProps = PromptInputButtonProps;

export const PromptInputActionMenuTrigger = ({
  className,
  children,
  ...props
}: PromptInputActionMenuTriggerProps) => (
  <DropdownMenuTrigger asChild>
    <PromptInputButton
      className={cn(
        // Open state shows, as the prompt selects do.
        'aria-expanded:bg-muted dark:aria-expanded:bg-input/30',
        className,
      )}
      {...props}
    >
      {children ?? <PlusIcon className="size-4" />}
    </PromptInputButton>
  </DropdownMenuTrigger>
);

export type PromptInputActionMenuContentProps = ComponentProps<
  typeof DropdownMenuContent
>;
export const PromptInputActionMenuContent = ({
  className,
  ...props
}: PromptInputActionMenuContentProps) => (
  <DropdownMenuContent align="start" className={cn(className)} {...props} />
);

export type PromptInputActionMenuItemProps = ComponentProps<
  typeof DropdownMenuItem
>;
export const PromptInputActionMenuItem = ({
  className,
  ...props
}: PromptInputActionMenuItemProps) => (
  <DropdownMenuItem className={cn(className)} {...props} />
);

export type PromptInputActionMenuSwitchItemProps = Omit<
  ComponentProps<typeof DropdownMenuItem>,
  'onSelect'
> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

/**
 * A menu row that toggles a tool on and off (e.g. Search the web), with a
 * switch on the right. The row itself is the control (`menuitemcheckbox`), so
 * the switch is drawn, not interactive; toggling keeps the menu open. Share
 * `checked` with the inline toggle so both stay in step.
 */
export const PromptInputActionMenuSwitchItem = ({
  className,
  children,
  checked = false,
  onCheckedChange,
  ...props
}: PromptInputActionMenuSwitchItemProps) => (
  <DropdownMenuItem
    aria-checked={checked}
    className={cn('justify-between gap-4', className)}
    onSelect={(event) => {
      event.preventDefault();
      onCheckedChange?.(!checked);
    }}
    role="menuitemcheckbox"
    {...props}
  >
    <span className="flex items-center gap-2">{children}</span>
    {/* Same look as Switch (size sm); keep in lock-step with rx-forms. */}
    <span
      aria-hidden="true"
      className="inline-flex h-4 w-7 shrink-0 items-center rounded-full border-2 border-transparent transition-all data-[state=checked]:bg-switch-checked data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80"
      data-slot="switch"
      data-state={checked ? 'checked' : 'unchecked'}
    >
      <span
        className="pointer-events-none block size-3 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0"
        data-state={checked ? 'checked' : 'unchecked'}
      />
    </span>
  </DropdownMenuItem>
);

// Submenus (e.g. Mode ›, Model ›) and choice rows, for a menu that gathers the
// composer's controls (the one-row composer's "+").
export const PromptInputActionMenuSub = DropdownMenuSub;

export type PromptInputActionMenuSubTriggerProps = ComponentProps<
  typeof DropdownMenuSubTrigger
> & {
  /** Current value, shown muted on the right (e.g. "Research"). */
  value?: ReactNode;
};
export const PromptInputActionMenuSubTrigger = ({
  className,
  children,
  value,
  ...props
}: PromptInputActionMenuSubTriggerProps) => (
  <DropdownMenuSubTrigger className={cn('gap-2', className)} {...props}>
    {children}
    {value != null && (
      <span className="ml-auto min-w-0 truncate whitespace-nowrap pl-4 text-muted-foreground">
        {value}
      </span>
    )}
  </DropdownMenuSubTrigger>
);

export const PromptInputActionMenuSubContent = DropdownMenuSubContent;
export const PromptInputActionMenuRadioGroup = DropdownMenuRadioGroup;
export const PromptInputActionMenuRadioItem = DropdownMenuRadioItem;

export type PromptInputActionMenuCheckboxItemProps = ComponentProps<
  typeof DropdownMenuCheckboxItem
>;
/** A checkable row; toggling keeps the menu open. */
export const PromptInputActionMenuCheckboxItem = ({
  onSelect,
  ...props
}: PromptInputActionMenuCheckboxItemProps) => (
  <DropdownMenuCheckboxItem
    onSelect={(event) => {
      event.preventDefault();
      onSelect?.(event);
    }}
    {...props}
  />
);

// ============================================================================
// PromptInputSpeechButton - Web Speech API integration
// ============================================================================

// Minimal portable types - Web Speech API isn't standardized across browsers.
interface PromptInputSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: PromptInputSpeechRecognition, ev: Event) => unknown) | null;
  onend: ((this: PromptInputSpeechRecognition, ev: Event) => unknown) | null;
  onresult:
    | ((
        this: PromptInputSpeechRecognition,
        ev: PromptInputSpeechRecognitionEvent,
      ) => unknown)
    | null;
  onerror:
    | ((
        this: PromptInputSpeechRecognition,
        ev: PromptInputSpeechRecognitionErrorEvent,
      ) => unknown)
    | null;
}

interface PromptInputSpeechRecognitionEvent extends Event {
  results: PromptInputSpeechRecognitionResultList;
  resultIndex: number;
}

type PromptInputSpeechRecognitionResultList = {
  readonly length: number;
  item(index: number): PromptInputSpeechRecognitionResult;
  [index: number]: PromptInputSpeechRecognitionResult;
};

type PromptInputSpeechRecognitionResult = {
  readonly length: number;
  item(index: number): PromptInputSpeechRecognitionAlternative;
  [index: number]: PromptInputSpeechRecognitionAlternative;
  isFinal: boolean;
};

type PromptInputSpeechRecognitionAlternative = {
  transcript: string;
  confidence: number;
};

interface PromptInputSpeechRecognitionErrorEvent extends Event {
  error: string;
}

type SpeechRecognitionCtor = {
  new (): PromptInputSpeechRecognition;
};

type WindowWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
};

export type PromptInputSpeechButtonProps = ComponentProps<
  typeof PromptInputButton
> & {
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  onTranscriptionChange?: (text: string) => void;
  lang?: string;
};

export const PromptInputSpeechButton = ({
  className,
  textareaRef,
  onTranscriptionChange,
  lang = 'en-US',
  ...props
}: PromptInputSpeechButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] =
    useState<PromptInputSpeechRecognition | null>(null);
  const recognitionRef = useRef<PromptInputSpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as WindowWithSpeech;
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;

    const speechRecognition = new Ctor();

    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = lang;

    speechRecognition.onstart = () => {
      setIsListening(true);
    };

    speechRecognition.onend = () => {
      setIsListening(false);
    };

    speechRecognition.onresult = (event) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result?.isFinal) {
          finalTranscript += result[0]?.transcript ?? '';
        }
      }

      if (finalTranscript && textareaRef?.current) {
        const textarea = textareaRef.current;
        const currentValue = textarea.value;
        const newValue =
          currentValue + (currentValue ? ' ' : '') + finalTranscript;

        textarea.value = newValue;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        onTranscriptionChange?.(newValue);
      }
    };

    speechRecognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = speechRecognition;
    setRecognition(speechRecognition);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [textareaRef, onTranscriptionChange, lang]);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  }, [recognition, isListening]);

  return (
    <PromptInputButton
      aria-label="Toggle voice input"
      className={cn(
        'relative transition-all duration-200',
        isListening &&
          'animate-pulse bg-muted text-foreground dark:bg-input/30',
        className,
      )}
      disabled={!recognition}
      onClick={toggleListening}
      {...props}
    >
      <MicIcon className="size-4" />
    </PromptInputButton>
  );
};

// ============================================================================
// PromptInputSelect - model selector built on Select from @gremorie/rx-forms
// ============================================================================

export type PromptInputSelectProps = ComponentProps<typeof Select>;

export const PromptInputSelect = (props: PromptInputSelectProps) => (
  <Select {...props} />
);

export type PromptInputSelectTriggerProps = ComponentProps<
  typeof SelectTrigger
>;

/**
 * `ghost` (default) is the AI Elements look: no surface until hover. On a
 * filled prompt, `outline` or `secondary` draw the trigger like the other
 * controls, through the Select's own variants.
 */
export const PromptInputSelectTrigger = ({
  className,
  variant = 'ghost',
  ...props
}: Omit<PromptInputSelectTriggerProps, 'variant'> & {
  variant?: 'ghost' | 'outline' | 'secondary';
}) =>
  variant === 'ghost' ? (
    <SelectTrigger
      className={cn(
        'border-none bg-transparent font-medium text-secondary-foreground shadow-none transition-colors',
        'hover:bg-muted dark:hover:bg-input/30 aria-expanded:bg-muted dark:aria-expanded:bg-input/30',
        className,
      )}
      {...props}
    />
  ) : (
    <SelectTrigger
      variant={variant}
      className={cn(
        'font-medium',
        variant === 'outline' &&
          'aria-expanded:bg-muted dark:aria-expanded:bg-input/30',
        className,
      )}
      {...props}
    />
  );

export type PromptInputSelectContentProps = ComponentProps<
  typeof SelectContent
>;

export const PromptInputSelectContent = ({
  className,
  position = 'popper',
  sideOffset = 4,
  ...props
}: PromptInputSelectContentProps) => (
  <SelectContent
    className={cn(className)}
    position={position}
    sideOffset={sideOffset}
    {...props}
  />
);

export type PromptInputSelectItemProps = ComponentProps<typeof SelectItem>;

export const PromptInputSelectItem = ({
  className,
  ...props
}: PromptInputSelectItemProps) => (
  <SelectItem className={cn(className)} {...props} />
);

export type PromptInputSelectValueProps = ComponentProps<typeof SelectValue>;

export const PromptInputSelectValue = ({
  ...props
}: PromptInputSelectValueProps) => <SelectValue {...props} />;

// ============================================================================
// PromptInputHoverCard - re-exports of HoverCard with zero-delay defaults
// ============================================================================

export type PromptInputHoverCardProps = ComponentProps<typeof HoverCard>;

export const PromptInputHoverCard = ({
  openDelay = 0,
  closeDelay = 0,
  ...props
}: PromptInputHoverCardProps) => (
  <HoverCard closeDelay={closeDelay} openDelay={openDelay} {...props} />
);

export type PromptInputHoverCardTriggerProps = ComponentProps<
  typeof HoverCardTrigger
>;

export const PromptInputHoverCardTrigger = (
  props: PromptInputHoverCardTriggerProps,
) => <HoverCardTrigger {...props} />;

export type PromptInputHoverCardContentProps = ComponentProps<
  typeof HoverCardContent
>;

export const PromptInputHoverCardContent = ({
  align = 'start',
  ...props
}: PromptInputHoverCardContentProps) => (
  <HoverCardContent align={align} {...props} />
);

// ============================================================================
// PromptInputCommand - command palette wrappers
// ============================================================================

export type PromptInputCommandProps = ComponentProps<typeof Command>;

export const PromptInputCommand = ({
  className,
  ...props
}: PromptInputCommandProps) => <Command className={cn(className)} {...props} />;

export type PromptInputCommandInputProps = ComponentProps<typeof CommandInput>;

export const PromptInputCommandInput = ({
  className,
  ...props
}: PromptInputCommandInputProps) => (
  <CommandInput className={cn(className)} {...props} />
);

export type PromptInputCommandListProps = ComponentProps<typeof CommandList>;

export const PromptInputCommandList = ({
  className,
  ...props
}: PromptInputCommandListProps) => (
  <CommandList className={cn(className)} {...props} />
);

export type PromptInputCommandEmptyProps = ComponentProps<typeof CommandEmpty>;

export const PromptInputCommandEmpty = ({
  ...props
}: PromptInputCommandEmptyProps) => <CommandEmpty {...props} />;

export type PromptInputCommandGroupProps = ComponentProps<typeof CommandGroup>;

export const PromptInputCommandGroup = ({
  className,
  ...props
}: PromptInputCommandGroupProps) => (
  <CommandGroup className={cn(className)} {...props} />
);

export type PromptInputCommandItemProps = ComponentProps<typeof CommandItem>;

export const PromptInputCommandItem = ({
  className,
  ...props
}: PromptInputCommandItemProps) => (
  <CommandItem className={cn(className)} {...props} />
);

export type PromptInputCommandSeparatorProps = ComponentProps<
  typeof CommandSeparator
>;

export const PromptInputCommandSeparator = ({
  className,
  ...props
}: PromptInputCommandSeparatorProps) => (
  <CommandSeparator className={cn(className)} {...props} />
);

// ============================================================================
// PromptInputTabs* - lightweight tabbed panels inside dropdowns / menus
// ============================================================================

export type PromptInputTabsListProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTabsList = ({
  className,
  ...props
}: PromptInputTabsListProps) => <div className={cn(className)} {...props} />;

export type PromptInputTabProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTab = ({
  className,
  ...props
}: PromptInputTabProps) => <div className={cn(className)} {...props} />;

export type PromptInputTabLabelProps = HTMLAttributes<HTMLHeadingElement>;

export const PromptInputTabLabel = ({
  className,
  ...props
}: PromptInputTabLabelProps) => (
  <h3
    className={cn(
      'mb-2 px-3 font-medium text-muted-foreground text-xs',
      className,
    )}
    {...props}
  />
);

export type PromptInputTabBodyProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTabBody = ({
  className,
  ...props
}: PromptInputTabBodyProps) => (
  <div className={cn('space-y-1', className)} {...props} />
);

export type PromptInputTabItemProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTabItem = ({
  className,
  ...props
}: PromptInputTabItemProps) => (
  <div
    className={cn(
      'flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent',
      className,
    )}
    {...props}
  />
);
