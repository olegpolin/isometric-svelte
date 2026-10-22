<!--
	The monument: two towers split by a slot, a cradle with a half-disc rotor,
	a socket with a disc rotor, corner caps with lamps, a pillar with stairs
	and an emblem, plus poster shapes that only compose in the flat view.
	Nothing here is interactive; the parent drives the view. Must be rendered
	inside a Threlte <Canvas>.
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { AdditiveBlending, CircleGeometry, Quaternion, Vector3 } from 'three';
	import { prefersReducedMotion } from 'svelte/motion';
	import { DEFAULT_SCENE_PALETTE, type ScenePalette } from './palette.js';
	import {
		applyGrainUVs,
		createGlowTexture,
		createNoiseTexture,
		createStoneMaterial,
		resolvePalette
	} from './materials.js';
	import {
		buildMonumentGeometry,
		CAPS,
		EMBLEM_CENTER,
		EMBLEM_RADII,
		LAMP_RADIUS,
		LAMP_Y,
		LEFT_ROTOR,
		RIGHT_ROTOR,
		SUN_ANCHOR,
		SUN_RADIUS
	} from './monument-geometry.js';
	import { viewDirection, viewQuaternion } from './rig.js';

	interface Props {
		palette?: ScenePalette;
		/** 0 = isometric, 1 = flat side view. The parent animates the camera and the monument together. */
		viewProgress?: number;
		/** Rotor angle in radians; the rims are repainted so they stay lit from above. */
		rotorAngle?: number;
		/** Opacity of the background disc, 0 to 1 (0 hides it). */
		sunOpacity?: number;
		/** Stop all idle animation. */
		paused?: boolean;
	}

	let {
		palette = DEFAULT_SCENE_PALETTE,
		viewProgress = 0,
		rotorAngle = 0,
		sunOpacity = 0,
		paused = false
	}: Props = $props();

	const { invalidate } = useThrelte();

	/* ------------------------------------------------ resources (one set) */

	const geo = buildMonumentGeometry();
	const noise = createNoiseTexture();
	const glow = createGlowTexture();
	const stone = createStoneMaterial(noise);
	const sunGeometry = applyGrainUVs(new CircleGeometry(SUN_RADIUS, 128));

	onDestroy(() => {
		geo.dispose();
		noise.dispose();
		glow.dispose();
		stone.dispose();
		sunGeometry.dispose();
	});

	const resolved = $derived(resolvePalette(palette));

	// Vertex colours are baked from the palette; repaint when it changes.
	$effect(() => {
		geo.stone.repaint(resolved);
		invalidate();
	});

	// Rotors are repainted for their current angle so their rims stay lit from above.
	const X_AXIS = new Vector3(1, 0, 0);
	const Z_AXIS = new Vector3(0, 0, 1);
	const leftTurn = new Quaternion();
	const rightTurn = new Quaternion();
	const spin = $derived(-rotorAngle);
	$effect(() => {
		geo.leftRotor.repaint(resolved, leftTurn.setFromAxisAngle(X_AXIS, spin));
		geo.rightRotor.repaint(resolved, rightTurn.setFromAxisAngle(Z_AXIS, spin));
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

	/* ----------------------------------------------------------- idle */

	let clock = $state(0);
	const idle = $derived(!paused && !prefersReducedMotion.current);
	useTask(
		(delta) => {
			clock += delta;
		},
		{ running: () => idle }
	);
	const bob = $derived(idle ? Math.sin((clock * Math.PI * 2) / 4.5) * 0.03 : 0);
	const flicker = $derived(
		idle ? Math.sin((clock * Math.PI * 2) / 3) * 0.06 + Math.sin(clock * 7.3) * 0.02 : 0
	);

	const emblemGlow = 0.6;

	function lampFacing(face: 'x' | 'z') {
		const f = face === 'x' ? direction.x : direction.z;
		return Math.min(1, Math.max(0, f * 1.7));
	}

	const rosette = Array.from({ length: 5 }, (_, i) => {
		const a = Math.PI / 2 + (i * Math.PI * 2) / 5;
		return { key: i, x: Math.cos(a) * 0.052, y: Math.sin(a) * 0.052 };
	});
</script>

<T.Group>
	{#if sunOpacity > 0.001}
		<T.Mesh geometry={sunGeometry} position={sunPosition} quaternion={billboard} renderOrder={-1}>
			<T.MeshBasicMaterial color={palette.sun} map={noise} transparent opacity={sunOpacity} />
		</T.Mesh>
	{/if}

	<T.Mesh geometry={geo.stone.geometry} material={stone} />

	<!-- Half-disc rotor resting in the cradle -->
	<T.Group position={LEFT_ROTOR.position}>
		<T.Mesh geometry={geo.leftRotor.geometry} material={stone} rotation.x={spin} />
	</T.Group>

	<!-- Disc rotor standing in the socket -->
	<T.Group position={RIGHT_ROTOR.position}>
		<T.Mesh geometry={geo.rightRotor.geometry} material={stone} rotation.z={spin} />
	</T.Group>

	<!-- Porthole lamps on the corner caps -->
	{#each CAPS as cap (cap.face)}
		{@const facing = lampFacing(cap.face)}
		{@const position =
			cap.face === 'z'
				? ([cap.x, LAMP_Y, cap.z + 0.154] as [number, number, number])
				: ([cap.x + 0.154, LAMP_Y, cap.z] as [number, number, number])}
		<T.Mesh {position} rotation.y={cap.face === 'x' ? Math.PI / 2 : 0}>
			<T.CircleGeometry args={[LAMP_RADIUS, 28]} />
			<T.MeshBasicMaterial color={palette.lamp} />
		</T.Mesh>
		<T.Sprite {position} scale={[LAMP_RADIUS * 6, LAMP_RADIUS * 6, 1]} renderOrder={5} visible={facing > 0.01}>
			<T.SpriteMaterial
				map={glow}
				color={palette.lamp}
				blending={AdditiveBlending}
				transparent
				depthWrite={false}
				depthTest={false}
				opacity={(0.7 + flicker) * facing}
			/>
		</T.Sprite>
	{/each}

	<!-- Emblem: three rings and a rosette, always facing the camera -->
	<T.Group
		position={[EMBLEM_CENTER[0], EMBLEM_CENTER[1] + bob, EMBLEM_CENTER[2]]}
		quaternion={billboard}
	>
		<T.Sprite scale={[1.5, 1.5, 1]} position.z={-0.05} renderOrder={4}>
			<T.SpriteMaterial
				map={glow}
				color={palette.emblem}
				blending={AdditiveBlending}
				transparent
				depthWrite={false}
				opacity={emblemGlow}
			/>
		</T.Sprite>
		{#each EMBLEM_RADII as radius (radius)}
			<T.Mesh>
				<T.RingGeometry args={[radius - 0.014, radius + 0.014, 72]} />
				<T.MeshBasicMaterial color={palette.emblem} />
			</T.Mesh>
		{/each}
		{#each rosette as petal (petal.key)}
			<T.Mesh position={[petal.x, petal.y, 0]}>
				<T.RingGeometry args={[0.02, 0.032, 24]} />
				<T.MeshBasicMaterial color={palette.emblem} />
			</T.Mesh>
		{/each}
		<T.Mesh>
			<T.CircleGeometry args={[0.022, 5]} />
			<T.MeshBasicMaterial color={palette.emblem} />
		</T.Mesh>
	</T.Group>

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
		{#each geo.posters.bands as band, i (i)}
			<T.Mesh geometry={band.geometry}>
				<T.MeshBasicMaterial color={palette[band.color]} map={noise} transparent opacity={posterAlpha} />
			</T.Mesh>
		{/each}
	{/if}
</T.Group>
