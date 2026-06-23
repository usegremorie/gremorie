# Gremorie Workbench

A standalone app to audit the React (`rx-*`) and Angular (`ng-*`) editions of a
component **side by side** and keep them at parity. It is the tool for spotting
and fixing differences between the two editions before they ship.

- App: `apps/workbench` (Vite + React, dogfooding the `rx-*` primitives).
- Live at: <set by your Vercel project> (the local dev URL is `http://localhost:5025`).

## What it shows

Per component, five columns:

1. **Catalog nav** (left) — the full component catalog, grouped by section
   (AI / Inputs / Layout & display / Interaction), mirroring the docs IA
   (`apps/docs/content/components/meta.json`). Categories collapse/expand;
   components with a contract are interactive, the rest show the roadmap.
2. **Anatomy & guidance** — the shared subcomponent tree + when-to-use /
   when-to-avoid, straight from the contract.
3. **Properties** — a Figma-Playground-style control panel; the controllable
   props drive **both** previews in lockstep.
4. **React** and **Angular** — symmetric Storybook iframes (Preview) + the real
   story source (Code), with install commands.

The theme toggle (dark/light) and brand-theme dropdown in the header re-theme
the whole shell **and** both preview iframes (via Storybook globals).

## Architecture

```
apps/workbench (Vite/React)            @gremorie/contracts (single source of truth)
  └─ reads the manifest  ──────────────►  anatomy · props · guidance · preview ids · commands
  └─ embeds two iframes:
       React  preview ◄── Storybook (rx-ai)  iframe.html?id=<rx preview id>&globals=...
       Angular preview ◄── Storybook (ng-ai) iframe.html?id=<ng preview id>&globals=...
  └─ Code tab: reads the real story source via import.meta.glob (build time)
```

The previews are driven by dedicated **`Workbench` stories** (one per component
per edition) that render an **identical dataset** at the same width, top-aligned
(`layout: 'padded'`). That is what makes the two columns truly comparable. The
contract's `preview` ids point at these `--workbench` stories.

## Run locally

Three processes; the Storybook ports MUST match the workbench fallbacks
(`4401` React, `4400` Angular):

```bash
# 1. React Storybook on :4401
npx storybook dev -p 4401 --no-open -c packages/rx-ai/.storybook

# 2. Angular Storybook on :4400
npx nx storybook ng-ai

# 3. The workbench app on :5025
npx nx serve workbench
```

Open `http://localhost:5025`. The iframes load from `localhost:4401/4400` (the
`VITE_RX_BASE` / `VITE_NG_BASE` fallback). HMR is live: editing a component or
its story updates the relevant preview instantly.

## The component-alignment loop (validation)

This is the core workflow — find and fix RX vs NG differences:

1. Run the three processes above and pick the component in the nav.
2. Compare the **React** and **Angular** Preview columns. Because both render the
   same `Workbench` dataset at the same size, any difference is a real parity gap
   (spacing, color, radius, label, behavior), not a data artifact.
3. Edit the component source to close the gap:
   - React: `packages/rx-*/src/lib/<component>/...`
   - Angular: `packages/ng-*/src/lib/<component>/...`
4. Storybook hot-reloads → the preview updates live → re-compare. Repeat.
5. Toggle dark/light and the brand themes to check parity across themes too.
6. Drive the **Properties** controls to check parity across prop combinations.
7. When aligned, run the package checks before publishing:
   ```bash
   npx nx test rx-<pkg>
   npx nx test ng-<pkg>
   npx nx run-many -t build            # production build, not just dev
   npx vitest run packages/contracts   # contract parity lint (RX ≡ NG ≡ contract)
   ```

## Add a component to the workbench

A component appears (interactive) in the workbench once it has a contract + a
`Workbench` story in each edition:

1. **Contract** — add `packages/contracts/src/contracts/<category>/<name>.contract.ts`
   (`defineContract({ name, category, status, anatomy, props, guidance, preview })`)
   and register it in `packages/contracts/src/index.ts` (`CONTRACTS`).
2. **Workbench stories** — add an export `Workbench` to both edition story files
   that renders ONE shared dataset, top-aligned:
   - React: `parameters: { layout: 'padded' }`, fixed-width decorator.
   - Angular: `parameters: { layout: 'padded' }`, a `render` template at the same
     fixed width binding every input.
   - Keep the two datasets byte-identical (same labels/values/series).
3. **Wire the preview** — set the contract's `preview: { rx, ng }` to the two
   `--workbench` story ids (the kebab-slug of the story title + `--workbench`).
4. The nav item turns interactive automatically (it matches by component name).

## Publication

The previews are hosted on **Chromatic** (which also runs visual regression
tests); the workbench app is hosted on **Vercel**.

### One-time setup

1. **Chromatic** — create two projects (one per Storybook): React and Angular.
   Set both Storybooks to **public** (required for cross-origin iframe
   embedding). Copy each project token into repo secrets:
   - `CHROMATIC_RX_TOKEN`, `CHROMATIC_NG_TOKEN`
     The workflow `.github/workflows/chromatic.yml` publishes both on push to
     `main` (and on PRs), with TurboSnap to limit snapshot usage.
2. **Vercel** — create a project from this repo with **root directory =
   `apps/workbench`** (it uses `apps/workbench/vercel.json`). Set Production env
   vars to the Chromatic branch permalinks:
   - `VITE_RX_BASE = https://main--<rx-app-id>.chromatic.com`
   - `VITE_NG_BASE = https://main--<ng-app-id>.chromatic.com`
     Find each `<app-id>` in the Chromatic project's Manage → Permalink screen.
     Vercel deploys on push via its Git integration.

### Publishing a component update (end to end)

1. Align the editions locally (the loop above) and run the package checks.
2. Open a PR. CI publishes both Storybooks to Chromatic and snapshots the
   changed stories; review any visual diffs in the Chromatic UI and approve.
3. Merge to `main`:
   - Chromatic republishes both Storybooks → the branch permalinks now serve the
     updated previews.
   - Vercel rebuilds and redeploys the workbench → the public workbench reflects
     the updated components (it reads the permalinks at build time).
4. Verify on the live workbench URL (both columns updated, themes still parity).

> This publishes the **showcase** (workbench + previews). Distributing the
> components themselves (registry / npm packages) is a separate, explicitly
> triggered step and is not part of this deploy.

## Notes

- The Code tab reads story source at the workbench's own build time
  (`import.meta.glob`), so it is independent of Chromatic.
- `args` and `globals` are standard Storybook iframe params (parsed client-side),
  so they work identically on local Storybook and on Chromatic-hosted builds.
- Workflow components are intentionally de-prioritized: kept in the codebase but
  removed from the workbench nav and the docs nav.
