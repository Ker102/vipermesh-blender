# Visual Presentation

## Build A Useful Feedback Loop

Use previews to answer concrete questions: composition, relative scale,
orientation, visibility, material readability, contact, and lighting direction.
Avoid repeated screenshots that do not change a decision.

For reference reconstruction, compare the largest visual anchors before
spending time on small details. Later passes can prioritize objects by
prominence in the intended camera.

## Camera

Focal length, camera height, perspective, and frame fill are creative and
task-dependent. Use framing tools and camera inspection to match the requested
result; do not force a universal interior, product, or cinematic preset.

Check that required objects are visible and that important silhouettes are not
accidentally cropped or hidden. A camera can conceal structural mistakes, so
visual framing does not replace spatial validation.

## Lighting

Choose lights from the intended source, mood, material response, and render
engine. Studio presets are useful starting points for isolated assets, while
custom lights and world environments may fit scenes with explicit windows,
fixtures, outdoor conditions, or stylized direction.

Judge exposure, color separation, shadow readability, and whether bright areas
erase material color. Numeric energy ranges are starting points rather than
scene-independent rules.

## Acceptance

Inspect the final render artifact, not only tool success responses. If a visible
problem remains, make a focused repair and re-render rather than rebuilding
unrelated scene elements.

`inspect_render_artifact` checks image integrity, not whether the picture matches
the brief. Open the image with the client's image/viewer capability. If the client
cannot view it, state that visual quality remains unverified.

For each required object or edit, compare evidence against the user's intent:
presence and proportions, functional facing direction, contact or attachment,
clearance, visibility, and material readability. Take a diagnostic side or top
view when the main camera hides a suspicious relationship. Bounds-based support
reports can miss hollow supports, rotated parts, handles and local mesh collisions.
Interpret them with actual geometry and stated intent, rather than treating a
passing report as complete acceptance. Recheck affected relationships after a repair.
