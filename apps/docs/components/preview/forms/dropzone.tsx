'use client';

import {
  Button,
  Dropzone,
  DropzoneAction,
  DropzoneDescription,
  DropzoneIcon,
  DropzoneTitle,
  type FileRejection,
} from '@gremorie/rx-forms';
import { FileIcon, UploadIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

const kb = (bytes: number) => `${Math.max(1, Math.round(bytes / 1024))} KB`;

export function DropzonePreview() {
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<FileRejection[]>([]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <Dropzone
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
        maxSize={5 * 1024 * 1024}
        maxFiles={4}
        invalid={rejected.length > 0}
        onDrop={(accepted, rej) => {
          setFiles((prev) => [...prev, ...accepted]);
          setRejected(rej);
        }}
      >
        <DropzoneIcon>
          <UploadIcon />
        </DropzoneIcon>
        <div className="flex flex-col gap-1">
          <DropzoneTitle>Drag and drop images here</DropzoneTitle>
          <DropzoneDescription>
            PNG or JPG, up to 5 MB each, 4 files at a time
          </DropzoneDescription>
        </div>
        <DropzoneAction>Browse files</DropzoneAction>
      </Dropzone>

      {rejected.length > 0 && (
        <ul
          role="alert"
          className="flex flex-col gap-1 text-sm text-destructive"
        >
          {rejected.map(({ file, errors }) => (
            <li key={file.name}>
              {file.name}: {errors.map((e) => e.message).join(', ')}
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <ul className="flex flex-col gap-1">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <FileIcon className="size-4 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <span className="text-muted-foreground">{kb(file.size)}</span>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove ${file.name}`}
                onClick={() =>
                  setFiles((prev) => prev.filter((_, j) => j !== i))
                }
              >
                <XIcon />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
