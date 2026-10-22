<script lang="ts">
	import { browser } from '$app/env';
	import { mode, theme } from 'mode-watcher';
	import { prefersReducedMotion } from 'svelte/motion';
	import { Button } from '#lib/components/ui/button/index.js';
	import { cn } from '#lib/utils.js';
	import type { ScenePalette } from '#lib/scene/index.js';
	import { heroState } from '#lib/theme/hero-state.svelte.js';

	/**
	 * The hero: one colour field, one monument, the title in the lower left. In light mode the
	 * field is the palette colour; in dark mode the field is night and the sun disc comes out.
	 */
	let view = $state<'iso' | 'flat'>('iso');
	let palette = $state<ScenePalette>();
	let turns = $state(0);

	// Re-read the scene tones whenever the mode or palette changes (the CSS has already updated).
	$effect(() => {
		void mode.current;
		void theme.current;
		import('#lib/scene/index.js').then(({ readScenePalette }) => {
			palette = readScenePalette();
		});
	});

	let night = $derived(mode.current === 'dark');
	let flat = $derived(view === 'flat');

	function setView(next: 'iso' | 'flat') {
		view = next;
		heroState.flat = next === 'flat';
	}

	$effect(() => () => {
		heroState.flat = false;
	});
	let remaining = $derived(4 - (turns % 4));

	const views = [
		{ value: 'iso', label: 'Isometric' },
		{ value: 'flat', label: 'Elevation' }
	] as const;
</script>

<section
	aria-labelledby="hero-title"
	class={cn(
		'relative isolate flex min-h-dvh flex-col overflow-hidden transition-colors duration-(--dur-5) ease-move',
		flat ? 'bg-background text-foreground' : 'bg-field text-field-foreground'
	)}
>
	<div class={cn('field-pool absolute inset-0 -z-10', !night && 'hidden')} aria-hidden="true"></div>

	<!-- the monument -->
	<div class="relative h-[62dvh] w-full lg:absolute lg:inset-y-0 lg:left-[10%] lg:right-0 lg:h-auto">
		{#if browser}
			{#await import('#lib/scene/index.js') then { HeroScene }}
				<HeroScene
					{palette}
					bind:view
					sun={night || flat}
					paused={prefersReducedMotion.current}
					class="size-full"
					onturn={(n) => (turns = n)}
				/>
			{/await}
		{/if}
	</div>

	<!-- the lockup -->
	<div
		class="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end gap-10 px-4 pt-6 pb-10 sm:px-6 lg:min-h-dvh lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pt-14 lg:pb-14"
	>
		<div class="animate-rise flex max-w-xl flex-col gap-6 motion-reduce:animate-none">
			<div class="flex flex-col gap-3">
				<span class="type-eyebrow opacity-80">Svelte 5 · Tailwind 4 · shadcn-svelte</span>
				<h1 id="hero-title" class="type-display">Isometric</h1>
			</div>
			<p class="max-w-[46ch] text-base sm:text-lg">
				A component library drawn in three tones. Sixty-three components for Svelte, every one
				restyled at the source: flat faces lit from the upper left, one colour per view, and room
				left empty on purpose.
			</p>
			<div class="flex flex-wrap items-center gap-3">
				<Button
					href="/components"
					variant="outline"
					size="lg"
					class="border-current bg-transparent text-current hover:bg-current/10 hover:text-current"
				>
					Browse the components
				</Button>
				<Button href="/dashboard" variant="link" size="lg" class="text-current">Open the dashboard</Button>
			</div>
		</div>

		<div class="flex flex-col items-start gap-3 text-sm lg:items-end lg:text-right">
			<p class="max-w-[28ch] opacity-80">
				{#if turns === 0}
					Drag across the towers, or click a rotor, to turn the mechanism.
				{:else if turns % 4 === 0}
					A full turn. The emblem noticed.
				{:else}
					{turns} quarter {turns === 1 ? 'turn' : 'turns'}. {remaining === 1 ? 'One more makes' : `${remaining} more make`} a circle.
				{/if}
			</p>
			<div class="flex items-center gap-1" role="group" aria-label="View">
				{#each views as { value, label } (value)}
					<button
						type="button"
						aria-pressed={view === value}
						onclick={() => setView(value)}
						class={cn(
							'type-label focus-visible:focus-halo h-8 rounded-md px-3 outline-none transition-colors duration-(--dur-1) ease-out',
							view === value ? 'bg-current/15' : 'opacity-70 hover:opacity-100'
						)}
					>
						{label}
					</button>
				{/each}
			</div>
		</div>
	</div>
</section>
