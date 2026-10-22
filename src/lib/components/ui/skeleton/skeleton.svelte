<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="skeleton"
	class={cn("skeleton-breath rounded-md bg-muted", className)}
	{...restProps}
></div>

<style>
	/* a slow breath rather than a pulse */
	.skeleton-breath {
		animation: skeleton-breath 1.8s ease-in-out infinite;
	}
	@keyframes skeleton-breath {
		50% {
			opacity: 0.5;
		}
	}
</style>
