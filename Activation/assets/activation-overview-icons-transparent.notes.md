# Transparent feature illustrations

Output: `activation-overview-icons-transparent.png`, 1536 × 1024 PNG with alpha.
Source: `activation-overview-atlas.png`.
Mode: built-in `image_gen`, background extraction edit.

Prompt:

Use case: background-extraction. Edit target: the provided 1536 x 1024 landscape sprite atlas of eight blue isometric illustrations. Remove ONLY the white backdrop and white floor between/around objects, replacing it with a genuinely transparent alpha channel. Preserve white parts that belong to the illustrations (shirts, panels, shelving, storefront, gifts) as opaque white. Preserve all eight subjects, their original glossy blue/cyan colors, fine edges and small details, and faint natural contact shadows as semitransparent alpha. Crucially keep the original 1536 x 1024 canvas, the exact 4-column by 2-row cell grid, and the position and scale of every illustration. Do not rearrange, enlarge, crop, redraw, add labels, add borders, or add new objects. Output a transparent PNG atlas, no checkerboard baked into the image. This is a production website asset; all spaces between illustrations must be transparent.

The HTML displays the seven feature illustrations using the existing square SVG viewports. The original atlas remains available for the sidebar illustration.
