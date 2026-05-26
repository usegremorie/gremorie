import type { AttachmentData } from '@gremorie/ng-attachments';

export type PromptInputState =
  | 'ready'
  | 'submitted'
  | 'streaming'
  | 'error';

export type PromptInputSize = 'sm' | 'md' | 'lg';

export type PromptInputVariant = 'default' | 'ghost' | 'bordered';

export interface PromptInputSubmitEvent {
  value: string;
  attachments: readonly AttachmentData[];
  preventDefault: () => void;
}

export interface PromptInputAttachmentError {
  file: File;
  reason: 'invalid-mime' | 'too-large' | 'max-count';
  message: string;
}

export interface PromptInputModelOption {
  id: string;
  label: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
}
