<!--
	@component
	The isometric hero scene. Nothing in it is clickable: the page drives it
	through `progress` (0 = isometric, 1 = flat elevation), usually from the
	scroll position, so the monument turns frame by frame as the reader moves.

	The component fills its container (`width: 100%; height: 100%`), so the
	consumer must give that container a height. Lazy-load it so three.js stays
	out of the initial bundle:

	```svelte
	{#await import('#lib/scene/index.js') then { HeroScene }}
		<HeroScene palette={readScenePalette()} progress={scrollProgress} />
	{/await}
	```
-->
<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { NoToneMapping } from 'three';
	import SceneContents from './SceneContents.svelte';
	import { DEFAULT_SCENE_PALETTE, type ScenePalette } from './palette.js';

	interface Props {
		/** Hex colours; read them from CSS with `readScenePalette()`. */
		palette?: ScenePalette;
		/** 0 = isometric, 1 = flat elevation; any value between is a frame of the move. */
		progress?: number;
		/** Opacity of the large background disc, 0 to 1. */
		sunOpacity?: number;
		/** Stop all idle animation (it also stops by itself while off screen). */
		paused?: boolean;
		class?: string;
		/** Accessible description of the scene. */
		label?: string;
	}

	let {
		palette = DEFAULT_SCENE_PALETTE,
		progress = 0,
		sunOpacity = 0,
		paused = false,
		class: className,
		label = 'Two tall grey towers joined by a lintel and a beam into an impossible triangle, which comes apart into a plain gate as the page scrolls.'
	}: Props = $props();

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
	<div class="hero-scene-canvas" aria-hidden="true">
		<Canvas dpr={[1, 2]} toneMapping={NoToneMapping} shadows={false}>
			<SceneContents {palette} {progress} {sunOpacity} paused={paused || !onScreen} />
		</Canvas>
	</div>
</div>

<style>
	.hero-scene {
		position: relative;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.hero-scene-canvas {
		position: absolute;
		inset: 0;
		user-select: none;
		-webkit-user-select: none;
	}
</style>
