import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { PromptInputAttachment } from './prompt-input-attachment';
import { PromptInputAttachments } from './prompt-input-attachments';

const mockFile = (name: string, size: number, type: string): File => {
  return new File(['mock'], name, { type });
};

const FILES = [
  mockFile('design-spec.pdf', 1024 * 240, 'application/pdf'),
  mockFile('notes.txt', 512, 'text/plain'),
  mockFile('clip.mp4', 1024 * 1024 * 12, 'video/mp4'),
];

const meta: Meta<PromptInputAttachments> = {
  title: 'PromptInput/Attachments',
  component: PromptInputAttachments,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [PromptInputAttachment] })],
  render: () => ({
    props: { files: FILES },
    template: `
      <prompt-input-attachments>
        @for (file of files; track file.name) {
          <prompt-input-attachment [file]="file" />
        }
      </prompt-input-attachments>
    `,
  }),
};

export default meta;
type Story = StoryObj<PromptInputAttachments>;
export const Multiple: Story = { name: 'Three attachments (pdf · text · video)' };
