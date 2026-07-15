---
whenToUse: 'Communicating system state to the user — loading (Spinner, Skeleton), progress (Progress) and persistent inline messages (Alert). Companion to Spartan-ng — fills the Spinner gap and wraps Spartan brain Progress idiomatically.'
whenNotToUse: 'Transient floating notifications belong to a Toast/Sonner primitive. Page-spanning announcements belong to a Banner.'
bestPractices:
  - 'Pick the right loading affordance: Spinner for unknown duration, Progress for known percent, Skeleton when you need to reserve layout for content shape.'
  - "Pair Skeleton-using regions with aria-busy='true' and aria-live='polite' so screen readers announce the loading state."
  - 'Convey Alert intent through the leading icon (Info, CheckCircle2, AlertTriangle) rather than introducing new variants.'
antipatterns:
  - 'Using Skeleton when the geometry of the real content is unknown — the whole point of Skeleton is to prevent layout shift.'
  - 'Silent Progress bars without a value or label — users do not know the actual state.'
  - 'Stacking multiple Spinners on one screen — pick one anchored to the slowest operation.'
examples:
  - title: 'Inline loading'
    code: |
      <button [disabled]="loading()">
        @if (loading()) { <gr-spinner size="sm" /> }
        Save
      </button>
  - title: 'Determinate upload progress'
    code: |
      <gr-progress [value]="uploadPct()" />
      <span>{{ uploadPct() }}%</span>
  - title: 'Inline alert'
    code: |
      <gr-alert variant="destructive">
        <gr-alert-title>Saved with errors</gr-alert-title>
        <gr-alert-description>2 rows failed validation.</gr-alert-description>
      </gr-alert>
  - title: 'Skeleton placeholder'
    code: |
      <div aria-busy="true" aria-live="polite">
        <gr-skeleton class="h-4 w-32" />
        <gr-skeleton class="h-4 w-48 mt-2" />
      </div>
---

# Feedback

Feedback primitives for the Angular edition — Spinner (Spartan-ng gap),
Alert (3 sub-components), Progress (wraps Spartan brain) and Skeleton.
All mirror their React counterparts in `@gremorie/rx-feedback` so the
visual surface stays consistent across editions.
