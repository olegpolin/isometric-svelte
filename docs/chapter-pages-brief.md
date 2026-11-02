# Chapter pages brief

Each catalog chapter is a route at `src/routes/(app)/components/<slug>/+page.svelte`, built from the showcase primitives in `src/lib/components/showcase/` and the chapter data in `src/lib/catalog.ts`. The foundations chapter (`/components/foundations`) is the reference implementation: read it first.

## Skeleton

```svelte
<script lang="ts">
	import { Page, Section, Demo } from '#lib/components/showcase/index.js';
	import { chapterBySlug } from '#lib/catalog.js';
	const chapter = chapterBySlug('actions')!;
</script>

<svelte:head>
	<title>{chapter.title} · Isometric</title>
	<meta name="description" content="..." />
</svelte:head>

<Page title={chapter.title} description={chapter.subtitle} chapter={{ numeral: chapter.numeral, connective: chapter.connective }}>
	<Section title="Button" description="One sentence on what it is for.">
		<Demo label="Variants" spec="default · secondary · outline · ghost · link · destructive · block" code={`<Button>Save changes</Button>`}>
			...
		</Demo>
	</Section>
</Page>
```

- One `Section` per component, in the order the chapter's `items` list them. The section title is the component name; the description says what it is for in one sentence, and when not to use it if that is useful ("For a yes/no setting use Switch").
- Inside a section, one `Demo` per concept, in this order where it applies: default, variants in a row, sizes in a row, states (disabled, invalid, loading, selected), composition (with icon, in a form, as a link, in a group), edge cases (long label, empty). Four to eight demos per component is typical; the simplest components (Separator, Label, Kbd) need two or three.
- `Demo` props: `label` (short, sentence case), `spec` (the values shown, separated by " · "), `code` (the exact Svelte for the first thing in the canvas, as a template literal; the lead wants the code to be what is rendered, so write the markup once as a string and keep the live markup identical), `align` (`center` default; `start` for forms and lists; `stretch` for tables and full-width things), `canvas` (`paper` default; `field` to show something on the colour field; `plain` for cards so they sit on the page tone).
- Overlays (dialogs, sheets, drawers, menus, popovers, tooltips, toasts) are demonstrated with a trigger button in the canvas. Open each one once while verifying.
- Interactive demos keep their own `$state` in the page script: switches that toggle, sliders with a live value, a form that validates on submit, a table with sortable columns if the component supports it. Nothing is a static screenshot of a component.

## Content

- Real, domain-consistent content. The site's running fiction is a static-site host whose project is called Observatory, with regions Frankfurt, San Francisco, Singapore and São Paulo, branches like `main`, `stairs/landing`, `rotor/snap`, and a sculpture-park guide app called Atlas. Use people's names that are plausible and not famous. Use measured-looking numbers (1,284,903; 38.4 GB; 0.21%).
- Labels name the outcome: "Save changes", "Copy install command", "Invite to team", never "Submit", "Get started", "Learn more", "Click here".
- Sentence case everywhere. No emoji. No filler adjectives (seamless, powerful, intuitive, beautiful). No "Not X, but Y". No em dashes in copy.
- Icons from `@lucide/svelte/icons/<name>`, passed as components, with `data-icon="inline-start"`/`inline-end` inside buttons; no sizing classes on icons inside components.

## Style rules in demos

- Use the components' own variants and props. The only classes you add are layout (`flex`, `gap-*`, `w-*`, `max-w-*`); never override a component's colours or typography from the page.
- Use semantic tokens if you must colour something (`text-muted-foreground`, `bg-muted`); never raw palette shades or hex.
- Forms use `Field.FieldGroup` + `Field.Field` + `Field.FieldLabel`; option sets use `ToggleGroup` or `RadioGroup`; loading buttons compose `Spinner` with `disabled`.

## Verification (required)

Start `npm run dev` and open the page in the browser. Check at desktop width and at 390 px. Check light and dark mode and at least two palettes, switched from the theme menu. Open every overlay once. Read console errors. Run `npx @sveltejs/mcp svelte-autofixer` on the page and `npm run check`; fix every error in your files. Do not commit.
