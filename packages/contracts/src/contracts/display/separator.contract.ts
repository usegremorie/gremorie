import { defineContract } from '../../types';

/**
 * Separator - a visual divider between groups of content.
 * React: `@gremorie/rx-display` (wraps `@radix-ui/react-separator`).
 * Angular: `@gremorie/ng-display` (wraps spartan brain `BrnSeparator`).
 */
export const separator = defineContract({
  name: 'separator',
  category: 'display',
  status: 'stable',
  anatomy: `
    <separator> (a single token-driven rule: bg-border, 1px on the cross axis)`,
  props: [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: 'horizontal',
      options: ['horizontal', 'vertical'],
      desc: 'Direction of the divider.',
    },
    {
      name: 'decorative',
      type: 'boolean',
      default: true,
      desc: 'true = presentational (role="none"); false = semantic (role="separator" + aria-orientation, announced by AT).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the rule.',
    },
  ],
  guidance: {
    summary: 'A thin token-driven rule dividing groups of content.',
    whenToUse: [
      'Separate sections, menu groups, or inline items (e.g. metadata rows).',
    ],
    whenNotToUse: [
      {
        text: 'Spacing alone is enough to group content (no visible rule needed)',
      },
    ],
    rules: [
      'Default decorative=true is correct in the vast majority of cases.',
      'Set decorative=false only when the divider carries semantic meaning you want screen readers to announce.',
      'orientation="vertical" needs a parent with a defined height (the rule is h-full).',
    ],
    example: '<separator /> ... <separator orientation="vertical" />',
  },
  preview: {
    rx: 'layout-display-display-separator--default',
    ng: 'display-separator--workbench',
  },
  figma: { nodeId: null },
});
