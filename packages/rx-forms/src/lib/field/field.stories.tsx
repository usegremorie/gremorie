import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button/button';
import { Checkbox } from '../checkbox/checkbox';
import { Input } from '../input/input';
import { RadioGroup, RadioGroupItem } from '../radio-group/radio-group';
import { Switch } from '../switch/switch';
import { Textarea } from '../textarea/textarea';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from './field';

/**
 * # Field
 *
 * The form-layout family, a faithful port of shadcn/ui `Field`: a label, a
 * control, helper text and an error composed into one accessible unit, grouped
 * into sets, plus the **choice card** (a whole `Field` inside a `FieldLabel`).
 *
 * ## Anatomy
 *
 * ```text
 * FieldSet                      fieldset, flex column
 * ├─ FieldLegend                legend (variant legend | label)
 * ├─ FieldDescription           muted helper text
 * └─ FieldGroup                 stacks fields; container-query root
 *    ├─ Field                   role=group, orientation vertical | horizontal | responsive
 *    │  ├─ FieldLabel           label; around a whole Field it is a choice card
 *    │  ├─ control              Input, Select, Textarea, Checkbox, RadioGroupItem, Switch
 *    │  ├─ FieldContent         label + description column beside a control
 *    │  │  ├─ FieldTitle        label-looking text that is not a label
 *    │  │  └─ FieldDescription
 *    │  └─ FieldError           role=alert, hidden when empty
 *    └─ FieldSeparator          rule with optional centered text
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `orientation` (Field) | `"vertical" \| "horizontal" \| "responsive"` | `"vertical"` | Layout of label, control and text. |
 * | `htmlFor` (FieldLabel) | `string` | — | Id of the control the label captions. |
 * | `variant` (FieldLegend) | `"legend" \| "label"` | `"legend"` | Heading or caption size. |
 * | `errors` (FieldError) | `Array<{ message?: string }>` | — | Messages; children win over `errors`. |
 * | ...`div` | `React.ComponentProps<"div">` | — | Native props on every part. |
 *
 * State lives in attributes, as in shadcn: `data-invalid="true"` on `Field`
 * (and `aria-invalid` on the control), `data-disabled="true"` on `Field` (and
 * `disabled` on the control).
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--primary` | selected choice-card border |
 * | `--accent` | selected choice-card fill |
 * | `--destructive` | invalid text and `FieldError` |
 * | `--muted-foreground` | `FieldDescription`, separator text |
 * | `--border` | choice-card border, separator rule |
 */
const meta = {
  title: 'Inputs/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal', 'responsive'],
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Workbench preset: renders the IDENTICAL use case as the Angular `Workbench`
 * story in `ng-forms`. Keep both datasets in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="w-full max-w-md">
      <FieldGroup>
        <Field {...args}>
          <FieldLabel htmlFor="wb-name">Full name</FieldLabel>
          <Input id="wb-name" placeholder="Ada Lovelace" />
          <FieldDescription>
            This appears on invoices and emails.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  ),
};

/** A single control with a label and helper text. */
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" placeholder="ada@example.com" />
        <FieldDescription>We never share it.</FieldDescription>
      </Field>
    </div>
  ),
};

/** Invalid: `data-invalid` on the field, `aria-invalid` on the control. */
export const WithError: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Field data-invalid="true">
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" defaultValue="ada" aria-invalid />
        <FieldError>Choose another username.</FieldError>
      </Field>
    </div>
  ),
};

/** `errors` with several messages renders a list. */
export const WithErrorList: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Field data-invalid="true">
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input id="password" type="password" aria-invalid />
        <FieldError
          errors={[
            { message: 'At least 8 characters.' },
            { message: 'One number.' },
            { message: 'One number.' },
          ]}
        />
      </Field>
    </div>
  ),
};

/** Disabled: `data-disabled` on the field dims the label, `disabled` on the control. */
export const Disabled: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Field data-disabled="true">
        <FieldLabel htmlFor="disabled">Company</FieldLabel>
        <Input id="disabled" disabled defaultValue="Gremorie" />
        <FieldDescription>Managed by your admin.</FieldDescription>
      </Field>
    </div>
  ),
};

/** `FieldSet` + `FieldLegend` + `FieldGroup`: related fields under one title. */
export const Fieldset: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldLegend>Address information</FieldLegend>
        <FieldDescription>
          We need your address to deliver your order.
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="street">Street address</FieldLabel>
            <Input id="street" placeholder="123 Main St" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="city">City</FieldLabel>
              <Input id="city" placeholder="New York" />
            </Field>
            <Field>
              <FieldLabel htmlFor="zip">Postal code</FieldLabel>
              <Input id="zip" placeholder="90502" />
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
};

