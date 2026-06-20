'use client';

import { Button, ButtonGroup } from '@gremorie/rx-forms';
import { Bold, Italic, Underline } from 'lucide-react';

export function ButtonGroupVerticalPreview() {
  return (
    <ButtonGroup orientation="vertical">
      <Button size="icon" variant="outline" aria-label="Bold">
        <Bold />
      </Button>
      <Button size="icon" variant="outline" aria-label="Italic">
        <Italic />
      </Button>
      <Button size="icon" variant="outline" aria-label="Underline">
        <Underline />
      </Button>
    </ButtonGroup>
  );
}
