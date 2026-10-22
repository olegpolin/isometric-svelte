<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";
	import type { WithoutChildrenOrChild } from "#lib/utils.js";
	import ContextMenuPortal from "./context-menu-portal.svelte";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		portalProps,
		class: className,
		...restProps
	}: ContextMenuPrimitive.ContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof ContextMenuPortal>>;
	} = $props();
</script>

<ContextMenuPortal {...portalProps}>
	<ContextMenuPrimitive.Content
		bind:ref
		data-slot="context-menu-content"
		class={cn(
			"bg-popover text-popover-foreground border border-border rounded-lg shadow-float p-1 min-w-36 z-50 max-h-(--bits-context-menu-content-available-height) origin-(--bits-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto [scrollbar-width:thin] data-open:animate-in data-open:fade-in-0 data-open:duration-(--dur-3) data-open:ease-enter data-closed:animate-out data-closed:fade-out-0 data-closed:duration-(--dur-2) data-closed:ease-exit data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-closed:data-[side=bottom]:slide-out-to-top-1 data-closed:data-[side=top]:slide-out-to-bottom-1 data-closed:data-[side=left]:slide-out-to-right-1 data-closed:data-[side=right]:slide-out-to-left-1",
			className
		)}
		{...restProps}
	/>
</ContextMenuPortal>
