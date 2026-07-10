'use client';

import {
  type AttachmentFile,
  Attachments,
  PromptInput,
  PromptInputAttachButton,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@gremorie/rx-ai';

// Pre-seeded demo chips so the surface is not empty. Files the user
// actually attaches flow through PromptInputAttachments below.
const SAMPLE_FILES: AttachmentFile[] = [
  {
    id: 'chart',
    type: 'file',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
    mediaType: 'image/jpeg',
    filename: 'q3-revenue-chart.png',
  },
  {
    id: 'pdf',
    type: 'file',
    url: '',
    mediaType: 'application/pdf',
    filename: 'q3-report.pdf',
  },
  {
    id: 'call',
    type: 'file',
    url: '',
    mediaType: 'audio/mpeg',
    filename: 'earnings-call.mp3',
  },
];

export function PromptInputAttachmentsPreview() {
  return (
    <PromptInput
      className="mx-auto max-w-xl"
      globalDrop
      multiple
      onSubmit={() => {
        // demo: wire onSubmit to the AI SDK to make this real
      }}
    >
      <PromptInputBody>
        <Attachments className="w-full px-3" variant="inline">
          {SAMPLE_FILES.map((file) => (
            <PromptInputAttachment data={file} key={file.id} />
          ))}
        </Attachments>
        <PromptInputAttachments>
          {(attachment) => <PromptInputAttachment data={attachment} />}
        </PromptInputAttachments>
        <PromptInputTextarea placeholder="Ask about these files..." />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputAttachButton tooltip="Attach files" />
        </PromptInputTools>
        <PromptInputSubmit status="ready" />
      </PromptInputFooter>
    </PromptInput>
  );
}
