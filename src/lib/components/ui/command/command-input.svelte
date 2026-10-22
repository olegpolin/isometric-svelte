<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import SearchIcon from '@lucide/svelte/icons/search';
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(""),
		...restProps
	}: CommandPrimitive.InputProps = $props();
</script>

<div
	data-slot="command-input-wrapper"
	class="flex h-11 shrink-0 items-center gap-2 border-b border-border px-3"
>
	<SearchIcon class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
	<CommandPrimitive.Input
		bind:ref
		bind:value
		data-slot="command-input"
		class={cn(
			"flex h-full w-full min-w-0 bg-transparent text-sm text-foreground outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
			className
		)}
		{...restProps}
	/>
</div>
