<script lang="ts">
	import { IsoGlyph } from '#lib/components/app/index.js';
	import { CHAPTERS, CHAPTER_GLYPHS } from '#lib/catalog.js';
</script>

<section aria-labelledby="chapters-title" class="flex flex-col gap-8">
	<div class="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 sm:px-6 lg:px-10">
		<span class="type-numeral text-muted-foreground text-lg">III</span>
		<div class="flex flex-wrap items-end justify-between gap-4">
			<h2 id="chapters-title" class="type-title text-2xl sm:text-3xl">Ten chapters</h2>
			<a
				href="/components"
				class="type-label text-muted-foreground hover:text-foreground focus-visible:focus-halo rounded-sm py-1 outline-none"
			>
				All components
			</a>
		</div>
	</div>

	<ol class="border-border flex snap-x gap-px overflow-x-auto border-y bg-border no-scrollbar">
		{#each CHAPTERS as c (c.slug)}
			<li class="w-[11.5rem] shrink-0 snap-start sm:w-[14rem]">
				<a
					href="/components/{c.slug}"
					class="group/ch bg-background hover:bg-muted/70 focus-visible:focus-halo relative flex aspect-square flex-col justify-between p-5 outline-none transition-colors duration-(--dur-1) ease-out"
				>
					<span class="flex items-start justify-between">
						<span class="type-numeral text-muted-foreground group-hover/ch:text-foreground text-base transition-colors">{c.numeral}</span>
						<span class="bg-primary size-1.5 scale-0 rounded-full transition-transform duration-(--dur-2) ease-settle group-hover/ch:scale-100"></span>
					</span>
					<span class="flex justify-center">
						<IsoGlyph cells={CHAPTER_GLYPHS[c.slug]} size={56} />
					</span>
					<span class="flex flex-col gap-1">
						<span class="type-title text-foreground text-sm">{c.title}</span>
						<span class="text-muted-foreground text-xs">{c.items.length} {c.slug === 'foundations' ? 'topics' : 'components'}</span>
					</span>
				</a>
			</li>
		{/each}
	</ol>
</section>
