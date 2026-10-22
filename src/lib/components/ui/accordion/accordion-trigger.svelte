<script lang="ts">
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import { cn, type WithoutChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		level = 3,
		children,
		...restProps
	}: WithoutChild<AccordionPrimitive.TriggerProps> & {
		level?: AccordionPrimitive.HeaderProps["level"];
	} = $props();
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		data-slot="accordion-trigger"
		bind:ref
		class={cn(
			"focus-visible:focus-halo **:data-[slot=accordion-trigger-icon]:text-muted-foreground rounded-md py-3 text-left text-sm font-medium underline-offset-4 decoration-border hover:underline **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 group/accordion-trigger relative flex flex-1 items-start justify-between gap-4 transition-[color,text-decoration-color,box-shadow] duration-(--dur-1) ease-out outline-none disabled:pointer-events-none disabled:opacity-50",
			className
		)}
		{...restProps}
	>
		{@render children?.()}
		<ChevronDownIcon
			data-slot="accordion-trigger-icon"
			class="pointer-events-none mt-0.5 shrink-0 transition-transform duration-(--dur-2) ease-move group-aria-expanded/accordion-trigger:rotate-180 motion-reduce:transition-none"
		/>
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
