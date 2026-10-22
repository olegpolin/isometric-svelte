<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props();
</script>

<p
	bind:this={ref}
	data-slot="field-description"
	class={cn(
		"text-muted-foreground text-left text-[0.8125rem] [[data-variant=legend]+&]:-mt-1 leading-normal font-normal group-has-data-horizontal/field:text-balance",
		"last:mt-0 nth-last-2:-mt-1",
		"[&>a]:underline [&>a]:decoration-border [&>a]:underline-offset-4 [&>a:hover]:text-foreground [&>a:hover]:decoration-foreground",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</p>
