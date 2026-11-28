import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Button } from '@gremorie/ng-core';
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
 * Field - the form-layout family. Angular parity port of React `Field` from
 * `@gremorie/rx-forms`: a label, a control,
 * helper text and an error composed into one accessible unit, grouped into
 * sets, plus the **choice card** (a whole `gr-field` inside a
 * `gr-field-label`).
 *
 * Compound API, one selector per React part: `gr-field`, `gr-field-label`,
 * `gr-field-title`, `gr-field-description`, `gr-field-error`,
 * `gr-field-content`, `gr-field-group`, `gr-field-set`, `gr-field-legend`,
 * `gr-field-separator`.
 *
 * State lives in attributes, as in React: `data-invalid="true"` on `gr-field`
 * (and `[ariaInvalid]` on the control), `data-disabled="true"` on `gr-field`
 * (and `[disabled]` on the control). The selected choice card takes the
 * `--primary` border and the `--accent` fill.
 */
const meta: Meta<Field> = {
  title: 'Inputs/Field',
  component: Field,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        Button,
        Checkbox,
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
        Input,
        RadioGroup,
        RadioGroupItem,
        Switch,
        Textarea,
      ],
    }),
  ],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal', 'responsive'],
    },
  },
};

export default meta;
type Story = StoryObj<Field>;

/**
 * Workbench preset: renders the IDENTICAL use case as the React `Workbench`
 * story in `rx-forms`. Keep both datasets in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: { orientation: 'vertical' },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-full max-w-md">
        <gr-field-group>
          <gr-field [orientation]="orientation">
            <gr-field-label for="wb-name">Full name</gr-field-label>
            <gr-input id="wb-name" placeholder="Ada Lovelace" />
            <gr-field-description>This appears on invoices and emails.</gr-field-description>
          </gr-field>
        </gr-field-group>
      </div>
    `,
  }),
};

/** A single control with a label and helper text. */
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="w-full max-w-md">
        <gr-field>
          <gr-field-label for="email">Email</gr-field-label>
          <gr-input id="email" type="email" placeholder="ada@example.com" />
          <gr-field-description>We never share it.</gr-field-description>
        </gr-field>
      </div>
    `,
  }),
};

/** Invalid: `data-invalid` on the field, `ariaInvalid` on the control. */
export const WithError: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="w-full max-w-md">
        <gr-field data-invalid="true">
          <gr-field-label for="username">Username</gr-field-label>
          <gr-input id="username" value="ada" [ariaInvalid]="true" />
          <gr-field-error>Choose another username.</gr-field-error>
        </gr-field>
      </div>
    `,
  }),
};

/** `errors` with several messages renders a list. */
export const WithErrorList: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      errors: [
        { message: 'At least 8 characters.' },
        { message: 'One number.' },
        { message: 'One number.' },
      ],
    },
    template: `
      <div class="w-full max-w-md">
        <gr-field data-invalid="true">
          <gr-field-label for="password">Password</gr-field-label>
          <gr-input id="password" type="password" [ariaInvalid]="true" />
          <gr-field-error [errors]="errors" />
        </gr-field>
      </div>
    `,
  }),
};

/** Disabled: `data-disabled` on the field dims the label, `disabled` on the control. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="w-full max-w-md">
        <gr-field data-disabled="true">
          <gr-field-label for="disabled">Company</gr-field-label>
          <gr-input id="disabled" [disabled]="true" value="Gremorie" />
          <gr-field-description>Managed by your admin.</gr-field-description>
        </gr-field>
      </div>
    `,
  }),
};

/** `gr-field-set` + `gr-field-legend` + `gr-field-group`: related fields under one title. */
export const Fieldset: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="w-full max-w-md">
        <gr-field-set>
          <gr-field-legend>Address information</gr-field-legend>
          <gr-field-description>We need your address to deliver your order.</gr-field-description>
          <gr-field-group>
            <gr-field>
              <gr-field-label for="street">Street address</gr-field-label>
              <gr-input id="street" placeholder="123 Main St" />
            </gr-field>
            <div class="grid grid-cols-2 gap-4">
              <gr-field>
                <gr-field-label for="city">City</gr-field-label>
                <gr-input id="city" placeholder="New York" />
              </gr-field>
              <gr-field>
                <gr-field-label for="zip">Postal code</gr-field-label>
                <gr-input id="zip" placeholder="90502" />
              </gr-field>
            </div>
          </gr-field-group>
        </gr-field-set>
      </div>
    `,
  }),
};

/** `orientation="horizontal"`: the control sits beside its label. */
export const Horizontal: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="w-full max-w-md">
        <gr-field-group>
          <gr-field orientation="horizontal">
            <gr-switch id="newsletter" />
            <gr-field-label for="newsletter">Subscribe to the newsletter</gr-field-label>
          </gr-field>
          <gr-field orientation="horizontal">
            <gr-checkbox id="sync" [checked]="true" />
            <gr-field-content>
              <gr-field-label for="sync">Sync Desktop and Documents folders</gr-field-label>
              <gr-field-description>
                They are synced with the cloud. You can open them from other devices.
              </gr-field-description>
            </gr-field-content>
          </gr-field>
        </gr-field-group>
      </div>
    `,
  }),
};

