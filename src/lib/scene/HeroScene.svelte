<!--
	@component
	Interactive isometric hero scene.

	The component fills its container (`width: 100%; height: 100%`), so the
	consumer must give that container a height. Lazy-load it so three.js stays
	out of the initial bundle:

	```svelte
	{#await import('#lib/scene/index.js') then { HeroScene }}
		<HeroScene palette={readScenePalette()} bind:view />
	{/await}
	```
-->
<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { NoToneMapping } from 'three';
	import SceneContents from './SceneContents.svelte';
	import { DEFAULT_SCENE_PALETTE, type ScenePalette } from './palette.js';
	import { RotorControl } from './rotor.svelte.js';

	interface Props {
		/** Hex colours; read them from CSS with `readScenePalette()`. */
		palette?: ScenePalette;
		/** `iso` (default) or `flat`; the camera animates between them. */
		view?: 'iso' | 'flat';
		/** Show the large background disc. */
		sun?: boolean;
		/** Stop all idle animation (it also stops by itself while off screen). */
		paused?: boolean;
		class?: string;
		/** Accessible description of the scene. */
		label?: string;
		/** Called with the committed quarter-turn count after each rotor turn. */
		onturn?: (quarterTurns: number) => void;
	}

	let {
		palette = DEFAULT_SCENE_PALETTE,
		view = $bindable('iso'),
		sun = false,
		paused = false,
		class: className,
		label = 'An isometric stone monument: two tall grey towers split by a narrow slot, a white key tile, two turning rotors and a pillar with stairs and a glowing emblem.',
		onturn
	}: Props = $props();

	const rotor = new RotorControl(() => onturn);

	let onScreen = $state(true);

	function trackVisibility(node: HTMLElement) {
		const observer = new IntersectionObserver(([entry]) => {
			onScreen = entry.isIntersecting;
		});
		observer.observe(node);
		return () => observer.disconnect();
	}
</script>

<div class={['hero-scene', className]} role="img" aria-label={label} {@attach trackVisibility}>
	<div class={['hero-scene-canvas', rotor.dragging && 'dragging']} aria-hidden="true">
		<Canvas dpr={[1, 2]} toneMapping={NoToneMapping} shadows={false}>
			<SceneContents {palette} {view} {sun} paused={paused || !onScreen} {rotor} />
		</Canvas>
	</div>
</div>

<style>
	.hero-scene {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.hero-scene-canvas {
		position: absolute;
		inset: 0;
		/* Horizontal drags turn the rotors; vertical swipes still scroll the page. */
		touch-action: pan-y;
		user-select: none;
		-webkit-user-select: none;
	}

	.dragging {
		cursor: grabbing;
	}
</style>
