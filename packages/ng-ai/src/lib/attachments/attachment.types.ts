/**
 * Shape consumed by the Attachments family.
 *
 * Mirrors the AI SDK's FileUIPart surface but without depending on the
 * `ai` package. Consumers can pass FileUIPart directly (structurally
 * compatible) or use {@link toAttachmentData} when starting from a
 * native File.
 */
export interface AttachmentData {
  /** Stable identifier — required for tracking in *ngFor / @for */
  id: string;
  /** Filename or display label. Falls back to mediaType-derived label. */
  filename?: string;
  /** MIME type — used to pick the preview surface (image/video/audio/document/source/unknown). */
  mediaType?: string;
  /** Already-uploaded URL — used as <img>/<video> src in the preview. */
  url?: string;
  /** Native File object — used to derive a blob URL preview client-side. */
  file?: File;
  /** Byte size — when omitted, derived from `file.size` if present. */
  size?: number;
}

export type AttachmentVariant = 'grid' | 'inline' | 'list';

export type AttachmentMediaCategory =
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'source'
  | 'unknown';
