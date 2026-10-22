<script lang="ts">
	import { ScrollArea as ScrollAreaPrimitive } from "bits-ui";
	import { cn, type WithoutChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		orientation = "vertical",
		children,
		...restProps
	}: WithoutChild<ScrollAreaPrimitive.ScrollbarProps> = $props();
</script>

<ScrollAreaPrimitive.Scrollbar
	bind:ref
	data-slot="scroll-area-scrollbar"
	data-orientation={orientation}
	{orientation}
	class={cn(
		"data-horizontal:h-2 data-horizontal:flex-col data-vertical:h-full data-vertical:w-2 flex touch-none p-px select-none",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ScrollAreaPrimitive.Thumb
		data-slot="scroll-area-thumb"
		class="bg-border hover:bg-muted-foreground active:bg-muted-foreground relative flex-1 rounded-full transition-colors duration-(--dur-1) ease-out"
	/>
</ScrollAreaPrimitive.Scrollbar>
