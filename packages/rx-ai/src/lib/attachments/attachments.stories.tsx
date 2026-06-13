import type { Meta, StoryObj } from '@storybook/react';
import { useCallback, useState } from 'react';

import {
  Attachment,
  type AttachmentData,
  AttachmentEmpty,
  AttachmentHoverCard,
  AttachmentHoverCardContent,
  AttachmentHoverCardTrigger,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  getAttachmentLabel,
  getMediaCategory,
} from './attachments';

/**
 * # Attachments
 *
 * A flexible, composable surface for displaying files, images, video, audio and
 * source documents — a faithful port of the Vercel AI Elements **Attachments**.
 * It is **standalone** (no PromptInput context required), so the same component
 * renders attachments in a composer *and* on a sent message.
 *
 * ## Variants
 *
 * | `variant` | Layout | Use |
 * | --- | --- | --- |
 * | `grid` *(default)* | thumbnail tiles | attachments on a message |
 * | `inline` | compact badges + hover preview | input/composer areas |
 * | `list` | full-metadata rows | file managers |
 *
 * ## Anatomy
 *
 * ```text
 * Attachments                  sets the variant (grid | inline | list)
 * ├─ Attachment                one per file (data, onRemove)
 * │  ├─ AttachmentPreview      thumbnail / icon
 * │  ├─ AttachmentInfo         name + media type
 * │  ├─ AttachmentRemove
 * │  └─ AttachmentHoverCard    inline preview (Trigger + Content)
 * └─ AttachmentEmpty           zero-state
 * ```
 *
 * Media category is auto-detected from `data.mediaType` via `getMediaCategory`
 * (image · video · audio · document · source · unknown), each with its own
 * fallback icon.
 */
const meta = {
  title: 'AI/Chatbot/Attachments',
  component: Attachments,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['grid', 'inline', 'list'],
      description: 'Layout variant.',
    },
  },
} satisfies Meta<typeof Attachments>;

export default meta;
type Story = StoryObj<typeof meta>;

const IMG_MOUNTAIN =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop';
const IMG_OCEAN =
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=400&fit=crop';

const FILES: AttachmentData[] = [
  {
    id: 'mountain',
    type: 'file',
    mediaType: 'image/jpeg',
    filename: 'mountain-landscape.jpg',
    url: IMG_MOUNTAIN,
  },
  {
    id: 'ocean',
    type: 'file',
    mediaType: 'image/jpeg',
    filename: 'ocean-sunset.jpg',
    url: IMG_OCEAN,
  },
  {
    id: 'report',
    type: 'file',
    mediaType: 'application/pdf',
    filename: 'quarterly-report.pdf',
    url: '',
  },
  {
    id: 'demo',
    type: 'file',
    mediaType: 'video/mp4',
    filename: 'product-demo.mp4',
    url: '',
  },
];

// One attachment of every media category, to exercise each fallback icon.
const ONE_OF_EACH: AttachmentData[] = [
  {
    id: 'img',
    type: 'file',
    mediaType: 'image/jpeg',
    filename: 'mountain-landscape.jpg',
    url: IMG_MOUNTAIN,
  },
  {
    id: 'vid',
    type: 'file',
    mediaType: 'video/mp4',
    filename: 'product-demo.mp4',
    url: '',
  },
  {
    id: 'aud',
    type: 'file',
    mediaType: 'audio/mpeg',
    filename: 'meeting-recording.mp3',
    url: '',
  },
  {
    id: 'doc',
    type: 'file',
    mediaType: 'application/pdf',
    filename: 'quarterly-report.pdf',
    url: '',
  },
  {
    id: 'src',
    type: 'source-document',
    sourceId: 'react-docs',
    mediaType: 'text/html',
    title: 'React Documentation',
  },
];

const useRemovable = (initial: AttachmentData[]) => {
  const [items, setItems] = useState(initial);
  const remove = useCallback(
    (id: string) => setItems((prev) => prev.filter((a) => a.id !== id)),
    [],
  );
  return { items, remove };
};

