---
whenToUse: "Surfaces grouping related content (Card) and compact status labels (Badge). Companions to Spartan-ng — fill the gap for primitives Spartan-ng doesn't ship."
whenNotToUse: 'Interactive selection chips — those belong to a ToggleGroup primitive, not Badge. Card is not for transient overlays (use a dialog/popover primitive).'
bestPractices:
  - 'Compose Card with its sub-parts (gn-card-header, gn-card-title, gn-card-description, gn-card-content, gn-card-footer) rather than dumping everything into the host.'
  - 'Pick the closest semantic Badge variant — outline for neutral metadata, secondary for default counts, destructive for errors.'
  - 'Both primitives are token-driven (bg-card, bg-secondary, border-border) so theme changes flow through automatically.'
antipatterns:
  - 'Hardcoding inline-styled spans/divs to mimic a badge — use Badge with the right variant.'
  - 'Reaching into Card sub-classes with className overrides to recolor — add a new variant on the primitive instead.'
examples:
  - title: 'KPI Card'
    code: |
      <gn-card>
        <gn-card-header>
          <gn-card-title>Total Revenue</gn-card-title>
          <gn-card-description>Last 30 days</gn-card-description>
          <gn-card-action>
            <gn-badge variant="outline">+12%</gn-badge>
          </gn-card-action>
        </gn-card-header>
        <gn-card-content>$45,231</gn-card-content>
      </gn-card>
  - title: 'Status badges'
    code: |
      <gn-badge variant="secondary">Running</gn-badge>
      <gn-badge variant="destructive">Failed</gn-badge>
      <gn-badge variant="outline">Pending</gn-badge>
---

# Display

Display primitives for the Angular edition — Card (compound surface) and
Badge (status labels). Companions to Spartan-ng, which doesn't ship its own
Card or Badge. Both primitives mirror the React versions in
`@gremorie/rx-display` so the visual surface stays consistent across editions.
