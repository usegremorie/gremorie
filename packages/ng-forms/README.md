# @gremorie/ng-forms

Form primitives for Angular: Input, Label, Textarea, Checkbox, RadioGroup,
Select, Switch, Slider, Toggle, ToggleGroup, ButtonGroup, InputOTP, InputGroup,
Calendar, DatePicker and Form. A companion to Spartan-ng that mirrors the React
`@gremorie/rx-forms` edition. Part of Gremorie, an AI native design system.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/ng-forms @gremorie/ng-core @spartan-ng/brain @angular/cdk @angular/forms class-variance-authority
```

Requires Angular 21 (`@angular/core` ^21.2.0). Interactive controls
(Checkbox, RadioGroup, Select, Switch, Slider, Toggle, ToggleGroup, InputOTP,
Calendar) are wired to `@spartan-ng/brain`; the package shares the Gremorie
tokens through `@gremorie/ng-core`.

## Styles

These primitives are styled with the Gremorie design tokens, so import the
core theme once in your global `styles.css`:

```css
@import 'tailwindcss';
@import '@gremorie/ng-core/theme.css';
```

## Usage

```ts
import { Component } from '@angular/core';
import { Input, Label } from '@gremorie/ng-forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [Input, Label],
  template: `
    <div class="flex w-72 flex-col gap-2">
      <gr-label for="email">Email</gr-label>
      <gr-input id="email" type="email" placeholder="ada@example.com" />
    </div>
  `,
})
export class ExampleComponent {}
```

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
