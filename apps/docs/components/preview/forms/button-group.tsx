'use client';

import { Button, ButtonGroup, ButtonGroupSeparator } from '@gremorie/rx-forms';

export function ButtonGroupPreview() {
  return (
    <ButtonGroup>
      <Button variant="outline">Copy</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Paste</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Cut</Button>
    </ButtonGroup>
  );
}
