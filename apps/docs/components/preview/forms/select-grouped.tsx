'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@gremorie/rx-forms';

export function SelectGroupedPreview() {
  return (
    <div className="max-w-xs">
      <Select>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Pick a timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern (EST)</SelectItem>
            <SelectItem value="cst">Central (CST)</SelectItem>
            <SelectItem value="pst">Pacific (PST)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="gmt">Greenwich (GMT)</SelectItem>
            <SelectItem value="cet">Central European (CET)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
