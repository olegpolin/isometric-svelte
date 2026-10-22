<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';

	/**
	 * One Atlas screen: an eyebrow and a title, an optional trailing action, then the content in a
	 * single column with the space between groups doing the grouping.
	 */
	let {
		eyebrow,
		title,
		action,
		children,
		class: className
	}: {
		eyebrow: string;
		title: string;
		action?: Snippet;
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div
	data-slot="atlas-screen"
	class={cn('flex flex-col gap-8 px-5 pt-4 pb-10 max-sm:pt-[max(1.5rem,env(safe-area-inset-top))]', className)}
>
	<header class="flex items-end justify-between gap-4">
		<div class="flex min-w-0 flex-col gap-2.5">
			<p class="type-eyebrow text-muted-foreground">{eyebrow}</p>
			<h1 class="type-title text-2xl">{title}</h1>
		</div>
		{@render action?.()}
	</header>
	{@render children()}
</div>
