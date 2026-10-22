<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const emptyMediaVariants = tv({
		base: "relative mb-1 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
		variants: {
			variant: {
				default: "size-20 text-muted-foreground [&_svg:not([class*='size-'])]:size-5",
				icon: "size-10 rounded-lg border border-border bg-face-top text-foreground shadow-face-sm [&_svg:not([class*='size-'])]:size-5",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type EmptyMediaVariant = VariantProps<typeof emptyMediaVariants>["variant"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		variant = "default",
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { variant?: EmptyMediaVariant } = $props();
</script>

<div
	bind:this={ref}
	data-slot="empty-icon"
	data-variant={variant}
	class={cn(emptyMediaVariants({ variant }), className)}
	{...restProps}
>
	{#if variant === "default"}
		<svg
			data-slot="empty-rings"
			class="absolute inset-0 size-full text-border"
			viewBox="0 0 80 80"
			fill="none"
			aria-hidden="true"
		>
			{#each [13, 26, 39] as r (r)}
				<circle cx="40" cy="40" {r} stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke" />
			{/each}
		</svg>
	{/if}
	{#if children}
		<span class="relative flex items-center justify-center">{@render children()}</span>
	{/if}
</div>
