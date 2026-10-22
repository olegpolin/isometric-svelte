<script lang="ts">
	import { browser } from '$app/env';
	import { mode, theme } from 'mode-watcher';
	import { prefersReducedMotion } from 'svelte/motion';
	import { Button } from '#lib/components/ui/button/index.js';
	import { cn } from '#lib/utils.js';
	import type { ScenePalette } from '#lib/scene/index.js';
	import { heroState } from '#lib/theme/hero-state.svelte.js';

	/**
	 * The hero is a scroll stage: the viewport stays pinned while the page scrolls through the
	 * stage, and that scroll position drives the monument frame by frame from its isometric view
	 * to a flat elevation. As it flattens, the field fades to paper and the sun disc comes out, so
	 * the end state reads as a poster. In dark mode the field is night from the start and the sun
	 * is always out.
	 */
	let palette = $state<ScenePalette>();

	// Re-read the scene tones whenever the mode or palette changes (the CSS has already updated).
	$effect(() => {
		void mode.current;
		void theme.current;
		import('#lib/scene/index.js').then(({ readScenePalette }) => {
			palette = readScenePalette();
		});
	});

	let night = $derived(mode.current === 'dark');

	/** 0 at the top of the page, 1 once the stage has been scrolled through. */
	let progress = $state(0);
	let stage = $state<HTMLElement>();
	let frame = 0;

	function measure() {
		if (!stage) return;
		const rect = stage.getBoundingClientRect();
		const range = rect.height - window.innerHeight;
		const raw = range > 0 ? -rect.top / range : 0;
		progress = Math.min(1, Math.max(0, raw));
	}

	function onscroll() {
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			measure();
		});
	}

	$effect(() => {
		measure();
		return () => cancelAnimationFrame(frame);
	});

	const smooth = (t: number) => {
		const x = Math.min(1, Math.max(0, t));
		return x * x * (3 - 2 * x);
	};

	/** Camera blend: eased at both ends so the move starts and stops like a mechanism. */
	let view = $derived(smooth(progress));
	/** The disc fades in through the middle of the move. */
	let sunOpacity = $derived(night ? 1 : smooth((progress - 0.3) / 0.4));
	let flat = $derived(progress > 0.5);
	let fieldColor = $derived(
		night
			? 'var(--background)'
			: `color-mix(in oklch, var(--background) ${Math.round(view * 100)}%, var(--field))`
	);

	$effect(() => {
		heroState.flat = flat;
		return () => {
			heroState.flat = false;
		};
	});
</script>

<svelte:window {onscroll} onresize={measure} />

<section bind:this={stage} aria-labelledby="hero-title" class="relative h-[260dvh]">
	<div
		class={cn(
			'sticky top-0 isolate flex h-dvh flex-col overflow-hidden transition-colors duration-(--dur-3) ease-out',
			flat ? 'text-foreground' : 'text-field-foreground'
		)}
		style:background-color={fieldColor}
	>
		<div class={cn('field-pool absolute inset-0 -z-10', !night && 'hidden')} aria-hidden="true"></div>

		<!-- the monument -->
		<div class="absolute inset-x-0 top-14 h-[56dvh] lg:inset-y-0 lg:left-[18%] lg:right-0 lg:h-auto xl:left-[10%]">
			{#if browser}
				{#await import('#lib/scene/index.js') then { HeroScene }}
					<HeroScene
						{palette}
						progress={view}
						{sunOpacity}
						paused={prefersReducedMotion.current}
						class="size-full"
					/>
				{/await}
			{/if}
			<!-- on small screens the towers fade into the field instead of ending at a cut -->
			<div
				class="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] lg:hidden"
				style:background-image="linear-gradient(to top, {fieldColor}, transparent)"
				aria-hidden="true"
			></div>
		</div>

		<!-- the lockup -->
		<div
			class="pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-[1440px] flex-col justify-end gap-8 px-4 pb-8 sm:px-6 lg:inset-0 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pb-14"
		>
			<div class="animate-rise pointer-events-auto flex max-w-xl flex-col gap-5 motion-reduce:animate-none lg:gap-6">
				<div class="flex flex-col gap-3">
					<span class="type-eyebrow opacity-80">Svelte 5 · Tailwind 4 · shadcn-svelte</span>
					<h1 id="hero-title" class="type-display">Isometric</h1>
				</div>
				<p class="max-w-[46ch] text-sm sm:text-base lg:text-lg">
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

			<div
				class="hidden flex-col items-center gap-3 transition-opacity duration-(--dur-2) ease-out lg:flex"
				style:opacity={Math.max(0, 1 - progress * 4)}
				aria-hidden="true"
			>
				<span class="type-label opacity-80">Scroll</span>
				<span class="h-10 w-px bg-current opacity-60"></span>
			</div>
		</div>
	</div>
</section>
