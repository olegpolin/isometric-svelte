<script lang="ts">
	import { setMode, setTheme, theme, userPrefersMode } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import InfoIcon from '@lucide/svelte/icons/info';
	import { LANGUAGES, Screen, getAtlasPrefs } from '#lib/components/mobile/index.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import { DEFAULT_PALETTE, PALETTES, isPaletteId } from '#lib/theme/index.js';
	import { cn } from '#lib/utils.js';

	const prefs = getAtlasPrefs();

	const palette = $derived(isPaletteId(theme.current) ? theme.current : DEFAULT_PALETTE);
	const languageLabel = $derived(LANGUAGES.find((l) => l.value === prefs.language)?.label ?? 'English');

	const settings = [
		{
			id: 'notifications',
			label: 'Notifications',
			description: 'Talks and closing times on the day of your visit'
		},
		{ id: 'audio-guide', label: 'Audio guide', description: 'Play the artist’s note when you reach a work' },
		{ id: 'reduce-motion', label: 'Reduce motion', description: 'Switch screens without the cross-fade' }
	] as const;

	const keys = {
		notifications: 'notifications',
		'audio-guide': 'audioGuide',
		'reduce-motion': 'reduceMotion'
	} as const;

	const modes = [
		{ value: 'light', label: 'Light', icon: SunIcon },
		{ value: 'dark', label: 'Dark', icon: MoonIcon },
		{ value: 'system', label: 'System', icon: MonitorIcon }
	] as const;
</script>

<Screen eyebrow="Member since 2023" title="You">
	<div class="flex items-center gap-4">
		<Avatar.Root size="lg" class="size-14">
			<Avatar.Fallback>ML</Avatar.Fallback>
		</Avatar.Root>
		<div class="flex min-w-0 flex-col gap-0.5">
			<p class="text-base font-medium">Maren Lindqvist</p>
			<p class="text-muted-foreground text-sm">14 visits · 31 works seen</p>
		</div>
	</div>

	<Field.FieldSet>
		<Field.Legend variant="legend">Settings</Field.Legend>
		<Field.Group class="gap-5">
			{#each settings as s (s.id)}
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Label for={s.id}>{s.label}</Field.Label>
						<Field.Description>{s.description}</Field.Description>
					</Field.Content>
					<Switch id={s.id} bind:checked={prefs[keys[s.id]]} />
				</Field.Field>
			{/each}
			<Field.Field>
				<Field.Label for="language">Language</Field.Label>
				<Select.Root type="single" bind:value={prefs.language}>
					<Select.Trigger id="language" class="w-full data-[size=default]:h-11">{languageLabel}</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each LANGUAGES as l (l.value)}
								<Select.Item value={l.value} label={l.label} class="h-11" />
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</Field.Field>
		</Field.Group>
	</Field.FieldSet>

	<Field.FieldSet>
		<Field.Legend variant="legend">Appearance</Field.Legend>
		<Field.Group class="gap-5">
			<Field.Field>
				<Field.Label id="palette-label">Palette</Field.Label>
				<div role="radiogroup" aria-labelledby="palette-label" class="-mx-1.5 flex justify-between">
					{#each PALETTES as p (p.id)}
						<button
							type="button"
							role="radio"
							aria-checked={palette === p.id}
							aria-label={p.name}
							title={p.note}
							onclick={() => setTheme(p.id)}
							class="focus-visible:focus-halo group/swatch flex size-11 items-center justify-center rounded-full outline-none"
						>
							<span
								data-theme={p.id}
								class={cn(
									'bg-primary size-8 rounded-full transition-transform duration-(--dur-1) ease-out group-hover/swatch:scale-105',
									palette === p.id && 'ring-foreground ring-offset-background ring-1 ring-offset-2'
								)}
							></span>
						</button>
					{/each}
				</div>
				<Field.Description>{PALETTES.find((p) => p.id === palette)?.note}</Field.Description>
			</Field.Field>
			<Field.Field>
				<Field.Label id="mode-label">Mode</Field.Label>
				<ToggleGroup.Root
					type="single"
					variant="outline"
					value={userPrefersMode.current}
					onValueChange={(v) => v && setMode(v as 'light' | 'dark' | 'system')}
					aria-labelledby="mode-label"
					class="w-full"
				>
					{#each modes as m (m.value)}
						<ToggleGroup.Item value={m.value} class="h-11 flex-1">
							<m.icon data-icon="inline-start" />
							{m.label}
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</Field.Field>
		</Field.Group>
	</Field.FieldSet>

	<Sheet.Root>
		<Sheet.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline" size="lg" class="h-11 w-full">
					<InfoIcon data-icon="inline-start" />
					About Atlas
				</Button>
			{/snippet}
		</Sheet.Trigger>
		<Sheet.Content side="right" showCloseButton={false} class="sm:pt-10">
			<Sheet.Header>
				<Sheet.Title>About Atlas</Sheet.Title>
				<Sheet.Description>Version 2.4 · Velden Sculpture Park</Sheet.Description>
			</Sheet.Header>
			<div class="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
				<p>
					Atlas is the visitor guide to Velden Sculpture Park: thirty hectares of meadow, orchard and
					hillside, and twelve works on permanent display.
				</p>
				<p>
					The park is open Tuesday to Sunday, 10:00 to 18:00. Entry is free; a reserved time slot keeps
					the meadow walk quiet.
				</p>
				<p class="text-muted-foreground">
					A demonstration app. The park, its works and its artists are invented.
				</p>
			</div>
			<Sheet.Footer>
				<Sheet.Close>
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="lg" class="h-11 w-full">Back to settings</Button>
					{/snippet}
				</Sheet.Close>
			</Sheet.Footer>
		</Sheet.Content>
	</Sheet.Root>
</Screen>