/** `orientation="responsive"`: vertical until its `gr-field-group` is `md` wide. */
export const Responsive: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="w-full max-w-3xl">
        <form>
          <gr-field-set>
            <gr-field-legend>Profile</gr-field-legend>
            <gr-field-description>Fill in your profile information.</gr-field-description>
            <gr-field-separator />
            <gr-field-group>
              <gr-field orientation="responsive">
                <gr-field-content>
                  <gr-field-label for="r-name">Name</gr-field-label>
                  <gr-field-description>Your full name, for identification.</gr-field-description>
                </gr-field-content>
                <gr-input id="r-name" placeholder="Ada Lovelace" />
              </gr-field>
              <gr-field-separator />
              <gr-field orientation="responsive">
                <gr-field-content>
                  <gr-field-label for="r-message">Message</gr-field-label>
                  <gr-field-description>
                    Keep it short, preferably under 100 characters.
                  </gr-field-description>
                </gr-field-content>
                <gr-textarea
                  id="r-message"
                  placeholder="Hello, world!"
                  class="min-h-[100px] resize-none sm:min-w-[300px]"
                />
              </gr-field>
              <gr-field-separator />
              <gr-field orientation="responsive">
                <ai-button type="submit">Submit</ai-button>
                <ai-button type="button" variant="outline">Cancel</ai-button>
              </gr-field>
            </gr-field-group>
          </gr-field-set>
        </form>
      </div>
    `,
  }),
};

/** A radio group in a fieldset, each option a horizontal field. */
export const RadioFieldset: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="w-full max-w-md">
        <gr-field-set>
          <gr-field-legend variant="label">Subscription plan</gr-field-legend>
          <gr-field-description>
            Yearly and lifetime plans offer significant savings.
          </gr-field-description>
          <gr-radio-group value="monthly">
            <gr-field orientation="horizontal">
              <gr-radio-group-item value="monthly" id="plan-monthly" />
              <gr-field-label for="plan-monthly" class="font-normal">Monthly ($9.99/month)</gr-field-label>
            </gr-field>
            <gr-field orientation="horizontal">
              <gr-radio-group-item value="yearly" id="plan-yearly" />
              <gr-field-label for="plan-yearly" class="font-normal">Yearly ($99.99/year)</gr-field-label>
            </gr-field>
            <gr-field orientation="horizontal">
              <gr-radio-group-item value="lifetime" id="plan-lifetime" />
              <gr-field-label for="plan-lifetime" class="font-normal">Lifetime ($299.99)</gr-field-label>
            </gr-field>
          </gr-radio-group>
        </gr-field-set>
      </div>
    `,
  }),
};

/**
 * Choice card with a `gr-radio-group`: the `gr-field-label` wraps a whole
 * `gr-field`, so the card is the click target. The selected card takes the
 * `--primary` border and the `--accent` fill.
 */
export const ChoiceCardRadioGroup: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="w-full max-w-md">
        <gr-field-group>
          <gr-field-set>
            <gr-field-label for="compute-environment">Compute environment</gr-field-label>
            <gr-field-description>
              Select the compute environment for your cluster.
            </gr-field-description>
            <gr-radio-group value="kubernetes" id="compute-environment">
              <gr-field-label for="kubernetes">
                <gr-field orientation="horizontal">
                  <gr-field-content>
                    <gr-field-title>Kubernetes</gr-field-title>
                    <gr-field-description>
                      Run GPU workloads on a K8s configured cluster.
                    </gr-field-description>
                  </gr-field-content>
                  <gr-radio-group-item value="kubernetes" id="kubernetes" />
                </gr-field>
              </gr-field-label>
              <gr-field-label for="vm">
                <gr-field orientation="horizontal">
                  <gr-field-content>
                    <gr-field-title>Virtual machine</gr-field-title>
                    <gr-field-description>
                      Access a VM configured cluster to run GPU workloads.
                    </gr-field-description>
                  </gr-field-content>
                  <gr-radio-group-item value="vm" id="vm" />
                </gr-field>
              </gr-field-label>
            </gr-radio-group>
          </gr-field-set>
        </gr-field-group>
      </div>
    `,
  }),
};

/** Choice card with `gr-checkbox`: several cards can be selected at once. */
export const ChoiceCardCheckbox: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="w-full max-w-md">
        <gr-field-set>
          <gr-field-legend variant="label">Notifications</gr-field-legend>
          <gr-field-description>Pick every channel you want to hear from.</gr-field-description>
          <gr-field-group class="gap-3">
            <gr-field-label for="cc-email">
              <gr-field orientation="horizontal">
                <gr-checkbox id="cc-email" [checked]="true" />
                <gr-field-content>
                  <gr-field-title>Email</gr-field-title>
                  <gr-field-description>A daily digest of what changed.</gr-field-description>
                </gr-field-content>
              </gr-field>
            </gr-field-label>
            <gr-field-label for="cc-push">
              <gr-field orientation="horizontal">
                <gr-checkbox id="cc-push" />
                <gr-field-content>
                  <gr-field-title>Push</gr-field-title>
                  <gr-field-description>Instant alerts on your phone.</gr-field-description>
                </gr-field-content>
              </gr-field>
            </gr-field-label>
          </gr-field-group>
        </gr-field-set>
      </div>
    `,
  }),
};

/** `gr-field-separator` with and without centered text. */
export const Separator: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="w-full max-w-md">
        <gr-field-group>
          <gr-field>
            <gr-field-label for="sep-email">Email</gr-field-label>
            <gr-input id="sep-email" type="email" />
          </gr-field>
          <gr-field-separator>Or continue with</gr-field-separator>
          <gr-field orientation="horizontal">
            <ai-button type="button" variant="outline">Google</ai-button>
            <ai-button type="button" variant="outline">GitHub</ai-button>
          </gr-field>
          <gr-field-separator />
          <gr-field>
            <ai-button type="submit">Create account</ai-button>
          </gr-field>
        </gr-field-group>
      </div>
    `,
  }),
};
