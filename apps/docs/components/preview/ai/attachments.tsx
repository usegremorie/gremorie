'use client';

import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  type AttachmentData,
} from '@gremorie/rx-ai';

const files: AttachmentData[] = [
  {
    id: '1',
    type: 'file',
    mediaType: 'image/png',
    filename: 'dashboard-mock.png',
    url: '',
  },
  {
    id: '2',
    type: 'file',
    mediaType: 'application/pdf',
    filename: 'spec-v3.pdf',
    url: '',
  },
  {
    id: '3',
    type: 'file',
    mediaType: 'audio/mpeg',
    filename: 'voice-note.mp3',
    url: '',
  },
];

export function AttachmentsPreview() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">grid</span>
        <Attachments variant="grid" className="ml-0">
          {files.map((data) => (
            <Attachment key={data.id} data={data} onRemove={() => undefined}>
              <AttachmentPreview />
              <AttachmentRemove />
            </Attachment>
          ))}
        </Attachments>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">inline</span>
        <Attachments variant="inline">
          {files.map((data) => (
            <Attachment key={data.id} data={data} onRemove={() => undefined}>
              <AttachmentPreview />
              <AttachmentInfo />
              <AttachmentRemove />
            </Attachment>
          ))}
        </Attachments>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">list</span>
        <Attachments variant="list">
          {files.map((data) => (
            <Attachment key={data.id} data={data} onRemove={() => undefined}>
              <AttachmentPreview />
              <AttachmentInfo showMediaType />
              <AttachmentRemove />
            </Attachment>
          ))}
        </Attachments>
      </div>
    </div>
  );
}
