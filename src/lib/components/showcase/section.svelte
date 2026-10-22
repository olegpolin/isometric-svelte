<script lang="ts">
	import type { Snippet } from 'svelte';

	/** A titled, deep-linkable group of demos. */
	let {
		id,
		title,
		description,
		children
	}: { id?: string; title: string; description?: string; children: Snippet } = $props();

	let slug = $derived(id ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
</script>

<section id={slug} class="flex scroll-mt-20 flex-col gap-6">
	<div class="flex max-w-2xl flex-col gap-1.5">
		<h2 class="group/heading text-foreground flex items-baseline gap-2 text-lg font-medium">
			<a
				href="#{slug}"
				class="focus-visible:focus-halo rounded-sm outline-none hover:underline hover:underline-offset-4"
			>
				{title}
			</a>
		</h2>
		{#if description}
			<p class="text-muted-foreground text-sm">{description}</p>
		{/if}
	</div>
	{@render children()}
</section>
