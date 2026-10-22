<script lang="ts" module>
	import { tv } from "tailwind-variants";
	import { cn } from "#lib/utils.js";

	export const navigationMenuTriggerStyle = tv({
		base: "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center gap-1 rounded-md px-3 text-sm text-muted-foreground outline-none transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-(--dur-1) ease-out hover:bg-accent hover:text-foreground focus-visible:focus-halo data-open:bg-accent data-open:text-foreground disabled:pointer-events-none disabled:opacity-50",
	});
</script>

<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: NavigationMenuPrimitive.TriggerProps = $props();
</script>

<NavigationMenuPrimitive.Trigger
	bind:ref
	data-slot="navigation-menu-trigger"
	class={cn(navigationMenuTriggerStyle(), "group", className)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDownIcon class="relative top-px size-3.5 transition-transform duration-(--dur-2) ease-move group-data-open/navigation-menu-trigger:rotate-180" aria-hidden="true" />
</NavigationMenuPrimitive.Trigger>
