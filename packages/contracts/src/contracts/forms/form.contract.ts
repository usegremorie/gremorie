import { defineContract } from '../../types';

/**
 * Form - the field-layout + accessibility-wiring primitives that tie a label,
 * control, description, and validation message together. React builds on
 * react-hook-form (Form/FormField + Controller); Angular layers over reactive
 * forms (no Form/FormField wrapper - use a native `<form [formGroup]>`).
 * React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const form = defineContract({
  name: 'form',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <form>
    └─ form-item (one field block; provides field context)
       ├─ form-label   (wired to the control id; data-error on invalid)
       ├─ form-control (the control; wires id / aria-describedby / aria-invalid)
       ├─ form-description (helper text)
       └─ form-message (validation error; hidden when empty)`,
  props: [
    {
      name: 'name',
      type: 'string',
      adapts: { rx: 'on <FormField>', ng: 'native formControlName' },
      desc: 'Field name (React: on FormField; Angular: native formControlName).',
    },
    {
      name: 'control',
      type: 'Control',
      adapts: { rx: 'on <FormField>', ng: 'native FormGroup' },
      desc: 'react-hook-form control (React only).',
    },
    {
      name: 'render',
      type: '({ field, fieldState, formState }) => ReactNode',
      adapts: { rx: 'on <FormField>', ng: 'n/a (template binding)' },
      desc: 'Field render-prop (React only).',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: false,
      adapts: {
        rx: 'derived from react-hook-form',
        ng: 'input: invalid on <gn-form-item>',
      },
      desc: 'Error state of the field (React derives it; Angular takes it as an input).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class (per sub-component)' },
      desc: 'Merged onto the relevant sub-component.',
    },
  ],
  guidance: {
    summary:
      'Field-block primitives that wire a label, control, description, and error message for accessibility.',
    whenToUse: [
      'Lay out and validate form fields with correct label/aria/error wiring.',
    ],
    whenNotToUse: [
      {
        text: 'A standalone control with no validation/description',
        use: 'input',
      },
      { text: 'Just an accessible caption', use: 'label' },
    ],
    rules: [
      'Wrap each field in form-item; it provides the id/aria context to label, control, description, and message.',
      'React: drive state with react-hook-form (Form + FormField). Angular: use a native <form [formGroup]> and pass [invalid] to gn-form-item.',
      'form-message hides itself when there is no error/content.',
    ],
    example:
      '<form-item><form-label>Email</form-label><input gnFormControl /><form-message /></form-item>',
  },
  preview: {
    rx: 'inputs-form--signup-form',
    ng: 'forms-form--workbench',
  },
  tag: { rx: 'FormItem', ng: 'gn-form-item' },
  example: {
    invalid: false,
  },
  figma: { nodeId: null },
});
