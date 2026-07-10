#!/usr/bin/env node
// Unscoped wrapper: `npx gremorie` delegates to the real CLI in @gremorie/cli.
import('@gremorie/cli/bin/gremorie.js').catch((err) => {
  console.error(err);
  process.exit(1);
});
