'use client';

import { Button, ButtonGroup, ButtonGroupText } from '@gremorie/rx-forms';

export function ButtonGroupTextPreview() {
  return (
    <ButtonGroup>
      <ButtonGroupText>https://</ButtonGroupText>
      <Button variant="outline">gremorie.com</Button>
    </ButtonGroup>
  );
}
