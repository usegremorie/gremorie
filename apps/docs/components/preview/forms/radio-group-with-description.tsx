'use client';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  RadioGroup,
  RadioGroupItem,
} from '@gremorie/rx-forms';

export function RadioGroupWithDescriptionPreview() {
  return (
    <RadioGroup defaultValue="comfortable">
      <Field orientation="horizontal">
        <RadioGroupItem value="default" id="rg-default" />
        <FieldContent>
          <FieldLabel htmlFor="rg-default">Default</FieldLabel>
          <FieldDescription>
            Balanced spacing for most layouts.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="comfortable" id="rg-comfortable" />
        <FieldContent>
          <FieldLabel htmlFor="rg-comfortable">Comfortable</FieldLabel>
          <FieldDescription>
            Roomier rows for dense data tables.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="compact" id="rg-compact" />
        <FieldContent>
          <FieldLabel htmlFor="rg-compact">Compact</FieldLabel>
          <FieldDescription>
            Tighter rows to fit more on screen.
          </FieldDescription>
        </FieldContent>
      </Field>
    </RadioGroup>
  );
}
