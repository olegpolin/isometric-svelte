<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuPrimitive.LinkProps = $props();
</script>

<NavigationMenuPrimitive.Link
	bind:ref
	data-slot="navigation-menu-link"
	class={cn("flex items-center gap-2 rounded-md p-2 text-sm text-muted-foreground outline-none transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-(--dur-1) ease-out hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground focus-visible:focus-halo data-active:text-foreground in-data-[slot=navigation-menu-content]:rounded-sm in-data-[slot=navigation-menu-content]:text-foreground [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground", className)}
	{...restProps}
/>
