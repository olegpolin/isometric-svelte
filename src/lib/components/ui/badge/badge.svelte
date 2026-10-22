<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const badgeVariants = tv({
		base: "type-label h-5 gap-1 rounded-sm border border-transparent px-1.5 text-[11px] leading-none transition-[color,background-color,border-color,box-shadow] duration-(--dur-1) ease-out has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 [&>svg]:size-3! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap outline-none focus-visible:focus-halo aria-invalid:border-destructive [&>svg]:pointer-events-none",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground [a]:hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_8%)]",
				secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)]",
				outline: "border-border text-foreground [a]:hover:bg-accent",
				destructive: "bg-destructive text-destructive-foreground [a]:hover:bg-[color-mix(in_oklch,var(--destructive),var(--foreground)_8%)]",
				signal: "bg-signal text-signal-foreground [a]:hover:bg-[color-mix(in_oklch,var(--signal),var(--foreground)_8%)]",
				success: "bg-success text-success-foreground [a]:hover:bg-[color-mix(in_oklch,var(--success),var(--foreground)_8%)]",
				warning: "bg-warning text-warning-foreground [a]:hover:bg-[color-mix(in_oklch,var(--warning),var(--foreground)_8%)]",
				ghost: "text-foreground hover:bg-accent",
				link: "text-foreground underline decoration-primary underline-offset-4 hover:decoration-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAnchorAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		variant?: BadgeVariant;
	} = $props();
</script>

<svelte:element
	this={href ? "a" : "span"}
	bind:this={ref}
	data-slot="badge"
	{href}
	class={cn(badgeVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
