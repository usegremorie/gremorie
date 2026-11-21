import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import {
  Button,
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@gremorie/rx-forms';
import { useState } from 'react';

const TOPICS = [
  {
    id: 'transactions',
    title: 'Transaction alerts',
    description: 'Deposits, withdrawals, and transfers.',
  },
  {
    id: 'security',
    title: 'Security alerts',
    description: 'Login attempts and account changes.',
  },
  {
    id: 'milestones',
    title: 'Goal milestones',
    description: 'Updates at 25%, 50%, 75%, and 100%.',
  },
  {
    id: 'market',
    title: 'Market updates',
    description: 'Daily portfolio summary and price alerts.',
  },
];

/**
 * Showcase card: personal-finance notification preferences. "Select all"
 * reflects the list: checked, unchecked or indeterminate.
 */
export function Notifications() {
  const [selected, setSelected] = useState<string[]>([
    'transactions',
    'security',
  ]);
  const all =
    selected.length === TOPICS.length
      ? true
      : selected.length > 0
        ? 'indeterminate'
        : false;

  const toggle = (id: string, on: boolean) =>
    setSelected((s) => (on ? [...s, id] : s.filter((x) => x !== id)));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose what you want to be notified about.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-5">
          <Field orientation="horizontal">
            <Checkbox
              checked={all}
              id="notify-all"
              onCheckedChange={(on) =>
                setSelected(on === true ? TOPICS.map((t) => t.id) : [])
              }
            />
            <FieldLabel htmlFor="notify-all">Select all</FieldLabel>
          </Field>
          {TOPICS.map((t) => (
            <Field key={t.id} orientation="horizontal">
              <Checkbox
                checked={selected.includes(t.id)}
                id={`notify-${t.id}`}
                onCheckedChange={(on) => toggle(t.id, on === true)}
              />
              <FieldContent>
                <FieldLabel htmlFor={`notify-${t.id}`}>{t.title}</FieldLabel>
                <FieldDescription>{t.description}</FieldDescription>
              </FieldContent>
            </Field>
          ))}
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save Preferences</Button>
      </CardFooter>
    </Card>
  );
}
