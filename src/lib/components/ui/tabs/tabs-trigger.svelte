<script lang="ts" module>
	import { tv } from "tailwind-variants";

	export const tabsTriggerVariants = tv({
		base: "relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-muted-foreground outline-none transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-(--dur-1) ease-out hover:text-foreground data-active:text-foreground focus-visible:focus-halo disabled:pointer-events-none disabled:opacity-50 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		variants: {
			variant: {
				line: "type-label h-9 px-0.5 group-data-vertical/tabs:h-8 group-data-vertical/tabs:px-3 after:pointer-events-none after:absolute after:bg-primary after:transition-transform after:duration-(--dur-2) after:ease-move group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:-bottom-px group-data-horizontal/tabs:after:h-0.5 group-data-horizontal/tabs:after:scale-x-0 group-data-horizontal/tabs:data-active:after:scale-x-100 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-start-px group-data-vertical/tabs:after:w-0.5 group-data-vertical/tabs:after:scale-y-0 group-data-vertical/tabs:data-active:after:scale-y-100",
				segment: "h-7 flex-1 group-data-vertical/tabs:flex-none rounded-sm px-2.5 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 data-active:bg-face-top data-active:shadow-face-sm",
			},
		},
		defaultVariants: {
			variant: "line",
		},
	});
</script>

<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";
	import { getTabsVariant, hasTabsVariant } from "./context.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: TabsPrimitive.TriggerProps = $props();

	const readVariant = hasTabsVariant() ? getTabsVariant() : () => "line" as const;
	const variant = $derived(readVariant());
</script>

<TabsPrimitive.Trigger
	bind:ref
	data-slot="tabs-trigger"
	data-variant={variant}
	class={cn(tabsTriggerVariants({ variant }), className)}
	{...restProps}
/>
