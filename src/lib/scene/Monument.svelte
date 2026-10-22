<!--
	The monument: two towers, a lintel and a beam that only close into a
	triangle from the isometric angle, plus poster shapes that only compose in
	the flat view. Nothing here is interactive; the parent drives the view. Must
	be rendered inside a Threlte <Canvas>.
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { T, useThrelte } from '@threlte/core';
	import { CircleGeometry, Vector3 } from 'three';
	import { DEFAULT_SCENE_PALETTE, type ScenePalette } from './palette.js';
	import { applyGrainUVs, createNoiseTexture, createStoneMaterial, resolvePalette } from './materials.js';
	import { buildMonumentGeometry, SUN_ANCHOR, SUN_RADIUS } from './monument-geometry.js';
	import { viewDirection, viewQuaternion } from './rig.js';

	interface Props {
		palette?: ScenePalette;
		/** 0 = isometric, 1 = flat side view. The parent animates the camera and the monument together. */
		viewProgress?: number;
		/** Opacity of the background disc, 0 to 1 (0 hides it). */
		sunOpacity?: number;
		/** Kept for API symmetry; the monument has no idle motion of its own. */
		paused?: boolean;
	}

	let {
		palette = DEFAULT_SCENE_PALETTE,
		viewProgress = 0,
		sunOpacity = 0
	}: Props = $props();

	const { invalidate } = useThrelte();

	/* ------------------------------------------------ resources (one set) */

	const geo = buildMonumentGeometry();
	const noise = createNoiseTexture();
	const stone = createStoneMaterial(noise);
	const sunGeometry = applyGrainUVs(new CircleGeometry(SUN_RADIUS, 128));

	onDestroy(() => {
		geo.dispose();
		noise.dispose();
		stone.dispose();
		sunGeometry.dispose();
	});

	const resolved = $derived(resolvePalette(palette));

	// Vertex colours are baked from the palette; repaint when it changes.
	$effect(() => {
		geo.stone.repaint(resolved);
		invalidate();
	});

	/* ------------------------------------------------------------- view */

	const progress = $derived(viewProgress);
	const billboard = $derived(viewQuaternion(progress).toArray() as [number, number, number, number]);
	const direction = $derived(viewDirection(progress));
	const sunPosition = $derived(
		new Vector3(...SUN_ANCHOR).addScaledVector(direction, -6).toArray() as [number, number, number]
	);

	function smoothstep(a: number, b: number, x: number) {
		const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
		return t * t * (3 - 2 * t);
	}
	const posterAlpha = $derived(smoothstep(0.55, 0.95, progress));
</script>

<T.Group>
	{#if sunOpacity > 0.001}
		<T.Mesh geometry={sunGeometry} position={sunPosition} quaternion={billboard} renderOrder={-1}>
			<T.MeshBasicMaterial color={palette.sun} map={noise} transparent opacity={sunOpacity} />
		</T.Mesh>
	{/if}

	<T.Mesh geometry={geo.stone.geometry} material={stone} />

	<!-- Poster shapes: only visible (and only aligned) in the flat view -->
	{#if posterAlpha > 0.001}
		<T.Mesh geometry={geo.posters.barTop}>
			<T.MeshBasicMaterial color={palette.accentRed} map={noise} transparent opacity={posterAlpha} />
		</T.Mesh>
		<T.Mesh geometry={geo.posters.barBottom}>
			<T.MeshBasicMaterial color={palette.accentRedDark} map={noise} transparent opacity={posterAlpha} />
		</T.Mesh>
		<T.Mesh geometry={geo.posters.disc}>
			<T.MeshBasicMaterial color={palette.accentBlue} map={noise} transparent opacity={posterAlpha} />
		</T.Mesh>
	{/if}
</T.Group>
