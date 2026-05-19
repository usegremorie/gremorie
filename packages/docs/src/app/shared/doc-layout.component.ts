import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavSection {
  title: string;
  items: { label: string; href: string }[];
}

const NAV: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction', href: '/docs/getting-started' },
    ],
  },
  {
    title: 'Components',
    items: [
      { label: 'PromptInput', href: '/docs/components/prompt-input' },
      { label: 'PromptInputTextarea', href: '/docs/components/prompt-input-textarea' },
      { label: 'PromptInputSubmit', href: '/docs/components/prompt-input-submit' },
      { label: 'PromptInputToolbar', href: '/docs/components/prompt-input-toolbar' },
      { label: 'PromptInputTools', href: '/docs/components/prompt-input-tools' },
      { label: 'PromptInputButton', href: '/docs/components/prompt-input-button' },
      { label: 'PromptInputAttachments', href: '/docs/components/prompt-input-attachments' },
      { label: 'PromptInputAttachment', href: '/docs/components/prompt-input-attachment' },
      { label: 'PromptInputActionMenu', href: '/docs/components/prompt-input-action-menu' },
      { label: 'PromptInputModelSelect', href: '/docs/components/prompt-input-model-select' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { label: 'Plain signals', href: '/docs/integrations/signals' },
    ],
  },
];

@Component({
  selector: 'docs-layout',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen flex-col bg-background text-foreground">
      <header class="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <a [routerLink]="['/']" class="flex items-center gap-2 font-semibold tracking-tight">
            <span class="rounded bg-foreground px-1.5 py-0.5 text-xs font-bold text-background">SHAD</span>
            <span class="text-foreground">ng</span>
          </a>
          <nav class="flex items-center gap-1 text-sm">
            <a
              [routerLink]="['/docs/getting-started']"
              routerLinkActive="bg-accent text-accent-foreground"
              class="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >Docs</a>
            <a
              href="https://github.com/kalvner/shadng"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-4">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.2-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.69.41.35.78 1.05.78 2.11v3.13c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z"/>
              </svg>
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <div class="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-8">
        <aside class="sticky top-20 hidden h-[calc(100vh-6rem)] w-56 shrink-0 overflow-y-auto md:block">
          <nav class="flex flex-col gap-6">
            @for (section of nav; track section.title) {
              <div class="flex flex-col gap-1">
                <h2 class="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {{ section.title }}
                </h2>
                @for (item of section.items; track item.href) {
                  <a
                    [routerLink]="item.href"
                    routerLinkActive="bg-accent text-accent-foreground font-medium"
                    class="block rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {{ item.label }}
                  </a>
                }
              </div>
            }
          </nav>
        </aside>

        <main class="min-w-0 flex-1">
          <ng-content />
        </main>
      </div>

      <footer class="border-t border-border bg-muted/30 py-6">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
          <span>MIT © Kalvner</span>
          <span>v0.1.0 · pre-release</span>
        </div>
      </footer>
    </div>
  `,
})
export class DocsLayout {
  protected readonly nav = NAV;
}
