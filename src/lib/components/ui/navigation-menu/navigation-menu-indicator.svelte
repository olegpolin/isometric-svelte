<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuPrimitive.IndicatorProps = $props();
</script>

<NavigationMenuPrimitive.Indicator
	bind:ref
	data-slot="navigation-menu-indicator"
	class={cn(
		"top-full z-1 flex h-2 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=visible]:fade-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out duration-(--dur-2) ease-out",
		className
	)}
	{...restProps}
>
	<div class="relative top-px size-1.5 rounded-full bg-foreground"></div>
</NavigationMenuPrimitive.Indicator>
