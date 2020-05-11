## Check-check

This is a GLSL fragment shader that takes two `vec3` colors and makes a moving
checkered pattern using them. You can also define `MovX`, `MovY` and the `CheckSize`.

This shader works as of right now, but can possibly be optimised. Take a look at the code.

## How it works

Basically all we do is make regular slices horizontally and vertically. We add horizontal
slices to the `Result` and substract vertical slices from the `Result`. Absolute of the
`Result` will be our checkered pattern. We use it for mixing the given colors together.

This, however, only works for the static pattern and only for integer values of `CheckSize`.
If we want a moving pattern without jittering we need to add smooth edges to the slices, and
we do that using the `Edge()` function that detects distance to the slice and softens its edge.
