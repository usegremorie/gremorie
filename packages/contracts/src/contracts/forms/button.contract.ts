import { defineContract } from '../../types';

/**
 * Button - a clickable button or a link styled as one. React lives in
 * `@gremorie/rx-forms`. The Angular source lives in `@gremorie/ng-core`
 * (ng-forms depends on ng-core's `cn`/`buttonVariants`, so hosting the source
 * in ng-forms would be circular) and is re-exported from `@gremorie/ng-forms`,
 * which mirrors the React package surface and hosts the Storybook stories.
 */
export const button = defineContract({
  name: 'button',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <button>            (or the projected child when asChild)
    ├─ icon (optional)
    └─ label`,
  props: [
    {
      name: 'variant',
      type: 'ButtonVariant',
      default: 'default',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
      desc: 'Visual style of the button.',
    },
    {
      name: 'size',
      type: 'ButtonSize',
      default: 'default',
      options: ['default', 'sm', 'lg', 'icon'],
      desc: 'Size preset; use "icon" for icon-only buttons.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Disable the button.',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: false,
      adapts: { ng: 'render an <a>/host element via content projection' },
      desc: 'Render as the child element (Radix Slot) instead of a <button>.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Extra classes merged onto the button.',
    },
  ],
  guidance: {
    summary:
      'A clickable button (or a link styled as one) with variants and sizes.',
    whenToUse: [
      'Trigger an action or submit a form.',
      'Use the link variant for navigation that should look like a button.',
    ],
    whenNotToUse: [
      { text: 'Plain in-text navigation between pages', use: 'breadcrumb' },
    ],
    rules: [
      'For icon-only buttons use size="icon" and always set an aria-label.',
      'The link variant drops padding and background.',
    ],
    example:
      '<button variant="outline" size="icon" aria-label="Submit"><ArrowUpIcon /></button>',
  },
  preview: {
    rx: 'inputs-buttons-button--workbench',
    ng: 'inputs-buttons-button--workbench',
  },
  tag: { rx: 'Button', ng: 'ai-button' },
  example: {
    variant: 'default',
    size: 'default',
    disabled: false,
  },
  figma: { nodeId: null },
});
