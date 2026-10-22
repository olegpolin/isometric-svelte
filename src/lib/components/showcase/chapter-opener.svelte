<script lang="ts">
	import { cn } from '#lib/utils.js';

	/**
	 * A chapter opener: numeral, hairline, title, a second hairline split by one small word, and a
	 * one-line subtitle. Centred; the only centred text on the site. `tone="field"` sets it on a
	 * colour field (foreground follows `--field-foreground`).
	 */
	let {
		numeral,
		title,
		connective = 'in which',
		subtitle,
		tone = 'paper',
		class: className
	}: {
		numeral: string;
		title: string;
		connective?: string;
		subtitle?: string;
		tone?: 'paper' | 'field';
		class?: string;
	} = $props();
</script>

<header
	data-slot="chapter-opener"
	class={cn(
		'flex flex-col items-center gap-4 text-center',
		tone === 'field' ? 'text-field-foreground' : 'text-foreground',
		className
	)}
>
	<span class="type-numeral text-xl opacity-80">{numeral}</span>
	<span class="hairline w-20" aria-hidden="true"></span>
	<h1 class="type-title text-3xl sm:text-4xl lg:text-5xl">{title}</h1>
	{#if subtitle}
		<div class="flex w-full max-w-xs items-center gap-3" aria-hidden="true">
			<span class="hairline flex-1"></span>
			<span class="font-sans text-sm lowercase opacity-80">{connective}</span>
			<span class="hairline flex-1"></span>
		</div>
		<p class="type-title max-w-[40ch] text-sm font-normal tracking-[0.12em] opacity-90 sm:text-base">
			{subtitle}
		</p>
	{/if}
</header>
