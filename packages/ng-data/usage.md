---
whenToUse: 'Dashboards, analytics surfaces, and AI-generated visualisations. Use the styled presets for quick wins; drop down to the headless primitives when you need a bespoke chart.'
whenNotToUse: 'A single sparkline inside a metric card - the styled presets carry a chart frame and axes which would be visual noise. Reach for the headless primitives or a plain SVG.'
bestPractices:
  - 'Pick the chart type based on the nature of the data: time series -> area or line; categorical -> bar; composition (<= 5 slices) -> pie; correlation -> scatter.'
  - 'Stick to the Gremorie sequential palette for ordinal data and the categorical palette for nominal data.'
  - 'When generating charts via AI, always pass tabular data plus a label - never inline arrays.'
antipatterns:
  - 'Pie chart with more than 5 slices - use a bar chart instead.'
  - "Sequential palette on categorical data - it implies ordering that isn't there."
  - 'Stacked bar to compare both totals and parts - readers can do one or the other, not both.'
api:
  inputs:
    - name: data
      type: ChartData
      required: true
      description: 'The dataset, in the shape expected by the chosen chart type.'
    - name: width
      type: number
      required: false
      description: 'Width override. Defaults to the host element width.'
    - name: height
      type: number
      required: false
      description: 'Height override. Defaults to 240.'
examples:
  - title: 'Area chart with monthly data'
    code: |
      <gremorie-area-chart [data]="revenueByMonth"></gremorie-area-chart>
  - title: 'Bar chart, categorical'
    code: |
      <gremorie-bar-chart [data]="usersByPlan"></gremorie-bar-chart>
---

# Data

Data visualisation primitives. Currently ships with Charts on D3 - headless
primitives plus styled presets (area, line, bar, scatter, pie, radar,
radial). The styled components are opinionated; the headless layer is there
when you need to break out.
