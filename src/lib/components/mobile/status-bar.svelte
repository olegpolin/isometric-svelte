<script lang="ts">
	import { cn } from '#lib/utils.js';

	/**
	 * The phone's status bar: a fixed time and hairline glyphs for signal, network and battery.
	 * Purely decorative, so it is hidden from assistive technology.
	 */
	let { class: className }: { class?: string } = $props();
</script>

<div
	aria-hidden="true"
	data-slot="status-bar"
	class={cn('text-foreground h-12 shrink-0 items-center justify-between px-8 pt-1', className)}
>
	<span class="font-sans text-[0.9375rem] font-medium tabular-nums">9:41</span>
	<span class="flex items-center gap-1.5">
		<!-- signal: four rising hairlines -->
		<svg width="17" height="11" viewBox="0 0 17 11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
			<path d="M1.75 9.25v-1.5M6.25 9.25v-3.5M10.75 9.25v-5.5M15.25 9.25v-7.5" />
		</svg>
		<!-- network: three concentric arcs and a dot -->
		<svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round">
			<path d="M1.25 3.9a9 9 0 0 1 12.5 0M3.6 6.2a5.6 5.6 0 0 1 7.8 0M5.9 8.4a2.3 2.3 0 0 1 3.2 0" />
		</svg>
		<!-- battery: hairline case, solid charge, nub -->
		<svg width="26" height="12" viewBox="0 0 26 12" fill="none">
			<rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" stroke-opacity="0.5" />
			<rect x="2.25" y="2.25" width="15.5" height="7.5" rx="1.5" fill="currentColor" />
			<path d="M24.25 4.25v3.5" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5" stroke-linecap="round" />
		</svg>
	</span>
</div>
