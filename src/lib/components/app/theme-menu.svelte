<script lang="ts">
	import { mode, setMode, setTheme, theme, userPrefersMode } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import * as Popover from '#lib/components/ui/popover/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { PALETTES, DEFAULT_PALETTE, isPaletteId, type PaletteId } from '#lib/theme/index.js';
	import { cn } from '#lib/utils.js';
	import RingDot from './ring-dot.svelte';

	/**
	 * The ring-and-dot opens the theme menu: six palette swatches and the light / dark / system
	 * choice. Both are persisted by mode-watcher (`data-theme` and the `dark` class on <html>).
	 */
	let { class: className }: { class?: string } = $props();

	let palette = $derived<PaletteId>(isPaletteId(theme.current) ? theme.current : DEFAULT_PALETTE);
	let preference = $derived(userPrefersMode.current);

	const modes = [
		{ value: 'light', label: 'Light', icon: SunIcon },
		{ value: 'dark', label: 'Dark', icon: MoonIcon },
		{ value: 'system', label: 'System', icon: MonitorIcon }
	] as const;
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="icon-round"
				class={cn('text-foreground', className)}
				aria-label="Theme: {palette}, {mode.current ?? 'light'} mode"
			>
				<RingDot size={22} />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content align="end" class="w-64 p-3">
		<div class="flex flex-col gap-3">
			<div class="flex items-baseline justify-between">
				<span class="type-label text-muted-foreground">Palette</span>
				<span class="text-muted-foreground text-xs">{PALETTES.find((p) => p.id === palette)?.note}</span>
			</div>
			<div class="grid grid-cols-6 gap-1.5" role="radiogroup" aria-label="Palette">
				{#each PALETTES as p (p.id)}
					<button
						type="button"
						role="radio"
						aria-checked={palette === p.id}
						aria-label={p.name}
						title={p.name}
						data-theme={p.id}
						onclick={() => setTheme(p.id)}
						class={cn(
							'bg-primary focus-visible:focus-halo relative mx-auto size-7 rounded-full outline-none transition-transform duration-(--dur-1) ease-out hover:scale-105',
							palette === p.id && 'ring-foreground ring-1 ring-offset-2 ring-offset-popover'
						)}
					></button>
				{/each}
			</div>
			<div class="flex items-center justify-between gap-3">
				<span class="type-label text-muted-foreground">Mode</span>
				<ToggleGroup.Root
					type="single"
					value={preference}
					onValueChange={(v) => v && setMode(v as 'light' | 'dark' | 'system')}
					variant="outline"
					size="sm"
					aria-label="Colour mode"
				>
					{#each modes as m (m.value)}
						<ToggleGroup.Item value={m.value} aria-label={m.label}>
							<m.icon />
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
