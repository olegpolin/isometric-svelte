<script lang="ts">
	import { getLocalTimeZone, today, type DateValue } from '@internationalized/date';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { superformClient } from 'sveltekit-superforms/adapters';
	import type { DateRange } from 'bits-ui';
	import { fromAction } from 'svelte/attachments';

	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import AtSignIcon from '@lucide/svelte/icons/at-sign';
	import BoldIcon from '@lucide/svelte/icons/bold';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import InfoIcon from '@lucide/svelte/icons/info';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import MailIcon from '@lucide/svelte/icons/mail';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import PaletteIcon from '@lucide/svelte/icons/palette';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SendIcon from '@lucide/svelte/icons/send';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import StarIcon from '@lucide/svelte/icons/star';
	import SunIcon from '@lucide/svelte/icons/sun';
	import TextAlignCenterIcon from '@lucide/svelte/icons/text-align-center';
	import TextAlignEndIcon from '@lucide/svelte/icons/text-align-end';
	import TextAlignStartIcon from '@lucide/svelte/icons/text-align-start';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import UnderlineIcon from '@lucide/svelte/icons/underline';

	import { Button, type ButtonSize, type ButtonVariant } from '#lib/components/ui/button/index.js';
	import * as ButtonGroup from '#lib/components/ui/button-group/index.js';
	import { Calendar } from '#lib/components/ui/calendar/index.js';
	import { Checkbox } from '#lib/components/ui/checkbox/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import * as Form from '#lib/components/ui/form/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import * as InputOTP from '#lib/components/ui/input-otp/index.js';
	import * as Kbd from '#lib/components/ui/kbd/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as NativeSelect from '#lib/components/ui/native-select/index.js';
	import * as RadioGroup from '#lib/components/ui/radio-group/index.js';
	import { RangeCalendar } from '#lib/components/ui/range-calendar/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Slider } from '#lib/components/ui/slider/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { Toggle } from '#lib/components/ui/toggle/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';

	// ---- mode and palette toolbar -------------------------------------------------------------
	const palettes = ['sun', 'ember', 'lagoon', 'dusk', 'moss', 'coral'] as const;
	let isDark = $state(false);
	let palette = $state<string>('sun');

	function toggleDark() {
		isDark = document.documentElement.classList.toggle('dark');
	}

	function cyclePalette() {
		const current = document.documentElement.dataset.theme ?? 'sun';
		const index = palettes.indexOf(current as (typeof palettes)[number]);
		palette = palettes[(index + 1) % palettes.length];
		document.documentElement.dataset.theme = palette;
	}

	// ---- buttons ------------------------------------------------------------------------------
	const variants: ButtonVariant[] = ['default', 'secondary', 'outline', 'ghost', 'block', 'destructive', 'link'];
	const sizes: ButtonSize[] = ['xs', 'sm', 'default', 'lg'];

	// ---- select -------------------------------------------------------------------------------
	const fonts = [
		{ value: 'cabin', label: 'Cabin' },
		{ value: 'josefin', label: 'Josefin Sans' },
		{ value: 'plex', label: 'IBM Plex Mono' }
	];
	const cities = [
		{ value: 'lisbon', label: 'Lisbon', region: 'Europe' },
		{ value: 'reykjavik', label: 'Reykjavík', region: 'Europe' },
		{ value: 'kyoto', label: 'Kyoto', region: 'Asia' },
		{ value: 'hanoi', label: 'Hanoi', region: 'Asia' },
		{ value: 'valparaiso', label: 'Valparaíso', region: 'Americas' },
		{ value: 'oaxaca', label: 'Oaxaca', region: 'Americas', disabled: true }
	];
	let font = $state('cabin');
	let city = $state('');
	let cityOpen = $state(false);
	const fontLabel = $derived(fonts.find((f) => f.value === font)?.label ?? 'Choose a typeface');
	const cityLabel = $derived(cities.find((c) => c.value === city)?.label ?? 'Choose a city');

	// ---- choices ------------------------------------------------------------------------------
	let notify = $state(true);
	let parentChecked = $state(false);
	let parentIndeterminate = $state(true);
	let paletteChoice = $state('lagoon');
	let shipping = $state('standard');
	let volume = $state(40);
	let priceRange = $state([25, 75]);
	let otp = $state('');

	// ---- calendars ----------------------------------------------------------------------------
	const now = today(getLocalTimeZone());
	let date = $state<DateValue | undefined>(now.add({ days: 3 }));
	let range = $state<DateRange>({ start: now.subtract({ days: 2 }), end: now.add({ days: 4 }) });
	let dropdownDate = $state<DateValue | undefined>(now);

	// ---- form ---------------------------------------------------------------------------------
	type Profile = { name: string; email: string; city: string };
	const validators = superformClient<Profile>({
		name: (value) => (!value || value.trim().length < 2 ? 'Enter at least two characters.' : null),
		email: (value) => (!value || !value.includes('@') ? 'Enter an email address with an @.' : null),
		city: (value) => (!value ? 'Choose the city you work from.' : null)
	});
	const profileForm = superForm(defaults<Profile>({ name: '', email: '', city: '' }, validators), {
		SPA: true,
		validators,
		resetForm: false
	});
	const { form: profile, enhance } = profileForm;
