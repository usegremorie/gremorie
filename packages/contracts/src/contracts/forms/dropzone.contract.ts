import { defineContract } from '../../types';

/**
 * Dropzone - a drop target for files, with a hidden file input behind it so the
 * same area also opens the native picker on click, Enter or Space. It validates
 * the dropped files (type, size, count) and reports them split into accepted and
 * rejected. React wraps `react-dropzone`; Angular uses native HTML drag and drop
 * with the same validation rules and error codes.
 * React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const dropzone = defineContract({
  name: 'dropzone',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <dropzone>                    (the drop area; focusable, hidden file input inside)
    ├─ dropzone-icon              (optional, themed glyph container)
    ├─ dropzone-title             (names the area; labels the group)
    ├─ dropzone-description       (hint: accepted types, limits; describes the group)
    └─ dropzone-action            (optional, a button that also opens the picker)`,
  props: [
    {
      name: 'accept',
      type: 'Record<string, string[]>',
      desc: 'Accepted types: MIME type (or wildcard) keys mapped to optional extensions, e.g. { "image/*": [".png", ".jpg"] }. Everything is accepted when omitted.',
      control: false,
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: true,
      desc: 'Allow more than one file per drop or pick.',
    },
    {
      name: 'maxSize',
      type: 'number',
      desc: 'Largest accepted file, in bytes.',
    },
    {
      name: 'maxFiles',
      type: 'number',
      desc: 'Most files accepted per drop (the surplus is rejected with too-many-files). Applies when multiple is on; 0 or omitted means no limit.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Disables dropping, clicking and the keyboard; sets data-disabled.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: false,
      desc: 'Marks the area as invalid (destructive border); sets data-invalid.',
    },
    {
      name: 'name',
      type: 'string',
      desc: 'Name of the underlying file input.',
    },
    {
      name: 'onDrop',
      type: '(accepted: File[], rejected: FileRejection[]) => void',
      adapts: { ng: 'output: filesDropped ({ accepted, rejected })' },
      desc: 'Fires after every drop or pick with the files split into accepted and rejected.',
    },
    {
      name: 'onDropAccepted',
      type: '(accepted: File[]) => void',
      adapts: { ng: 'output: filesAccepted' },
      desc: 'Fires when at least one file was accepted.',
    },
    {
      name: 'onDropRejected',
      type: '(rejected: FileRejection[]) => void',
      adapts: { ng: 'output: filesRejected' },
      desc: 'Fires when at least one file was rejected; each rejection carries its error codes (file-invalid-type, file-too-large, too-many-files).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the drop area.',
    },
  ],
  guidance: {
    summary:
      'A drop area for files that also opens the native picker, with accept, size and count validation.',
    whenToUse: [
      'Let people upload one or many files by dragging them in or browsing.',
      'Show the accepted types and limits next to the area, and the rejections after a drop.',
    ],
    whenNotToUse: [
      { text: 'A single file field inside a compact form row', use: 'input' },
      { text: 'An empty collection with a call to action', use: 'empty' },
    ],
    rules: [
      'The area is one focus stop: Enter or Space opens the picker. The title labels it and the description describes it, automatically.',
      'The state lives in data attributes: data-drag-active, data-drag-reject, data-disabled, data-invalid. Style children with group-data-[...]/dropzone.',
      'The component reports files; it does not render the file list or the rejection messages. Compose those next to it.',
    ],
    example:
      '<dropzone accept={{ "image/*": [] }} maxSize={5_000_000}><dropzone-icon/><dropzone-title>Drop files</dropzone-title><dropzone-description>PNG or JPG, up to 5 MB</dropzone-description><dropzone-action>Browse files</dropzone-action></dropzone>',
  },
  preview: {
    rx: 'inputs-files-dropzone--workbench',
    ng: 'inputs-files-dropzone--workbench',
  },
  tag: { rx: 'Dropzone', ng: 'gr-dropzone' },
  example: { multiple: true, disabled: false, invalid: false },
  figma: { nodeId: null },
});
