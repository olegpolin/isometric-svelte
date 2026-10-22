<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import { getEmblaContext } from "./context.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const emblaCtx = getEmblaContext("<Carousel.Dots/>");
</script>

<div
	bind:this={ref}
	data-slot="carousel-dots"
	class={cn(
		"flex items-center justify-center gap-0.5",
		emblaCtx.orientation === "vertical" && "flex-col",
		className
	)}
	{...restProps}
>
	{#each emblaCtx.scrollSnaps as snap, index (snap)}
		{@const active = index === emblaCtx.selectedIndex}
		<button
			type="button"
			data-slot="carousel-dot"
			data-active={active || undefined}
			aria-label="Go to slide {index + 1}"
			aria-current={active ? "true" : undefined}
			class="group/carousel-dot grid size-5 place-items-center rounded-full outline-none focus-visible:focus-halo"
			onclick={() => emblaCtx.scrollTo(index)}
		>
			<span
				class="border-muted-foreground group-hover/carousel-dot:border-foreground group-data-active/carousel-dot:border-foreground group-data-active/carousel-dot:bg-foreground size-2 rounded-full border transition-[background-color,border-color] duration-(--dur-2) ease-out"
			></span>
		</button>
	{/each}
</div>
