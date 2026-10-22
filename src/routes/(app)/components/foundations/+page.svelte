<script lang="ts">
	import { setTheme, theme } from 'mode-watcher';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import BellIcon from '@lucide/svelte/icons/bell';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import CheckIcon from '@lucide/svelte/icons/check';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import XIcon from '@lucide/svelte/icons/x';
	import { Page, Section, Demo } from '#lib/components/showcase/index.js';
	import { IsoGlyph, RingDot } from '#lib/components/app/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { chapterBySlug } from '#lib/catalog.js';
	import { PALETTES, DEFAULT_PALETTE, isPaletteId } from '#lib/theme/index.js';
	import { cn } from '#lib/utils.js';

	const chapter = chapterBySlug('foundations')!;

	let current = $derived(isPaletteId(theme.current) ? theme.current : DEFAULT_PALETTE);

	const SEMANTIC = [
		{ token: 'background', name: 'Background', note: 'the page field: warm paper, or teal-black at night' },
		{ token: 'foreground', name: 'Foreground', note: 'ink' },
		{ token: 'card', name: 'Card', note: 'a surface one step above the field' },
		{ token: 'popover', name: 'Popover', note: 'a floating surface' },
		{ token: 'muted', name: 'Muted', note: 'quiet fills: canvases, tracks' },
		{ token: 'secondary', name: 'Secondary', note: 'secondary actions' },
		{ token: 'accent', name: 'Accent', note: 'hover and highlighted rows' },
		{ token: 'border', name: 'Border', note: 'every hairline' },
		{ token: 'primary', name: 'Primary', note: 'the one action on a view' },
		{ token: 'signal', name: 'Signal', note: 'one secondary call-out at most' },
		{ token: 'field', name: 'Field', note: 'the saturated ground of hero sections' },
		{ token: 'destructive', name: 'Destructive', note: 'status' },
		{ token: 'success', name: 'Success', note: 'status' },
		{ token: 'warning', name: 'Warning', note: 'status' },
		{ token: 'info', name: 'Info', note: 'status' }
	];

	const FACES = [
		{ token: 'face-top', name: 'Top', note: 'lightest; the surface you stand on' },
		{ token: 'face-side', name: 'Side', note: 'right-facing, mid' },
		{ token: 'face-shadow', name: 'Shadow', note: 'left-facing, darkest' }
	];

	const monument: [number, number, number][] = [
		[0, 0, 0], [1, 0, 0], [0, 0, 1], [1, 0, 1],
		[0, 1, 0], [1, 1, 0], [0, 1, 1], [1, 1, 1],
		[0, 2, 0], [0, 3, 0], [0, 4, 0],
		[2, 0, 1], [2, 0, 2], [3, 0, 2]
	];

	const TYPE = [
		{ cls: 'type-display', name: 'Display', spec: 'Josefin Sans 200 · fluid · 0.22em', sample: 'Isometric' },
		{ cls: 'type-title text-3xl', name: 'Title', spec: 'Josefin Sans 300 · 0.16em', sample: 'The vestibule' },
		{ cls: 'type-label', name: 'Label', spec: 'Josefin Sans 500 · 12px · 0.125em', sample: 'Components' },
		{ cls: 'type-eyebrow', name: 'Eyebrow', spec: 'Josefin Sans 600 · 11px · 0.18em', sample: 'Chapter two' },
		{ cls: 'type-numeral text-3xl', name: 'Numeral', spec: 'Josefin Sans 200 · 0.2em', sample: 'VII' }
	];

	const SCALE = [12, 14, 15, 18, 22, 28];

	const RADII = [
		{ name: 'sm', cls: 'rounded-sm', px: '2.4px', use: 'badges, kbd, menu items' },
		{ name: 'md', cls: 'rounded-md', px: '3.2px', use: 'buttons, inputs, toggles' },
		{ name: 'lg', cls: 'rounded-lg', px: '4px', use: 'cards, menus, popovers' },
		{ name: 'xl', cls: 'rounded-xl', px: '5.6px', use: 'dialogs, sheets' },
		{ name: 'full', cls: 'rounded-full', px: 'circle', use: 'avatars, radios, the ring-and-dot' }
	];

	const EASINGS = [
		{ token: '--ease-out', name: 'Out', value: 'cubic-bezier(0.2, 0, 0, 1)', dur: '--dur-1', use: 'hover, press, colour' },
		{ token: '--ease-move', name: 'Move', value: 'cubic-bezier(0.65, 0, 0.35, 1)', dur: '--dur-4', use: 'travel and rotation' },
		{ token: '--ease-settle', name: 'Settle', value: 'cubic-bezier(0.22, 1, 0.36, 1)', dur: '--dur-3', use: 'snap after a drag' },
		{ token: '--ease-enter', name: 'Enter', value: 'cubic-bezier(0.05, 0.7, 0.1, 1)', dur: '--dur-3', use: 'overlays arriving' },
		{ token: '--ease-exit', name: 'Exit', value: 'cubic-bezier(0.3, 0, 0.8, 0.15)', dur: '--dur-2', use: 'overlays leaving' }
	];

	let played = $state<Record<string, boolean>>({});
	function play(token: string) {
		played[token] = false;
		requestAnimationFrame(() => (played[token] = true));
	}

	const ICONS = [SearchIcon, SettingsIcon, BellIcon, CalendarIcon, ChevronRightIcon, CheckIcon, CopyIcon, PlusIcon, XIcon];
