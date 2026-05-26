import {
  AttachmentData,
  AttachmentMediaCategory,
} from './attachment.types';

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `attachment-${Date.now().toString(36)}-${idCounter}`;
}

/**
 * Convert a native File into an AttachmentData shape that the components
 * consume. Generates a stable id if you don't provide one.
 */
export function toAttachmentData(
  file: File,
  overrides?: Partial<AttachmentData>,
): AttachmentData {
  return {
    id: overrides?.id ?? nextId(),
    filename: overrides?.filename ?? file.name,
    mediaType: overrides?.mediaType ?? file.type,
    size: overrides?.size ?? file.size,
    file,
    ...overrides,
  };
}

/**
 * Classify an attachment into a coarse media category — drives the
 * preview surface (image vs video vs audio vs generic document icon).
 */
export function getMediaCategory(
  data: Pick<AttachmentData, 'mediaType'>,
): AttachmentMediaCategory {
  const mime = data.mediaType?.toLowerCase() ?? '';
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  if (
    mime === 'application/pdf' ||
    mime.startsWith('text/') ||
    mime.includes('document') ||
    mime.includes('spreadsheet') ||
    mime.includes('presentation')
  ) {
    return 'document';
  }
  if (mime.startsWith('text/uri-list') || mime === 'application/url') {
    return 'source';
  }
  return 'unknown';
}

/**
 * Pick the best human-readable label for an attachment. Filename wins;
 * fallback hierarchy lets even a typeless blob show something useful.
 */
export function getAttachmentLabel(
  data: Pick<AttachmentData, 'filename' | 'mediaType'>,
): string {
  if (data.filename) return data.filename;
  const category = getMediaCategory(data);
  switch (category) {
    case 'image':
      return 'Image';
    case 'video':
      return 'Video';
    case 'audio':
      return 'Audio';
    case 'document':
      return 'Document';
    case 'source':
      return 'Source';
    default:
      return 'Attachment';
  }
}

/** Format byte count as a short string like "240 KB" or "12.4 MB". */
export function formatFileSize(bytes: number | undefined): string {
  if (bytes === undefined || bytes < 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
