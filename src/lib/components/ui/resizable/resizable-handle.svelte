<script lang="ts">
	import * as ResizablePrimitive from "paneforge";
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		withHandle = false,
		...restProps
	}: WithoutChildrenOrChild<ResizablePrimitive.PaneResizerProps> & {
		withHandle?: boolean;
	} = $props();
</script>

<ResizablePrimitive.PaneResizer
	bind:ref
	data-slot="resizable-handle"
	class={cn(
		"group/resizable-handle relative flex w-px items-center justify-center bg-border transition-colors duration-(--dur-1) ease-out outline-none after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2 hover:bg-ring focus-visible:bg-ring focus-visible:focus-halo data-active:bg-ring data-[direction=vertical]:h-px data-[direction=vertical]:w-full data-[direction=vertical]:after:left-0 data-[direction=vertical]:after:h-2 data-[direction=vertical]:after:w-full data-[direction=vertical]:after:translate-x-0 data-[direction=vertical]:after:-translate-y-1/2 [&[data-direction=vertical]>div]:rotate-90",
		className
	)}
	{...restProps}
>
	{#if withHandle}
		<div
			data-slot="resizable-handle-grip"
			class="bg-muted-foreground group-hover/resizable-handle:bg-ring group-data-active/resizable-handle:bg-ring z-10 flex h-4 w-0.5 shrink-0 rounded-full transition-colors duration-(--dur-1) ease-out"
		></div>
	{/if}
</ResizablePrimitive.PaneResizer>
