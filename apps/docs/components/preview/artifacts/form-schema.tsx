'use client';

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import { Button, Checkbox, Input, Label } from '@gremorie/rx-forms';
import { useState } from 'react';

const SCHEMA = `{
  fields: [
    { type: "text", name: "company", label: "Company name", required: true },
    { type: "email", name: "email", label: "Work email", required: true },
    { type: "checkbox", name: "newsletter", label: "Subscribe to monthly updates" },
  ],
}`;

export function FormSchema() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Generated form</CardTitle>
            <CardDescription>
              Built from a 3-field schema returned by the LLM.
            </CardDescription>
          </div>
          <Badge variant="outline">Field schema</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 2000);
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="fs-company">Company name</Label>
            <Input id="fs-company" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="fs-email">Work email</Label>
            <Input id="fs-email" type="email" required />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="fs-newsletter" />
            <Label htmlFor="fs-newsletter" className="text-sm font-normal">
              Subscribe to monthly updates
            </Label>
          </div>
          <Button type="submit" className="w-full">
            {submitted ? 'Sent!' : 'Submit'}
          </Button>
          <pre className="mt-2 overflow-x-auto rounded bg-muted/40 p-3 text-xs font-mono text-muted-foreground">
            {SCHEMA}
          </pre>
        </form>
      </CardContent>
    </Card>
  );
}