/** `orientation="horizontal"`: the control sits beside its label. */
export const Horizontal: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <FieldGroup>
        <Field orientation="horizontal">
          <Switch id="newsletter" />
          <FieldLabel htmlFor="newsletter">
            Subscribe to the newsletter
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="sync" defaultChecked />
          <FieldContent>
            <FieldLabel htmlFor="sync">
              Sync Desktop and Documents folders
            </FieldLabel>
            <FieldDescription>
              They are synced with the cloud. You can open them from other
              devices.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

/** `orientation="responsive"`: vertical until its `FieldGroup` is `md` wide. */
export const Responsive: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <form>
        <FieldSet>
          <FieldLegend>Profile</FieldLegend>
          <FieldDescription>Fill in your profile information.</FieldDescription>
          <FieldSeparator />
          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="r-name">Name</FieldLabel>
                <FieldDescription>
                  Your full name, for identification.
                </FieldDescription>
              </FieldContent>
              <Input id="r-name" placeholder="Ada Lovelace" required />
            </Field>
            <FieldSeparator />
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="r-message">Message</FieldLabel>
                <FieldDescription>
                  Keep it short, preferably under 100 characters.
                </FieldDescription>
              </FieldContent>
              <Textarea
                id="r-message"
                placeholder="Hello, world!"
                className="min-h-[100px] resize-none sm:min-w-[300px]"
              />
            </Field>
            <FieldSeparator />
            <Field orientation="responsive">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  ),
};

/** A radio group in a fieldset, each option a horizontal field. */
export const RadioFieldset: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldLegend variant="label">Subscription plan</FieldLegend>
        <FieldDescription>
          Yearly and lifetime plans offer significant savings.
        </FieldDescription>
        <RadioGroup defaultValue="monthly">
          <Field orientation="horizontal">
            <RadioGroupItem value="monthly" id="plan-monthly" />
            <FieldLabel htmlFor="plan-monthly" className="font-normal">
              Monthly ($9.99/month)
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="yearly" id="plan-yearly" />
            <FieldLabel htmlFor="plan-yearly" className="font-normal">
              Yearly ($99.99/year)
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="lifetime" id="plan-lifetime" />
            <FieldLabel htmlFor="plan-lifetime" className="font-normal">
              Lifetime ($299.99)
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
    </div>
  ),
};

/**
 * Choice card with a `RadioGroup`: the `FieldLabel` wraps a whole `Field`, so
 * the card is the click target. The selected card takes the `--primary` border
 * and the `--accent` fill.
 */
export const ChoiceCardRadioGroup: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <FieldGroup>
        <FieldSet>
          <FieldLabel htmlFor="compute-environment">
            Compute environment
          </FieldLabel>
          <FieldDescription>
            Select the compute environment for your cluster.
          </FieldDescription>
          <RadioGroup defaultValue="kubernetes" id="compute-environment">
            <FieldLabel htmlFor="kubernetes">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Kubernetes</FieldTitle>
                  <FieldDescription>
                    Run GPU workloads on a K8s configured cluster.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="kubernetes" id="kubernetes" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="vm">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Virtual machine</FieldTitle>
                  <FieldDescription>
                    Access a VM configured cluster to run GPU workloads.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="vm" id="vm" />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  ),
};

/** Choice card with `Checkbox`: several cards can be selected at once. */
export const ChoiceCardCheckbox: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldLegend variant="label">Notifications</FieldLegend>
        <FieldDescription>
          Pick every channel you want to hear from.
        </FieldDescription>
        <FieldGroup className="gap-3">
          <FieldLabel htmlFor="cc-email">
            <Field orientation="horizontal">
              <Checkbox id="cc-email" defaultChecked />
              <FieldContent>
                <FieldTitle>Email</FieldTitle>
                <FieldDescription>
                  A daily digest of what changed.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
          <FieldLabel htmlFor="cc-push">
            <Field orientation="horizontal">
              <Checkbox id="cc-push" />
              <FieldContent>
                <FieldTitle>Push</FieldTitle>
                <FieldDescription>
                  Instant alerts on your phone.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
};

/** `FieldSeparator` with and without centered text. */
export const Separator: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="sep-email">Email</FieldLabel>
          <Input id="sep-email" type="email" />
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field orientation="horizontal">
          <Button type="button" variant="outline">
            Google
          </Button>
          <Button type="button" variant="outline">
            GitHub
          </Button>
        </Field>
        <FieldSeparator />
        <Field>
          <Button type="submit">Create account</Button>
        </Field>
      </FieldGroup>
    </div>
  ),
};
