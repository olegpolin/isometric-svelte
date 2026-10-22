<script lang="ts">
	import { Progress as ProgressPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		max = 100,
		value,
		...restProps
	}: WithoutChildrenOrChild<ProgressPrimitive.RootProps> = $props();

	const percent = $derived(value == null ? 0 : (100 * value) / (max || 1));
</script>

<ProgressPrimitive.Root
	bind:ref
	data-slot="progress"
	class={cn("relative flex h-1.5 w-full items-center overflow-hidden rounded-full bg-muted", className)}
	{value}
	{max}
	{...restProps}
>
	{#if value === null}
		<div data-slot="progress-indicator" class="progress-sweep h-full w-[30%] rounded-full bg-primary"></div>
	{:else}
		<div
			data-slot="progress-indicator"
			class="size-full flex-1 rounded-full bg-primary transition-transform duration-(--dur-4) ease-move"
			style:transform="translateX(-{100 - percent}%)"
		></div>
	{/if}
</ProgressPrimitive.Root>

<style>
	/* indeterminate: a 30% segment travelling end to end and back */
	.progress-sweep {
		animation: progress-sweep 1.4s var(--ease-move) infinite alternate;
	}
	@keyframes progress-sweep {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(233.34%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.progress-sweep {
			width: 100%;
			animation: progress-breath 1.8s ease-in-out infinite;
		}
	}
	@keyframes progress-breath {
		50% {
			opacity: 0.4;
		}
	}
</style>
