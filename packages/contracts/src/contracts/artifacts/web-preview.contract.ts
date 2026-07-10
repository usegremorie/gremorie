import { defineContract } from '../../types';

/**
 * WebPreview - a sandboxed live-preview card: a URL bar over an `<iframe>` with
 * an optional collapsible console. Shared state (current URL, console open) lives
 * in a context (React) / DI token (Angular) read by the subcomponents.
 * React: `@gremorie/rx-artifacts`. Angular: `@gremorie/ng-artifacts`.
 */
export const webPreview = defineContract({
  name: 'web-preview',
  category: 'artifacts',
  status: 'stable',
  anatomy: `
    <web-preview>
    └─ web-preview (card root + shared state)
       ├─ web-preview-navigation (toolbar row)
       │  ├─ web-preview-navigation-button (ghost icon button, tooltip)
       │  └─ web-preview-url (address input, commits on Enter)
       ├─ web-preview-body (sandboxed iframe, optional loading slot)
       └─ web-preview-console (collapsible, renders a logs array)`,
  props: [
    {
      name: 'defaultUrl',
      type: 'string',
      default: '',
      desc: 'Initial URL seeded into the iframe + input.',
    },
    {
      name: 'onUrlChange',
      type: '(url: string) => void',
      adapts: { ng: 'output: urlChange' },
      desc: 'Fires when the URL is committed (Enter).',
    },
    {
      name: 'src',
      type: 'string',
      desc: 'WebPreviewBody: explicit iframe src; overrides the shared URL when set.',
    },
    {
      name: 'loading',
      type: 'ReactNode',
      adapts: { ng: 'projected content (slot after the iframe)' },
      desc: 'WebPreviewBody: optional overlay rendered after the iframe.',
    },
    {
      name: 'tooltip',
      type: 'string',
      adapts: {
        ng: 'rendered as native title + aria-label (no Tooltip primitive)',
      },
      desc: 'WebPreviewNavigationButton hover tooltip.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'WebPreviewNavigationButton disabled state.',
    },
    {
      name: 'logs',
      type: 'WebPreviewLog[]',
      default: '[]',
      desc: 'WebPreviewConsole rows: { level: "log"|"warn"|"error", message, timestamp }[].',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the card root.',
    },
    {
      name: 'onClick',
      type: '(e) => void',
      adapts: { ng: 'output: clicked' },
      desc: 'WebPreviewNavigationButton click (e.g. reload).',
    },
  ],
  guidance: {
    summary:
      'A sandboxed iframe preview with a URL bar and an optional console panel.',
    whenToUse: [
      'Show rendered output of a generated site or component inline, with a navigable URL bar.',
      'Surface preview console logs alongside the rendered frame.',
    ],
    whenNotToUse: [
      {
        text: 'Highlighted source code, not a rendered page',
        use: 'code-block',
      },
      { text: 'A generated raster image', use: 'image' },
    ],
    rules: [
      'The iframe is sandboxed (allow-scripts/same-origin/forms/popups/presentation); some hosts block framing, so the chrome may surround a blank frame.',
      'WebPreviewUrl commits on Enter; WebPreviewBody falls back to the shared URL unless its own src is set.',
      'Angular trusts the resolved URL as a SafeResourceUrl (NG0904) before binding it to the iframe — React assigns the raw string.',
    ],
    example:
      '<web-preview defaultUrl="https://example.com"><web-preview-navigation><web-preview-url /></web-preview-navigation><web-preview-body /></web-preview>',
  },
  preview: {
    rx: 'ai-code-webpreview--workbench',
    ng: 'ai-code-webpreview--workbench',
  },
  tag: { rx: 'WebPreview', ng: 'web-preview' },
  example: {
    defaultUrl: 'https://example.com',
  },
  figma: { nodeId: null },
});
