import { assistant } from './assistant.contract';
import { chainOfThought } from './chain-of-thought.contract';
import { checkpoint } from './checkpoint.contract';
import { confirmation } from './confirmation.contract';
import { context } from './context.contract';
import { conversation } from './conversation.contract';
import { inlineCitation } from './inline-citation.contract';
import { message } from './message.contract';
import { modelSelector } from './model-selector.contract';
import { plan } from './plan.contract';
import { promptInput } from './prompt-input.contract';
import { queue } from './queue.contract';
import { reasoning } from './reasoning.contract';
import { shimmer } from './shimmer.contract';
import { sources } from './sources.contract';
import { suggestion } from './suggestion.contract';
import { task } from './task.contract';
import { tool } from './tool.contract';

/** All `chatbot` (AI Elements) category contracts. */
export const CHATBOT_CONTRACTS = [
  assistant,
  chainOfThought,
  checkpoint,
  confirmation,
  context,
  conversation,
  inlineCitation,
  message,
  modelSelector,
  plan,
  promptInput,
  queue,
  reasoning,
  shimmer,
  sources,
  suggestion,
  task,
  tool,
];
