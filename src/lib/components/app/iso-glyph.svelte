<script lang="ts">
	import { cn } from '#lib/utils.js';

	/**
	 * A small isometric illustration built from unit cubes. `cells` are [x, y, z] grid positions
	 * (y up). Each cube draws its three visible faces in the three face tones, painted back to
	 * front, so a few cells read as a tiny monument. True 30° projection.
	 */
	let {
		cells,
		size = 64,
		tone = 'scene',
		class: className
	}: {
		cells: [number, number, number][];
		size?: number;
		/** `scene` uses the monument greys; `face` uses the UI face tones; `field` uses primary tints. */
		tone?: 'scene' | 'face' | 'field';
		class?: string;
	} = $props();

	const COS = Math.cos(Math.PI / 6);
	const SIN = 0.5;

	const project = (x: number, y: number, z: number) => [(x - z) * COS, (x + z) * SIN - y] as const;

	let sorted = $derived([...cells].sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2])));

	let box = $derived.by(() => {
		let minX = Infinity,
			maxX = -Infinity,
			minY = Infinity,
			maxY = -Infinity;
		for (const [x, y, z] of cells) {
			for (const [dx, dy, dz] of [
				[0, 0, 0],
				[1, 0, 0],
				[0, 0, 1],
				[1, 0, 1],
				[0, 1, 0],
				[1, 1, 0],
				[0, 1, 1],
				[1, 1, 1]
			]) {
				const [px, py] = project(x + dx, y + dy, z + dz);
				minX = Math.min(minX, px);
				maxX = Math.max(maxX, px);
				minY = Math.min(minY, py);
				maxY = Math.max(maxY, py);
			}
		}
		return { minX, minY, w: maxX - minX, h: maxY - minY };
	});

	const pts = (list: (readonly [number, number])[]) => list.map(([x, y]) => `${x.toFixed(3)},${y.toFixed(3)}`).join(' ');

	const tones = {
		scene: { top: 'var(--scene-top)', light: 'var(--scene-light)', shadow: 'var(--scene-shadow)' },
		face: { top: 'var(--face-top)', light: 'var(--face-side)', shadow: 'var(--face-shadow)' },
		field: {
			top: 'color-mix(in oklch, var(--primary) 55%, white)',
			light: 'var(--primary)',
			shadow: 'color-mix(in oklch, var(--primary) 70%, var(--foreground))'
		}
	};
</script>

<svg
	width={size}
	height={size * (box.h / box.w)}
	viewBox="{box.minX - 0.02} {box.minY - 0.02} {box.w + 0.04} {box.h + 0.04}"
	aria-hidden="true"
	class={cn('shrink-0', className)}
	shape-rendering="geometricPrecision"
>
	{#each sorted as [x, y, z] (`${x},${y},${z}`)}
		<!-- top -->
		<polygon
			points={pts([project(x, y + 1, z), project(x + 1, y + 1, z), project(x + 1, y + 1, z + 1), project(x, y + 1, z + 1)])}
			fill={tones[tone].top}
		/>
		<!-- right-facing (+x) -->
		<polygon
			points={pts([project(x + 1, y + 1, z), project(x + 1, y, z), project(x + 1, y, z + 1), project(x + 1, y + 1, z + 1)])}
			fill={tones[tone].light}
		/>
		<!-- left-facing (+z) -->
		<polygon
			points={pts([project(x, y + 1, z + 1), project(x + 1, y + 1, z + 1), project(x + 1, y, z + 1), project(x, y, z + 1)])}
			fill={tones[tone].shadow}
		/>
	{/each}
</svg>
