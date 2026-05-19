import type { Meta, StoryObj } from '@storybook/angular';

import { PromptInputAttachment } from './prompt-input-attachment';

const file = (name: string, size: number, type: string) =>
  new File(['x'], name, { type });

const meta: Meta<PromptInputAttachment> = {
  title: 'PromptInput/Attachment',
  component: PromptInputAttachment,
  tags: ['autodocs'],
  argTypes: {
    loading: { control: 'boolean' },
    errored: { control: 'boolean' },
    removable: { control: 'boolean' },
  },
  args: {
    file: file('document.pdf', 1024 * 240, 'application/pdf'),
    loading: false,
    errored: false,
    removable: true,
  },
};

export default meta;
type Story = StoryObj<PromptInputAttachment>;

export const Pdf: Story = {
  args: { file: file('design-spec.pdf', 1024 * 240, 'application/pdf') },
};
export const Text: Story = {
  args: { file: file('notes.txt', 512, 'text/plain') },
};
export const Video: Story = {
  args: { file: file('clip.mp4', 1024 * 1024 * 12, 'video/mp4') },
};
export const Audio: Story = {
  args: { file: file('voice.mp3', 1024 * 1024 * 2, 'audio/mpeg') },
};
export const Generic: Story = {
  args: { file: file('archive.zip', 1024 * 1024, 'application/zip') },
};
export const Loading: Story = {
  args: { file: file('uploading.pdf', 1024 * 100, 'application/pdf'), loading: true },
};
export const Errored: Story = {
  args: { file: file('rejected.pdf', 1024 * 100, 'application/pdf'), errored: true },
};
