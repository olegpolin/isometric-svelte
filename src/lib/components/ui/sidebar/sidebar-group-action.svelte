<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		child,
		...restProps
	}: WithElementRef<HTMLButtonAttributes> & {
		child?: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();

	const mergedProps = $derived({
		class: cn(
			"absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-sm p-0 text-muted-foreground outline-hidden transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-(--dur-1) ease-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:focus-halo group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
			className
		),
		"data-slot": "sidebar-group-action",
		"data-sidebar": "group-action",
		...restProps,
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button bind:this={ref} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
