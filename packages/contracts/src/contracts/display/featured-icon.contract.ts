import { defineContract } from '../../types';

/**
 * FeaturedIcon - an icon inside a styled, themed container; the small "badge"
 * that anchors a card / artifact / empty-state header.
 * React: `@gremorie/rx-display` (CVA-styled span, lucide `icon` prop).
 * Angular: `@gremorie/ng-display` (CVA-styled host element, projected glyph).
 */
export const featuredIcon = defineContract({
  name: 'featured-icon',
  category: 'display',
  status: 'stable',
  anatomy: `
    <featured-icon>          (sized, rounded container; sizes the glyph)
    └─ [svg glyph]           (React: lucide icon prop or children; Angular: projected svg)`,
  props: [
    {
      name: 'icon',
      type: 'LucideIcon',
      adapts: { ng: 'not exposed (project an svg glyph as content)' },
      desc: 'Glyph to render (alternatively pass children).',
    },
    {
      name: 'color',
      type: "'primary' | 'gray' | 'success' | 'error'",
      default: 'primary',
      options: ['primary', 'gray', 'success', 'error'],
      desc: 'Semantic color.',
    },
    {
      name: 'theme',
      type: "'light' | 'solid' | 'outline'",
      default: 'light',
      options: ['light', 'solid', 'outline'],
      desc: 'Fill style.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg' | 'xl'",
      default: 'md',
      options: ['sm', 'md', 'lg', 'xl'],
      desc: '32 / 40 / 48 / 56 px container.',
    },
    {
      name: 'shape',
      type: "'square' | 'circle'",
      default: 'square',
      options: ['square', 'circle'],
      desc: 'Container shape (square radius scales with size).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the container.',
    },
  ],
  guidance: {
    summary:
      'An icon inside a styled, themed container - the anchor glyph of a card, artifact or empty-state header.',
    whenToUse: [
      'Anchor a card / artifact / empty-state header with a semantic glyph.',
      'Convey intent (success, error) through the color variant.',
    ],
    whenNotToUse: [
      { text: 'A compact text label for status or counts', use: 'badge' },
      { text: 'A user / entity portrait', use: 'avatar' },
    ],
    rules: [
      'Token-driven: theme + dark mode flow through automatically; never hardcode fills.',
      'The container sizes the glyph - do not size the svg yourself.',
      'React takes a lucide icon prop; Angular projects the svg as content (lucide-angular is not a dependency).',
    ],
    example:
      '<featured-icon color="success" theme="solid" size="lg" shape="circle" />',
  },
  preview: {
    rx: 'layout-display-display-featuredicon--workbench',
    ng: 'layout-display-display-featuredicon--workbench',
  },
  tag: { rx: 'FeaturedIcon', ng: 'gn-featured-icon' },
  example: { color: 'primary', theme: 'light', size: 'md', shape: 'square' },
  figma: { nodeId: null },
});
