'use client';

import {
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@gremorie/rx-forms';

export function FieldChoiceCardCheckboxPreview() {
  return (
    <div className="mx-auto w-full max-w-md">
      <FieldSet>
        <FieldLegend variant="label">Notifications</FieldLegend>
        <FieldDescription>
          Pick every channel you want to hear from.
        </FieldDescription>
        <FieldGroup className="gap-3">
          <FieldLabel htmlFor="field-cc-email">
            <Field orientation="horizontal">
              <Checkbox id="field-cc-email" defaultChecked />
              <FieldContent>
                <FieldTitle>Email</FieldTitle>
                <FieldDescription>
                  A daily digest of what changed.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
          <FieldLabel htmlFor="field-cc-push">
            <Field orientation="horizontal">
              <Checkbox id="field-cc-push" />
              <FieldContent>
                <FieldTitle>Push</FieldTitle>
                <FieldDescription>
                  Instant alerts on your phone.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
