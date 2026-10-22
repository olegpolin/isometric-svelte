<script lang="ts">
	import { cn } from '#lib/utils.js';
	import type { Stat } from './data.js';
	import Sparkline from './sparkline.svelte';

	/**
	 * One measure: label, the number large, a one-line caption, a sparkline of the range and the
	 * change against the previous range in words. A plain tile; the hairlines come from the row.
	 */
	let { stat, class: className }: { stat: Stat; class?: string } = $props();
</script>

<div data-slot="stat-tile" class={cn('bg-background flex min-w-0 flex-col gap-3 px-4 py-5 sm:px-5', className)}>
	<h3 class="type-label text-muted-foreground">{stat.label}</h3>
	<div class="flex items-end justify-between gap-3">
		<p class="flex min-w-0 items-baseline gap-1 leading-none">
			<span class="text-foreground font-sans text-[1.75rem] tracking-tight tabular-nums">{stat.value}</span>
			{#if stat.unit}
				<span class="text-muted-foreground text-sm">{stat.unit}</span>
			{/if}
		</p>
		<Sparkline values={stat.spark} class="mb-0.5 h-7 w-20 shrink-0 xl:w-24" />
	</div>
	<div class="flex flex-col gap-1 text-xs">
		<p class="text-muted-foreground truncate">{stat.caption}</p>
		<p
			class={cn(
				'font-medium tabular-nums',
				stat.delta.tone === 'success' && 'text-success',
				stat.delta.tone === 'destructive' && 'text-destructive',
				stat.delta.tone === 'muted' && 'text-muted-foreground'
			)}
		>
			{stat.delta.text}
		</p>
	</div>
</div>
