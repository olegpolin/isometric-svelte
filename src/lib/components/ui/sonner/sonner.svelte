<script lang="ts">
	import { mode } from "mode-watcher";
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from "svelte-sonner";
	import { Spinner } from "#lib/components/ui/spinner/index.js";
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import OctagonXIcon from '@lucide/svelte/icons/octagon-x';
	import InfoIcon from '@lucide/svelte/icons/info';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';

	let { toastOptions, ...restProps }: SonnerProps = $props();

	// Toasts are block cards: a hairline, an extruded bottom face, and the status colour as a 2px start bar.
	// svelte-sonner ships its own attribute selectors, so these utilities need `!` to win.
	const toast = [
		"font-sans! text-sm! gap-3! px-4! py-3! rounded-lg! border-border! border-s-2! border-s-foreground! bg-card! text-card-foreground! shadow-face!",
		"data-[type=success]:border-s-success! data-[type=error]:border-s-destructive! data-[type=warning]:border-s-warning! data-[type=info]:border-s-info!",
		"data-[type=success]:**:data-icon:text-success data-[type=error]:**:data-icon:text-destructive data-[type=warning]:**:data-icon:text-warning data-[type=info]:**:data-icon:text-info",
	].join(" ");
</script>

<Sonner
	theme={mode.current}
	class="toaster group"
	style="--normal-bg: var(--color-card); --normal-text: var(--color-card-foreground); --normal-border: var(--color-border);"
	{...restProps}
	toastOptions={{
		...toastOptions,
		classes: {
			toast,
			title: "font-medium! text-foreground! leading-snug!",
			description: "text-muted-foreground! text-sm!",
			actionButton: "h-7! rounded-md! bg-primary! px-2.5! font-sans! text-xs! font-medium! text-primary-foreground!",
			cancelButton: "h-7! rounded-md! bg-muted! px-2.5! font-sans! text-xs! text-foreground!",
			closeButton: "border-border! bg-card! text-muted-foreground! hover:bg-accent! hover:text-foreground!",
			...toastOptions?.classes,
		},
	}}
>
	{#snippet loadingIcon()}
		<Spinner class="size-4" />
	{/snippet}
	{#snippet successIcon()}
		<CircleCheckIcon class="size-4" />
	{/snippet}
	{#snippet errorIcon()}
		<OctagonXIcon class="size-4" />
	{/snippet}
	{#snippet infoIcon()}
		<InfoIcon class="size-4" />
	{/snippet}
	{#snippet warningIcon()}
		<TriangleAlertIcon class="size-4" />
	{/snippet}
</Sonner>
