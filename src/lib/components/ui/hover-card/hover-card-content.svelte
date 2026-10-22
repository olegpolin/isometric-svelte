<script lang="ts">
	import { LinkPreview as HoverCardPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";
	import HoverCardPortal from "./hover-card-portal.svelte";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		side = "bottom",
		sideOffset = 4,
		align = "center",
		portalProps,
		...restProps
	}: HoverCardPrimitive.ContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof HoverCardPortal>>;
	} = $props();
</script>

<HoverCardPortal {...portalProps}>
	<HoverCardPrimitive.Content
		bind:ref
		data-slot="hover-card-content"
		{side}
		{sideOffset}
		{align}
		class={cn(
			"bg-popover text-popover-foreground border border-border rounded-lg shadow-float z-50 w-64 p-3 text-sm outline-hidden origin-(--bits-link-preview-content-transform-origin) data-open:animate-in data-open:fade-in-0 data-open:duration-(--dur-3) data-open:ease-enter data-closed:animate-out data-closed:fade-out-0 data-closed:duration-(--dur-2) data-closed:ease-exit data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-closed:data-[side=bottom]:slide-out-to-top-1 data-closed:data-[side=top]:slide-out-to-bottom-1 data-closed:data-[side=left]:slide-out-to-right-1 data-closed:data-[side=right]:slide-out-to-left-1",
			className
		)}
		{...restProps}
	/>
</HoverCardPortal>
