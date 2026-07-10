import { Assistant } from './assistant';
import { Dashboard } from './dashboard';
import { EmptyState } from './empty-state';
import { SettingsForm } from './settings-form';
import { SignIn } from './sign-in';

/** The Assistant in its new-chat (empty) start state, for the docs preview. */
function AssistantNewChat() {
  return <Assistant initialView="empty" />;
}

const blocks = {
  'sign-in': SignIn,
  dashboard: Dashboard,
  assistant: Assistant,
  'assistant-new-chat': AssistantNewChat,
  'settings-form': SettingsForm,
  'empty-state': EmptyState,
} as const;

export type BlockName = keyof typeof blocks;

/**
 * Embeds a featured block preview inside an MDX page. The wrapper
 * frames the block with a muted background and a thin border so it
 * reads as a contained demo, distinct from prose.
 */
export function BlockPreview({ name }: { name: BlockName }) {
  const Component = blocks[name];
  return (
    <div className="not-prose my-6 flex items-center justify-center overflow-hidden rounded-lg border bg-muted/20 p-6">
      <Component />
    </div>
  );
}
