<script lang="ts">
	import type { Snippet } from 'svelte';
	import { BitsConfig } from 'bits-ui';
	import { cn } from '#lib/utils.js';
	import StatusBar from './status-bar.svelte';

	/**
	 * A phone on the page field from 640px up (390 × 844 screen, 12px bezel); the bare screen,
	 * full-bleed, below that. The screen is the containing block for everything fixed inside it,
	 * and every portalled layer (dialogs, sheets, drawers, menus) is sent to it through
	 * `BitsConfig`, so overlays stay inside the glass. `children` scroll; `chrome` (the tab bar,
	 * the toaster) stays put below them.
	 */
	let {
		id = 'atlas-screen',
		scroller = $bindable(null),
		label,
		children,
		chrome,
		class: className
	}: {
		id?: string;
		scroller?: HTMLElement | null;
		label: string;
		children: Snippet;
		chrome?: Snippet;
		class?: string;
	} = $props();
</script>

<div
	data-slot="phone-frame"
	class={cn(
		'w-full sm:w-auto sm:rounded-[56px] sm:border sm:border-border sm:bg-(--scene-ink) sm:p-3 sm:shadow-face-lg',
		className
	)}
>
	<div
		{id}
		role="region"
		aria-label={label}
		class="screen bg-background text-foreground relative flex h-dvh w-full flex-col overflow-clip sm:h-[844px] sm:w-[390px] sm:rounded-[44px]"
	>
		<StatusBar class="hidden sm:flex" />
		<BitsConfig defaultPortalTo="#{id}">
			<div bind:this={scroller} class="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:none]">
				{@render children()}
			</div>
			{@render chrome?.()}
		</BitsConfig>
		<span
			aria-hidden="true"
			class="bg-foreground pointer-events-none absolute bottom-2 left-1/2 hidden h-[5px] w-[134px] -translate-x-1/2 rounded-full sm:block"
		></span>
	</div>
</div>

<style>
	/* A transform makes the screen the containing block for `position: fixed` descendants, so
	   overlays, toasts and their backdrops cover the screen rather than the browser window. */
	.screen {
		transform: translateZ(0);
	}
</style>
