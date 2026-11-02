<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";

	let {
		shouldScaleBackground = true,
		// A drawer is a dialog: move focus into it when it opens. vaul leaves this off by default.
		autoFocus = true,
		open = $bindable(false),
		activeSnapPoint = $bindable(null),
		...restProps
	}: DrawerPrimitive.RootProps = $props();
</script>

<DrawerPrimitive.NestedRoot {shouldScaleBackground} {autoFocus} bind:open bind:activeSnapPoint {...restProps} />
