import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@gremorie/rx-ai';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';

const MODES = ['Research', 'Analyze', 'Plan'];
const MODELS = ['Sonnet 4.6', 'Opus 4.8'];

function Composer({ variant }: { variant: 'outline' | 'secondary' }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
        {variant}
      </span>
      <PromptInput className="w-full" onSubmit={() => undefined}>
        <PromptInputBody>
          <PromptInputTextarea placeholder="Ask anything, or pick a mode..." />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools className="gap-2">
            <PromptInputSelect defaultValue={MODES[0]}>
              <PromptInputSelectTrigger
                aria-label="Select mode"
                size="sm"
                variant={variant}
              >
                <PromptInputSelectValue />
              </PromptInputSelectTrigger>
              <PromptInputSelectContent>
                {MODES.map((m) => (
                  <PromptInputSelectItem key={m} value={m}>
                    {m}
                  </PromptInputSelectItem>
                ))}
              </PromptInputSelectContent>
            </PromptInputSelect>
            <PromptInputSelect defaultValue={MODELS[0]}>
              <PromptInputSelectTrigger
                aria-label="Select model"
                size="sm"
                variant={variant}
              >
                <PromptInputSelectValue />
              </PromptInputSelectTrigger>
              <PromptInputSelectContent>
                {MODELS.map((m) => (
                  <PromptInputSelectItem key={m} value={m}>
                    {m}
                  </PromptInputSelectItem>
                ))}
              </PromptInputSelectContent>
            </PromptInputSelect>
          </PromptInputTools>
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

/** Comparison, not a reference card: select triggers on the filled prompt. */
export function PromptSelects() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt selects</CardTitle>
        <CardDescription>
          Outline vs secondary on the filled prompt.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Composer variant="outline" />
        <Composer variant="secondary" />
      </CardContent>
    </Card>
  );
}
