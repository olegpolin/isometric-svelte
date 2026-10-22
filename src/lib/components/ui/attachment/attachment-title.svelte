<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="attachment-title"
	class={cn(
		"font-medium block max-w-full min-w-0 truncate group-data-[state=processing]/attachment:animate-breath group-data-[state=uploading]/attachment:animate-breath motion-reduce:animate-none",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
