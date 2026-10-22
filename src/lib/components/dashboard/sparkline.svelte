<script lang="ts">
	import { cn } from '#lib/utils.js';

	/**
	 * A tiny line drawn from the values, oldest first. No axis, no fill: the trend only. The stroke
	 * is `currentColor` at 1.5px and stays 1.5px however the box is stretched.
	 */
	let {
		values,
		width = 96,
		height = 28,
		class: className
	}: { values: number[]; width?: number; height?: number; class?: string } = $props();

	const PAD = 2;

	let d = $derived.by(() => {
		if (values.length < 2) return '';
		const min = Math.min(...values);
		const max = Math.max(...values);
		const span = max - min || 1;
		const step = (width - PAD * 2) / (values.length - 1);
		return values
			.map((v, i) => {
				const x = PAD + i * step;
				const y = PAD + (1 - (v - min) / span) * (height - PAD * 2);
				return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
			})
			.join(' ');
	});
</script>

<svg
	viewBox="0 0 {width} {height}"
	preserveAspectRatio="none"
	fill="none"
	aria-hidden="true"
	class={cn('text-primary overflow-visible', className)}
>
	<path
		{d}
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linejoin="round"
		stroke-linecap="round"
		vector-effect="non-scaling-stroke"
	/>
</svg>
