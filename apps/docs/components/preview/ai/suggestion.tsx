'use client';

import { Suggestion, Suggestions } from '@gremorie/rx-ai';

const SUGGESTIONS = [
  'Explain the registry architecture',
  'Show me a Plan example',
  'How do I add a new primitive?',
  'What is the MCP server for?',
  'Compare Angular and React editions',
];

export function SuggestionPreview() {
  return (
    <Suggestions>
      {SUGGESTIONS.map((s) => (
        <Suggestion key={s} suggestion={s} onClick={() => undefined} />
      ))}
    </Suggestions>
  );
}
