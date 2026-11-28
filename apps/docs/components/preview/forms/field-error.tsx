'use client';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from '@gremorie/rx-forms';

export function FieldErrorPreview() {
  return (
    <div className="mx-auto w-full max-w-md">
      <FieldGroup>
        <Field data-invalid="true">
          <FieldLabel htmlFor="field-username">Username</FieldLabel>
          <Input id="field-username" defaultValue="ada" aria-invalid />
          <FieldError>Choose another username.</FieldError>
        </Field>
        <Field data-invalid="true">
          <FieldLabel htmlFor="field-password">Password</FieldLabel>
          <Input id="field-password" type="password" aria-invalid />
          <FieldError
            errors={[
              { message: 'At least 8 characters.' },
              { message: 'One number.' },
            ]}
          />
        </Field>
        <Field data-disabled="true">
          <FieldLabel htmlFor="field-company">Company</FieldLabel>
          <Input id="field-company" disabled defaultValue="Gremorie" />
          <FieldDescription>Managed by your admin.</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  );
}
