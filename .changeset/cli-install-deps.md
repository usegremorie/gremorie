---
'@gremorie/cli': minor
---

`gremorie add` now installs the npm packages an item needs, with the package manager detected from `packageManager` or the lockfile (up to the workspace root). Packages already declared are skipped, so existing ranges are never rewritten. New `--no-install` flag; `--dry-run` prints the install command without running it. A failed install keeps the written files and prints the command to run.