</script>

<svelte:head>
	<title>Controls lab</title>
</svelte:head>

<div
	class="bg-popover border-border shadow-float fixed top-4 right-4 z-50 flex items-center gap-1 rounded-lg border p-1"
>
	<Button variant="ghost" size="sm" onclick={toggleDark} aria-pressed={isDark}>
		{#if isDark}
			<SunIcon data-icon="inline-start" />
			Light mode
		{:else}
			<MoonIcon data-icon="inline-start" />
			Dark mode
		{/if}
	</Button>
	<Button variant="ghost" size="sm" onclick={cyclePalette}>
		<PaletteIcon data-icon="inline-start" />
		Palette: {palette}
	</Button>
</div>

<main class="mx-auto flex max-w-5xl flex-col gap-20 px-6 pt-24 pb-32">
	<header class="flex flex-col gap-3">
		<p class="type-eyebrow text-muted-foreground">Lab</p>
		<h1 class="type-title text-3xl">Controls</h1>
		<p class="text-muted-foreground max-w-[65ch]">
			Every control in every variant, size and state. Hover is live; press Tab to walk the focus
			halo through the page.
		</p>
	</header>

	<!-- Button -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label">Button</h2>
		<div class="flex flex-col gap-4">
			{#each variants as variant (variant)}
				<div class="flex flex-wrap items-center gap-3">
					<span class="text-muted-foreground w-24 text-xs">{variant}</span>
					{#each sizes as size (size)}
						<Button {variant} {size}>Copy install command</Button>
					{/each}
					<Button {variant}>
						<CopyIcon data-icon="inline-start" />
						Copy
					</Button>
					<Button {variant}>
						Continue
						<ArrowRightIcon data-icon="inline-end" />
					</Button>
					<Button {variant} disabled>Disabled</Button>
				</div>
			{/each}
		</div>
		<div class="flex flex-wrap items-center gap-3">
			<span class="text-muted-foreground w-24 text-xs">icon sizes</span>
			<Button variant="outline" size="icon-xs" aria-label="Add"><PlusIcon /></Button>
			<Button variant="outline" size="icon-sm" aria-label="Add"><PlusIcon /></Button>
			<Button variant="outline" size="icon" aria-label="Add"><PlusIcon /></Button>
			<Button variant="outline" size="icon-lg" aria-label="Add"><PlusIcon /></Button>
			<Button variant="ghost" size="icon-round" aria-label="Settings"><SettingsIcon /></Button>
			<Button variant="ghost" size="icon-round" aria-label="Search"><SearchIcon /></Button>
			<Button variant="block" size="icon" aria-label="Star"><StarIcon /></Button>
			<Button variant="destructive" size="icon" aria-label="Delete"><TrashIcon /></Button>
		</div>
		<div class="flex flex-wrap items-center gap-3">
			<span class="text-muted-foreground w-24 text-xs">states</span>
			<Button variant="outline" aria-invalid="true">Invalid outline</Button>
			<Button href="#field">Link as button</Button>
			<Button href="#field" disabled>Disabled link</Button>
			<Button variant="outline" aria-expanded="true">Expanded</Button>
		</div>
	</section>

	<!-- Button group -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label">Button group</h2>
		<div class="flex flex-wrap items-start gap-6">
			<ButtonGroup.Root>
				<Button variant="outline">Archive</Button>
				<Button variant="outline">Report</Button>
				<Button variant="outline">Snooze</Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root>
				<Button variant="block">Previous</Button>
				<Button variant="block">Next</Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root>
				<Button variant="secondary">Deploy</Button>
				<ButtonGroup.Separator />
				<Button variant="secondary" size="icon" aria-label="More deploy options"><PlusIcon /></Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root>
				<ButtonGroup.Text>https://</ButtonGroup.Text>
				<Input placeholder="isometric.design" class="w-44" />
				<Button variant="outline">Visit</Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root orientation="vertical">
				<Button variant="outline" size="icon" aria-label="Zoom in"><PlusIcon /></Button>
				<Button variant="outline" size="icon" aria-label="Search"><SearchIcon /></Button>
			</ButtonGroup.Root>
		</div>
	</section>

	<!-- Toggle -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label">Toggle and toggle group</h2>
		<div class="flex flex-wrap items-center gap-3">
			<span class="text-muted-foreground w-24 text-xs">toggle</span>
			<Toggle aria-label="Bold"><BoldIcon /></Toggle>
			<Toggle aria-label="Italic" pressed><ItalicIcon /></Toggle>
			<Toggle variant="outline" aria-label="Underline"><UnderlineIcon /></Toggle>
			<Toggle variant="outline" pressed aria-label="Underline"><UnderlineIcon /></Toggle>
			<Toggle size="sm" pressed>
				<StarIcon data-icon="inline-start" />
				Starred
			</Toggle>
			<Toggle size="lg">Large</Toggle>
			<Toggle disabled>Disabled</Toggle>
		</div>
		<div class="flex flex-wrap items-center gap-6">
			<span class="text-muted-foreground w-24 text-xs">group</span>
			<ToggleGroup.Root type="single" value="start" aria-label="Text alignment">
				<ToggleGroup.Item value="start" aria-label="Align start"><TextAlignStartIcon /></ToggleGroup.Item>
				<ToggleGroup.Item value="center" aria-label="Align centre"><TextAlignCenterIcon /></ToggleGroup.Item>
				<ToggleGroup.Item value="end" aria-label="Align end"><TextAlignEndIcon /></ToggleGroup.Item>
			</ToggleGroup.Root>
			<ToggleGroup.Root type="multiple" variant="outline" value={['bold']}>
				<ToggleGroup.Item value="bold" aria-label="Bold"><BoldIcon /></ToggleGroup.Item>
				<ToggleGroup.Item value="italic" aria-label="Italic"><ItalicIcon /></ToggleGroup.Item>
				<ToggleGroup.Item value="underline" aria-label="Underline"><UnderlineIcon /></ToggleGroup.Item>
			</ToggleGroup.Root>
			<ToggleGroup.Root type="single" variant="outline" spacing={2} value="lagoon">
				<ToggleGroup.Item value="sun">Sun</ToggleGroup.Item>
				<ToggleGroup.Item value="lagoon">Lagoon</ToggleGroup.Item>
				<ToggleGroup.Item value="dusk">Dusk</ToggleGroup.Item>
				<ToggleGroup.Item value="moss" disabled>Moss</ToggleGroup.Item>
			</ToggleGroup.Root>
			<ToggleGroup.Root type="single" size="sm" value="week">
				<ToggleGroup.Item value="day">Day</ToggleGroup.Item>
				<ToggleGroup.Item value="week">Week</ToggleGroup.Item>
				<ToggleGroup.Item value="month">Month</ToggleGroup.Item>
			</ToggleGroup.Root>
		</div>
	</section>

	<!-- Text inputs -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label">Input, textarea, input group</h2>
		<div class="grid gap-6 md:grid-cols-2">
			<Field.Group>
				<Field.Field>
					<Field.Label for="lab-name">Display name</Field.Label>
					<Input id="lab-name" placeholder="Ada Lovelace" />
				</Field.Field>
				<Field.Field>
					<Field.Label for="lab-filled">Studio</Field.Label>
					<Input id="lab-filled" value="Isometric, Lisbon" />
				</Field.Field>
				<Field.Field data-disabled>
					<Field.Label for="lab-disabled">Workspace ID</Field.Label>
					<Input id="lab-disabled" value="ws_2026_lisbon" disabled />
				</Field.Field>
				<Field.Field data-invalid>
					<Field.Label for="lab-invalid">Email</Field.Label>
					<Input id="lab-invalid" value="ada.lovelace" aria-invalid="true" />
					<Field.Error>Enter an email address with an @.</Field.Error>
				</Field.Field>
				<Field.Field>
					<Field.Label for="lab-file">Specimen sheet</Field.Label>
					<Input id="lab-file" type="file" />
				</Field.Field>
				<Field.Field>
					<Field.Label for="lab-notes">Notes</Field.Label>
					<Textarea id="lab-notes" placeholder="What should the next palette feel like?" />
					<Field.Description>Plain text, up to 280 characters.</Field.Description>
				</Field.Field>
				<Field.Field data-invalid>
					<Field.Label for="lab-notes-invalid">Brief</Field.Label>
					<Textarea id="lab-notes-invalid" aria-invalid="true" value="tbd" />
					<Field.Error>Write at least one full sentence.</Field.Error>
				</Field.Field>
				<Field.Field data-disabled>
					<Field.Label for="lab-notes-disabled">Archived notes</Field.Label>
					<Textarea id="lab-notes-disabled" disabled value="Moss was retired in spring." />
				</Field.Field>
			</Field.Group>
			<Field.Group>
				<Field.Field>
					<Field.Label for="lab-search">Search typefaces</Field.Label>
					<InputGroup.Root>
						<InputGroup.Input id="lab-search" placeholder="Josefin Sans" />
						<InputGroup.Addon>
							<SearchIcon />
						</InputGroup.Addon>
						<InputGroup.Addon align="inline-end">
							<Kbd.Root>⌘</Kbd.Root>
							<Kbd.Root>K</Kbd.Root>
						</InputGroup.Addon>
					</InputGroup.Root>
				</Field.Field>
				<Field.Field>
					<Field.Label for="lab-url">Site address</Field.Label>
					<InputGroup.Root>
						<InputGroup.Addon>
							<InputGroup.Text>https://</InputGroup.Text>
						</InputGroup.Addon>
						<InputGroup.Input id="lab-url" placeholder="isometric.design" />
						<InputGroup.Addon align="inline-end">
							<InputGroup.Button size="icon-xs" aria-label="Copy address"><CopyIcon /></InputGroup.Button>
						</InputGroup.Addon>
					</InputGroup.Root>
				</Field.Field>
				<Field.Field data-invalid>
					<Field.Label for="lab-handle">Handle</Field.Label>
					<InputGroup.Root>
						<InputGroup.Addon><AtSignIcon /></InputGroup.Addon>
						<InputGroup.Input id="lab-handle" value="ada lovelace" aria-invalid="true" />
					</InputGroup.Root>
					<Field.Error>Handles cannot contain spaces.</Field.Error>
				</Field.Field>
				<Field.Field data-disabled>
					<Field.Label for="lab-mail-disabled">Forwarding address</Field.Label>
					<InputGroup.Root>
						<InputGroup.Addon><MailIcon /></InputGroup.Addon>
						<InputGroup.Input id="lab-mail-disabled" value="studio@isometric.design" disabled />
					</InputGroup.Root>
				</Field.Field>
				<Field.Field>
					<Field.Label for="lab-message">Message</Field.Label>
					<InputGroup.Root>
						<InputGroup.Textarea id="lab-message" placeholder="Ask about the Lagoon palette" />
						<InputGroup.Addon align="block-end" class="border-t">
							<InputGroup.Text>0 / 280</InputGroup.Text>
							<InputGroup.Button variant="default" size="xs" class="ml-auto">
								Send
								<SendIcon data-icon="inline-end" />
							</InputGroup.Button>
						</InputGroup.Addon>
					</InputGroup.Root>
				</Field.Field>
			</Field.Group>
		</div>
	</section>

	<!-- Selects -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label">Select and native select</h2>
		<div class="flex flex-wrap items-end gap-6">
			<Field.Field class="w-56">
				<Field.Label for="lab-font">Typeface</Field.Label>
				<Select.Root type="single" bind:value={font}>
					<Select.Trigger id="lab-font" class="w-full">{fontLabel}</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each fonts as f (f.value)}
								<Select.Item value={f.value} label={f.label}>{f.label}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</Field.Field>
			<Field.Field class="w-56">
				<Field.Label for="lab-city">City</Field.Label>
				<Select.Root type="single" bind:value={city} bind:open={cityOpen}>
					<Select.Trigger id="lab-city" class="w-full">
						<span data-slot="select-value">
							<MapPinIcon />
							{cityLabel}
						</span>
					</Select.Trigger>
					<Select.Content>
						{#each ['Europe', 'Asia', 'Americas'] as region, i (region)}
							{#if i > 0}<Select.Separator />{/if}
							<Select.Group>
								<Select.GroupHeading>{region}</Select.GroupHeading>
								{#each cities.filter((c) => c.region === region) as c (c.value)}
									<Select.Item value={c.value} label={c.label} disabled={c.disabled}>{c.label}</Select.Item>
								{/each}
							</Select.Group>
						{/each}
					</Select.Content>
				</Select.Root>
			</Field.Field>
			<Button variant="outline" onclick={() => (cityOpen = true)}>Open city select</Button>
			<Field.Field class="w-48" data-invalid>
				<Field.Label for="lab-select-invalid">Palette</Field.Label>
				<Select.Root type="single">
					<Select.Trigger id="lab-select-invalid" aria-invalid="true" class="w-full">Choose a palette</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Item value="sun">Sun</Select.Item>
							<Select.Item value="ember">Ember</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
				<Field.Error>Choose a palette to continue.</Field.Error>
			</Field.Field>
			<Field.Field class="w-40" data-disabled>
				<Field.Label for="lab-select-disabled">Region</Field.Label>
				<Select.Root type="single" disabled>
					<Select.Trigger id="lab-select-disabled" class="w-full">Europe</Select.Trigger>
					<Select.Content>
						<Select.Group><Select.Item value="eu">Europe</Select.Item></Select.Group>
					</Select.Content>
				</Select.Root>
			</Field.Field>
			<Field.Field class="w-40">
				<Field.Label for="lab-select-sm">Small</Field.Label>
				<Select.Root type="single" value="mono">
					<Select.Trigger id="lab-select-sm" size="sm" class="w-full">IBM Plex Mono</Select.Trigger>
					<Select.Content>
						<Select.Group><Select.Item value="mono">IBM Plex Mono</Select.Item></Select.Group>
					</Select.Content>
				</Select.Root>
			</Field.Field>
		</div>
		<div class="flex flex-wrap items-end gap-6">
			<Field.Field class="w-56">
				<Field.Label for="lab-native">Palette (native)</Field.Label>
				<NativeSelect.Root id="lab-native" class="w-full">
					<NativeSelect.OptGroup label="Warm">
						<NativeSelect.Option value="sun">Sun</NativeSelect.Option>
						<NativeSelect.Option value="ember">Ember</NativeSelect.Option>
						<NativeSelect.Option value="coral">Coral</NativeSelect.Option>
					</NativeSelect.OptGroup>
					<NativeSelect.OptGroup label="Cool">
						<NativeSelect.Option value="lagoon">Lagoon</NativeSelect.Option>
						<NativeSelect.Option value="dusk">Dusk</NativeSelect.Option>
						<NativeSelect.Option value="moss">Moss</NativeSelect.Option>
					</NativeSelect.OptGroup>
				</NativeSelect.Root>
			</Field.Field>
			<Field.Field class="w-40">
				<Field.Label for="lab-native-sm">Small</Field.Label>
				<NativeSelect.Root id="lab-native-sm" size="sm" class="w-full">
					<NativeSelect.Option value="14">14 px</NativeSelect.Option>
					<NativeSelect.Option value="15">15 px</NativeSelect.Option>
				</NativeSelect.Root>
			</Field.Field>
			<Field.Field class="w-40" data-invalid>
				<Field.Label for="lab-native-invalid">Invalid</Field.Label>
				<NativeSelect.Root id="lab-native-invalid" aria-invalid="true" class="w-full">
					<NativeSelect.Option value="">Choose one</NativeSelect.Option>
				</NativeSelect.Root>
			</Field.Field>
			<Field.Field class="w-40" data-disabled>
				<Field.Label for="lab-native-disabled">Disabled</Field.Label>
				<NativeSelect.Root id="lab-native-disabled" disabled class="w-full">
					<NativeSelect.Option value="kyoto">Kyoto</NativeSelect.Option>
				</NativeSelect.Root>
			</Field.Field>
		</div>
	</section>

	<!-- OTP -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label">Input OTP</h2>
		<div class="flex flex-wrap items-start gap-10">
			<Field.Field class="w-fit">
				<Field.Label for="lab-otp">Verification code</Field.Label>
				<InputOTP.Root id="lab-otp" maxlength={6} bind:value={otp}>
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells.slice(0, 3) as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
						<InputOTP.Separator />
						<InputOTP.Group>
							{#each cells.slice(3, 6) as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
				<Field.Description>Sent to ada@isometric.design.</Field.Description>
			</Field.Field>
			<Field.Field class="w-fit" data-invalid>
				<Field.Label for="lab-otp-invalid">Invalid code</Field.Label>
				<InputOTP.Root id="lab-otp-invalid" maxlength={4} value="1907">
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells as cell (cell)}
								<InputOTP.Slot {cell} aria-invalid="true" />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
				<Field.Error>That code has expired.</Field.Error>
			</Field.Field>
			<Field.Field class="w-fit" data-disabled>
				<Field.Label for="lab-otp-disabled">Disabled</Field.Label>
				<InputOTP.Root id="lab-otp-disabled" maxlength={4} value="20" disabled>
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
			</Field.Field>
		</div>
	</section>

	<!-- Choices -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label">Checkbox, radio, switch</h2>
		<div class="grid gap-10 md:grid-cols-3">
			<Field.Set>
				<Field.Legend variant="legend">Email me about</Field.Legend>
				<Field.Description>Choose what lands in your inbox.</Field.Description>
				<Field.Group data-slot="checkbox-group">
					<Field.Field orientation="horizontal">
						<Checkbox
							id="lab-cb-all"
							bind:checked={parentChecked}
							bind:indeterminate={parentIndeterminate}
						/>
						<Field.Label for="lab-cb-all">All updates (indeterminate)</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal">
						<Checkbox id="lab-cb-releases" checked />
						<Field.Label for="lab-cb-releases">New palettes</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal">
						<Checkbox id="lab-cb-type" />
						<Field.Label for="lab-cb-type">Typeface changes</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal" data-disabled>
						<Checkbox id="lab-cb-disabled" disabled />
						<Field.Label for="lab-cb-disabled">Weekly digest (paused)</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal" data-disabled>
						<Checkbox id="lab-cb-disabled-on" disabled checked />
						<Field.Label for="lab-cb-disabled-on">Security notices</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal" data-invalid>
						<Checkbox id="lab-cb-invalid" aria-invalid="true" />
						<Field.Label for="lab-cb-invalid">I accept the licence</Field.Label>
					</Field.Field>
				</Field.Group>
			</Field.Set>

			<Field.Set>
				<Field.Legend variant="legend">Shipping</Field.Legend>
				<RadioGroup.Root bind:value={shipping}>
					<Field.Field orientation="horizontal">
						<RadioGroup.Item value="standard" id="lab-ship-standard" />
						<Field.Label for="lab-ship-standard">Standard, 4 to 6 days</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal">
						<RadioGroup.Item value="express" id="lab-ship-express" />
						<Field.Label for="lab-ship-express">Express, next day</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal" data-disabled>
						<RadioGroup.Item value="drone" id="lab-ship-drone" disabled />
						<Field.Label for="lab-ship-drone">Courier to Reykjavík</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal" data-invalid>
						<RadioGroup.Item value="pickup" id="lab-ship-pickup" aria-invalid="true" />
						<Field.Label for="lab-ship-pickup">Pick up in Lisbon</Field.Label>
					</Field.Field>
				</RadioGroup.Root>
			</Field.Set>

			<Field.Set>
				<Field.Legend variant="legend">Switch</Field.Legend>
				<Field.Group>
					<Field.Field orientation="horizontal">
						<Switch id="lab-sw-notify" bind:checked={notify} />
						<Field.Label for="lab-sw-notify">Notifications</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal">
						<Switch id="lab-sw-off" />
						<Field.Label for="lab-sw-off">Reduce motion</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal">
						<Switch id="lab-sw-sm" size="sm" checked />
						<Field.Label for="lab-sw-sm">Small, on</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal" data-disabled>
						<Switch id="lab-sw-disabled" disabled checked />
						<Field.Label for="lab-sw-disabled">Disabled, on</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal" data-disabled>
						<Switch id="lab-sw-disabled-off" disabled />
						<Field.Label for="lab-sw-disabled-off">Disabled, off</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal" data-invalid>
						<Switch id="lab-sw-invalid" aria-invalid="true" />
						<Field.Label for="lab-sw-invalid">Invalid</Field.Label>
					</Field.Field>
				</Field.Group>
			</Field.Set>
		</div>

		<Field.Set id="field">
			<Field.Legend variant="legend">Palette (choice cards)</Field.Legend>
			<RadioGroup.Root bind:value={paletteChoice} class="grid gap-3 md:grid-cols-3">
				{#each [{ v: 'sun', d: 'Warm yellow on paper.' }, { v: 'lagoon', d: 'Teal with a coral signal.' }, { v: 'dusk', d: 'Indigo field, coral signal.' }] as option (option.v)}
					<Field.Label for={`lab-card-${option.v}`}>
						<Field.Field orientation="horizontal">
							<Field.Content>
								<Field.Title class="capitalize">{option.v}</Field.Title>
								<Field.Description>{option.d}</Field.Description>
							</Field.Content>
							<RadioGroup.Item value={option.v} id={`lab-card-${option.v}`} />
						</Field.Field>
					</Field.Label>
				{/each}
			</RadioGroup.Root>
		</Field.Set>

		<Field.Label for="lab-card-switch" class="max-w-md">
			<Field.Field orientation="horizontal">
				<Field.Content>
					<Field.Title>Share usage data</Field.Title>
					<Field.Description>Anonymous counts of which palettes are picked.</Field.Description>
				</Field.Content>
				<Switch id="lab-card-switch" />
			</Field.Field>
		</Field.Label>
	</section>

	<!-- Slider -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label">Slider</h2>
		<div class="flex flex-wrap items-start gap-10">
			<Field.Field class="w-64">
				<Field.Label>Volume <span class="text-muted-foreground ml-auto tabular-nums">{volume}</span></Field.Label>
				<Slider type="single" bind:value={volume} max={100} step={1} />
			</Field.Field>
			<Field.Field class="w-64">
				<Field.Label>
					Price range
					<span class="text-muted-foreground ml-auto tabular-nums">€{priceRange[0]} to €{priceRange[1]}</span>
				</Field.Label>
				<Slider type="multiple" bind:value={priceRange} max={100} step={5} />
			</Field.Field>
			<Field.Field class="w-64" data-disabled>
				<Field.Label>Disabled</Field.Label>
				<Slider type="single" value={60} disabled />
			</Field.Field>
			<div class="flex h-40 items-center gap-6">
				<Slider type="single" value={30} orientation="vertical" />
				<Slider type="multiple" value={[20, 70]} orientation="vertical" />
			</div>
		</div>
	</section>

	<!-- Calendars -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label">Calendar and range calendar</h2>
		<div class="flex flex-wrap items-start gap-8">
			<Calendar type="single" bind:value={date} />
			<RangeCalendar bind:value={range} />
			<Calendar type="single" bind:value={dropdownDate} captionLayout="dropdown" />
			<Calendar
				type="single"
				value={now}
				isDateDisabled={(d) => d.day % 7 === 0}
				isDateUnavailable={(d) => d.day === 13}
			/>
		</div>
	</section>

	<!-- Kbd and Label -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label">Kbd and label</h2>
		<div class="flex flex-wrap items-center gap-6">
			<Kbd.Root>Esc</Kbd.Root>
			<Kbd.Group>
				<Kbd.Root>Ctrl</Kbd.Root>
				<span class="text-muted-foreground text-xs">+</span>
				<Kbd.Root>Shift</Kbd.Root>
				<span class="text-muted-foreground text-xs">+</span>
				<Kbd.Root>P</Kbd.Root>
			</Kbd.Group>
			<p class="text-muted-foreground text-sm">
				Press <Kbd.Root>⌘</Kbd.Root> <Kbd.Root>K</Kbd.Root> to search palettes.
			</p>
			<Button variant="outline">
				Search
				<Kbd.Root>/</Kbd.Root>
			</Button>
		</div>
		<div class="flex flex-wrap items-center gap-6">
			<div class="flex items-center gap-2">
				<Checkbox id="lab-label-terms" />
				<Label for="lab-label-terms">Plain label beside a checkbox</Label>
			</div>
			<div class="flex items-center gap-2">
				<InfoIcon class="text-muted-foreground size-4" />
				<Label>Label with an icon</Label>
			</div>
		</div>
	</section>

	<!-- Form -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label">Form (superforms, client-side)</h2>
		<form method="POST" {@attach fromAction(enhance)} class="flex max-w-md flex-col gap-6">
			<Form.Field form={profileForm} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Display name</Form.Label>
						<Input {...props} bind:value={$profile.name} placeholder="Ada Lovelace" />
					{/snippet}
				</Form.Control>
				<Form.Description>Shown on palettes you publish.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field form={profileForm} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input {...props} type="email" bind:value={$profile.email} placeholder="ada@isometric.design" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Fieldset form={profileForm} name="city">
				<Form.Legend>City you work from</Form.Legend>
				<RadioGroup.Root bind:value={$profile.city} name="city">
					{#each cities.slice(0, 3) as c (c.value)}
						<div class="flex items-center gap-3">
							<Form.Control>
								{#snippet children({ props })}
									<RadioGroup.Item value={c.value} {...props} />
									<Form.Label class="font-normal">{c.label}</Form.Label>
								{/snippet}
							</Form.Control>
						</div>
					{/each}
				</RadioGroup.Root>
				<Form.FieldErrors />
			</Form.Fieldset>
			<div class="flex gap-3">
				<Form.Button>Save profile</Form.Button>
				<Button variant="ghost" type="reset" onclick={() => profileForm.reset()}>Reset</Button>
			</div>
		</form>
	</section>
</main>
