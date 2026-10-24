# isometric-svelte

**Showcase: [isometric-svelte.vercel.app](https://isometric-svelte.vercel.app/)**

Isometric is a component library and showcase for Svelte 5, Tailwind 4 and shadcn-svelte, drawn in three tones. Every surface is a face of a solid: the top is lightest, the right-facing side is mid, the left-facing side is darkest. A page is one colour field with a little ink on it, and most of it is left empty.

It has a landing page built around an interactive WebGL monument, a catalog of 63 components in ten chapters, a desktop dashboard and a phone-framed mobile app. Light mode is the default; there is a dark mode and six palettes (sun, ember, lagoon, dusk, moss, coral) that re-tint the whole system, the monument's sun included.

## Tech Stack

- **[Svelte](https://svelte.dev)** (Svelte 5) - frontend framework
- **[SvelteKit](https://svelte.dev/docs/kit)** (SvelteKit 3) - full-stack framework
- **[Tailwind CSS](https://tailwindcss.com)** (Tailwind 4) - styling
- **[shadcn-svelte](https://shadcn-svelte.com)** - UI components (built on **[bits-ui](https://bits-ui.com)**), restyled at the source
- **[Threlte](https://threlte.xyz)** and **[three.js](https://threejs.org)** - the isometric monument on the landing page
- **[mode-watcher](https://mode-watcher.sveco.dev)** - light / dark mode and the palette attribute
- **[LayerChart](https://www.layerchart.com)** (through the shadcn-svelte Chart) - dashboard charts
- **Josefin Sans, Cabin and IBM Plex Mono** (via Fontsource) - display, text and code typefaces

## Getting Started

```sh
npm i
npm run dev
```

## Where things live

- `docs/foundation.md` is the one file every page reads from: the idea, colour roles, palettes, face tones, shape, motion, typography, icons and voice.
- `src/routes/layout.css` holds every token: the two modes, the six palettes on `data-theme`, the scene tones the WebGL monument reads, the easing curves and the type utilities.
- `src/lib/components/ui/` is the component source. It started from `shadcn-svelte add --all` and was then restyled component by component; `docs/restyle-brief.md` is the brief that was followed.
- `src/lib/scene/` is the monument: unlit three-tone geometry, grain on faces only, and a camera that collapses the isometric view into a flat elevation frame by frame as the page scrolls.
- `src/lib/components/app/` is the site shell (header with the ring-and-dot theme menu, footer, wordmark, the voxel glyph).
- `src/lib/components/showcase/` holds the Page, Section and Demo primitives the catalog is written with; `src/lib/catalog.ts` lists the chapters.
- `src/routes/(app)/` is the site: landing, `components/` (the catalog), `dashboard/`.
- `src/routes/mobile/` is the phone-framed app, with its own layout.

## Using it as a reference

Start from a normal shadcn-svelte project, then borrow what fits: the tokens in `layout.css` and `docs/foundation.md` are portable on their own, and each component folder can be copied over its shadcn-svelte counterpart.
