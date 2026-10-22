<script lang="ts">
	import { cn } from '#lib/utils.js';

	/**
	 * The mark: a cube seen from the isometric corner, its three faces in the three face tones,
	 * followed by the tracked wordmark. `compact` hides the word.
	 */
	let { compact = false, class: className }: { compact?: boolean; class?: string } = $props();
</script>

<span class={cn('inline-flex items-center gap-2.5', className)}>
	<svg width="22" height="24" viewBox="0 0 22 24" aria-hidden="true" class="shrink-0">
		<path d="M11 1 21 6.75v11.5L11 24 1 18.25V6.75Z" fill="var(--scene-shadow)" />
		<path d="M11 1 21 6.75 11 12.5 1 6.75Z" fill="var(--scene-top)" />
		<path d="M11 12.5 21 6.75v11.5L11 24Z" fill="var(--scene-light)" />
	</svg>
	{#if !compact}
		<span class="type-label text-foreground text-[0.8125rem] tracking-[0.22em]">Isometric</span>
	{/if}
</span>
