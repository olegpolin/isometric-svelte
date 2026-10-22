<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from "bits-ui";
	import CheckIcon from "@lucide/svelte/icons/check";
	import { cn, type WithoutChildrenOrChild } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props();
</script>

<CheckboxPrimitive.Root
	bind:ref
	data-slot="checkbox"
	class={cn(
		"bg-card border-input data-checked:bg-primary data-checked:text-primary-foreground data-checked:border-primary aria-invalid:border-destructive aria-invalid:data-checked:border-primary focus-visible:focus-halo flex size-4 items-center justify-center rounded-sm border text-foreground transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-(--dur-1) ease-out group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:outline-none! group-has-[:focus-visible]/field-label:shadow-none! peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	bind:checked
	bind:indeterminate
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		<div
			data-slot="checkbox-indicator"
			class="grid place-content-center text-current transition-none [&>svg]:size-3.5"
		>
			{#if checked}
				<CheckIcon />
			{:else if indeterminate}
				<span class="block h-px w-2 bg-current"></span>
			{/if}
		</div>
	{/snippet}
</CheckboxPrimitive.Root>
