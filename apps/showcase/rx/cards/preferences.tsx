import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import {
  Button,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@gremorie/rx-forms';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

const CURRENCIES = [
  { value: 'usd', label: 'USD · United States Dollar' },
  { value: 'eur', label: 'EUR · Euro' },
  { value: 'gbp', label: 'GBP · British Pound' },
];

const DEFAULTS = { currency: 'usd', publicStats: true, emailReports: true };

/** Showcase card: account preferences for an artist on a royalty platform. */
export function Preferences() {
  const [currency, setCurrency] = useState(DEFAULTS.currency);
  const [publicStats, setPublicStats] = useState(DEFAULTS.publicStats);
  const [emailReports, setEmailReports] = useState(DEFAULTS.emailReports);
  const reset = () => {
    setCurrency(DEFAULTS.currency);
    setPublicStats(DEFAULTS.publicStats);
    setEmailReports(DEFAULTS.emailReports);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Manage your account settings and notifications.
        </CardDescription>
        <CardAction>
          <Button
            aria-label="Close"
            className="bg-muted"
            size="icon"
            variant="ghost"
          >
            <XIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-6">
          <Field>
            <FieldLabel htmlFor="default-currency">Default Currency</FieldLabel>
            <Select onValueChange={setCurrency} value={currency}>
              <SelectTrigger className="w-full" id="default-currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <FieldSeparator />
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="public-statistics">
                Public Statistics
              </FieldLabel>
              <FieldDescription>
                Allow others to see your total stream count and listening
                activity.
              </FieldDescription>
            </FieldContent>
            <Switch
              checked={publicStats}
              id="public-statistics"
              onCheckedChange={setPublicStats}
            />
          </Field>
          <FieldSeparator />
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="email-notifications">
                Email Notifications
              </FieldLabel>
              <FieldDescription>
                Monthly royalty reports and distribution updates.
              </FieldDescription>
            </FieldContent>
            <Switch
              checked={emailReports}
              id="email-notifications"
              onCheckedChange={setEmailReports}
            />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-between">
        <Button onClick={reset} variant="outline">
          Reset
        </Button>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
}
