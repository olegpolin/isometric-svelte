<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> = $props();
</script>

<RadioGroupPrimitive.Item
	bind:ref
	data-slot="radio-group-item"
	class={cn(
		"bg-card border-input data-checked:border-ring aria-invalid:border-destructive focus-visible:focus-halo flex size-4 items-center justify-center rounded-full border transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-(--dur-1) ease-out group-has-[:focus-visible]/field-label:outline-none! group-has-[:focus-visible]/field-label:shadow-none! group/radio-group-item peer relative aspect-square shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		<span
			data-slot="radio-group-indicator"
			data-checked={checked}
			class="bg-primary pointer-events-none block size-1.5 scale-0 rounded-full transition-transform duration-(--dur-2) ease-out data-[checked=true]:scale-100"
		></span>
	{/snippet}
</RadioGroupPrimitive.Item>
