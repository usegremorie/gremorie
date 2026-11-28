---
whenToUse: 'Colour logic shared by the ColorPicker of both editions: OKLCH parsing and formatting, channels, keyboard steps, area geometry and saved colours.'
whenNotToUse: 'Picking a colour in a UI - use the ColorPicker component instead.'
bestPractices:
  - 'Keep values as OKLCH while editing; print hex or rgb only at the edges.'
  - 'Pass the previous hue to parseColor so a gray keeps its hue.'
antipatterns:
  - "Don't write colour maths by hand next to it; extend this package."
---
