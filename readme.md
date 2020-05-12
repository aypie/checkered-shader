## Check-check!

This is a GLSL fragment shader that takes two `vec3` colors and makes a moving
checkered pattern using them. You can also define `MovX`, `MovY` and the `CheckSize`.

## How it works

Basically all we do is draw regular stripes horizontally and vertically. We substract horizontal
stripes from vertical stripes, and the absolute of the result will be a checkered pattern, we
then can use this pattern to mix our given colors and output the final color.

Just this, however, only works for the static pattern and only for integer values of `CheckSize`.
As we need a moving pattern without jittering - we need to add smooth edges to the stripes, and
we do that using the `Stripe()` function that draws stripes considering the smoothness of the edges.
To do that `Stripe()` draws pixel-wide linear falloffs on the edges of the stripes.
