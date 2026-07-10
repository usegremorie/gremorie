// Button's source stays in `@gremorie/ng-core`: ng-forms consumes `cn` and
// `buttonVariants` from ng-core throughout, so hosting the Button source here
// would create a circular package dependency (ng-core -> ng-forms -> ng-core).
// ng-forms re-exports it so the Angular package surface mirrors React's
// `@gremorie/rx-forms`, which ships Button directly.
export {
  Button,
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from '@gremorie/ng-core';
