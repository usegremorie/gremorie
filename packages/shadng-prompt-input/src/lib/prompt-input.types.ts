export type PromptInputState =
  | 'ready'
  | 'submitted'
  | 'streaming'
  | 'error';

export type PromptInputSize = 'sm' | 'md' | 'lg';

export type PromptInputVariant = 'default' | 'ghost' | 'bordered';

export interface PromptInputSubmitEvent {
  value: string;
  preventDefault: () => void;
}

export interface PromptInputAttachmentError {
  file: File;
  reason: 'invalid-mime' | 'too-large' | 'max-count';
  message: string;
}
