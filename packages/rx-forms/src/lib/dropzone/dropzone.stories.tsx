import type { Meta, StoryObj } from '@storybook/react';
import { FileIcon, UploadIcon, XIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '../button';
import {
  Dropzone,
  DropzoneAction,
  DropzoneDescription,
  DropzoneIcon,
  DropzoneTitle,
  type FileRejection,
} from './dropzone';

/**
 * # Dropzone
 *
 * A drop target for files. Dropping files, or activating the area with a click,
 * Enter or Space, reports them split into accepted and rejected, validated
 * against `accept`, `maxSize` and `maxFiles`. Built on `react-dropzone`.
 * The component reports files; the file list and the rejection messages are
 * composed next to it (see the "With file list" story).
 *
 * ## Anatomy
 *
 * ```text
 * Dropzone                    the drop area; focusable, hidden file input inside
 * ├─ DropzoneIcon             optional themed glyph container
 * ├─ DropzoneTitle            names the area (aria-labelledby)
 * ├─ DropzoneDescription      hint: accepted types, limits (aria-describedby)
 * └─ DropzoneAction           optional button that also opens the picker
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `accept` | `Record<string, string[]>` | none | MIME keys (wildcards allowed) mapped to extensions. |
 * | `multiple` | `boolean` | `true` | Allow more than one file. |
 * | `maxSize` | `number` | none | Largest accepted file, in bytes. |
 * | `maxFiles` | `number` | none | Most files accepted per drop; the surplus is rejected. |
 * | `disabled` | `boolean` | `false` | Disables dropping, clicking and the keyboard. |
 * | `invalid` | `boolean` | `false` | Destructive border. |
 * | `name` | `string` | none | Name of the file input. |
 * | `onDrop` | `(accepted, rejected) => void` | none | After every drop or pick. |
 * | `onDropAccepted` | `(accepted) => void` | none | At least one file accepted. |
 * | `onDropRejected` | `(rejected) => void` | none | At least one file rejected (codes: `file-invalid-type`, `file-too-large`, `too-many-files`). |
 *
 * ## State attributes
 *
 * `data-drag-active`, `data-drag-reject`, `data-disabled`, `data-invalid`.
 * Style children with `group-data-[...]/dropzone`.
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--input` | dashed border |
 * | `--ring` | focus ring |
 * | `--primary` | drag-active border and tint |
 * | `--destructive` | rejected drag, invalid border and tint |
 * | `--muted` / `--muted-foreground` | icon container, description |
 */
const meta = {
  title: 'Inputs/Files/Dropzone',
  component: Dropzone,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { multiple: true, disabled: false, invalid: false },
  argTypes: {
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    maxSize: { control: 'number' },
    maxFiles: { control: 'number' },
    accept: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

const parts = (
  <>
    <DropzoneIcon>
      <UploadIcon />
    </DropzoneIcon>
    <div className="flex flex-col gap-1">
      <DropzoneTitle>Drag and drop files here</DropzoneTitle>
      <DropzoneDescription>PNG or JPG, up to 5 MB each</DropzoneDescription>
    </div>
    <DropzoneAction>Browse files</DropzoneAction>
  </>
);

/** Workbench: one dropzone driven by the controls. */
export const Workbench: Story = {
  args: { accept: { 'image/*': ['.png', '.jpg'] }, maxSize: 5_000_000 },
  render: (args) => <Dropzone {...args}>{parts}</Dropzone>,
};

export const Default: Story = {
  render: (args) => <Dropzone {...args}>{parts}</Dropzone>,
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
  args: { accept: { 'image/*': [] } },
  render: (args) => <Dropzone {...args}>{parts}</Dropzone>,
  play: hover('image/png'),
};

/** A file the area would refuse is over it: `data-drag-reject`. */
export const DragRejected: Story = {
  args: { accept: { 'image/*': [] } },
  render: (args) => <Dropzone {...args}>{parts}</Dropzone>,
  play: hover('application/zip'),
};

export const Invalid: Story = {
  args: { invalid: true },
  render: (args) => <Dropzone {...args}>{parts}</Dropzone>,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <Dropzone {...args}>{parts}</Dropzone>,
};

/** The area without icon and action: the whole surface is the target. */
export const Minimal: Story = {
  render: (args) => (
    <Dropzone {...args}>
      <DropzoneTitle>Drop files to attach</DropzoneTitle>
      <DropzoneDescription>or click to browse</DropzoneDescription>
    </Dropzone>
  ),
};

const kb = (bytes: number) => `${Math.max(1, Math.round(bytes / 1024))} KB`;

/** Accepted files listed below, rejections explained, each removable. */
export const WithFileList: Story = {
  args: { accept: { 'image/*': [] }, maxSize: 200_000, maxFiles: 3 },
  render: function Render(args) {
    const [files, setFiles] = React.useState<File[]>([]);
    const [rejected, setRejected] = React.useState<FileRejection[]>([]);
    return (
      <div className="flex flex-col gap-3">
        <Dropzone
          {...args}
          invalid={rejected.length > 0}
          onDrop={(accepted, rej) => {
            setFiles((prev) => [...prev, ...accepted]);
            setRejected(rej);
          }}
        >
          {parts}
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
  },
};
