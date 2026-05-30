import type { Meta, StoryObj } from "@storybook/react";

import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselNext,
  InlineCitationCarouselPrev,
  InlineCitationQuote,
  InlineCitationSource,
  InlineCitationText,
} from "./inline-citation";

/**
 * InlineCitation - footnote-style citation that hovers into a source card
 * (React edition). The cited span carries a Badge trigger condensing the
 * source hostname; on hover a HoverCard opens with the source detail (and,
 * for multiple sources, a Carousel).
 *
 * Anatomy: InlineCitation > InlineCitationText + InlineCitationCard
 * (InlineCitationCardTrigger + InlineCitationCardBody > InlineCitationSource
 * / InlineCitationQuote / Carousel).
 */
const meta = {
  title: "AI/InlineCitation",
  component: InlineCitation,
  tags: ["autodocs"],
  parameters: { layout: "centered", controls: { disable: true } },
} satisfies Meta<typeof InlineCitation>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Single source - one cited fact, one source. Hover the badge to reveal the
 * source title + url.
 */
export const SingleSource: Story = {
  render: () => (
    <p className="max-w-md text-sm leading-relaxed">
      Gremorie ships components, a registry, and an MCP server
      <InlineCitation>
        <InlineCitationText> [1]</InlineCitationText>
        <InlineCitationCard>
          <InlineCitationCardTrigger sources={["https://gremorie.com"]} />
          <InlineCitationCardBody>
            <InlineCitationSource
              title="Gremorie docs"
              url="https://gremorie.com/docs"
              description="The AI-native design system: registry + MCP, React and Angular editions."
            />
          </InlineCitationCardBody>
        </InlineCitationCard>
      </InlineCitation>
      , for React and Angular.
    </p>
  ),
};

/**
 * Multi-source carousel - several sources behind one citation. The card body
 * uses the Carousel with a header (index + prev/next) and one item per source.
 */
export const MultiSourceCarousel: Story = {
  render: () => {
    const sources = [
      {
        title: "Registry README",
        url: "https://gremorie.com/docs/registry",
        description: "How the registry resolves dependencies and writes source.",
      },
      {
        title: "MCP server guide",
        url: "https://gremorie.com/docs/mcp",
        description: "Serving the corpus to LLMs over the Model Context Protocol.",
      },
      {
        title: "Phase 5k release notes",
        url: "https://gremorie.com/changelog",
        description: "100 primitives across 9 packages, editions in parity.",
      },
    ];
    return (
      <p className="max-w-md text-sm leading-relaxed">
        The two editions stay in parity across the same registry
        <InlineCitation>
          <InlineCitationText> [1]</InlineCitationText>
          <InlineCitationCard>
            <InlineCitationCardTrigger
              sources={sources.map((s) => s.url)}
            />
            <InlineCitationCardBody>
              <InlineCitationCarousel>
                <InlineCitationCarouselHeader>
                  <InlineCitationCarouselPrev />
                  <InlineCitationCarouselIndex />
                  <InlineCitationCarouselNext />
                </InlineCitationCarouselHeader>
                <InlineCitationCarouselContent>
                  {sources.map((s) => (
                    <InlineCitationCarouselItem key={s.url}>
                      <InlineCitationSource
                        title={s.title}
                        url={s.url}
                        description={s.description}
                      />
                    </InlineCitationCarouselItem>
                  ))}
                </InlineCitationCarouselContent>
              </InlineCitationCarousel>
            </InlineCitationCardBody>
          </InlineCitationCard>
        </InlineCitation>
        .
      </p>
    );
  },
};

/**
 * Source with pulled quote - the card body adds an `InlineCitationQuote`
 * with the exact excerpt the answer is grounded in.
 */
export const WithPulledQuote: Story = {
  render: () => (
    <p className="max-w-md text-sm leading-relaxed">
      Components are copy-paste and yours to own
      <InlineCitation>
        <InlineCitationText> [1]</InlineCitationText>
        <InlineCitationCard>
          <InlineCitationCardTrigger sources={["https://gremorie.com"]} />
          <InlineCitationCardBody>
            <InlineCitationSource
              title="Gremorie docs"
              url="https://gremorie.com/docs"
            />
            <InlineCitationQuote>
              Run `gremorie add` and the code is yours. No black-box
              dependency - own every line.
            </InlineCitationQuote>
          </InlineCitationCardBody>
        </InlineCitationCard>
      </InlineCitation>
      .
    </p>
  ),
};
