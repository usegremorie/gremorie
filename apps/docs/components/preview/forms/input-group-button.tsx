'use client';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@gremorie/rx-forms';

export function InputGroupButtonPreview() {
  return (
    <div className="max-w-md">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="your-site.com" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="sm" variant="default">
            Copy
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
