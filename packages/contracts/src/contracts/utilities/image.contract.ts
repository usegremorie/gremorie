import { defineContract } from '../../types';

/**
 * Image - renders an AI SDK `Experimental_GeneratedImage` (base64 + mediaType)
 * as a responsive, rounded `<img>` whose `src` is a `data:` URL.
 * React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const image = defineContract({
  name: 'image',
  category: 'utilities',
  status: 'stable',
  anatomy: `
    <image>
    └─ img (src = data:<mediaType>;base64,<base64>, responsive + rounded)`,
  props: [
    {
      name: 'base64',
      type: 'string',
      required: true,
      desc: 'Base64-encoded image payload (built into the data URL).',
    },
    {
      name: 'mediaType',
      type: 'string',
      required: true,
      desc: 'MIME type, e.g. "image/png".',
    },
    {
      name: 'uint8Array',
      type: 'Uint8Array',
      desc: 'Raw bytes (part of the AI SDK shape; unused for rendering on both sides).',
    },
    { name: 'alt', type: 'string', desc: 'Alt text.' },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the <img>.',
    },
  ],
  guidance: {
    summary:
      'Renders an AI-generated image returned by the AI SDK as an <img>.',
    whenToUse: [
      'Display a model-generated image delivered as a base64 data URL.',
    ],
    whenNotToUse: [
      { text: 'A normal URL-sourced image', use: 'img' },
      { text: 'A rendered web page / iframe', use: 'web-preview' },
    ],
    rules: [
      'Pass the whole Experimental_GeneratedImage shape; the src is built from base64 + mediaType.',
      'uint8Array is accepted for type parity but is not used to build the src.',
      'Provide alt text for accessibility.',
    ],
    example: '<image base64="..." mediaType="image/png" alt="Generated art" />',
  },
  preview: {
    rx: 'ai-utilities-image--workbench',
    ng: 'ai-utilities-image--workbench',
  },
  tag: { rx: 'Image', ng: 'image' },
  example: {
    base64:
      'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAOklEQVR4nO3OMQEAAAjDMMC/56EBvlRA00naMwsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB47gJ5IgABm0tBHwAAAABJRU5ErkJggg==',
    mediaType: 'image/png',
    alt: 'Generated image',
  },
  figma: { nodeId: null },
});
