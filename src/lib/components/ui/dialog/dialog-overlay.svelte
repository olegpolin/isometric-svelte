<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DialogPrimitive.OverlayProps = $props();
</script>

<DialogPrimitive.Overlay
	bind:ref
	data-slot="dialog-overlay"
	class={cn("fixed inset-0 isolate z-50 bg-foreground/30 dark:bg-background/70 data-open:animate-in data-open:fade-in-0 data-open:duration-(--dur-3) data-open:ease-enter data-closed:animate-out data-closed:fade-out-0 data-closed:duration-(--dur-2) data-closed:ease-exit", className)}
	{...restProps}
/>
