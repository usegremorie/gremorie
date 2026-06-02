import type { Meta, StoryObj } from '@storybook/react';
import {
  CheckCircle2,
  Info,
  Terminal,
  TriangleAlert,
  XCircle,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './alert';

/**
 * # Alert
 *
 * An in-flow feedback message anchored inside page content — distinct from a
 * toast (transient, floating) or a banner (page-spanning). Gremorie keeps the
 * API minimal: two visual variants, with intent conveyed primarily through a
 * leading `lucide-react` icon (`Info`, `CheckCircle2`, `TriangleAlert`,
 * `XCircle`) rather than a wider variant set.
 *
 * ## Anatomy
 *
 * - **Alert** — the bordered container; pass an icon as the first child to claim the leading column.
 * - **AlertTitle** — the headline.
 * - **AlertDescription** — the body text.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `variant` | `"default" \| "destructive"` | `"default"` | Visual intent. |
 * | `className` | `string` | — | Extra classes. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `AlertTitle` | Headline row. |
 * | `AlertDescription` | Body row. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--card` / `--card-foreground` | Surface + text |
 * | `--destructive` | `variant="destructive"` text + icon |
 * | `--muted-foreground` | Description text |
 * | `--border` | Container border |
 */
const meta = {
  title: 'Interaction/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'destructive'] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default informational alert with icon, title and description. */
export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg">
      <Terminal />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
};

/** The `destructive` variant for errors. */
export const Destructive: Story = {
  args: { variant: 'destructive' },
  render: (args) => (
    <Alert {...args} className="max-w-lg">
      <XCircle />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        Your card was declined. Update your billing details to continue.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Intent conveyed through the leading icon — info, success and warning all use
 * the `default` variant per the KDS guidance.
 */
export const Intents: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Alert>
        <Info />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          A new version is available to install.
        </AlertDescription>
      </Alert>
      <Alert>
        <CheckCircle2 />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your changes have been saved.</AlertDescription>
      </Alert>
      <Alert>
        <TriangleAlert />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Your storage is almost full.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <XCircle />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>The request could not be completed.</AlertDescription>
      </Alert>
    </div>
  ),
};

/** Title only — no description (the layout collapses to a single row). */
export const TitleOnly: Story = {
  render: () => (
    <Alert className="max-w-lg">
      <Info />
      <AlertTitle>Your session will expire in 5 minutes.</AlertTitle>
    </Alert>
  ),
};
