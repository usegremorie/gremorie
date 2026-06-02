# @gremorie/rx-forms

React form primitives for Gremorie, an AI native design system. Inputs,
buttons, selects, and the field building blocks you need to assemble accessible
forms.

## Install

```bash
npm i @gremorie/rx-forms @gremorie/rx-core
```

Requires React 18 or 19 and Tailwind CSS v4 in the host project.

## Styles

Import the pre compiled token stylesheet once, at your app entry. It ships the
design tokens (colors, radius, light and dark themes) as plain CSS variables,
so you do not need to wire Tailwind `@theme` yourself.

```css
@import 'tailwindcss';
@import '@gremorie/react/styles.css';
```

If you prefer a granular import, pull the tokens straight from the core
package:

```css
@import '@gremorie/rx-core/styles/globals.css';
```

## Usage

```tsx
import { Button, Input, Label } from '@gremorie/rx-forms';

export function SignInForm() {
  return (
    <form className="grid max-w-sm gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
      <Button type="submit">Sign in</Button>
    </form>
  );
}
```

## Components

- `Button`
- `Input`
- `InputGroup`
- `Label`
- `Select`
- `Textarea`
- `ButtonGroup`
- `Calendar`
- `Checkbox`
- `Form`
- `InputOTP`
- `RadioGroup`
- `Slider`
- `Switch`
- `Toggle`
- `ToggleGroup`

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).

Full documentation lives at [gremorie.com](https://gremorie.com).
