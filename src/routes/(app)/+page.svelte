<script lang="ts">
	import { Hero, Palettes, Chapters, InUse } from '#lib/components/landing/index.js';
</script>

<svelte:head>
	<title>Isometric</title>
	<meta
		name="description"
		content="Isometric: a component library and showcase for Svelte 5, Tailwind 4 and shadcn-svelte, drawn in three tones with one colour per view."
	/>
</svelte:head>

<div class="flex flex-col">
	<Hero />
	<div class="flex flex-col gap-20 py-16 lg:gap-28 lg:py-24">
		<Palettes />
		<Chapters />
	</div>
	<InUse />
</div>
