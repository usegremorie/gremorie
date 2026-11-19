import { defineContract } from '../../types';

/**
 * Field - the form-layout family: it composes a label, a control, helper text
 * and a validation message into one accessible unit, and groups units into
 * sets. Also the choice card (a `Field` inside a `FieldLabel` around a radio or
 * checkbox). React: `Field*` parts in `@gremorie/rx-forms`. Angular:
 * `gr-field*` selectors in `@gremorie/ng-forms`.
 */
export const field = defineContract({
  name: 'field',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <field-set>
    ├─ field-legend (variant: legend | label)
    ├─ field-description
    └─ field-group (container-query root for orientation="responsive")
       ├─ field (orientation: vertical | horizontal | responsive; role=group)
       │  ├─ field-label (native label; wraps a whole field = choice card)
       │  ├─ control (input, select, textarea, checkbox, radio, switch ...)
       │  ├─ field-content (label + description column beside a control)
       │  │  ├─ field-title (label-looking text, not a label)
       │  │  └─ field-description
       │  └─ field-error (role=alert; hidden when empty)
       └─ field-separator (rule, optional centered text)`,
  props: [
    {
      name: 'orientation',
      type: 'string',
      options: ['vertical', 'horizontal', 'responsive'],
      default: 'vertical',
      desc: 'Layout of the label, control and text. "responsive" is vertical until its field-group is md wide.',
    },
    {
      name: 'htmlFor',
      type: 'string',
      adapts: { ng: 'input: for (on gr-field-label)' },
      desc: 'On field-label: id of the control it captions.',
    },
    {
      name: 'variant',
      type: 'string',
      options: ['legend', 'label'],
      default: 'legend',
      adapts: {
        rx: 'on <FieldLegend>',
        ng: 'input: variant (on gr-field-legend)',
      },
      desc: 'On field-legend: heading size (legend) or caption size (label).',
    },
    {
      name: 'errors',
      type: 'Array<{ message?: string } | undefined>',
      adapts: {
        rx: 'on <FieldError>',
        ng: 'input: errors (on gr-field-error)',
      },
      desc: 'On field-error: messages to show (one as text, several as a list). Children win over errors.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class (per part)' },
      desc: 'Merged onto the part.',
    },
  ],
  guidance: {
    summary:
      'Label, control, helper text and error laid out as one accessible field, plus sets, groups and choice cards.',
    whenToUse: [
      'Lay out any form field: a label, a control, a description and an error.',
      'Group related fields in a field-set with a legend (a radio or checkbox group, an address).',
      'Build a choice card: a whole field wrapped in a field-label, so the card selects the radio or checkbox inside it.',
    ],
    whenNotToUse: [
      {
        text: 'React Hook Form wiring (id, aria-describedby and aria-invalid from form state)',
        use: 'form',
      },
      { text: 'Just an accessible caption', use: 'label' },
      { text: 'A standalone control', use: 'input' },
    ],
    rules: [
      'Mark an invalid field with data-invalid="true" on the field and aria-invalid on the control; a disabled one with data-disabled="true" on the field and disabled on the control.',
      'A choice card is field-label > field (horizontal) > field-content + radio/checkbox; the selected card takes the --primary border and the --accent fill.',
      'Put a field-group around fields; its container query drives orientation="responsive".',
      'field-title is for text that looks like a label but is not one (inside a choice card, where the label is the whole card).',
    ],
    example:
      '<field><field-label htmlFor="email">Email</field-label><input id="email" /><field-description>We never share it.</field-description></field>',
  },
  preview: {
    rx: 'inputs-field--workbench',
    ng: 'inputs-field--workbench',
  },
  tag: { rx: 'Field', ng: 'gr-field' },
  example: {
    orientation: 'vertical',
  },
  figma: { nodeId: null },
});
