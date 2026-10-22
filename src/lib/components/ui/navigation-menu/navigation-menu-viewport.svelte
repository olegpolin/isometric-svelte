<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuPrimitive.ViewportProps = $props();
</script>

<div
	class={cn(
		"absolute start-0 top-full isolate z-50 flex justify-center"
	)}
>
	<NavigationMenuPrimitive.Viewport
		bind:ref
		data-slot="navigation-menu-viewport"
		class={cn(
			"bg-popover text-popover-foreground border border-border rounded-lg shadow-float relative mt-1.5 w-full overflow-hidden origin-top transition-[width,height] duration-(--dur-3) ease-move data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-1 data-open:ease-enter data-closed:animate-out data-closed:fade-out-0 data-closed:ease-exit",
			"h-[calc(var(--bits-navigation-menu-viewport-height)+0.75rem)] md:w-[calc(var(--bits-navigation-menu-viewport-width)+0.75rem)]",
			className
		)}
		{...restProps}
	/>
</div>
