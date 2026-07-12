---
whenToUse: "Surfaces grouping related content (Card) and compact status labels (Badge). Companions to Spartan-ng — fill the gap for primitives Spartan-ng doesn't ship."
whenNotToUse: 'Interactive selection chips — those belong to a ToggleGroup primitive, not Badge. Card is not for transient overlays (use a dialog/popover primitive).'
bestPractices:
  - 'Compose Card with its sub-parts (gr-card-header, gr-card-title, gr-card-description, gr-card-content, gr-card-footer) rather than dumping everything into the host.'
  - 'Pick the closest semantic Badge variant — outline for neutral metadata, secondary for default counts, destructive for errors.'
  - 'Both primitives are token-driven (bg-card, bg-secondary, border-border) so theme changes flow through automatically.'
antipatterns:
  - 'Hardcoding inline-styled spans/divs to mimic a badge — use Badge with the right variant.'
  - 'Reaching into Card sub-classes with className overrides to recolor — add a new variant on the primitive instead.'
examples:
  - title: 'KPI Card'
    code: |
      <gr-card>
        <gr-card-header>
          <gr-card-title>Total Revenue</gr-card-title>
          <gr-card-description>Last 30 days</gr-card-description>
          <gr-card-action>
            <gr-badge variant="outline">+12%</gr-badge>
          </gr-card-action>
        </gr-card-header>
        <gr-card-content>$45,231</gr-card-content>
      </gr-card>
  - title: 'Status badges'
    code: |
      <gr-badge variant="secondary">Running</gr-badge>
      <gr-badge variant="destructive">Failed</gr-badge>
      <gr-badge variant="outline">Pending</gr-badge>
---

# Display

Display primitives for the Angular edition — Card (compound surface) and
Badge (status labels). Companions to Spartan-ng, which doesn't ship its own
Card or Badge. Both primitives mirror the React versions in
`@gremorie/rx-display` so the visual surface stays consistent across editions.
