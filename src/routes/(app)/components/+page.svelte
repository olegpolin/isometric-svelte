<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { IsoGlyph } from '#lib/components/app/index.js';
	import { CHAPTERS, CHAPTER_GLYPHS, COMPONENT_COUNT } from '#lib/catalog.js';
</script>

<svelte:head>
	<title>Components · Isometric</title>
	<meta
		name="description"
		content="Every component in Isometric, arranged in ten chapters: foundations, actions, inputs, selection, navigation, feedback, overlays, display, layout and conversation."
	/>
</svelte:head>

<div class="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 lg:py-14">
	<header class="flex max-w-2xl flex-col gap-3">
		<h1 class="type-title text-2xl sm:text-3xl">Components</h1>
		<p class="text-muted-foreground text-base">
			{COMPONENT_COUNT} components in {CHAPTERS.length - 1} chapters, plus the foundations they are
			built from. Every demo is live and follows the palette and mode you set in the ring menu.
		</p>
	</header>

	<ol class="border-border flex flex-col border-t">
		{#each CHAPTERS as chapter (chapter.slug)}
			<li class="border-border border-b">
				<a
					href="/components/{chapter.slug}"
					class="group/row focus-visible:focus-halo -mx-3 flex items-center gap-5 rounded-md px-3 py-5 outline-none transition-colors duration-(--dur-1) ease-out hover:bg-muted/60 sm:gap-8 sm:py-6"
				>
					<span class="type-numeral text-muted-foreground group-hover/row:text-foreground w-8 shrink-0 text-lg transition-colors">
						{chapter.numeral}
					</span>
					<span class="flex w-14 shrink-0 justify-center sm:w-16">
						<IsoGlyph cells={CHAPTER_GLYPHS[chapter.slug]} size={44} />
					</span>
					<span class="flex min-w-0 flex-1 flex-col gap-1.5">
						<span class="flex items-baseline gap-3">
							<span class="type-title text-foreground text-base sm:text-lg">{chapter.title}</span>
							<span class="text-muted-foreground hidden text-sm sm:inline">{chapter.connective} {chapter.subtitle}</span>
						</span>
						<span class="text-muted-foreground truncate text-sm">
							{chapter.items.join(' · ')}
						</span>
					</span>
					<span
						aria-hidden="true"
						class="text-muted-foreground group-hover/row:text-foreground flex size-8 shrink-0 items-center justify-center rounded-full transition-[color,transform] duration-(--dur-2) ease-settle group-hover/row:translate-x-1"
					>
						<ArrowRightIcon class="size-4" />
					</span>
				</a>
			</li>
		{/each}
	</ol>
</div>