/**
 * Grid — thumbnail tiles, the default for attachments shown on a message.
 * Images and video render a real preview; other types fall back to an icon.
 */
export const Grid: Story = {
  render: () => {
    const { items, remove } = useRemovable(FILES);

    return (
      <Attachments variant="grid">
        {items.map((data) => (
          <Attachment
            data={data}
            key={data.id}
            onRemove={() => remove(data.id)}
          >
            <AttachmentPreview />
            <AttachmentRemove />
          </Attachment>
        ))}
      </Attachments>
    );
  },
};

/**
 * Inline — compact badges for composer areas. Hover a badge to preview the
 * file (full image for pictures, name + MIME type for everything else); the
 * remove control swaps in over the thumbnail on hover.
 */
export const Inline: Story = {
  render: () => {
    const { items, remove } = useRemovable(ONE_OF_EACH);

    return (
      <Attachments variant="inline">
        {items.map((data) => {
          const mediaCategory = getMediaCategory(data);
          const label = getAttachmentLabel(data);

          return (
            <AttachmentHoverCard key={data.id}>
              <AttachmentHoverCardTrigger asChild>
                <Attachment data={data} onRemove={() => remove(data.id)}>
                  <div className="relative size-5 shrink-0">
                    <div className="absolute inset-0 transition-opacity group-hover:opacity-0">
                      <AttachmentPreview />
                    </div>
                    <AttachmentRemove className="absolute inset-0" />
                  </div>
                  <AttachmentInfo />
                </Attachment>
              </AttachmentHoverCardTrigger>
              <AttachmentHoverCardContent>
                <div className="space-y-3">
                  {mediaCategory === 'image' &&
                    data.type === 'file' &&
                    data.url && (
                      <div className="flex max-h-96 w-80 items-center justify-center overflow-hidden rounded-md border">
                        <img
                          alt={label}
                          className="max-h-full max-w-full object-contain"
                          height={384}
                          src={data.url}
                          width={320}
                        />
                      </div>
                    )}
                  <div className="space-y-1 px-0.5">
                    <h4 className="font-semibold text-sm leading-none">
                      {label}
                    </h4>
                    {data.mediaType && (
                      <p className="font-mono text-muted-foreground text-xs">
                        {data.mediaType}
                      </p>
                    )}
                  </div>
                </div>
              </AttachmentHoverCardContent>
            </AttachmentHoverCard>
          );
        })}
      </Attachments>
    );
  },
};

/**
 * List — full-metadata rows for file managers. `AttachmentInfo` shows the MIME
 * type and the remove button sits inline at the end of each row.
 */
export const List: Story = {
  render: () => {
    const { items, remove } = useRemovable(ONE_OF_EACH);

    return (
      <Attachments className="w-full max-w-md" variant="list">
        {items.map((data) => (
          <Attachment
            data={data}
            key={data.id}
            onRemove={() => remove(data.id)}
          >
            <AttachmentPreview />
            <AttachmentInfo showMediaType />
            <AttachmentRemove />
          </Attachment>
        ))}
      </Attachments>
    );
  },
};

/**
 * Media types — one attachment per detected category (image · video · audio ·
 * document · source), each with its own fallback icon. Read-only (no remove).
 */
export const MediaTypes: Story = {
  render: () => (
    <Attachments className="w-full max-w-md" variant="list">
      {ONE_OF_EACH.map((data) => (
        <Attachment data={data} key={data.id}>
          <AttachmentPreview />
          <AttachmentInfo showMediaType />
        </Attachment>
      ))}
    </Attachments>
  ),
};

/** Empty — the zero-state when there are no attachments to show. */
export const Empty: Story = {
  render: () => (
    <Attachments className="w-full max-w-md" variant="list">
      <AttachmentEmpty />
    </Attachments>
  ),
};
