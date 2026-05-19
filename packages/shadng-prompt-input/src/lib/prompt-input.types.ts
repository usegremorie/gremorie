export type PromptInputState =
  | 'ready'
  | 'submitted'
  | 'streaming'
  | 'error';

export type PromptInputSize = 'sm' | 'md' | 'lg';

export type PromptInputVariant = 'default' | 'ghost' | 'bordered';

export type PromptInputAttachmentType =
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'text'
  | 'generic';

export interface PromptInputSubmitEvent {
  value: string;
  attachments: readonly File[];
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
