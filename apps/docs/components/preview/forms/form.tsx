'use client';

import {
  Button,
  Checkbox,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
  Textarea,
} from '@gremorie/rx-forms';
import { Mail } from 'lucide-react';

export function FormPreview() {
  return (
    <form className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="form-email">Email</Label>
        <InputGroup>
          <InputGroupAddon>
            <Mail className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            id="form-email"
            type="email"
            placeholder="you@example.com"
          />
        </InputGroup>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="form-msg">Message</Label>
        <Textarea id="form-msg" placeholder="Tell us more..." rows={4} />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="form-tos" />
        <Label htmlFor="form-tos">I accept the terms</Label>
      </div>
      <Button type="submit">Send</Button>
    </form>
  );
}
