<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const tabsListVariants = tv({
		base: "group/tabs-list inline-flex items-center text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:items-stretch",
		variants: {
			variant: {
				line: "w-full justify-start gap-5 border-b border-border group-data-vertical/tabs:w-fit group-data-vertical/tabs:gap-0 group-data-vertical/tabs:border-b-0 group-data-vertical/tabs:border-s",
				segment: "w-fit justify-center gap-0.5 rounded-md bg-muted p-0.5",
			},
		},
		defaultVariants: {
			variant: "line",
		},
	});

	export type TabsListVariant = VariantProps<typeof tabsListVariants>["variant"];
</script>

<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";
	import { setTabsVariant } from "./context.js";

	let {
		ref = $bindable(null),
		variant = "line",
		class: className,
		...restProps
	}: TabsPrimitive.ListProps & {
		variant?: TabsListVariant;
	} = $props();

	setTabsVariant(() => variant ?? "line");
</script>

<TabsPrimitive.List
	bind:ref
	data-slot="tabs-list"
	data-variant={variant}
	class={cn(tabsListVariants({ variant }), className)}
	{...restProps}
/>
