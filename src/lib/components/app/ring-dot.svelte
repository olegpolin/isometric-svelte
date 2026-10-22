<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	/** The ring-and-dot glyph: a hairline circle with a solid centre. Inherits `currentColor`. */
	let {
		size = 20,
		dot = 0.3,
		class: className,
		...rest
	}: SVGAttributes<SVGSVGElement> & { size?: number; dot?: number } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	aria-hidden="true"
	class={className}
	{...rest}
>
	<circle cx="12" cy="12" r="10.25" stroke="currentColor" stroke-width="1.5" />
	<circle cx="12" cy="12" r={12 * dot} fill="currentColor" />
</svg>
