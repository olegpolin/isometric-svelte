<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarPrimitive.FallbackProps = $props();
</script>

<AvatarPrimitive.Fallback
	bind:ref
	data-slot="avatar-fallback"
	class={cn(
		"bg-muted text-muted-foreground type-label text-[0.6875rem] rounded-full flex size-full items-center justify-center ps-[0.125em] group-data-[size=sm]/avatar:text-[0.5625rem] group-data-[size=lg]/avatar:text-[0.8125rem]",
		className
	)}
	{...restProps}
/>
