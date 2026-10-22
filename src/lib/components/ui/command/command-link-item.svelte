<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CommandPrimitive.LinkItemProps = $props();
</script>


<CommandPrimitive.LinkItem
	bind:ref
	data-slot="command-item"
	class={cn(
		"relative flex min-h-8 cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none transition-colors duration-(--dur-1) ease-out data-selected:bg-accent data-selected:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-selected:[&_svg:not([class*='text-'])]:text-foreground group/command-item",
		"data-disabled:pointer-events-none data-disabled:opacity-50",
		className
	)}
	{...restProps}
/>
