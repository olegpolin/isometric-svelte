<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		inset,
		class: className,
		...restProps
	}: ComponentProps<typeof MenubarPrimitive.GroupHeading> & {
		inset?: boolean;
	} = $props();
</script>

<MenubarPrimitive.GroupHeading
	bind:ref
	data-slot="menubar-group-heading"
	data-inset={inset}
	class={cn("type-label text-muted-foreground px-2 pt-2.5 pb-1.5 data-inset:pl-8", className)}
	{...restProps}
/>
