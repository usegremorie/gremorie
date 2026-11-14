import type { PlatformModel } from './model.ts';

export const renderTokensJson = (model: PlatformModel): string =>
  `${JSON.stringify(model, null, 2)}\n`;
