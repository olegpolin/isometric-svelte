<script lang="ts">
	import { MessageScroller as MessageScrollerPrimitive } from "@shadcn-svelte/primitives/message-scroller";
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import { Button } from "#lib/components/ui/button/index.js";
	import type { ButtonSize, ButtonVariant } from "#lib/components/ui/button/index.js";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		direction = "end",
		class: className,
		children,
		child: childProp,
		variant = "outline",
		size = "icon-round",
		...restProps
	}: MessageScrollerPrimitive.ButtonProps & {
		variant?: ButtonVariant;
		size?: ButtonSize;
	} = $props();
</script>

<MessageScrollerPrimitive.Button
	bind:ref
	data-slot="message-scroller-button"
	data-direction={direction}
	data-variant={variant}
	data-size={size}
	{direction}
	class={cn(
		"absolute inset-s-1/2 -translate-x-1/2 border-border bg-card text-foreground shadow-float transition-[translate,opacity,background-color] duration-(--dur-3) hover:bg-accent hover:text-foreground data-[active=false]:pointer-events-none data-[active=false]:opacity-0 data-[active=false]:ease-exit data-[active=true]:translate-y-0 data-[active=true]:opacity-100 data-[active=true]:ease-enter data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180",
		className
	)}
	{...restProps}
>
	{#snippet child(state)}
		{#if childProp}
			{@render childProp(state)}
		{:else}
			<Button {variant} {size} {...state.props}>
				{#if children}
					{@render children()}
				{:else}
					<ArrowDownIcon />
					<span class="sr-only">
						{direction === "end" ? "Scroll to end" : "Scroll to start"}
					</span>
				{/if}
			</Button>
		{/if}
	{/snippet}
</MessageScrollerPrimitive.Button>
