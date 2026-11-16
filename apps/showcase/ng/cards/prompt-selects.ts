import { ChangeDetectionStrategy, Component } from '@angular/core';
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
} from '@gremorie/ng-ai';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/ng-display';

/** Comparison, not a reference card: select triggers on the filled prompt. */
@Component({
  selector: 'showcase-prompt-selects',
  standalone: true,
  imports: [
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Prompt selects</gr-card-title>
        <gr-card-description
          >Outline vs secondary on the filled prompt.</gr-card-description
        >
      </gr-card-header>
      <gr-card-content class="flex flex-col gap-6">
        @for (variant of variants; track variant) {
          <div class="flex flex-col gap-2">
            <span
              class="font-medium text-muted-foreground text-xs uppercase tracking-wider"
              >{{ variant }}</span
            >
            <prompt-input class="w-full">
              <prompt-input-body>
                <prompt-input-textarea
                  placeholder="Ask anything, or pick a mode..."
                />
              </prompt-input-body>
              <prompt-input-footer>
                <prompt-input-tools class="gap-2">
                  <prompt-input-select [value]="modes[0]">
                    <prompt-input-select-trigger
                      ariaLabel="Select mode"
                      size="sm"
                      [variant]="variant"
                    >
                      <prompt-input-select-value />
                    </prompt-input-select-trigger>
                    <prompt-input-select-content>
                      @for (m of modes; track m) {
                        <prompt-input-select-item [value]="m" [label]="m">{{
                          m
                        }}</prompt-input-select-item>
                      }
                    </prompt-input-select-content>
                  </prompt-input-select>
                  <prompt-input-select [value]="models[0]">
                    <prompt-input-select-trigger
                      ariaLabel="Select model"
                      size="sm"
                      [variant]="variant"
                    >
                      <prompt-input-select-value />
                    </prompt-input-select-trigger>
                    <prompt-input-select-content>
                      @for (m of models; track m) {
                        <prompt-input-select-item [value]="m" [label]="m">{{
                          m
                        }}</prompt-input-select-item>
                      }
                    </prompt-input-select-content>
                  </prompt-input-select>
                </prompt-input-tools>
                <prompt-input-submit />
              </prompt-input-footer>
            </prompt-input>
          </div>
        }
      </gr-card-content>
    </gr-card>
  `,
})
export class PromptSelects {
  protected readonly variants = ['outline', 'secondary'] as const;
  protected readonly modes = ['Research', 'Analyze', 'Plan'];
  protected readonly models = ['Sonnet 4.6', 'Opus 4.8'];
}
