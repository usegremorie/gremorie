import { ChatSurface } from "./chat-surface";
import { Dashboard } from "./dashboard";
import { EmptyState } from "./empty-state";
import { MarketingHero } from "./marketing-hero";
import { SettingsForm } from "./settings-form";
import { SignIn } from "./sign-in";

const blocks = {
  "sign-in": SignIn,
  dashboard: Dashboard,
  "chat-surface": ChatSurface,
  "settings-form": SettingsForm,
  "marketing-hero": MarketingHero,
  "empty-state": EmptyState,
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
