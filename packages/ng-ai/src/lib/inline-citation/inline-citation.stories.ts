import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnHoverCardContent } from '@spartan-ng/brain/hover-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@gremorie/ng-display';

import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationQuote,
  InlineCitationSource,
  InlineCitationText,
} from './';

/**
 * InlineCitation — footnote citation that hovers into a source card
 * (Angular edition). Mirrors React `InlineCitation` from `@gremorie/rx-ai`.
 *
 * Built on `@spartan-ng/brain` BrnHoverCard + `gn-badge` (ng-display). The
 * hover-card content lives in a `<ng-template brnHoverCardContent>` (brain
 * idiom); multiple sources compose `gn-carousel` (ng-display) inside the body.
 */
const meta: Meta<InlineCitation> = {
  title: 'AI/Chatbot/InlineCitation',
  component: InlineCitation,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [
        InlineCitation,
        InlineCitationText,
        InlineCitationCard,
        InlineCitationCardTrigger,
        InlineCitationCardBody,
        InlineCitationSource,
        InlineCitationQuote,
        BrnHoverCardContent,
        Carousel,
        CarouselContent,
        CarouselItem,
        CarouselPrevious,
        CarouselNext,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<InlineCitation>;

/**
 * Workbench — fixed-width preview frame matching the catalog convention.
 * Same dataset as the React Workbench story (the single source).
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <div style="width: 420px;">
        <p class="max-w-md text-sm leading-relaxed">
          Gremorie ships components, a registry, and an MCP server
          <inline-citation>
            <inline-citation-text> [1]</inline-citation-text>
            <inline-citation-card>
              <inline-citation-card-trigger [sources]="['https://gremorie.com']" />
              <ng-template brnHoverCardContent>
                <inline-citation-card-body>
                  <inline-citation-source
                    title="Gremorie docs"
                    url="https://gremorie.com/docs"
                    description="The AI-native design system: registry + MCP, React and Angular editions."
                  />
                </inline-citation-card-body>
              </ng-template>
            </inline-citation-card>
          </inline-citation>
          , for React and Angular.
        </p>
      </div>
    `,
  }),
};

/**
 * Single source — one cited fact, one source. Hover the badge to reveal the
 * source title + url.
 */
export const SingleSource: Story = {
  render: () => ({
    template: `
      <p class="max-w-md text-sm leading-relaxed">
        Gremorie ships components, a registry, and an MCP server
        <inline-citation>
          <inline-citation-text> [1]</inline-citation-text>
          <inline-citation-card>
            <inline-citation-card-trigger [sources]="['https://gremorie.com']" />
            <ng-template brnHoverCardContent>
              <inline-citation-card-body>
                <inline-citation-source
                  title="Gremorie docs"
                  url="https://gremorie.com/docs"
                  description="The AI-native design system: registry + MCP, React and Angular editions."
                />
              </inline-citation-card-body>
            </ng-template>
          </inline-citation-card>
        </inline-citation>
        , for React and Angular.
      </p>
    `,
  }),
};

/**
 * Multi-source carousel — several sources behind one citation. The body
 * composes `gn-carousel` (ng-display) with one slide per source.
 */
export const MultiSourceCarousel: Story = {
  render: () => ({
    template: `
      <p class="max-w-md text-sm leading-relaxed">
        The two editions stay in parity across the same registry
        <inline-citation>
          <inline-citation-text> [1]</inline-citation-text>
          <inline-citation-card>
            <inline-citation-card-trigger
              [sources]="['https://gremorie.com/docs/registry','https://gremorie.com/docs/mcp','https://gremorie.com/changelog']"
            />
            <ng-template brnHoverCardContent>
              <inline-citation-card-body>
                <gn-carousel class="w-full">
                  <gn-carousel-content>
                    <gn-carousel-item class="p-4 pl-8">
                      <inline-citation-source
                        title="Registry README"
                        url="https://gremorie.com/docs/registry"
                        description="How the registry resolves dependencies and writes source."
                      />
                    </gn-carousel-item>
                    <gn-carousel-item class="p-4 pl-8">
                      <inline-citation-source
                        title="MCP server guide"
                        url="https://gremorie.com/docs/mcp"
                        description="Serving the corpus to LLMs over the Model Context Protocol."
                      />
                    </gn-carousel-item>
                    <gn-carousel-item class="p-4 pl-8">
                      <inline-citation-source
                        title="Phase 5k release notes"
                        url="https://gremorie.com/changelog"
                        description="100 primitives across 9 packages, editions in parity."
                      />
                    </gn-carousel-item>
                  </gn-carousel-content>
                  <gn-carousel-previous />
                  <gn-carousel-next />
                </gn-carousel>
              </inline-citation-card-body>
            </ng-template>
          </inline-citation-card>
        </inline-citation>
        .
      </p>
    `,
  }),
};

/**
 * Source with pulled quote — the body adds an `inline-citation-quote` with the
 * exact excerpt the answer is grounded in.
 */
export const WithPulledQuote: Story = {
  render: () => ({
    template: `
      <p class="max-w-md text-sm leading-relaxed">
        Components are copy-paste and yours to own
        <inline-citation>
          <inline-citation-text> [1]</inline-citation-text>
          <inline-citation-card>
            <inline-citation-card-trigger [sources]="['https://gremorie.com']" />
            <ng-template brnHoverCardContent>
              <inline-citation-card-body class="space-y-2 p-4">
                <inline-citation-source
                  title="Gremorie docs"
                  url="https://gremorie.com/docs"
                />
                <inline-citation-quote>
                  Run gremorie add and the code is yours. No black-box
                  dependency — own every line.
                </inline-citation-quote>
              </inline-citation-card-body>
            </ng-template>
          </inline-citation-card>
        </inline-citation>
        .
      </p>
    `,
  }),
};
