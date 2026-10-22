<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: MenubarPrimitive.TriggerProps = $props();
</script>

<MenubarPrimitive.Trigger
	bind:ref
	data-slot="menubar-trigger"
	class={cn("flex h-7 items-center rounded-sm px-2 text-sm outline-hidden select-none transition-colors duration-(--dur-1) ease-out hover:bg-accent focus-visible:focus-halo data-[state=open]:bg-accent aria-expanded:bg-accent", className)}
	{...restProps}
/>
