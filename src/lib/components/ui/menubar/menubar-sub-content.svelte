<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";
	import MenubarPortal from "./menubar-portal.svelte";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		align = "start",
		alignOffset = -3,
		portalProps,
		...restProps
	}: MenubarPrimitive.SubContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof MenubarPortal>>;
	} = $props();
</script>

<MenubarPortal {...portalProps}>
	<MenubarPrimitive.SubContent
		bind:ref
		data-slot="menubar-sub-content"
		{align}
		{alignOffset}
		class={cn(
			"bg-popover text-popover-foreground border border-border rounded-lg shadow-float p-1 min-w-36 z-50 origin-(--bits-menubar-content-transform-origin) overflow-hidden data-open:animate-in data-open:fade-in-0 data-open:duration-(--dur-3) data-open:ease-enter data-closed:animate-out data-closed:fade-out-0 data-closed:duration-(--dur-2) data-closed:ease-exit data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-closed:data-[side=bottom]:slide-out-to-top-1 data-closed:data-[side=top]:slide-out-to-bottom-1 data-closed:data-[side=left]:slide-out-to-right-1 data-closed:data-[side=right]:slide-out-to-left-1",
			className
		)}
		{...restProps}
	/>
</MenubarPortal>
