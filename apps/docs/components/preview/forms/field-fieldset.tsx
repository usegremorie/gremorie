'use client';

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
} from '@gremorie/rx-forms';

export function FieldFieldsetPreview() {
  return (
    <div className="mx-auto w-full max-w-md">
      <FieldSet>
        <FieldLegend>Address information</FieldLegend>
        <FieldDescription>
          We need your address to deliver your order.
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="field-street">Street address</FieldLabel>
            <Input id="field-street" placeholder="123 Main St" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="field-city">City</FieldLabel>
              <Input id="field-city" placeholder="New York" />
            </Field>
            <Field>
              <FieldLabel htmlFor="field-zip">Postal code</FieldLabel>
              <Input id="field-zip" placeholder="90502" />
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
