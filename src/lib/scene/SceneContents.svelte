<!--
	Everything inside the hero <Canvas>: the fitted orthographic camera, the
	iso-to-flat camera move driven by `progress`, and the monument.
-->
<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import type { OrthographicCamera } from 'three';
	import Monument from './Monument.svelte';
	import type { ScenePalette } from './palette.js';
	import { CAMERA_DISTANCE, cameraFrame } from './rig.js';

	interface Props {
		palette: ScenePalette;
		/** 0 = isometric, 1 = flat elevation. */
		progress: number;
		/** Opacity of the background disc, 0 to 1. */
		sunOpacity: number;
		paused: boolean;
	}

	let { palette, progress, sunOpacity, paused }: Props = $props();

	const { size, invalidate } = useThrelte();

	let camera = $state.raw<OrthographicCamera>();
	const frame = $derived(cameraFrame(progress, $size.width, $size.height));

	$effect(() => {
		if (!camera) return;
		camera.position.copy(frame.position);
		camera.quaternion.copy(frame.quaternion);
		camera.zoom = frame.zoom;
		camera.updateProjectionMatrix();
		invalidate();
	});
</script>

<T.OrthographicCamera makeDefault near={0.1} far={CAMERA_DISTANCE * 3} bind:ref={camera} />

<Monument {palette} viewProgress={progress} {sunOpacity} {paused} />
