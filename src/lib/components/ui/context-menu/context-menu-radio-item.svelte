<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from "bits-ui";
	import { cn, type WithoutChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		inset,
		children: childrenProp,
		closeOnSelect = false,
		...restProps
	}: WithoutChild<ContextMenuPrimitive.RadioItemProps> & {
		inset?: boolean;
	} = $props();
</script>

<ContextMenuPrimitive.RadioItem
	bind:ref
	{closeOnSelect}
	data-slot="context-menu-radio-item"
	data-inset={inset}
	class={cn(
		"relative flex min-h-8 cursor-default items-center gap-2 rounded-sm pr-2 pl-8 py-1.5 text-sm outline-hidden select-none transition-colors duration-(--dur-1) ease-out focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground focus:[&_svg:not([class*='text-'])]:text-foreground data-highlighted:[&_svg:not([class*='text-'])]:text-foreground",
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		<span class="pointer-events-none absolute left-2 flex size-4 items-center justify-center" data-slot="context-menu-radio-item-indicator">
			{#if checked}
				<span class="flex size-3.5 items-center justify-center rounded-full border border-foreground"><span class="size-1.5 rounded-full bg-primary"></span></span>
			{/if}
		</span>
		{@render childrenProp?.({ checked })}
	{/snippet}
</ContextMenuPrimitive.RadioItem>
