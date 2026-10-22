# Isometric: design foundation

This is the one file every page reads from. It states the decisions; `src/routes/layout.css` holds the values. If a value changes, change it there and update this file in the same commit.

## The idea

Every surface is a face of a solid. A scene is one colour field, one centred object, and a great deal of empty space. Light comes from the upper left, so the top of anything is its lightest face, the right-facing side is mid, and the left-facing side is darkest. Edges are defined by the change of tone between faces, never by strokes. Colour is spent on the one or two things that can be acted on.

Applied to a user interface:

- One hue per page. The page field is a warm paper in light mode or a teal-black in dark mode, and a single key colour (the active palette) carries actions. Secondary tones come from mixing the key colour with the field, not from new hues.
- Three faces, not shadows. Depth is shown with a lighter top tone, a mid tone and a shadow tone. Drop shadows are reserved for floating layers (popovers, dialogs), and even there they are flat, offset blocks rather than soft blurs.
- Hairlines and rings. Rules are 1px. The primary icon control is a ring with a dot. Focus is two concentric hairline rings. Success and "arrived" states draw expanding concentric rings. Nothing static glows; only live, interactive things do, and only in dark mode.
- Crisp corners, true circles. Blocks have a 4px corner at most. Anything round is a full circle. There are no pills on rectangular content, and no rounded-everything.
- Negative space is the layout. Hero sections hold one object at 20-30% of the viewport width and leave the rest empty. Dense pages (catalog, dashboard) use the space between groups, not boxes, to show grouping.
- Fade, do not crop. Long structures bleed off the bottom edge of the viewport or fade into the field.
- The reader's position is tiny and bright. Current-page markers, cursors and the active item are small and the highest-contrast thing on the screen.

## Colour

All colours are oklch. Semantic tokens follow the shadcn-svelte names so every component keeps working; three extra groups are added.

### Field and ink (mode-level, not palette-level)

| Token | Light | Dark |
|---|---|---|
| `--background` | warm paper `oklch(0.975 0.012 95)` | teal-black `oklch(0.21 0.028 212)` |
| `--foreground` | ink `oklch(0.243 0.026 218)` | paper `oklch(0.95 0.015 110)` |
| `--card` / `--popover` | top face, near white | lifted pool, two steps above the field |
| `--muted`, `--secondary`, `--accent` | paper mixed with 3-8% ink | field lifted 4-8% |
| `--border`, `--input` | hairline, paper mixed with 12% ink | white at 10% |

Dark mode is a spotlight, not an inversion: the field is near-black with a hue, surfaces sit a few steps above it, and the page keeps a soft radial lift behind the main object (`.field-pool`).

### Palettes (the `data-theme` attribute on `<html>`)

Each palette sets `--primary`, `--primary-foreground`, `--signal` (a second, sparing accent that contrasts the primary), `--ring`, `--chart-1..5`, the scene tones used by the 3D monument, and `--field` (the saturated ground used by hero and chapter sections).

| Palette | Primary | On primary | Signal | Field |
|---|---|---|---|---|
| `sun` (default) | `oklch(0.868 0.178 92)` | ink | blue `oklch(0.488 0.156 260)` | primary |
| `ember` | `oklch(0.551 0.213 28)` | paper | straw `oklch(0.886 0.155 91)` | primary |
| `lagoon` | `oklch(0.729 0.128 185)` | ink | coral `oklch(0.738 0.162 14)` | primary |
| `dusk` | `oklch(0.446 0.157 274)` | paper | coral `oklch(0.704 0.192 37)` | indigo `oklch(0.391 0.101 279)` |
| `moss` | `oklch(0.779 0.199 153)` | ink | blossom `oklch(0.738 0.162 14)` | primary |
| `coral` | `oklch(0.738 0.162 14)` | ink | periwinkle `oklch(0.60 0.12 273)` | primary |

Rules of use:

- `--primary` is for the primary action on a view and for the current-location marker. It should cover 1-5% of the pixels of a dense page.
- `--signal` is for one secondary call-out per view at most (a badge count, a live indicator, the character in a scene). Never both accents on one component.
- Status colours (`--destructive`, success, warning, info) are tuned to the palette's chroma; they are not Tailwind defaults.
- Never put grey text on a coloured field. On a field, text is ink or paper at full strength.

