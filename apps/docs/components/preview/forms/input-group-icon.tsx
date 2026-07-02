'use client';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@gremorie/rx-forms';
import { CreditCard, Lock } from 'lucide-react';

export function InputGroupIconPreview() {
  return (
    <div className="max-w-md">
      <InputGroup>
        <InputGroupAddon>
          <CreditCard className="size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon align="inline-end">
          <Lock className="size-4" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
