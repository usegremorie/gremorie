/**
 * The site's own name and pitch, in one place.
 *
 * These strings are what the world reads before it ever loads the page: the
 * Google result, the Slack and LinkedIn unfurl, the `og:` and `twitter:` cards.
 * They used to be duplicated in `app/layout.tsx` and in the landing's own
 * `metadata`, and the copies drifted - the landing's subheadline was rewritten
 * while both descriptions kept advertising a component count the page no
 * longer showed.
 *
 * SITE_DESCRIPTION tracks the hero's subheadline on purpose: what a search
 * result promises and what the page opens with should be the same promise. It
 * is kept under 155 characters, which is roughly where Google truncates, and
 * it carries no figure - a number here ages the moment a component lands, and
 * nobody would think to update it.
 */
export const SITE_NAME = 'Gremorie';

export const SITE_TITLE = 'Gremorie - the design system for React and Angular';

export const SITE_DESCRIPTION =
  'Everything an AI product needs: conversation, artifacts, charts, plus the primitives, tokens and blocks around them. React and Angular, at parity. MIT.';

export const SITE_URL = 'https://www.gremorie.com';
