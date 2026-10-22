<script lang="ts">
	import { cn } from "#lib/utils.js";
	import type { SVGAttributes } from "svelte/elements";

	let {
		class: className,
		role = "status",
		"aria-label": ariaLabel = "Loading",
		...restProps
	}: SVGAttributes<SVGSVGElement> = $props();
</script>

<!-- A hairline ring with one dot travelling around it. Size with size-*; colour follows currentColor. -->
<svg
	data-slot="spinner"
	{role}
	aria-label={ariaLabel}
	viewBox="0 0 16 16"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={cn("size-4 shrink-0", className)}
	{...restProps}
>
	<circle
		cx="8"
		cy="8"
		r="6"
		stroke="currentColor"
		stroke-width="1"
		stroke-opacity="0.3"
		vector-effect="non-scaling-stroke"
	/>
	<circle
		class="spinner-dot"
		cx="8"
		cy="8"
		r="6"
		stroke="currentColor"
		stroke-width="3"
		stroke-linecap="round"
		stroke-dasharray="0.001 100"
	/>
</svg>

<style>
	/* one turn per cycle, eased like a crank reaching its stop */
	.spinner-dot {
		transform-box: view-box;
		transform-origin: center;
		animation: spinner-turn 1.1s var(--ease-move) infinite;
	}
	@keyframes spinner-turn {
		to {
			transform: rotate(1turn);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.spinner-dot {
			animation: spinner-breath 1.8s ease-in-out infinite;
		}
	}
	@keyframes spinner-breath {
		50% {
			opacity: 0.3;
		}
	}
</style>
