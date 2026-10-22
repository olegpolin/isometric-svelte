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
	data-slot="code-block-footer"
	class={cn("gap-2 h-9 px-3 border-t border-border text-xs text-muted-foreground group-data-[variant=destructive]/code-block:border-destructive group-data-[size=sm]/code-block:h-8 group-data-[size=sm]/code-block:px-2.5 flex min-w-0 shrink-0 items-center", className)}
	{...restProps}
>
	{@render children?.()}
</div>
