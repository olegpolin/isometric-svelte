<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props();
</script>

<tr
	bind:this={ref}
	data-slot="table-row"
	class={cn("border-b border-border transition-colors duration-(--dur-1) ease-out hover:bg-muted/60 has-aria-expanded:bg-muted/60 aria-selected:bg-accent data-[state=selected]:bg-accent", className)}
	{...restProps}
>
	{@render children?.()}
</tr>
