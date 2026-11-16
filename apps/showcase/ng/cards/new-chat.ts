import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideMessageCircleDashed,
  lucidePlus,
  lucideRefreshCw,
} from '@ng-icons/lucide';
import { Button } from '@gremorie/ng-core';
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@gremorie/ng-ai';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gremorie/ng-display';

const DRAFT =
  "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply the view jumps.";

/** shadcn home reference: the "New Chat" assistant card. */
@Component({
  selector: 'showcase-new-chat',
  standalone: true,
  imports: [
    Button,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    NgIcon,
    PromptInput,
    PromptInputBody,
    PromptInputButton,
    PromptInputFooter,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools,
  ],
  providers: [
    provideIcons({ lucideMessageCircleDashed, lucidePlus, lucideRefreshCw }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card class="h-[560px]">
      <gr-card-header class="border-b">
        <gr-card-title>New Chat</gr-card-title>
        <gr-card-description>How can I help you today?</gr-card-description>
        <gr-card-action>
          <ai-button
            variant="outline"
            size="icon"
            ariaLabel="Reset conversation"
          >
            <ng-icon name="lucideRefreshCw" aria-hidden="true" />
          </ai-button>
        </gr-card-action>
      </gr-card-header>
      <gr-card-content
        class="flex flex-1 flex-col items-center justify-center gap-4 text-center"
      >
        <div
          class="flex size-10 items-center justify-center rounded-lg bg-muted"
        >
          <ng-icon
            name="lucideMessageCircleDashed"
            class="text-xl"
            aria-hidden="true"
          />
        </div>
        <div class="flex flex-col gap-2">
          <p class="font-semibold text-lg">Morning, shadcn!</p>
          <p class="text-muted-foreground text-sm">
            What are we working on today? Press send to start a new conversation
          </p>
        </div>
      </gr-card-content>
      <gr-card-footer>
        <prompt-input class="w-full" [value]="draft">
          <prompt-input-body>
            <prompt-input-textarea />
          </prompt-input-body>
          <prompt-input-footer>
            <prompt-input-tools>
              <prompt-input-button variant="outline" ariaLabel="Add files">
                <ng-icon name="lucidePlus" aria-hidden="true" />
              </prompt-input-button>
            </prompt-input-tools>
            <prompt-input-submit />
          </prompt-input-footer>
        </prompt-input>
      </gr-card-footer>
    </gr-card>
  `,
})
export class NewChat {
  protected readonly draft = DRAFT;
}
