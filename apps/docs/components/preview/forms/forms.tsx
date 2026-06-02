'use client';

import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  Calendar,
  Checkbox,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from '@gremorie/rx-forms';
import { Bold, Italic, Mail, Search, Underline } from 'lucide-react';
import { useState } from 'react';

// ---------- Button ----------

export function ButtonPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}

// ---------- ButtonGroup ----------

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

// ---------- Input ----------

export function InputPreview() {
  return (
    <div className="flex max-w-xs flex-col gap-2">
      <Label htmlFor="email-input">Email</Label>
      <Input id="email-input" type="email" placeholder="you@example.com" />
    </div>
  );
}

// ---------- InputGroup ----------

export function InputGroupPreview() {
  return (
    <div className="max-w-md">
      <InputGroup>
        <InputGroupAddon>
          <Search className="size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search the registry..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="sm">Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

// ---------- InputOTP ----------

export function InputOTPPreview() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

// ---------- Label ----------

export function LabelPreview() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="lbl-demo">Display name</Label>
      <Input id="lbl-demo" placeholder="Type something..." />
    </div>
  );
}

// ---------- Select ----------

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

// ---------- Checkbox ----------

export function CheckboxPreview() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="cb-demo" defaultChecked />
      <Label htmlFor="cb-demo">Subscribe to the changelog</Label>
    </div>
  );
}

// ---------- RadioGroup ----------

export function RadioGroupPreview() {
  return (
    <RadioGroup defaultValue="react" className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="rg-react" value="react" />
        <Label htmlFor="rg-react">React</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="rg-ng" value="angular" />
        <Label htmlFor="rg-ng">Angular</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="rg-both" value="both" />
        <Label htmlFor="rg-both">Both</Label>
      </div>
    </RadioGroup>
  );
}

// ---------- Switch ----------

export function SwitchPreview() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="sw-demo" defaultChecked />
      <Label htmlFor="sw-demo">Stream tokens</Label>
    </div>
  );
}

// ---------- Slider ----------

export function SliderPreview() {
  return (
    <div className="max-w-sm">
      <Slider defaultValue={[40]} max={100} step={1} />
    </div>
  );
}

// ---------- Textarea ----------

export function TextareaPreview() {
  return (
    <div className="max-w-md">
      <Textarea placeholder="Write a description..." rows={4} />
    </div>
  );
}

// ---------- Toggle ----------

export function TogglePreview() {
  return (
    <div className="flex gap-2">
      <Toggle aria-label="Bold">
        <Bold className="size-4" />
      </Toggle>
      <Toggle aria-label="Italic" defaultPressed>
        <Italic className="size-4" />
      </Toggle>
      <Toggle aria-label="Underline">
        <Underline className="size-4" />
      </Toggle>
    </div>
  );
}

// ---------- ToggleGroup ----------

export function ToggleGroupPreview() {
  return (
    <ToggleGroup type="single" defaultValue="bold">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

// ---------- Calendar ----------

export function CalendarPreview() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return <Calendar mode="single" selected={date} onSelect={setDate} />;
}

// ---------- Form (basic example) ----------

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
