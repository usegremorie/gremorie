import { defineContract } from '../../types';

/**
 * Shimmer - an animated gradient sweep over text, signalling streaming / pending
 * content. React ships a component that wraps text; Angular ships a directive you
 * apply to any element. React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const shimmer = defineContract({
  name: 'shimmer',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <shimmer>
    └─ shimmer (RX: <p>/<span> with sweeping gradient; NG: [ngShimmer] directive on any element)`,
  props: [
    {
      name: 'duration',
      type: 'number',
      default: 2,
      adapts: { ng: 'input: shimmerDuration' },
      desc: 'Seconds for one full sweep.',
    },
    {
      name: 'spread',
      type: 'number',
      default: 2,
      adapts: { ng: 'input: shimmerSpread' },
      desc: 'Spread coefficient; sweep width ≈ text length × spread.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      adapts: { rx: 'not implemented' },
      desc: 'Angular-only: pause the animation (animation-play-state).',
    },
    {
      name: 'as',
      type: 'ElementType',
      default: 'p',
      adapts: { ng: 'directive on host element' },
      desc: 'React-only: the element to render; Angular applies to its host element.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the element.',
    },
  ],
  guidance: {
    summary:
      'An animated gradient sweep over text that signals streaming or pending content.',
    whenToUse: [
      'Indicate text is being generated / streamed in.',
      'Shimmer a placeholder label while content loads.',
    ],
    whenNotToUse: [
      { text: 'Block-shaped loading placeholders', use: 'skeleton' },
      {
        text: 'A spinning loader for an indeterminate action',
        use: 'spinner',
      },
    ],
    rules: [
      'React is a component wrapping text (as picks the tag); Angular is a directive ([ngShimmer]) applied to any element.',
      'React animates via motion; Angular via injected CSS keyframes — same look, no shared dep. Use disabled (Angular) to freeze it.',
    ],
    example: '<span ngShimmer [shimmerDuration]="2">Thinking…</span>',
  },
  preview: {
    rx: 'ai-chatbot-shimmer--default',
    ng: 'ai-shimmer--default',
  },
  figma: { nodeId: null },
});
