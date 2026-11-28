'use client';

import {
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@gremorie/rx-forms';

export function CheckboxWithLabelPreview() {
  return (
    <Field orientation="horizontal">
      <Checkbox id="cb-terms" defaultChecked />
      <FieldContent>
        <FieldLabel htmlFor="cb-terms">Accept terms and conditions</FieldLabel>
        <FieldDescription>
          You agree to our Terms of Service and Privacy Policy.
        </FieldDescription>
      </FieldContent>
    </Field>
  );
}
