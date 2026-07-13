import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { AttachmentEmpty } from './attachment-empty';
import { AttachmentInfo } from './attachment-info';
import { AttachmentItem } from './attachment-item';
import { AttachmentList } from './attachment-list';
import { AttachmentPreview } from './attachment-preview';
import { AttachmentRemove } from './attachment-remove';
import type { AttachmentData } from './attachment.types';

/**
 * Attachments — a flexible, composable surface for displaying files, images,
 * video, audio and source documents. Standalone (no PromptInput context
 * required), so the same family renders attachments in a composer *and* on a
 * sent message. Parity port of the React AI Elements **Attachments**
 * (`@gremorie/rx-ai`).
 *
 * ## Variants
 *
 * | `variant` | Layout | Use |
 * | --- | --- | --- |
 * | `grid` *(default)* | thumbnail tiles | attachments on a message |
 * | `inline` | compact badges | input/composer areas |
 * | `list` | full-metadata rows | file managers |
 *
 * ## Anatomy
 *
 * ```text
 * <attachment-list>              sets the variant (grid | inline | list)
 * ├─ <attachment-item>           one per file ([data], (removed))
 * │  ├─ <attachment-preview>     thumbnail / media-type icon
 * │  ├─ <attachment-info>        name + optional media type / size
 * │  └─ <attachment-remove>      calls the item's (removed) output via DI
 * └─ <attachment-empty>          zero-state
 * ```
 *
 * Media category is auto-detected from `data.mediaType` via `getMediaCategory`
 * (image · video · audio · document · source · unknown), each with its own
 * fallback icon.
 *
 * Angular deltas from React: the wrapper is `<attachment-list [variant]>` and
 * the item is `<attachment-item [data]>`; removal is wired through the item's
 * `(removed)` output (`<attachment-remove>` triggers it via DI) rather than an
 * `onRemove` prop; there is no HoverCard preview primitive, so the `inline`
 * story shows the compact badge row without it.
 */
const meta: Meta<AttachmentList> = {
  title: 'AI/Chatbot/Attachments',
  component: AttachmentList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['grid', 'inline', 'list'],
      description: 'Layout variant.',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        AttachmentList,
        AttachmentItem,
        AttachmentPreview,
        AttachmentInfo,
        AttachmentRemove,
        AttachmentEmpty,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<AttachmentList>;

const IMG_MOUNTAIN =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop';
const IMG_OCEAN =
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=400&fit=crop';

const FILES: AttachmentData[] = [
  {
    id: 'mountain',
    mediaType: 'image/jpeg',
    filename: 'mountain-landscape.jpg',
    url: IMG_MOUNTAIN,
  },
  {
    id: 'ocean',
    mediaType: 'image/jpeg',
    filename: 'ocean-sunset.jpg',
    url: IMG_OCEAN,
  },
  {
    id: 'report',
    mediaType: 'application/pdf',
    filename: 'quarterly-report.pdf',
  },
  { id: 'demo', mediaType: 'video/mp4', filename: 'product-demo.mp4' },
];

// One attachment of every media category, to exercise each fallback icon.
// NB: NG's `getMediaCategory` maps `text/*` to "document"; the source category
// is keyed off `application/url`, so that is what the source entry uses.
const ONE_OF_EACH: AttachmentData[] = [
  {
    id: 'img',
    mediaType: 'image/jpeg',
    filename: 'mountain-landscape.jpg',
    url: IMG_MOUNTAIN,
  },
  { id: 'vid', mediaType: 'video/mp4', filename: 'product-demo.mp4' },
  { id: 'aud', mediaType: 'audio/mpeg', filename: 'meeting-recording.mp3' },
  { id: 'doc', mediaType: 'application/pdf', filename: 'quarterly-report.pdf' },
  { id: 'src', mediaType: 'application/url', filename: 'React Documentation' },
];

/** A local, mutable copy + a `remove` handler that filters it in place. */
function removable(initial: AttachmentData[]) {
  const items = initial.map((a) => ({ ...a }));
  return {
    items,
    remove: (data: AttachmentData) => {
      const i = items.findIndex((a) => a.id === data.id);
      if (i >= 0) items.splice(i, 1);
    },
  };
}

/**
 * Grid — thumbnail tiles, the default for attachments shown on a message.
 * Images render a real preview; other types fall back to a media-type icon.
 */
export const Grid: Story = {
  render: () => ({
    props: removable(FILES),
    template: `
      <attachment-list variant="grid">
        @for (item of items; track item.id) {
          <attachment-item [data]="item" (removed)="remove($event)">
            <attachment-preview />
            <attachment-remove />
          </attachment-item>
        }
      </attachment-list>
    `,
  }),
};

/**
 * Inline — compact badges for composer areas. Each badge shows a small preview
 * plus the filename; the remove control sits inline. (Angular has no HoverCard
 * primitive, so there is no hover preview here.)
 */
export const Inline: Story = {
  render: () => ({
    props: removable(ONE_OF_EACH),
    template: `
      <attachment-list variant="inline">
        @for (item of items; track item.id) {
          <attachment-item [data]="item" (removed)="remove($event)">
            <attachment-preview />
            <attachment-info />
            <attachment-remove />
          </attachment-item>
        }
      </attachment-list>
    `,
  }),
};

/**
 * List — full-metadata rows for file managers. `<attachment-info>` shows the
 * MIME type and the remove button sits inline at the end of each row.
 */
export const List: Story = {
  render: () => ({
    props: removable(ONE_OF_EACH),
    template: `
      <attachment-list variant="list" class="w-full max-w-md">
        @for (item of items; track item.id) {
          <attachment-item [data]="item" (removed)="remove($event)">
            <attachment-preview />
            <attachment-info [showMediaType]="true" />
            <attachment-remove />
          </attachment-item>
        }
      </attachment-list>
    `,
  }),
};

/**
 * Media types — one attachment per detected category (image · video · audio ·
 * document · source), each with its own fallback icon. Read-only (no remove).
 */
export const MediaTypes: Story = {
  name: 'Media types',
  render: () => ({
    props: { items: ONE_OF_EACH },
    template: `
      <attachment-list variant="list" class="w-full max-w-md">
        @for (item of items; track item.id) {
          <attachment-item [data]="item">
            <attachment-preview />
            <attachment-info [showMediaType]="true" />
          </attachment-item>
        }
      </attachment-list>
    `,
  }),
};

/** Empty — the zero-state when there are no attachments to show. */
export const Empty: Story = {
  render: () => ({
    template: `
      <attachment-list variant="list" class="w-full max-w-md">
        <attachment-empty />
      </attachment-list>
    `,
  }),
};
