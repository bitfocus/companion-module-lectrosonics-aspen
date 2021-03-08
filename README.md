# companion-module-lectrosonics-aspen

This module controls the Lectrosonics ASPEN series.
Currently these features are implemented:

- Audio Input Mute
- Audio Input Gain
- Audio Output Mute
- Audio Output Gain
- Rear Panel Input Gain
- Rear Panel Output Gain

The values of those features are available in a variable for each input/output channel.
For the rear panel inputs and outputs the gain can be incremented and decremented by steps.

Example of the raw TCP data from the ASPEN:
```
ingn * {20,12,21,50,10,10,0,0,-70,-70,-70,-70}
inmt * {0,1,1,1,0,0,0,0,0,0,0,0}
outgn * {0,0,0,0,0,0,0,0,0,0,0,0}
outmt * {0,0,0,1,1,1,0,0,0,0,0,0}
rpingn * {-4,-4,-4,0,-8,-8,0,0,0,0,0,0}
```
