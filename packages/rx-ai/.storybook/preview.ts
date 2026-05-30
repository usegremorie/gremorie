import type { Preview } from "@storybook/react";

import "./preview.css";

/**
 * Shared preview for the rx-* Storybook. Centers primitives by default and
 * wires the standard control matchers. Theme tokens come from preview.css
 * (Gremorie two-tier tokens via @gremorie/rx-core).
 */
const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
