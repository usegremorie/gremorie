import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@gremorie/rx-ai';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { MessageCircleDashedIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';

export const DRAFT =
  "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply the view jumps.";

/** shadcn home reference: the "New Chat" assistant card. */
export function NewChat() {
  return (
    <Card className="h-[560px]">
      <CardHeader className="border-b">
        <CardTitle>New Chat</CardTitle>
        <CardDescription>How can I help you today?</CardDescription>
        <CardAction>
          <Button variant="outline" size="icon" aria-label="Reset conversation">
            <RefreshCwIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <MessageCircleDashedIcon className="size-5" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg">Morning, shadcn!</p>
          <p className="text-muted-foreground text-sm">
            What are we working on today? Press send to start a new conversation
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <PromptInput className="w-full" onSubmit={() => undefined}>
          <PromptInputBody>
            <PromptInputTextarea defaultValue={DRAFT} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputButton variant="outline" aria-label="Add files">
                <PlusIcon className="size-4" />
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit />
          </PromptInputFooter>
        </PromptInput>
      </CardFooter>
    </Card>
  );
}
