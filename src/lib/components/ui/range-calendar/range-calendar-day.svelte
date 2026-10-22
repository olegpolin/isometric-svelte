<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: RangeCalendarPrimitive.DayProps = $props();
</script>

<RangeCalendarPrimitive.Day
	bind:ref
	class={cn(
		"relative flex size-(--cell-size) flex-col items-center justify-center gap-1 rounded-(--cell-radius) p-0 leading-none font-normal tabular-nums whitespace-nowrap outline-none select-none transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-(--dur-1) ease-out",
		"not-data-selected:hover:bg-accent not-data-selected:hover:text-accent-foreground",
		"data-[range-middle]:rounded-none data-[range-middle]:hover:bg-[color-mix(in_oklch,var(--accent),var(--foreground)_6%)]",
		"data-[today]:after:bg-primary data-[today]:after:absolute data-[today]:after:bottom-1 data-[today]:after:left-1/2 data-[today]:after:size-1 data-[today]:after:-translate-x-1/2 data-[today]:after:rounded-full [&[data-today][data-disabled]]:text-muted-foreground",
		// range Start
		"data-[range-start]:bg-primary data-[range-start]:text-primary-foreground data-[range-start]:hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_8%)] [&[data-today][data-range-start]]:after:bg-primary-foreground",
		// range End
		"data-[range-end]:bg-primary data-[range-end]:text-primary-foreground data-[range-end]:hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_8%)] [&[data-today][data-range-end]]:after:bg-primary-foreground",
		// Outside months
		"[&[data-outside-month]:not([data-selected])]:text-muted-foreground",
		// Disabled
		"data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
		// Unavailable
		"data-[unavailable]:line-through",
		// focus
		"focus-visible:focus-halo focus-visible:z-10",
		// inner spans
		"[&>span]:text-xs [&>span]:opacity-70",
		className
	)}
	{...restProps}
/>
