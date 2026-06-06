'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gremorie/rx-forms';

export function SelectPreview() {
  return (
    <div className="max-w-xs">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick a primitive" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="message">Message</SelectItem>
          <SelectItem value="conversation">Conversation</SelectItem>
          <SelectItem value="plan">Plan</SelectItem>
          <SelectItem value="reasoning">Reasoning</SelectItem>
          <SelectItem value="tool">Tool</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
