'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gremorie/rx-forms';

export function SelectDisabledPreview() {
  return (
    <div className="flex max-w-xs flex-col gap-3">
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Disabled select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="message">Message</SelectItem>
          <SelectItem value="conversation">Conversation</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Some options disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="message">Message</SelectItem>
          <SelectItem value="conversation" disabled>
            Conversation (coming soon)
          </SelectItem>
          <SelectItem value="plan">Plan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
