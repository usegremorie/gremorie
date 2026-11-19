'use client';

import {
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Switch,
} from '@gremorie/rx-forms';

export function FieldHorizontalPreview() {
  return (
    <div className="mx-auto w-full max-w-md">
      <FieldGroup>
        <Field orientation="horizontal">
          <Switch id="field-newsletter" />
          <FieldLabel htmlFor="field-newsletter">
            Subscribe to the newsletter
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="field-sync" defaultChecked />
          <FieldContent>
            <FieldLabel htmlFor="field-sync">
              Sync Desktop and Documents folders
            </FieldLabel>
            <FieldDescription>
              They are synced with the cloud. You can open them from other
              devices.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  );
}
