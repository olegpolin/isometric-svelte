<script lang="ts">
	import * as Collapsible from "#lib/components/ui/collapsible/index.js";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import { cn, type WithoutChild } from "#lib/utils.js";
	import TraceIcon from "./trace-icon.svelte";
	import type { Collapsible as CollapsiblePrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChild<CollapsiblePrimitive.TriggerProps> = $props();
</script>

<Collapsible.Trigger
	bind:ref
	data-slot="trace-collapsible-trigger"
	class={cn(
		"gap-1 rounded-sm focus-visible:focus-halo group/trace-collapsible-trigger flex w-fit max-w-full min-w-0 cursor-pointer items-center text-left text-muted-foreground transition-colors duration-(--dur-1) ease-out outline-none hover:text-foreground has-[[data-status=error]]:text-destructive",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<TraceIcon class="transition-transform duration-(--dur-2) ease-move group-aria-expanded/trace-collapsible-trigger:rotate-90 motion-reduce:transition-none">
		<ChevronRightIcon />
	</TraceIcon>
</Collapsible.Trigger>
