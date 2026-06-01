import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { Button } from '../button/button';
import { Checkbox } from '../checkbox/checkbox';
import { Input } from '../input/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';

/**
 * # Form
 *
 * A faithful shadcn `react-hook-form` wrapper: a set of field-aware primitives
 * that wire ARIA relationships (`htmlFor`, `aria-describedby`, `aria-invalid`)
 * automatically. `Form` is just `FormProvider`; the real work happens in
 * `FormField` (a typed `Controller`) and the `FormItem` context.
 *
 * ## Anatomy
 *
 * - **Form** — `FormProvider`; spread your `useForm()` methods onto it.
 * - **FormField** — typed `Controller`; owns one field via `name` + `control`.
 * - **FormItem** — `grid gap-2` wrapper that mints a stable `id`.
 * - **FormLabel** — Label wired to the control; turns destructive on error.
 * - **FormControl** — Slot that injects `id` + ARIA onto your input.
 * - **FormDescription** — muted helper text (referenced by `aria-describedby`).
 * - **FormMessage** — renders the field error (or children); null when empty.
 *
 * ## Props
 *
 * `Form` forwards every prop of `FormProvider`. The field primitives take their
 * standard element props. `FormField` is generic over your field-values type.
 *
 * | Prop (FormField) | Type | Description |
 * | --- | --- | --- |
 * | `name` | `FieldPath<TFieldValues>` | The field key. |
 * | `control` | `Control<TFieldValues>` | From `useForm()`. |
 * | `render` | `({ field }) => ReactElement` | Render prop wiring the control. |
 * | `rules` | `RegisterOptions` | Validation rules (e.g. `required`, `pattern`). |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `FormItem` | Field wrapper; provides the item `id` context. |
 * | `FormLabel` | Label bound to the control; error-aware styling. |
 * | `FormControl` | Slot injecting `id` + `aria-*` onto the input. |
 * | `FormDescription` | Muted helper copy. |
 * | `FormMessage` | Error message row (renders only when there is content). |
 * | `useFormField` | Hook exposing the field id/ARIA ids + field state. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--destructive` | error label + `FormMessage` text |
 * | `--muted-foreground` | `FormDescription` |
 */
// `Form` is `FormProvider`, whose props are the full `useForm()` return value
// and cannot be supplied as static args. We anchor the meta on `FormItem`
// (a plain wrapper) purely so Storybook has a renderable component; every
// story drives a real `useForm()` instance through `render`.
const meta = {
  title: 'Inputs/Form',
  component: FormItem,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormItem>;

export default meta;
type Story = StoryObj<typeof meta>;

type SignupValues = {
  username: string;
  email: string;
  acceptTerms: boolean;
};

/**
 * A realistic sign-up form with `useForm()`, two text fields and a checkbox,
 * each with validation rules. Submit with empty/invalid fields to see
 * `FormMessage` light up and the labels turn destructive.
 */
export const SignupForm: Story = {
  render: () => {
    function Demo() {
      const form = useForm<SignupValues>({
        defaultValues: { username: '', email: '', acceptTerms: false },
        mode: 'onTouched',
      });

      const onSubmit = (values: SignupValues) => {
        // eslint-disable-next-line no-alert
        alert(JSON.stringify(values, null, 2));
      };

      return (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-80 flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="username"
              rules={{
                required: 'Username is required.',
                minLength: { value: 3, message: 'At least 3 characters.' },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="ada.lovelace" {...field} />
                  </FormControl>
                  <FormDescription>This is your public handle.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{
                required: 'Email is required.',
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: 'Enter a valid email address.',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="ada@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptTerms"
              rules={{ required: 'You must accept the terms.' }}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Accept terms and conditions</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create account</Button>
          </form>
        </Form>
      );
    }

    return <Demo />;
  },
};
