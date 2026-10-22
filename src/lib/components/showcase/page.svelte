<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';
	import ChapterOpener from './chapter-opener.svelte';

	/**
	 * A showcase page. With `chapter` it opens with a centred chapter opener on a colour field;
	 * otherwise with a left-aligned title and description.
	 */
	let {
		title,
		description,
		chapter,
		width = 'default',
		children
	}: {
		title: string;
		description?: string;
		chapter?: { numeral: string; connective?: string };
		width?: 'default' | 'wide';
		children: Snippet;
	} = $props();
</script>

{#if chapter}
	<div class="bg-field text-field-foreground">
		<div class="mx-auto flex w-full max-w-5xl flex-col px-4 py-16 sm:px-6 lg:py-24">
			<ChapterOpener
				numeral={chapter.numeral}
				connective={chapter.connective}
				{title}
				subtitle={description}
				tone="field"
			/>
		</div>
	</div>
{/if}

<div
	class={cn(
		'mx-auto flex w-full flex-col gap-14 px-4 py-10 sm:px-6 lg:gap-20 lg:py-14',
		width === 'wide' ? 'max-w-[1440px] lg:px-10' : 'max-w-5xl'
	)}
>
	{#if !chapter}
		<header class="flex max-w-2xl flex-col gap-3">
			<h1 class="type-title text-2xl sm:text-3xl">{title}</h1>
			{#if description}
				<p class="text-muted-foreground text-base">{description}</p>
			{/if}
		</header>
	{/if}
	{@render children()}
</div>
