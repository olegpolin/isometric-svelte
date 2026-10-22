<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import { buttonVariants, type ButtonSize } from "#lib/components/ui/button/index.js";
	import { cn } from "#lib/utils.js";
	let {
		ref = $bindable(null),
		class: className,
		size = "icon",
		isActive,
		page,
		children,
		...restProps
	}: PaginationPrimitive.PageProps & {
		size?: ButtonSize;
		isActive: boolean;
	} = $props();
</script>

{#snippet Fallback()}
	{page.value}
{/snippet}

<PaginationPrimitive.Page
	bind:ref
	{page}
	aria-current={isActive ? "page" : undefined}
	data-slot="pagination-link"
	data-active={isActive}
	data-size={size}
	class={cn(
		buttonVariants({ size, variant: "ghost" }),
		"tabular-nums text-muted-foreground hover:text-foreground data-active:border-border data-active:bg-face-top data-active:text-foreground data-active:shadow-face-sm data-active:hover:bg-face-top data-active:active:translate-y-0.5 data-active:active:shadow-none",
		className
	)}
	{...restProps}
>
	{#if children}
		{@render children?.()}
	{:else}
		{@render Fallback()}
	{/if}
</PaginationPrimitive.Page>
