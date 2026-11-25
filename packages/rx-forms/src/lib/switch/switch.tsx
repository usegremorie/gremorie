'use client';

import { Switch as SwitchPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@gremorie/rx-core';

/**
 * Switch - immediate-effect toggle.
 *
 * Built over Radix. Use Switch when toggling
 * the control changes state right away (notifications on/off, dark
 * mode). For checked state inside a form that will be submitted,
 * reach for `Checkbox` instead - Switch is for "now", Checkbox for
 * "on submit".
 *
 * Two sizes - `sm` and `default` - exposed via the `size` prop on
 * the data attribute, which the thumb consumes via the
 * `group-data-[size]` selector.
 */
export type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default';
};

function Switch({ className, size = 'default', ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'peer group/switch inline-flex shrink-0 items-center rounded-full border-2 border-transparent transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-5 data-[size=default]:w-11 data-[size=sm]:h-4 data-[size=sm]:w-7 data-[state=checked]:bg-switch-checked data-[state=unchecked]:bg-input',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block rounded-full bg-white shadow-sm ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-[state=unchecked]:translate-x-0 group-data-[size=default]/switch:data-[state=checked]:translate-x-6 group-data-[size=sm]/switch:data-[state=checked]:translate-x-3',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
