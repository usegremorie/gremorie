import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import {
  DocsPage,
  DocsSection,
  DocsProse,
} from '../../../shared/doc-page.component';

@Component({
  selector: 'docs-integration-signals',
  imports: [DocsLayout, DocsPage, DocsSection, DocsProse, DocsCodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Integration"
        title="Plain signals — no AI library"
        lede="End-to-end streaming chat using only Angular signals, fetch, and ReadableStream. No Hashbrown, no Vercel AI SDK, no NgRx. Use this as a reference when wiring Gremorie NG to a custom backend."
      >
        <docs-section title="What this shows" anchor="overview">
          <docs-prose>
            <p>
              Gremorie NG components consume
              <strong>signal-driven inputs</strong> for state, value, and
              attachments. The library doesn't import any AI framework — you
              bring your own state. This example uses a backend that returns
              server-sent events (SSE), streamed chunk by chunk into a signal.
            </p>
          </docs-prose>
        </docs-section>

        <docs-section title="Component" anchor="component">
          <docs-code-block
            title="chat.component.ts"
            lang="typescript"
            [code]="chatComponent"
          />
        </docs-section>

        <docs-section title="Backend (any framework)" anchor="backend">
          <docs-prose>
            <p>The server endpoint streams chunks of plain text:</p>
          </docs-prose>
          <docs-code-block
            title="POST /api/chat"
            lang="javascript"
            [code]="backend"
          />
        </docs-section>

        <docs-section title="What's happening" anchor="explanation">
          <docs-prose>
            <ol class="ml-5 list-decimal space-y-2">
              <li>
                <strong>State machine.</strong> The container's
                <code>state</code> input drives the submit button visual and the
                aria-live announcements. We move through
                <code>ready → submitted → streaming → ready</code> on success,
                or <code>error</code> on failure.
              </li>
              <li>
                <strong>Submit handler.</strong> On <code>(submitted)</code> we
                POST to the backend and read the response body via
                <code>ReadableStream</code>. Each chunk appended to the
                <code>response()</code> signal — your message renderer reads
                from there.
              </li>
              <li>
                <strong>Cancel.</strong> On <code>(canceled)</code> (Esc or Stop
                button click during streaming) we abort the underlying
                <code>AbortController</code>.
              </li>
              <li>
                <strong>Retry.</strong> On <code>(retried)</code> (Submit click
                in error state) we re-fire the same request.
              </li>
            </ol>
          </docs-prose>
        </docs-section>

        <docs-section
          title="Adapting to Hashbrown or Vercel AI SDK"
          anchor="adapting"
        >
          <docs-prose>
            <p>
              Replace the manual <code>fetch + ReadableStream</code> with the
              library's helpers, but keep the same <code>state</code> signal
              driving the container. Hashbrown's
              <code>chatResource()</code> exposes a <code>status()</code> signal
              that maps 1:1 to our four states. Vercel AI SDK's Angular adapter
              is similar.
            </p>
            <p>
              Dedicated integration docs for Hashbrown and Vercel AI SDK are
              planned for v0.1.1.
            </p>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class SignalsIntegrationPage {
  protected readonly chatComponent = `import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import {
  PromptInput,
  PromptInputState,
  PromptInputSubmit,
  PromptInputSubmitEvent,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@gremorie/ng-ai';

@Component({
  selector: 'app-chat',
  imports: [PromptInput, PromptInputTextarea, PromptInputToolbar, PromptInputSubmit],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="flex flex-col gap-4">
      <pre class="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">{{ response() }}</pre>

      <prompt-input
        [(value)]="prompt"
        [state]="state()"
        (submitted)="onSubmit($event)"
        (canceled)="onCancel()"
        (retried)="onSubmit({ value: prompt(), attachments: [], preventDefault: noop })"
      >
        <prompt-input-textarea placeholder="Ask anything…" />
        <prompt-input-toolbar>
          <prompt-input-submit />
        </prompt-input-toolbar>
      </prompt-input>
    </div>
  \`,
})
export class ChatComponent {
  prompt = signal('');
  state = signal<PromptInputState>('ready');
  response = signal('');

  private controller: AbortController | null = null;
  protected readonly noop = () => undefined;

  async onSubmit({ value }: PromptInputSubmitEvent) {
    this.state.set('submitted');
    this.response.set('');
    this.controller = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt: value }),
        signal: this.controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error('Network error');
      }

      this.state.set('streaming');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        this.response.update((prev) => prev + decoder.decode(chunk));
      }

      this.state.set('ready');
      this.prompt.set('');
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        this.state.set('ready');
        return;
      }
      this.state.set('error');
    }
  }

  onCancel() {
    this.controller?.abort();
  }
}`;

  protected readonly backend = `// Express example — same pattern works on any framework.
app.post('/api/chat', async (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  const stream = await yourLlm.stream(req.body.prompt);

  for await (const chunk of stream) {
    res.write(chunk);
  }
  res.end();
});`;
}
