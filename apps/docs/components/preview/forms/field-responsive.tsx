'use client';

import {
  Button,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  Input,
  Textarea,
} from '@gremorie/rx-forms';

export function FieldResponsivePreview() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <form>
        <FieldGroup>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="field-r-name">Name</FieldLabel>
              <FieldDescription>
                Your full name, for identification.
              </FieldDescription>
            </FieldContent>
            <Input id="field-r-name" placeholder="Ada Lovelace" required />
          </Field>
          <FieldSeparator />
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="field-r-message">Message</FieldLabel>
              <FieldDescription>
                Keep it short, preferably under 100 characters.
              </FieldDescription>
            </FieldContent>
            <Textarea
              id="field-r-message"
              placeholder="Hello, world!"
              className="min-h-[100px] resize-none sm:min-w-[300px]"
            />
          </Field>
          <FieldSeparator />
          <Field orientation="responsive">
            <Button type="submit">Submit</Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
