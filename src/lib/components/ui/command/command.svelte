<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	export type CommandRootApi = CommandPrimitive.Root;

	let {
		api = $bindable(null),
		ref = $bindable(null),
		value = $bindable(""),
		class: className,
		...restProps
	}: CommandPrimitive.RootProps & {
		api?: CommandRootApi | null;
	} = $props();
</script>

<CommandPrimitive.Root
	bind:this={api}
	bind:value
	bind:ref
	data-slot="command"
	class={cn("flex size-full flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground in-data-[slot=popover-content]:border-0 in-data-[slot=dialog-content]:rounded-none in-data-[slot=dialog-content]:border-0", className)}
	{...restProps}
/>
