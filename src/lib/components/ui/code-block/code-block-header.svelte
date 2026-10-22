<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="code-block-header"
	class={cn(
		"gap-2 h-10 px-3 border-b border-border text-muted-foreground group-data-[variant=destructive]/code-block:text-destructive group-data-[variant=destructive]/code-block:border-destructive group-data-[size=sm]/code-block:h-8 group-data-[size=sm]/code-block:px-2.5 flex min-w-0 shrink-0 items-center *:has-[>[data-slot=code-block-title]]:min-w-0",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
