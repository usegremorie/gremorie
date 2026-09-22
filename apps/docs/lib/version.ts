import pkg from '../../../packages/gremorie/package.json';

/**
 * The published version of Gremorie, read from the package the landing tells
 * people to run (`npx gremorie add ...`). Every publishable package moves in
 * lockstep through `nx release`, so this one number is the whole system's.
 *
 * Derived rather than written down on purpose: the hero pill states the
 * version, and a hardcoded string goes stale the moment a release lands.
 * A static import keeps it a build-time constant - no `fs`, so Turbopack does
 * not trace the project the way the `llms-full.txt` route does.
 */
export const gremorieVersion: string = pkg.version;
