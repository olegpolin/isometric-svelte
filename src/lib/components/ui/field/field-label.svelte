<script lang="ts">
	import { Label } from "#lib/components/ui/label/index.js";
	import { cn } from "#lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof Label> = $props();
</script>

<Label
	bind:ref
	data-slot="field-label"
	class={cn(
		"gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:bg-card has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border has-[>[data-slot=field]]:border-border transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-(--dur-1) ease-out has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-accent has-[>[data-slot=field]]:has-data-checked:border-ring has-[>[data-slot=field]]:has-data-checked:bg-[color-mix(in_oklab,var(--primary)_8%,var(--card))] has-[>[data-slot=field]]:has-[:focus-visible]:focus-halo *:data-[slot=field]:p-3 group/field-label peer/field-label flex w-fit",
		"has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</Label>
