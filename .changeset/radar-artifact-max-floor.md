---
'@gremorie/rx-artifacts': patch
---

Chart artifact: keep radar charts inside the plot

The radar chart now pins its scale at 100 by default, which is right for the
scores it is usually reaching for and wrong for an artifact, which carries
whatever range a model produced — anything above 100 drew outside the outer
ring. The artifact now treats 100 as a floor and grows the scale when the data
needs it.
