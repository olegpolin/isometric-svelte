<script lang="ts">
	import { PinInput as InputOTPPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		cell,
		class: className,
		...restProps
	}: InputOTPPrimitive.CellProps = $props();
</script>

<InputOTPPrimitive.Cell
	{cell}
	bind:ref
	data-slot="input-otp-slot"
	class={cn(
		"bg-card text-foreground border-input aria-invalid:border-destructive data-[active=true]:focus-halo size-9 rounded-md border text-[0.9375rem] font-medium tabular-nums transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-(--dur-1) ease-out outline-none relative flex items-center justify-center data-[active=true]:z-10",
		className
	)}
	{...restProps}
>
	{#snippet child({ props })}
		<div {...props} data-active={cell.isActive}>
			{cell.char}
			{#if cell.hasFakeCaret}
				<div
					class="pointer-events-none absolute inset-0 flex items-center justify-center"
				>
					<div class="animate-caret-blink bg-foreground h-4 w-px duration-1000"></div>
				</div>
			{/if}
		</div>
	{/snippet}
</InputOTPPrimitive.Cell>
