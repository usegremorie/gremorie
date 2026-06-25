import { defineContract } from '../../types';

/**
 * Conversation - the scrolling message viewport that sticks to the bottom as
 * new messages stream in, with an empty state and a "scroll to bottom" button.
 * React: `@gremorie/rx-ai`. Angular: `@gremorie/ng-ai`.
 */
export const conversation = defineContract({
  name: 'conversation',
  category: 'chatbot',
  status: 'stable',
  anatomy: `
    <conversation>
    └─ conversation (stick-to-bottom viewport, role="log")
       ├─ conversation-content (message list, flex column)
       ├─ conversation-empty-state (shown when there are no messages)
       └─ conversation-scroll-button (auto-hides at the bottom)`,
  props: [
    {
      name: 'initial',
      type: "'smooth' | 'instant' | boolean",
      default: 'smooth',
      adapts: { ng: 'auto (native observers)' },
      desc: 'Initial auto-scroll behavior (React: use-stick-to-bottom).',
    },
    {
      name: 'resize',
      type: "'smooth' | 'instant' | boolean",
      default: 'smooth',
      adapts: { ng: 'auto (native observers)' },
      desc: 'Scroll behavior when the viewport resizes (React).',
    },
    {
      name: 'title',
      type: 'string',
      default: 'No messages yet',
      desc: 'Empty-state heading (on conversation-empty-state).',
    },
    {
      name: 'description',
      type: 'string',
      default: 'Start a conversation to see messages here',
      desc: 'Empty-state supporting line (on conversation-empty-state).',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      adapts: { ng: 'content slot [icon]' },
      desc: 'Empty-state icon; Angular projects via the icon slot.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the surface.',
    },
  ],
  guidance: {
    summary:
      'A bottom-anchored scroll viewport for a message thread, with empty state and scroll-to-bottom affordance.',
    whenToUse: [
      'Wrap a list of chat messages that should stay pinned to the newest message.',
      'Show a friendly empty state before the first message.',
    ],
    whenNotToUse: [
      { text: 'Rendering a single message bubble', use: 'message' },
      {
        text: 'A non-chat scrolling region with no stick-to-bottom behavior',
        use: 'scroll-area',
      },
    ],
    rules: [
      'Put messages inside conversation-content; the scroll button and empty state are siblings.',
      'React wraps use-stick-to-bottom; Angular reimplements stickiness with native Resize/Mutation observers — behavior parity, no shared dep.',
    ],
    example:
      '<conversation>\n  <conversation-content>\n    <!-- <message> items -->\n  </conversation-content>\n  <conversation-scroll-button />\n</conversation>',
  },
  preview: {
    rx: 'ai-chatbot-conversation--short-thread',
    ng: 'ai-conversation--short-thread',
  },
  figma: { nodeId: null },
});
