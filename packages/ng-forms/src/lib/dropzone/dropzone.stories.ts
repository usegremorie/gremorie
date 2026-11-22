import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Dropzone,
  DropzoneAction,
  DropzoneDescription,
  DropzoneIcon,
  DropzoneTitle,
} from './dropzone';

/**
 * Dropzone — a drop target for files. Angular parity port of React `Dropzone`
 * from `@gremorie/rx-forms`. Dropping files, or activating the area with a
 * click, Enter or Space, reports them split into accepted and rejected through
 * `filesDropped` / `filesAccepted` / `filesRejected`, validated against
 * `accept`, `maxSize` and `maxFiles`. Native drag and drop plus a hidden file
 * input, so no extra dependency. State lives in `data-drag-active`,
 * `data-drag-reject`, `data-disabled` and `data-invalid`.
 */
const meta: Meta<Dropzone> = {
  title: 'Inputs/Files/Dropzone',
  component: Dropzone,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        Dropzone,
        DropzoneIcon,
        DropzoneTitle,
        DropzoneDescription,
        DropzoneAction,
      ],
    }),
  ],
  args: { multiple: true, disabled: false, invalid: false },
  argTypes: {
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    maxSize: { control: 'number' },
    maxFiles: { control: 'number' },
    accept: { control: false },
  },
};

export default meta;
type Story = StoryObj<Dropzone>;

const UPLOAD_ICON = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
  </svg>`;

const BODY = `
  <gr-dropzone-icon>${UPLOAD_ICON}</gr-dropzone-icon>
  <div class="flex flex-col gap-1">
    <gr-dropzone-title>Drag and drop files here</gr-dropzone-title>
    <gr-dropzone-description>PNG or JPG, up to 5 MB each</gr-dropzone-description>
  </div>
  <gr-dropzone-action>Browse files</gr-dropzone-action>`;

const ACCEPT_IMAGES = { 'image/*': [] as string[] };

/** Workbench: one dropzone driven by the controls. */
export const Workbench: Story = {
  args: { accept: { 'image/*': ['.png', '.jpg'] }, maxSize: 5_000_000 },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-96">
        <gr-dropzone [accept]="accept" [multiple]="multiple" [maxSize]="maxSize" [maxFiles]="maxFiles" [disabled]="disabled" [invalid]="invalid">
          ${BODY}
        </gr-dropzone>
      </div>`,
  }),
};

export const Default: Story = {
  render: () => ({
    template: `<div class="w-96"><gr-dropzone>${BODY}</gr-dropzone></div>`,
  }),
};

/** Simulates a file hovering the area, as a real drag would. */
function hover(type: string) {
  return async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const area = canvasElement.querySelector('[data-slot="dropzone"]');
    const event = new Event('dragenter', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'dataTransfer', {
      value: { types: ['Files'], items: [{ kind: 'file', type }] },
    });
    area?.dispatchEvent(event);
  };
}

/** A valid file is over the area: `data-drag-active`. */
export const DragActive: Story = {
  render: () => ({
    props: { accept: ACCEPT_IMAGES },
    template: `<div class="w-96"><gr-dropzone [accept]="accept">${BODY}</gr-dropzone></div>`,
  }),
  play: hover('image/png'),
};

/** A file the area would refuse is over it: `data-drag-reject`. */
export const DragRejected: Story = {
  render: () => ({
    props: { accept: ACCEPT_IMAGES },
    template: `<div class="w-96"><gr-dropzone [accept]="accept">${BODY}</gr-dropzone></div>`,
  }),
  play: hover('application/zip'),
};

export const Invalid: Story = {
  render: () => ({
    template: `<div class="w-96"><gr-dropzone invalid>${BODY}</gr-dropzone></div>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<div class="w-96"><gr-dropzone disabled>${BODY}</gr-dropzone></div>`,
  }),
};

/** The area without icon and action: the whole surface is the target. */
export const Minimal: Story = {
  render: () => ({
    template: `
      <div class="w-96">
        <gr-dropzone>
          <gr-dropzone-title>Drop files to attach</gr-dropzone-title>
          <gr-dropzone-description>or click to browse</gr-dropzone-description>
        </gr-dropzone>
      </div>`,
  }),
};

/** Accepted files listed below, rejections explained, each removable. */
export const WithFileList: Story = {
  render: () => ({
    props: {
      accept: ACCEPT_IMAGES,
      files: [] as File[],
      rejected: [] as { file: File; errors: { message: string }[] }[],
      onDropped(event: {
        accepted: File[];
        rejected: { file: File; errors: { message: string }[] }[];
      }) {
        this['files'] = [...this['files'], ...event.accepted];
        this['rejected'] = event.rejected;
      },
      remove(index: number) {
        this['files'] = this['files'].filter(
          (_: File, i: number) => i !== index,
        );
      },
      kb: (bytes: number) => `${Math.max(1, Math.round(bytes / 1024))} KB`,
    },
    template: `
      <div class="flex w-96 flex-col gap-3">
        <gr-dropzone [accept]="accept" [maxSize]="200000" [maxFiles]="3" [invalid]="rejected.length > 0" (filesDropped)="onDropped($event)">
          ${BODY}
        </gr-dropzone>
        @if (rejected.length) {
          <ul role="alert" class="flex flex-col gap-1 text-sm text-destructive">
            @for (r of rejected; track r.file.name) {
              <li>{{ r.file.name }}: {{ r.errors[0].message }}</li>
            }
          </ul>
        }
        @if (files.length) {
          <ul class="flex flex-col gap-1">
            @for (file of files; track $index) {
              <li class="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                <span class="min-w-0 flex-1 truncate">{{ file.name }}</span>
                <span class="text-muted-foreground">{{ kb(file.size) }}</span>
                <button type="button" class="text-muted-foreground hover:text-foreground" [attr.aria-label]="'Remove ' + file.name" (click)="remove($index)">&times;</button>
              </li>
            }
          </ul>
        }
      </div>`,
  }),
};
