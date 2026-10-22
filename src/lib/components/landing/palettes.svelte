<script lang="ts">
	import { setTheme, theme } from 'mode-watcher';
	import { IsoGlyph } from '#lib/components/app/index.js';
	import { PALETTES, DEFAULT_PALETTE, isPaletteId } from '#lib/theme/index.js';
	import { cn } from '#lib/utils.js';

	/**
	 * One hue per view. Six palette tiles, each a small colour field holding the same monument
	 * glyph; choosing one re-tints the whole site. Under them, the three face tones of the current
	 * mode with their token names.
	 */
	let current = $derived(isPaletteId(theme.current) ? theme.current : DEFAULT_PALETTE);

	const faces = [
		{ token: '--face-top', name: 'Top', note: 'the lit face, lightest' },
		{ token: '--face-side', name: 'Side', note: 'right-facing, mid' },
		{ token: '--face-shadow', name: 'Shadow', note: 'left-facing, darkest' }
	];

	const glyph: [number, number, number][] = [
		[0, 0, 0],
		[1, 0, 0],
		[0, 0, 1],
		[1, 0, 1],
		[0, 1, 0],
		[0, 2, 0]
	];
</script>

<section aria-labelledby="palettes-title" class="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
	<div class="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
		<div class="flex max-w-md flex-col gap-4">
			<span class="type-numeral text-muted-foreground text-lg">II</span>
			<h2 id="palettes-title" class="type-title text-2xl sm:text-3xl">One hue per view</h2>
			<p class="text-muted-foreground text-base">
				A page is a single colour field with a small amount of ink on it. Secondary tones come from
				mixing that key colour with the paper, not from new hues. Pick a palette and the whole site
				follows: the buttons, the charts, the monument's sun.
			</p>
		</div>

		<div class="flex flex-col gap-8">
			<div class="grid grid-cols-3 gap-px sm:grid-cols-6" role="radiogroup" aria-label="Palette">
				{#each PALETTES as p (p.id)}
					<button
						type="button"
						role="radio"
						aria-checked={current === p.id}
						data-theme={p.id}
						onclick={() => setTheme(p.id)}
						class={cn(
							'group/tile bg-field text-field-foreground focus-visible:focus-halo relative flex aspect-[4/5] flex-col items-center justify-between p-3 outline-none transition-transform duration-(--dur-2) ease-settle',
							'first:rounded-l-lg last:rounded-r-lg hover:z-10 hover:scale-[1.03]'
						)}
					>
						<span
							aria-hidden="true"
							class={cn(
								'size-2 rounded-full bg-current transition-transform duration-(--dur-2) ease-settle',
								current === p.id ? 'scale-100' : 'scale-0'
							)}
						></span>
						<IsoGlyph cells={glyph} size={44} />
						<span class="type-label">{p.name}</span>
					</button>
				{/each}
			</div>

			<dl class="grid grid-cols-3 gap-4">
				{#each faces as f (f.token)}
					<div class="flex flex-col gap-2">
						<div class="border-border aspect-[5/3] rounded-md border" style:background="var({f.token})"></div>
						<dt class="text-foreground text-sm font-medium">{f.name}</dt>
						<dd class="text-muted-foreground text-xs">{f.note}</dd>
						<dd class="text-muted-foreground font-mono text-[11px]">{f.token}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</section>
