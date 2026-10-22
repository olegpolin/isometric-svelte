<!-- Temporary lab page for checking the hero scene. Add ?reduced to emulate reduced motion. -->
<script lang="ts">
	import { browser } from '$app/env';

	let view = $state<'iso' | 'flat'>('iso');
	let sun = $state(false);
	let paused = $state(false);
	let turns = $state(0);

	const params = browser ? new URLSearchParams(location.search) : new URLSearchParams();
	const reduced = params.has('reduced');
	// ?w=1600&h=900 renders the scene at a fixed size (the page scrolls) for pixel-level checks.
	const fixedWidth = params.get('w');
	const fixedHeight = params.get('h');
	if (reduced) {
		// Must run before svelte/motion is first imported (the scene is loaded lazily below).
		const original = window.matchMedia.bind(window);
		window.matchMedia = (query: string) => {
			if (!query.includes('prefers-reduced-motion')) return original(query);
			return {
				matches: true,
				media: query,
				onchange: null,
				addEventListener() {},
				removeEventListener() {},
				addListener() {},
				removeListener() {},
				dispatchEvent: () => false
			} as MediaQueryList;
		};
	}

	const scene = browser ? import('#lib/scene/index.js') : null;
</script>

<div
	class={['lab', fixedWidth && 'fixed']}
	style:background={sun ? '#ffffff' : '#fece00'}
	style:width={fixedWidth ? `${fixedWidth}px` : null}
	style:height={fixedHeight ? `${fixedHeight}px` : null}
>
	{#if scene}
		{#await scene then { HeroScene }}
			<HeroScene bind:view {sun} {paused} onturn={(n) => (turns = n)} />
		{/await}
	{/if}

	<div class="controls">
		<button onclick={() => (view = view === 'iso' ? 'flat' : 'iso')}>view: {view}</button>
		<button onclick={() => (sun = !sun)}>sun: {sun ? 'on' : 'off'}</button>
		<button onclick={() => (paused = !paused)}>paused: {paused}</button>
		<span>turns: {turns}</span>
		<span>{reduced ? 'reduced motion (emulated)' : ''}</span>
	</div>
</div>

<style>
	.lab {
		position: fixed;
		inset: 0;
	}

	.lab.fixed {
		position: relative;
		inset: auto;
	}

	.controls {
		position: absolute;
		top: 8px;
		left: 8px;
		display: flex;
		gap: 6px;
		align-items: center;
		font: 12px monospace;
	}
</style>
