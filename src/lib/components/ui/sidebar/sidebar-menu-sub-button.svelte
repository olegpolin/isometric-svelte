<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { Snippet } from "svelte";
	import type { HTMLAnchorAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		children,
		child,
		class: className,
		size = "md",
		isActive = false,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		child?: Snippet<[{ props: Record<string, unknown> }]>;
		size?: "sm" | "md";
		isActive?: boolean;
	} = $props();

	const mergedProps = $derived({
		class: cn(
			"relative flex h-7 min-w-0 -translate-x-px items-center gap-2 rounded-sm px-2 text-muted-foreground outline-hidden transition-[color,background-color,box-shadow] duration-(--dur-1) ease-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:focus-halo active:bg-sidebar-accent data-active:font-medium data-active:text-foreground data-[size=md]:text-sm data-[size=sm]:text-xs group-data-[collapsible=icon]:hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground before:pointer-events-none before:absolute before:-start-[12.5px] before:top-1/2 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-primary before:scale-0 before:transition-transform before:duration-(--dur-2) before:ease-move data-active:before:scale-100",
			className
		),
		"data-slot": "sidebar-menu-sub-button",
		"data-sidebar": "menu-sub-button",
		"data-size": size,
		"data-active": isActive,
		...restProps,
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<a bind:this={ref} {...mergedProps}>
		{@render children?.()}
	</a>
{/if}
