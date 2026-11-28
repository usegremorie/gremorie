'use client';

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Textarea,
} from '@gremorie/rx-forms';

export function FieldPreview() {
  return (
    <div className="mx-auto w-full max-w-md">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="field-name">Full name</FieldLabel>
          <Input id="field-name" placeholder="Ada Lovelace" />
          <FieldDescription>
            This appears on invoices and emails.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="field-bio">Bio</FieldLabel>
          <Textarea
            id="field-bio"
            placeholder="A line about you"
            className="resize-none"
          />
        </Field>
      </FieldGroup>
    </div>
  );
}