### Face tones

`--face-top`, `--face-side`, `--face-shadow` give any raised element its three faces in the current mode. The scene tokens (`--scene-top`, `--scene-light`, `--scene-shadow`, `--scene-tile`, `--scene-ink`, `--scene-sun`, `--scene-lamp`, `--scene-emblem`, `--scene-accent-*`) are the greys and accents used by the 3D monument and are converted to hex at runtime.

## Shape

- `--radius: 0.25rem`. Inline controls use the `sm` and `md` steps (2.4px and 3.2px), cards use `lg` (4px), sheets and dialogs use `xl` (5.6px). Full-bleed sections have no radius.
- Circles are full circles: icon buttons in the ghost variant, avatars, the ring-and-dot control, radio buttons, switch thumbs.
- Extruded blocks ("faces") use a solid offset in `--face-shadow` on the bottom and right, 2px for controls and 4px for cards in the `block` variant. Pressing a block removes the offset and moves it down by the same amount.

## Motion

Motion is mechanical: things slide, rotate and settle like a crank reaching its stop. Stone, not rubber: nothing overshoots or bounces. A rotation takes 700ms per quarter turn on `--ease-move`; a released drag snaps to its stop on `--ease-settle`.

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | hover, press, colour, opacity |
| `--ease-move` | `cubic-bezier(0.65, 0, 0.35, 1)` | things that travel or rotate: sheets, the tabs indicator, the carousel, the monument's rotors and camera |
| `--ease-settle` | `cubic-bezier(0.22, 1, 0.36, 1)` | snapping into place after a drag; decelerates with no overshoot |
| `--ease-enter` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | overlays entering |
| `--ease-exit` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | overlays leaving |
| `--dur-1` | 120ms | hover and focus |
| `--dur-2` | 200ms | state changes inside a component |
| `--dur-3` | 320ms | overlays entering and leaving |
| `--dur-4` | 700ms | scene elements and section transitions |
| `--dur-5` | 1100ms | camera moves |

Only `transform` and `opacity` animate on the page. One choreographed entrance per page at most; after that, motion follows the pointer. Under `prefers-reduced-motion` movement is replaced by opacity, the monument stops idling, and the camera switch is instant.

## Typography

Two voices, both quiet.

- **Display (`--font-display`): Josefin Sans Variable.** A 1920s geometric with a low x-height, so tracked uppercase reads like small caps. Used for page and chapter titles at weight 200-300 with 0.16-0.22em tracking, and for labels, eyebrows and navigation at weight 500-600, 11-12px, 0.125-0.18em tracking. Display sizes are fluid (`clamp`) and get lighter as they get bigger. Never used for running text.
- **Text (`--font-sans`): Cabin Variable.** A humanist sans in the Johnston and Gill lineage, with a width axis. All body copy, component text, inputs, tables. UI runs at 14-15px, weight 400, normal tracking; prose at 16px with a 1.6 line height and a 65ch measure.
- **Code (`--font-mono`): IBM Plex Mono** at 400 and 500.

Utilities: `type-display`, `type-title`, `type-label`, `type-eyebrow`, `type-numeral`. The UI scale is a major third (12 / 14 / 15 / 18 / 22 / 28); the display tier is 32 / 48 / 64+. Body weight is 400; 500 is for labels and emphasis; nothing is bold except numerals in tables.

Chapter openers (used by the catalog groups and the landing page only): a thin Roman numeral, a short hairline, the title in `type-title`, a second hairline split by one small lowercase word, and a one-line subtitle. Everything in an opener is centred; everything else on the site is left-aligned.

## Iconography

Lucide, stroke width 1.5, sized optically to the text cap height. No icons inside tinted circles. No sparkle or wand icons. The ring-and-dot is drawn inline as SVG where it is the primary control.

## Voice

Sentence case everywhere, including buttons. Labels name the outcome ("Copy install command", not "Get started"). No filler adjectives. Chapter-style section openers (a numeral, a hairline, a title, a one-line subtitle) are reserved for the catalog groups and the landing page; they do not appear inside components.
