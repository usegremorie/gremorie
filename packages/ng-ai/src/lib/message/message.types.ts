/**
 * Mirrors AI SDK `UIMessage["role"]`.
 *
 * React rx-ai source: packages/rx-ai/src/lib/message/message.tsx
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Subset of the AI SDK `FileUIPart` shape used by MessageAttachment.
 * Kept local so consumers do not have to install the `ai` package just
 * to render an attachment.
 */
export interface MessageAttachmentData {
  filename?: string;
  mediaType?: string;
  url?: string;
}
