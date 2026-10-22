<!--
	Everything inside the hero <Canvas>: the fitted orthographic camera, the
	iso/flat camera move, pointer interactivity, drag-to-turn and the monument.
-->
<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { prefersReducedMotion, Tween } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { on } from 'svelte/events';
	import type { OrthographicCamera } from 'three';
	import Monument from './Monument.svelte';
	import { RIGHT_ROTOR } from './monument-geometry.js';
	import type { ScenePalette } from './palette.js';
	import { CAMERA_DISTANCE, cameraFrame } from './rig.js';
	import type { RotorControl } from './rotor.svelte.js';

	interface Props {
		palette: ScenePalette;
		view: 'iso' | 'flat';
		sun: boolean;
		paused: boolean;
		rotor: RotorControl;
	}

	let { palette, view, sun, paused, rotor }: Props = $props();

	interactivity();
	const { size, invalidate, dom } = useThrelte();

	const progress = Tween.of(() => (view === 'flat' ? 1 : 0), {
		duration: () => (prefersReducedMotion.current ? 0 : 1100),
		easing: cubicInOut
	});

	let camera = $state.raw<OrthographicCamera>();
	const frame = $derived(cameraFrame(progress.current, $size.width, $size.height));

	$effect(() => {
		if (!camera) return;
		camera.position.copy(frame.position);
		camera.quaternion.copy(frame.quaternion);
		camera.zoom = frame.zoom;
		camera.updateProjectionMatrix();
		invalidate();
	});

	// Horizontal drag anywhere on the canvas turns both rotors, 1:1 with the
	// pointer (the disc's rim follows the cursor), then snaps on release.
	const DRAG_THRESHOLD = 6;
	$effect(() => {
		let pointerId: number | null = null;
		let startX = 0;
		let active = false;

		const finish = (event: PointerEvent) => {
			if (event.pointerId !== pointerId) return;
			if (active) {
				rotor.endDrag();
				if (dom.hasPointerCapture(event.pointerId)) dom.releasePointerCapture(event.pointerId);
			}
			pointerId = null;
			active = false;
		};

		const offs = [
			on(dom, 'pointerdown', (event) => {
				if (pointerId !== null || (event.pointerType === 'mouse' && event.button !== 0)) return;
				pointerId = event.pointerId;
				startX = event.clientX;
				active = false;
			}),
			on(dom, 'pointermove', (event) => {
				if (event.pointerId !== pointerId) return;
				const dx = event.clientX - startX;
				if (!active) {
					if (Math.abs(dx) < DRAG_THRESHOLD) return;
					active = true;
					dom.setPointerCapture(event.pointerId);
					rotor.beginDrag();
				}
				rotor.drag(dx / (RIGHT_ROTOR.radius * frame.zoom));
			}),
			on(dom, 'pointerup', finish),
			on(dom, 'pointercancel', finish)
		];
		return () => offs.forEach((off) => off());
	});
</script>

<T.OrthographicCamera makeDefault near={0.1} far={CAMERA_DISTANCE * 3} bind:ref={camera} />

<Monument {palette} {view} viewProgress={progress.current} {sun} {paused} {rotor} />