</script>

<svelte:head>
	<title>Foundations · Isometric</title>
	<meta name="description" content="The colour roles, face tones, palettes, type voices, shape steps, motion curves and icon rules that every Isometric component is built from." />
</svelte:head>

<Page
	title={chapter.title}
	description={chapter.subtitle}
	chapter={{ numeral: chapter.numeral, connective: chapter.connective }}
>
	<Section title="Colour" description="Semantic roles. The field and ink change with the mode; primary, signal and field change with the palette.">
		<ul class="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
			{#each SEMANTIC as c (c.token)}
				<li class="flex flex-col gap-2">
					<div class="border-border aspect-[5/3] rounded-md border" style:background="var(--{c.token})"></div>
					<span class="text-foreground text-sm font-medium">{c.name}</span>
					<span class="text-muted-foreground text-xs">{c.note}</span>
					<span class="text-muted-foreground font-mono text-[11px]">--{c.token}</span>
				</li>
			{/each}
		</ul>
	</Section>

	<Section title="Faces" description="Depth is three tones, not a shadow. Light comes from the upper left: the top is lightest, the right-facing side is mid, the left-facing side is darkest.">
		<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
			<Demo label="A monument from unit cubes" spec="IsoGlyph · scene tones" class="min-h-64">
				<IsoGlyph cells={monument} size={220} />
			</Demo>
			<Demo label="The same cubes in the interface tones" spec="face-top · face-side · face-shadow" class="min-h-64">
				<IsoGlyph cells={monument} size={220} tone="face" />
			</Demo>
		</div>
		<dl class="grid grid-cols-3 gap-4">
			{#each FACES as f (f.token)}
				<div class="flex flex-col gap-2">
					<div class="border-border aspect-[5/3] rounded-md border" style:background="var(--{f.token})"></div>
					<dt class="text-foreground text-sm font-medium">{f.name}</dt>
					<dd class="text-muted-foreground text-xs">{f.note}</dd>
					<dd class="text-muted-foreground font-mono text-[11px]">--{f.token}</dd>
				</div>
			{/each}
		</dl>
	</Section>

	<Section title="Palettes" description="Six key colours. Each sets primary, signal, the field, the ring, the chart series and the sun behind the monument.">
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" role="radiogroup" aria-label="Palette">
			{#each PALETTES as p (p.id)}
				<button
					type="button"
					role="radio"
					aria-checked={current === p.id}
					data-theme={p.id}
					onclick={() => setTheme(p.id)}
					class={cn(
						'border-border focus-visible:focus-halo flex flex-col gap-3 rounded-lg border p-3 text-left outline-none transition-colors duration-(--dur-1) ease-out hover:bg-muted/60',
						current === p.id && 'bg-muted/60'
					)}
				>
					<span class="grid grid-cols-3 gap-1">
						<span class="bg-primary aspect-square rounded-sm" title="primary"></span>
						<span class="bg-signal aspect-square rounded-sm" title="signal"></span>
						<span class="bg-field aspect-square rounded-sm" title="field"></span>
					</span>
					<span class="flex items-center justify-between">
						<span class="text-foreground text-sm font-medium">{p.name}</span>
						<span class={cn('bg-primary size-1.5 rounded-full', current !== p.id && 'opacity-0')}></span>
					</span>
					<span class="text-muted-foreground text-xs">{p.note}</span>
				</button>
			{/each}
		</div>
	</Section>

	<Section title="Type" description="Two voices. Josefin Sans in tracked capitals for titles and labels; Cabin for everything that is read.">
		<div class="border-border flex flex-col divide-y rounded-lg border">
			{#each TYPE as t (t.name)}
				<div class="grid gap-2 p-5 sm:grid-cols-[8rem_minmax(0,1fr)_14rem] sm:items-baseline sm:gap-6">
					<span class="text-muted-foreground text-xs">{t.name}</span>
					<span class={cn(t.cls, 'text-foreground')}>{t.sample}</span>
					<span class="text-muted-foreground text-xs sm:text-right">{t.spec}</span>
				</div>
			{/each}
			<div class="grid gap-2 p-5 sm:grid-cols-[8rem_minmax(0,1fr)_14rem] sm:items-baseline sm:gap-6">
				<span class="text-muted-foreground text-xs">Text</span>
				<p class="text-foreground max-w-[60ch] text-base">
					Cabin sits in the Johnston and Gill line of humanist sans serifs: round, a little narrow, and
					easy at fourteen pixels. Body copy is weight 400; labels and emphasis are 500; nothing is bold.
				</p>
				<span class="text-muted-foreground text-xs sm:text-right">Cabin 400 · 15px · 1.55</span>
			</div>
			<div class="grid gap-2 p-5 sm:grid-cols-[8rem_minmax(0,1fr)_14rem] sm:items-baseline sm:gap-6">
				<span class="text-muted-foreground text-xs">Code</span>
				<code class="text-foreground font-mono text-sm">const faces = ['top', 'side', 'shadow'] as const;</code>
				<span class="text-muted-foreground text-xs sm:text-right">IBM Plex Mono 400 · 13px</span>
			</div>
		</div>
		<Demo label="The interface scale" spec="major third: 12 · 14 · 15 · 18 · 22 · 28" align="start">
			<div class="flex flex-wrap items-baseline gap-x-8 gap-y-4">
				{#each SCALE as px (px)}
					<span class="flex flex-col gap-1">
						<span class="text-foreground" style:font-size="{px}px">Faces</span>
						<span class="text-muted-foreground font-mono text-[11px]">{px}px</span>
					</span>
				{/each}
			</div>
		</Demo>
	</Section>

	<Section title="Shape" description="Crisp corners and true circles. The base radius is 4px; nothing rectangular is a pill.">
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-5">
			{#each RADII as r (r.name)}
				<div class="flex flex-col gap-2">
					<div class={cn('bg-face-top border-border aspect-[5/3] border', r.cls)}></div>
					<span class="text-foreground text-sm font-medium">rounded-{r.name}</span>
					<span class="text-muted-foreground text-xs">{r.px} · {r.use}</span>
				</div>
			{/each}
		</div>
		<Demo label="Extruded faces" spec="shadow-face-sm · shadow-face · shadow-face-lg" align="center">
			<div class="bg-face-top border-border shadow-face-sm flex h-8 items-center rounded-md border px-3 text-sm">Control</div>
			<div class="bg-card border-border shadow-face flex h-16 w-32 items-center justify-center rounded-lg border text-sm">Card</div>
			<div class="bg-popover border-border shadow-face-lg flex h-20 w-40 items-center justify-center rounded-xl border text-sm">Dialog</div>
		</Demo>
	</Section>

	<Section title="Motion" description="Mechanical. Things slide and rotate, then settle like stone: no overshoot, no bounce. Press a curve to run it.">
		<div class="border-border flex flex-col divide-y rounded-lg border">
			{#each EASINGS as e (e.token)}
				<button
					type="button"
					onclick={() => play(e.token)}
					class="focus-visible:focus-halo grid items-center gap-3 p-4 text-left outline-none transition-colors duration-(--dur-1) ease-out hover:bg-muted/60 sm:grid-cols-[6rem_minmax(0,1fr)_14rem_12rem] sm:gap-6"
				>
					<span class="text-foreground text-sm font-medium">{e.name}</span>
					<span class="bg-muted relative h-6 overflow-hidden rounded-sm">
						<span
							class="bg-primary absolute inset-y-1 left-1 w-6 rounded-sm"
							style:transition={played[e.token] ? `transform var(${e.dur}) var(${e.token})` : 'none'}
							style:transform={played[e.token] ? 'translateX(calc(var(--track) - 100%))' : 'translateX(0)'}
							style:--track="min(100%, 36rem)"
						></span>
					</span>
					<span class="text-muted-foreground font-mono text-[11px]">{e.value}</span>
					<span class="text-muted-foreground text-xs">{e.use}</span>
				</button>
			{/each}
		</div>
	</Section>

	<Section title="Icons" description="Lucide at a 1.5 stroke, sized to the cap height. The ring-and-dot is drawn inline where it is the primary control.">
		<Demo label="The set at 20px" spec="stroke 1.5 · currentColor">
			<div class="text-foreground flex flex-wrap items-center gap-5">
				<RingDot size={20} />
				{#each ICONS as Icon, i (i)}
					<Icon class="size-5" />
				{/each}
			</div>
		</Demo>
		<Demo label="Inside controls" spec="icons never sit in tinted circles">
			<Button variant="outline"><SearchIcon data-icon="inline-start" />Search the catalog</Button>
			<Button variant="ghost" size="icon-round" aria-label="Settings"><SettingsIcon /></Button>
			<Button variant="ghost" size="icon-round" aria-label="Theme"><RingDot size={22} /></Button>
		</Demo>
	</Section>
</Page>
