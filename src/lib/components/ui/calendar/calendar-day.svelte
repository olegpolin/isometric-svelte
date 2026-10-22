<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CalendarPrimitive.DayProps = $props();
</script>

<CalendarPrimitive.Day
	bind:ref
	class={cn(
		"relative flex size-(--cell-size) flex-col items-center justify-center gap-1 rounded-(--cell-radius) p-0 leading-none font-normal tabular-nums whitespace-nowrap outline-none select-none transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-(--dur-1) ease-out",
		"[&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
		"not-data-selected:hover:bg-accent not-data-selected:hover:text-accent-foreground",
		"data-[today]:after:bg-primary data-[today]:after:absolute data-[today]:after:bottom-1 data-[today]:after:left-1/2 data-[today]:after:size-1 data-[today]:after:-translate-x-1/2 data-[today]:after:rounded-full [&[data-today][data-disabled]]:text-muted-foreground",
		"data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_8%)] [&[data-today][data-selected]]:after:bg-primary-foreground",
		// Outside months
		"[&[data-outside-month]:not([data-selected])]:text-muted-foreground",
		// Disabled
		"data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
		// Unavailable
		"data-[unavailable]:text-muted-foreground data-[unavailable]:line-through",
		// focus
		"focus-visible:focus-halo focus-visible:z-10",
		// inner spans
		"[&>span]:text-xs [&>span]:opacity-70",
		className
	)}
	{...restProps}
/>
