<script lang="ts">
	import { tick } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import {
		DateFormatter,
		getLocalTimeZone,
		isWeekend,
		today,
		type DateValue
	} from '@internationalized/date';
	import type { DateRange } from 'bits-ui';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import GitBranchIcon from '@lucide/svelte/icons/git-branch';
	import { Page, Section, Demo } from '#lib/components/showcase/index.js';
	import { Checkbox } from '#lib/components/ui/checkbox/index.js';
	import * as RadioGroup from '#lib/components/ui/radio-group/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Slider } from '#lib/components/ui/slider/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import * as Popover from '#lib/components/ui/popover/index.js';
	import * as Command from '#lib/components/ui/command/index.js';
	import { Calendar } from '#lib/components/ui/calendar/index.js';
	import { RangeCalendar } from '#lib/components/ui/range-calendar/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { chapterBySlug } from '#lib/catalog.js';

	const chapter = chapterBySlug('selection')!;

	const REGIONS = [
		{ value: 'fra', label: 'Frankfurt' },
		{ value: 'sfo', label: 'San Francisco' },
		{ value: 'sin', label: 'Singapore' },
		{ value: 'gru', label: 'São Paulo' }
	];

	const BRANCHES = [
		'main',
		'stairs/landing',
		'rotor/snap',
		'atlas/map-tiles',
		'atlas/offline',
		'docs/typography',
		'fix/cache-headers'
	];

	const PEOPLE = [
		{ team: 'Atlas guides', names: ['Ines Halvorsen', 'Tomás Okafor', 'Mira Lindqvist'] },
		{ team: 'Platform', names: ['Ana Ribeiro', 'Jonah Weller', 'Priya Natarajan', 'Kenji Moreau'] }
	];

	// Checkbox
	let licence = $state(false);
	let deployTo = $state<string[]>(['fra', 'sin']);
	let allRegions = $derived(deployTo.length === REGIONS.length);
	let someRegions = $derived(deployTo.length > 0 && deployTo.length < REGIONS.length);
	function toggleRegion(value: string, on: boolean) {
		deployTo = on ? [...deployTo, value] : deployTo.filter((v) => v !== value);
	}
	let addons = $state({ images: true, analytics: false });

	// Radio group
	let promote = $state('stairs/landing');
	let cache = $state('reuse');
	let retention = $state('30');
	let plan = $state('team');

	// Switch
	let autoDeploy = $state(true);
	let previews = $state(true);
	let protectPreviews = $state(false);
	let compressImages = $state(true);
	let maintenance = $state(false);

	// Slider
	let instances = $state(3);
	let latency = $state([80, 220]);
	let canary = $state(25);
	let weights = $state([40, 25, 20, 15]);

	// Select
	let selectRegion = $state('');
	let selectBranch = $state('main');
	let teams = $state<string[]>(['Atlas guides']);
	const regionLabel = (v: string) => REGIONS.find((r) => r.value === v)?.label;

	// Combobox
	let branchOpen = $state(false);
	let branch = $state('');
	let branchTrigger = $state<HTMLButtonElement>(null!);
	function closeBranch() {
		branchOpen = false;
		tick().then(() => branchTrigger.focus());
	}

	let assigneeOpen = $state(false);
	let assignee = $state('Ana Ribeiro');
	let assigneeTrigger = $state<HTMLButtonElement>(null!);
	function closeAssignee() {
		assigneeOpen = false;
		tick().then(() => assigneeTrigger.focus());
	}

	let notifyOpen = $state(false);
	let notify = $state<string[]>(['Ines Halvorsen', 'Jonah Weller']);
	function toggleNotify(name: string) {
		notify = notify.includes(name) ? notify.filter((n) => n !== name) : [...notify, name];
	}

	// Calendar, date picker, range calendar
	const now = today(getLocalTimeZone());
	const wide = new MediaQuery('min-width: 48rem');
	const medium = new DateFormatter('en-US', { dateStyle: 'medium' });
	const long = new DateFormatter('en-US', { dateStyle: 'long' });
	const fmt = (d: DateValue, f = medium) => f.format(d.toDate(getLocalTimeZone()));

	let day = $state<DateValue | undefined>(now.add({ days: 3 }));
	let windows = $state<DateValue[]>([now.add({ days: 2 }), now.add({ days: 9 })]);
	let launch = $state<DateValue | undefined>(now.set({ day: 1 }).add({ months: 2 }));
	let fieldTrip = $state<DateValue | undefined>();
	const weekends = (d: DateValue) => isWeekend(d, 'en-US');

	let releaseOpen = $state(false);
	let release = $state<DateValue | undefined>();
	let freezeOpen = $state(false);
	let freezeDate = $state<DateValue | undefined>(now.add({ days: 14 }));
	let contractStart = $state<DateValue | undefined>();
	let reportOpen = $state(false);
	let report = $state<DateRange | undefined>({ start: now.subtract({ days: 13 }), end: now });

	let range = $state<DateRange | undefined>({ start: now.add({ days: 4 }), end: now.add({ days: 8 }) });
	let campaign = $state<DateRange | undefined>({ start: now.add({ days: 10 }), end: now.add({ days: 24 }) });
	let freeze = $state<DateRange | undefined>();
</script>

<svelte:head>
	<title>{chapter.title} · Isometric</title>
	<meta
		name="description"
		content="Checkbox, radio group, switch, slider, select, combobox, calendar, date picker and range calendar: the controls that pick one option, or several."
	/>
</svelte:head>

<Page
	title={chapter.title}
	description={chapter.subtitle}
	chapter={{ numeral: chapter.numeral, connective: chapter.connective }}
>
	<!-- Checkbox -->
	<Section
		title="Checkbox"
		description="Turns one option on or off as part of a form that is saved later. For a setting that applies at once use Switch; for one choice out of several use Radio group."
	>
		<Demo
			label="Default"
			spec="bind:checked"
			code={`<Field.Field orientation="horizontal" class="w-fit">
	<Checkbox id="sel-licence" bind:checked={licence} />
	<Field.Label for="sel-licence">Publish Atlas photos under the park's open licence</Field.Label>
</Field.Field>`}
		>
			<Field.Field orientation="horizontal" class="w-fit">
				<Checkbox id="sel-licence" bind:checked={licence} />
				<Field.Label for="sel-licence">Publish Atlas photos under the park's open licence</Field.Label>
			</Field.Field>
			<span class="text-muted-foreground text-xs">checked: {licence}</span>
		</Demo>

		<Demo
			label="States"
			spec="unchecked · checked · indeterminate · disabled · invalid"
			code='<Checkbox aria-label="Unchecked" />'
		>
			<Checkbox aria-label="Unchecked" />
			<Checkbox checked aria-label="Checked" />
			<Checkbox indeterminate aria-label="Indeterminate" />
			<Checkbox disabled aria-label="Disabled" />
			<Checkbox checked disabled aria-label="Disabled and checked" />
			<Checkbox aria-invalid="true" aria-label="Invalid" />
		</Demo>

		<Demo
			label="With a description"
			spec="FieldContent · FieldDescription"
			align="start"
			code={`<Field.Field orientation="horizontal" class="max-w-md">
	<Checkbox id="sel-purge" checked />
	<Field.Content>
		<Field.Label for="sel-purge">Purge the cache after each deploy</Field.Label>
		<Field.Description>Visitors get the new build within seconds. The first requests in each region are slower while the cache refills.</Field.Description>
	</Field.Content>
</Field.Field>`}
		>
			<Field.Field orientation="horizontal" class="max-w-md">
				<Checkbox id="sel-purge" checked />
				<Field.Content>
					<Field.Label for="sel-purge">Purge the cache after each deploy</Field.Label>
					<Field.Description>Visitors get the new build within seconds. The first requests in each region are slower while the cache refills.</Field.Description>
				</Field.Content>
			</Field.Field>
		</Demo>

		<Demo
			label="A group with select all"
			spec="indeterminate parent · FieldSet"
			align="start"
			code={`<Field.Set class="w-full max-w-xs">
	<Field.Legend variant="label">Deploy to</Field.Legend>
	<Field.Field orientation="horizontal">
		<Checkbox
			id="sel-all-regions"
			checked={allRegions}
			indeterminate={someRegions}
			onCheckedChange={(on) => (deployTo = on ? REGIONS.map((r) => r.value) : [])}
		/>
		<Field.Label for="sel-all-regions">All regions</Field.Label>
	</Field.Field>
	<Field.Separator />
	<Field.Group data-slot="checkbox-group">
		{#each REGIONS as region (region.value)}
			<Field.Field orientation="horizontal">
				<Checkbox
					id="sel-region-{region.value}"
					checked={deployTo.includes(region.value)}
					onCheckedChange={(on) => toggleRegion(region.value, on)}
				/>
				<Field.Label for="sel-region-{region.value}">{region.label}</Field.Label>
			</Field.Field>
		{/each}
	</Field.Group>
</Field.Set>`}
		>
			<Field.Set class="w-full max-w-xs">
				<Field.Legend variant="label">Deploy to</Field.Legend>
				<Field.Field orientation="horizontal">
					<Checkbox
						id="sel-all-regions"
						checked={allRegions}
						indeterminate={someRegions}
						onCheckedChange={(on) => (deployTo = on ? REGIONS.map((r) => r.value) : [])}
					/>
					<Field.Label for="sel-all-regions">All regions</Field.Label>
				</Field.Field>
				<Field.Separator />
				<Field.Group data-slot="checkbox-group">
					{#each REGIONS as region (region.value)}
						<Field.Field orientation="horizontal">
							<Checkbox
								id="sel-region-{region.value}"
								checked={deployTo.includes(region.value)}
								onCheckedChange={(on) => toggleRegion(region.value, on)}
							/>
							<Field.Label for="sel-region-{region.value}">{region.label}</Field.Label>
						</Field.Field>
					{/each}
				</Field.Group>
			</Field.Set>
		</Demo>

		<Demo
			label="Choice cards"
			spec="FieldLabel wrapping a horizontal Field"
			align="start"
			code={`<Field.Group class="w-full max-w-md">
	<Field.Label for="sel-addon-images">
		<Field.Field orientation="horizontal">
			<Checkbox id="sel-addon-images" bind:checked={addons.images} />
			<Field.Content>
				<Field.Title>Image optimisation</Field.Title>
				<Field.Description>Resizes and re-encodes images at the edge. Saved 38.4 GB last month.</Field.Description>
			</Field.Content>
		</Field.Field>
	</Field.Label>
	<Field.Label for="sel-addon-analytics">
		<Field.Field orientation="horizontal">
			<Checkbox id="sel-addon-analytics" bind:checked={addons.analytics} />
			<Field.Content>
				<Field.Title>Edge analytics</Field.Title>
				<Field.Description>Counts visits per region without cookies.</Field.Description>
			</Field.Content>
		</Field.Field>
	</Field.Label>
</Field.Group>`}
		>
			<Field.Group class="w-full max-w-md">
				<Field.Label for="sel-addon-images">
					<Field.Field orientation="horizontal">
						<Checkbox id="sel-addon-images" bind:checked={addons.images} />
						<Field.Content>
							<Field.Title>Image optimisation</Field.Title>
							<Field.Description>Resizes and re-encodes images at the edge. Saved 38.4 GB last month.</Field.Description>
						</Field.Content>
					</Field.Field>
				</Field.Label>
				<Field.Label for="sel-addon-analytics">
					<Field.Field orientation="horizontal">
						<Checkbox id="sel-addon-analytics" bind:checked={addons.analytics} />
						<Field.Content>
							<Field.Title>Edge analytics</Field.Title>
							<Field.Description>Counts visits per region without cookies.</Field.Description>
						</Field.Content>
					</Field.Field>
				</Field.Label>
			</Field.Group>
		</Demo>
	</Section>

	<!-- Radio group -->
	<Section
		title="Radio group"
		description="Picks exactly one option from a short list that is shown in full. For more than seven options use Select; for an on/off choice use Checkbox or Switch."
	>
		<Demo
			label="Default"
			spec="bind:value"
			align="start"
			code={`<RadioGroup.Root bind:value={promote} class="w-fit">
	{#each ['main', 'stairs/landing', 'rotor/snap'] as name (name)}
		<Field.Field orientation="horizontal">
			<RadioGroup.Item value={name} id="sel-promote-{name}" />
			<Field.Label for="sel-promote-{name}">{name}</Field.Label>
		</Field.Field>
	{/each}
</RadioGroup.Root>`}
		>
			<RadioGroup.Root bind:value={promote} class="w-fit">
				{#each ['main', 'stairs/landing', 'rotor/snap'] as name (name)}
					<Field.Field orientation="horizontal">
						<RadioGroup.Item value={name} id="sel-promote-{name}" />
						<Field.Label for="sel-promote-{name}">{name}</Field.Label>
					</Field.Field>
				{/each}
			</RadioGroup.Root>
			<span class="text-muted-foreground text-xs">Promote {promote} to production</span>
		</Demo>

		<Demo
			label="With descriptions"
			spec="FieldSet · FieldLegend · FieldContent"
			align="start"
			code={`<Field.Set class="max-w-md">
	<Field.Legend variant="label">Build cache</Field.Legend>
	<RadioGroup.Root bind:value={cache}>
		<Field.Field orientation="horizontal">
			<RadioGroup.Item value="reuse" id="sel-cache-reuse" />
			<Field.Content>
				<Field.Label for="sel-cache-reuse">Reuse the cache</Field.Label>
				<Field.Description>Fastest. Restores 1.2 GB of dependencies from the last build.</Field.Description>
			</Field.Content>
		</Field.Field>
		<Field.Field orientation="horizontal">
			<RadioGroup.Item value="clear" id="sel-cache-clear" />
			<Field.Content>
				<Field.Label for="sel-cache-clear">Clear the cache and rebuild</Field.Label>
				<Field.Description>Use after changing the lockfile or the Node version.</Field.Description>
			</Field.Content>
		</Field.Field>
	</RadioGroup.Root>
</Field.Set>`}
		>
			<Field.Set class="max-w-md">
				<Field.Legend variant="label">Build cache</Field.Legend>
				<RadioGroup.Root bind:value={cache}>
					<Field.Field orientation="horizontal">
						<RadioGroup.Item value="reuse" id="sel-cache-reuse" />
						<Field.Content>
							<Field.Label for="sel-cache-reuse">Reuse the cache</Field.Label>
							<Field.Description>Fastest. Restores 1.2 GB of dependencies from the last build.</Field.Description>
						</Field.Content>
					</Field.Field>
					<Field.Field orientation="horizontal">
						<RadioGroup.Item value="clear" id="sel-cache-clear" />
						<Field.Content>
							<Field.Label for="sel-cache-clear">Clear the cache and rebuild</Field.Label>
							<Field.Description>Use after changing the lockfile or the Node version.</Field.Description>
						</Field.Content>
					</Field.Field>
				</RadioGroup.Root>
			</Field.Set>
		</Demo>

		<Demo
			label="Horizontal"
			spec="orientation=horizontal"
			code={`<RadioGroup.Root bind:value={retention} orientation="horizontal" class="flex w-fit flex-wrap gap-6" aria-label="Log retention">
	{#each ['7', '30', '90'] as days (days)}
		<Field.Field orientation="horizontal" class="w-fit">
			<RadioGroup.Item value={days} id="sel-retention-{days}" />
			<Field.Label for="sel-retention-{days}">{days} days</Field.Label>
		</Field.Field>
	{/each}
</RadioGroup.Root>`}
		>
			<RadioGroup.Root bind:value={retention} orientation="horizontal" class="flex w-fit flex-wrap gap-6" aria-label="Log retention">
				{#each ['7', '30', '90'] as days (days)}
					<Field.Field orientation="horizontal" class="w-fit">
						<RadioGroup.Item value={days} id="sel-retention-{days}" />
						<Field.Label for="sel-retention-{days}">{days} days</Field.Label>
					</Field.Field>
				{/each}
			</RadioGroup.Root>
		</Demo>

		<Demo
			label="States"
			spec="disabled item · invalid"
			align="start"
			code={`<RadioGroup.Root value="node22" class="w-fit" aria-label="Runtime">
	<Field.Field orientation="horizontal">
		<RadioGroup.Item value="node22" id="sel-runtime-22" />
		<Field.Label for="sel-runtime-22">Node 22</Field.Label>
	</Field.Field>
	<Field.Field orientation="horizontal" data-disabled="true">
		<RadioGroup.Item value="node18" id="sel-runtime-18" disabled />
		<Field.Label for="sel-runtime-18">Node 18 (retired)</Field.Label>
	</Field.Field>
</RadioGroup.Root>`}
		>
			<RadioGroup.Root value="node22" class="w-fit" aria-label="Runtime">
				<Field.Field orientation="horizontal">
					<RadioGroup.Item value="node22" id="sel-runtime-22" />
					<Field.Label for="sel-runtime-22">Node 22</Field.Label>
				</Field.Field>
				<Field.Field orientation="horizontal" data-disabled="true">
					<RadioGroup.Item value="node18" id="sel-runtime-18" disabled />
					<Field.Label for="sel-runtime-18">Node 18 (retired)</Field.Label>
				</Field.Field>
			</RadioGroup.Root>
			<Field.Set class="w-fit" data-invalid="true">
				<Field.Legend variant="label">Billing contact</Field.Legend>
				<RadioGroup.Root aria-invalid="true">
					<Field.Field orientation="horizontal" data-invalid="true">
						<RadioGroup.Item value="owner" id="sel-billing-owner" aria-invalid="true" />
						<Field.Label for="sel-billing-owner">Team owner</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal" data-invalid="true">
						<RadioGroup.Item value="finance" id="sel-billing-finance" aria-invalid="true" />
						<Field.Label for="sel-billing-finance">Finance inbox</Field.Label>
					</Field.Field>
				</RadioGroup.Root>
				<Field.Error>Choose who receives invoices.</Field.Error>
			</Field.Set>
		</Demo>

		<Demo
			label="Choice cards"
			spec="FieldLabel wrapping a horizontal Field"
			align="start"
			code={`<RadioGroup.Root bind:value={plan} class="w-full max-w-md" aria-label="Plan">
	{#each [
		{ value: 'hobby', title: 'Hobby', note: 'One project, previews on every branch.' },
		{ value: 'team', title: 'Team', note: 'Unlimited projects, 1 TB of bandwidth, shared deploy keys.' },
		{ value: 'studio', title: 'Studio', note: 'Everything in Team, plus regional pinning and audit logs.' }
	] as option (option.value)}
		<Field.Label for="sel-plan-{option.value}">
			<Field.Field orientation="horizontal">
				<Field.Content>
					<Field.Title>{option.title}</Field.Title>
					<Field.Description>{option.note}</Field.Description>
				</Field.Content>
				<RadioGroup.Item value={option.value} id="sel-plan-{option.value}" />
			</Field.Field>
		</Field.Label>
	{/each}
</RadioGroup.Root>`}
		>
			<RadioGroup.Root bind:value={plan} class="w-full max-w-md" aria-label="Plan">
				{#each [
					{ value: 'hobby', title: 'Hobby', note: 'One project, previews on every branch.' },
					{ value: 'team', title: 'Team', note: 'Unlimited projects, 1 TB of bandwidth, shared deploy keys.' },
					{ value: 'studio', title: 'Studio', note: 'Everything in Team, plus regional pinning and audit logs.' }
				] as option (option.value)}
					<Field.Label for="sel-plan-{option.value}">
						<Field.Field orientation="horizontal">
							<Field.Content>
								<Field.Title>{option.title}</Field.Title>
								<Field.Description>{option.note}</Field.Description>
							</Field.Content>
							<RadioGroup.Item value={option.value} id="sel-plan-{option.value}" />
						</Field.Field>
					</Field.Label>
				{/each}
			</RadioGroup.Root>
		</Demo>
	</Section>

	<!-- Switch -->
	<Section
		title="Switch"
		description="Turns a setting on or off, and the change takes effect at once. In a form that is saved with a button use Checkbox."
	>
		<Demo
			label="Default"
			spec="bind:checked"
			code={`<Field.Field orientation="horizontal" class="w-fit">
	<Switch id="sel-auto-deploy" bind:checked={autoDeploy} />
	<Field.Label for="sel-auto-deploy">Deploy main on every push</Field.Label>
</Field.Field>`}
		>
			<Field.Field orientation="horizontal" class="w-fit">
				<Switch id="sel-auto-deploy" bind:checked={autoDeploy} />
				<Field.Label for="sel-auto-deploy">Deploy main on every push</Field.Label>
			</Field.Field>
			<span class="text-muted-foreground text-xs">{autoDeploy ? 'On' : 'Off'}</span>
		</Demo>

		<Demo
			label="Sizes"
			spec="sm · default"
			code='<Switch size="sm" checked aria-label="Small switch" />'
		>
			<Switch size="sm" checked aria-label="Small switch" />
			<Switch checked aria-label="Default switch" />
		</Demo>

		<Demo
			label="States"
			spec="off · on · disabled · invalid"
			code='<Switch aria-label="Off" />'
		>
			<Switch aria-label="Off" />
			<Switch checked aria-label="On" />
			<Switch disabled aria-label="Disabled" />
			<Switch checked disabled aria-label="Disabled and on" />
			<Switch aria-invalid="true" aria-label="Invalid" />
		</Demo>

		<Demo
			label="A settings list"
			spec="horizontal Field · FieldContent · data-disabled"
			align="start"
			code={`<Field.Group class="max-w-md">
	<Field.Field orientation="horizontal">
		<Field.Content>
			<Field.Label for="sel-previews">Preview deployments</Field.Label>
			<Field.Description>Build every branch at its own address.</Field.Description>
		</Field.Content>
		<Switch id="sel-previews" bind:checked={previews} />
	</Field.Field>
	<Field.Field orientation="horizontal">
		<Field.Content>
			<Field.Label for="sel-protect">Password-protect previews</Field.Label>
			<Field.Description>Visitors need the team password to open a preview.</Field.Description>
		</Field.Content>
		<Switch id="sel-protect" bind:checked={protectPreviews} disabled={!previews} />
	</Field.Field>
	<Field.Field orientation="horizontal">
		<Field.Content>
			<Field.Label for="sel-compress">Compress responses</Field.Label>
			<Field.Description>Brotli for text, AVIF for images where the browser accepts it.</Field.Description>
		</Field.Content>
		<Switch id="sel-compress" bind:checked={compressImages} />
	</Field.Field>
	<Field.Field orientation="horizontal" data-disabled="true">
		<Field.Content>
			<Field.Label for="sel-pinning">Regional pinning</Field.Label>
			<Field.Description>Available on the Studio plan.</Field.Description>
		</Field.Content>
		<Switch id="sel-pinning" disabled />
	</Field.Field>
</Field.Group>`}
		>
			<Field.Group class="max-w-md">
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Label for="sel-previews">Preview deployments</Field.Label>
						<Field.Description>Build every branch at its own address.</Field.Description>
					</Field.Content>
					<Switch id="sel-previews" bind:checked={previews} />
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Label for="sel-protect">Password-protect previews</Field.Label>
						<Field.Description>Visitors need the team password to open a preview.</Field.Description>
					</Field.Content>
					<Switch id="sel-protect" bind:checked={protectPreviews} disabled={!previews} />
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Label for="sel-compress">Compress responses</Field.Label>
						<Field.Description>Brotli for text, AVIF for images where the browser accepts it.</Field.Description>
					</Field.Content>
					<Switch id="sel-compress" bind:checked={compressImages} />
				</Field.Field>
				<Field.Field orientation="horizontal" data-disabled="true">
					<Field.Content>
						<Field.Label for="sel-pinning">Regional pinning</Field.Label>
						<Field.Description>Available on the Studio plan.</Field.Description>
					</Field.Content>
					<Switch id="sel-pinning" disabled />
				</Field.Field>
			</Field.Group>
		</Demo>

		<Demo
			label="Choice card"
			spec="FieldLabel wrapping a horizontal Field"
			align="start"
			code={`<Field.Label for="sel-maintenance" class="max-w-md">
	<Field.Field orientation="horizontal">
		<Field.Content>
			<Field.Title>Maintenance mode</Field.Title>
			<Field.Description>Serve a holding page from every region while Atlas data is migrated.</Field.Description>
		</Field.Content>
		<Switch id="sel-maintenance" bind:checked={maintenance} />
	</Field.Field>
</Field.Label>`}
		>
			<Field.Label for="sel-maintenance" class="max-w-md">
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Title>Maintenance mode</Field.Title>
						<Field.Description>Serve a holding page from every region while Atlas data is migrated.</Field.Description>
					</Field.Content>
					<Switch id="sel-maintenance" bind:checked={maintenance} />
				</Field.Field>
			</Field.Label>
		</Demo>
	</Section>

	<!-- Slider -->
	<Section
		title="Slider"
		description="Picks a number, or a range, from a continuous scale where the rough position matters more than the exact figure. For an exact value use a number Input."
	>
		<Demo
			label="Default"
			spec="type=single · min 1 · max 12 · live value"
			code={`<Slider type="single" bind:value={instances} min={1} max={12} step={1} class="max-w-sm" aria-label="Instances" />`}
		>
			<div class="flex w-full max-w-sm flex-col gap-3">
				<Slider type="single" bind:value={instances} min={1} max={12} step={1} class="max-w-sm" aria-label="Instances" />
				<span class="text-muted-foreground text-xs">{instances} {instances === 1 ? 'instance' : 'instances'} in Frankfurt</span>
			</div>
		</Demo>

		<Demo
			label="Range"
			spec="type=multiple · two thumbs"
			code={`<Slider type="multiple" bind:value={latency} min={0} max={400} step={10} class="max-w-sm" aria-label="Healthy latency range" />`}
		>
			<div class="flex w-full max-w-sm flex-col gap-3">
				<Slider type="multiple" bind:value={latency} min={0} max={400} step={10} class="max-w-sm" aria-label="Healthy latency range" />
				<span class="text-muted-foreground text-xs">Alert when p95 latency leaves {latency[0]} to {latency[1]} ms</span>
			</div>
		</Demo>

		<Demo
			label="In a field"
			spec="step 5 · FieldTitle · FieldDescription"
			align="start"
			code={`<Field.Field class="max-w-sm">
	<Field.Title>Traffic to stairs/landing</Field.Title>
	<Slider type="single" bind:value={canary} max={100} step={5} aria-label="Traffic to stairs/landing" />
	<Field.Description>{canary}% of visitors see the preview; {100 - canary}% stay on main.</Field.Description>
</Field.Field>`}
		>
			<Field.Field class="max-w-sm">
				<Field.Title>Traffic to stairs/landing</Field.Title>
				<Slider type="single" bind:value={canary} max={100} step={5} aria-label="Traffic to stairs/landing" />
				<Field.Description>{canary}% of visitors see the preview; {100 - canary}% stay on main.</Field.Description>
			</Field.Field>
		</Demo>

		<Demo
			label="Vertical"
			spec="orientation=vertical"
			code={`<Slider type="single" orientation="vertical" bind:value={weights[0]} max={100} aria-label="Frankfurt weight" />`}
		>
			<div class="flex gap-8">
				{#each REGIONS as region, i (region.value)}
					<div class="flex h-48 flex-col items-center gap-3">
						<Slider type="single" orientation="vertical" bind:value={weights[i]} max={100} aria-label="{region.label} weight" />
						<span class="text-muted-foreground text-xs">{region.value.toUpperCase()} {weights[i]}</span>
					</div>
				{/each}
			</div>
		</Demo>

		<Demo
			label="Disabled"
			spec="disabled"
			code={`<Slider type="single" value={60} disabled class="max-w-sm" aria-label="Bandwidth cap" />`}
		>
			<Slider type="single" value={60} disabled class="max-w-sm" aria-label="Bandwidth cap" />
		</Demo>
	</Section>

	<!-- Select -->
	<Section
		title="Select"
		description="Picks one option, or several, from a list that opens in a layer. For a handful of options shown at once use Radio group; for a long list people search use Combobox."
	>
		<Demo
			label="Default"
			spec="type=single · items · SelectValue"
			code={`<Select.Root type="single" items={REGIONS} bind:value={selectRegion}>
	<Select.Trigger class="w-48" aria-label="Region">
		<Select.Value placeholder="Choose a region" />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each REGIONS as region (region.value)}
				<Select.Item value={region.value} label={region.label} />
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>`}
		>
			<Select.Root type="single" items={REGIONS} bind:value={selectRegion}>
				<Select.Trigger class="w-48" aria-label="Region">
					<Select.Value placeholder="Choose a region" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each REGIONS as region (region.value)}
							<Select.Item value={region.value} label={region.label} />
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<span class="text-muted-foreground text-xs">{selectRegion ? `Deploying to ${regionLabel(selectRegion)}` : 'No region yet'}</span>
		</Demo>

		<Demo
			label="Groups"
			spec="SelectGroup · SelectGroupHeading · SelectSeparator"
			code={`<Select.Root type="single" bind:value={selectBranch}>
	<Select.Trigger class="w-52" aria-label="Branch">
		<GitBranchIcon />
		<Select.Value class="flex-1" />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.GroupHeading>Production</Select.GroupHeading>
			<Select.Item value="main" label="main" />
		</Select.Group>
		<Select.Separator />
		<Select.Group>
			<Select.GroupHeading>Previews</Select.GroupHeading>
			{#each BRANCHES.slice(1) as name (name)}
				<Select.Item value={name} label={name} />
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>`}
		>
			<Select.Root type="single" bind:value={selectBranch}>
				<Select.Trigger class="w-52" aria-label="Branch">
					<GitBranchIcon />
					<Select.Value class="flex-1" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.GroupHeading>Production</Select.GroupHeading>
						<Select.Item value="main" label="main" />
					</Select.Group>
					<Select.Separator />
					<Select.Group>
						<Select.GroupHeading>Previews</Select.GroupHeading>
						{#each BRANCHES.slice(1) as name (name)}
							<Select.Item value={name} label={name} />
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</Demo>

		<Demo
			label="Sizes"
			spec="sm · default"
			code={`<Select.Root type="single" value="25" items={[{ value: '25', label: '25 rows' }, { value: '50', label: '50 rows' }]}>
	<Select.Trigger size="sm" aria-label="Rows per page">
		<Select.Value />
	</Select.Trigger>
	<Select.Content>
		<Select.Item value="25" label="25 rows" />
		<Select.Item value="50" label="50 rows" />
	</Select.Content>
</Select.Root>`}
		>
			<Select.Root type="single" value="25" items={[{ value: '25', label: '25 rows' }, { value: '50', label: '50 rows' }]}>
				<Select.Trigger size="sm" aria-label="Rows per page">
					<Select.Value />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="25" label="25 rows" />
					<Select.Item value="50" label="50 rows" />
				</Select.Content>
			</Select.Root>
			<Select.Root type="single" value="25" items={[{ value: '25', label: '25 rows' }, { value: '50', label: '50 rows' }]}>
				<Select.Trigger aria-label="Rows per page, default size">
					<Select.Value />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="25" label="25 rows" />
					<Select.Item value="50" label="50 rows" />
				</Select.Content>
			</Select.Root>
		</Demo>

		<Demo
			label="States"
			spec="disabled · invalid · disabled item"
			code={`<Select.Root type="single" disabled>
	<Select.Trigger class="w-44" aria-label="Runtime">
		<Select.Value placeholder="Node 22" />
	</Select.Trigger>
	<Select.Content>
		<Select.Item value="node22" label="Node 22" />
	</Select.Content>
</Select.Root>`}
		>
			<Select.Root type="single" disabled>
				<Select.Trigger class="w-44" aria-label="Runtime">
					<Select.Value placeholder="Node 22" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="node22" label="Node 22" />
				</Select.Content>
			</Select.Root>
			<Select.Root type="single">
				<Select.Trigger class="w-52" aria-invalid="true" aria-label="Framework">
					<Select.Value placeholder="Choose a framework" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="sveltekit" label="SvelteKit" />
					<Select.Item value="static" label="Static files" />
					<Select.Item value="legacy" label="Legacy preset (retired)" disabled />
				</Select.Content>
			</Select.Root>
		</Demo>

		<Demo
			label="Multiple"
			spec="type=multiple · custom trigger text"
			code={`<Select.Root type="multiple" bind:value={teams}>
	<Select.Trigger class="w-56" aria-label="Teams with access">
		{teams.length === 0 ? 'No teams' : teams.length === 1 ? teams[0] : \`\${teams.length} teams\`}
	</Select.Trigger>
	<Select.Content>
		{#each ['Atlas guides', 'Platform', 'Design', 'Finance'] as team (team)}
			<Select.Item value={team} label={team} />
		{/each}
	</Select.Content>
</Select.Root>`}
		>
			<Select.Root type="multiple" bind:value={teams}>
				<Select.Trigger class="w-56" aria-label="Teams with access">
					{teams.length === 0 ? 'No teams' : teams.length === 1 ? teams[0] : `${teams.length} teams`}
				</Select.Trigger>
				<Select.Content>
					{#each ['Atlas guides', 'Platform', 'Design', 'Finance'] as team (team)}
						<Select.Item value={team} label={team} />
					{/each}
				</Select.Content>
			</Select.Root>
		</Demo>

		<Demo
			label="In a field"
			spec="FieldLabel · id on the trigger"
			align="start"
			code={`<Field.Field class="max-w-xs">
	<Field.Label for="sel-field-region">Fallback region</Field.Label>
	<Select.Root type="single" items={REGIONS} value="sin">
		<Select.Trigger id="sel-field-region" class="w-full">
			<Select.Value />
		</Select.Trigger>
		<Select.Content>
			{#each REGIONS as region (region.value)}
				<Select.Item value={region.value} label={region.label} />
			{/each}
		</Select.Content>
	</Select.Root>
	<Field.Description>Serves traffic when the primary region fails a health check.</Field.Description>
</Field.Field>`}
		>
			<Field.Field class="max-w-xs">
				<Field.Label for="sel-field-region">Fallback region</Field.Label>
				<Select.Root type="single" items={REGIONS} value="sin">
					<Select.Trigger id="sel-field-region" class="w-full">
						<Select.Value />
					</Select.Trigger>
					<Select.Content>
						{#each REGIONS as region (region.value)}
							<Select.Item value={region.value} label={region.label} />
						{/each}
					</Select.Content>
				</Select.Root>
				<Field.Description>Serves traffic when the primary region fails a health check.</Field.Description>
			</Field.Field>
		</Demo>
	</Section>

	<!-- Combobox -->
	<Section
		title="Combobox"
		description="A select you can type into: a Popover holding a Command list, filtered as you type. Use it when the list is long enough that people search rather than scan."
	>
		<Demo
			label="Default"
			spec="Popover · Command · refocuses the trigger"
			code={`<Popover.Root bind:open={branchOpen}>
	<Popover.Trigger bind:ref={branchTrigger}>
		{#snippet child({ props })}
			<Button {...props} variant="outline" class="w-56 justify-between" role="combobox" aria-expanded={branchOpen}>
				{branch || 'Choose a branch'}
				<ChevronDownIcon data-icon="inline-end" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-56 p-0" align="start">
		<Command.Root>
			<Command.Input placeholder="Search branches" />
			<Command.List>
				<Command.Empty>No branch matches.</Command.Empty>
				<Command.Group>
					{#each BRANCHES as name (name)}
						<Command.Item value={name} data-checked={branch === name} onSelect={() => { branch = name; closeBranch(); }}>
							{name}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>`}
		>
			<Popover.Root bind:open={branchOpen}>
				<Popover.Trigger bind:ref={branchTrigger}>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="w-56 justify-between" role="combobox" aria-expanded={branchOpen}>
							{branch || 'Choose a branch'}
							<ChevronDownIcon data-icon="inline-end" />
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-56 p-0" align="start">
					<Command.Root>
						<Command.Input placeholder="Search branches" />
						<Command.List>
							<Command.Empty>No branch matches.</Command.Empty>
							<Command.Group>
								{#each BRANCHES as name (name)}
									<Command.Item value={name} data-checked={branch === name} onSelect={() => { branch = name; closeBranch(); }}>
										{name}
									</Command.Item>
								{/each}
							</Command.Group>
						</Command.List>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
		</Demo>

		<Demo
			label="With groups"
			spec="CommandGroup heading · one choice"
			code={`<Popover.Root bind:open={assigneeOpen}>
	<Popover.Trigger bind:ref={assigneeTrigger}>
		{#snippet child({ props })}
			<Button {...props} variant="outline" class="w-56 justify-between" role="combobox" aria-expanded={assigneeOpen} aria-label="Assign review to">
				{assignee}
				<ChevronDownIcon data-icon="inline-end" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-64 p-0" align="start">
		<Command.Root>
			<Command.Input placeholder="Search people" />
			<Command.List>
				<Command.Empty>Nobody by that name.</Command.Empty>
				{#each PEOPLE as group (group.team)}
					<Command.Group heading={group.team}>
						{#each group.names as name (name)}
							<Command.Item value={name} data-checked={assignee === name} onSelect={() => { assignee = name; closeAssignee(); }}>
								{name}
							</Command.Item>
						{/each}
					</Command.Group>
				{/each}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>`}
		>
			<Popover.Root bind:open={assigneeOpen}>
				<Popover.Trigger bind:ref={assigneeTrigger}>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="w-56 justify-between" role="combobox" aria-expanded={assigneeOpen} aria-label="Assign review to">
							{assignee}
							<ChevronDownIcon data-icon="inline-end" />
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-64 p-0" align="start">
					<Command.Root>
						<Command.Input placeholder="Search people" />
						<Command.List>
							<Command.Empty>Nobody by that name.</Command.Empty>
							{#each PEOPLE as group (group.team)}
								<Command.Group heading={group.team}>
									{#each group.names as name (name)}
										<Command.Item value={name} data-checked={assignee === name} onSelect={() => { assignee = name; closeAssignee(); }}>
											{name}
										</Command.Item>
									{/each}
								</Command.Group>
							{/each}
						</Command.List>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
		</Demo>

		<Demo
			label="Multiple"
			spec="stays open · toggles · badges"
			class="flex-col"
			code={`<Popover.Root bind:open={notifyOpen}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" class="w-56 justify-between" role="combobox" aria-expanded={notifyOpen} aria-label="People to notify">
				{notify.length === 0 ? 'Notify nobody' : \`Notify \${notify.length} \${notify.length === 1 ? 'person' : 'people'}\`}
				<ChevronDownIcon data-icon="inline-end" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-64 p-0" align="start">
		<Command.Root>
			<Command.Input placeholder="Search people" />
			<Command.List>
				<Command.Empty>Nobody by that name.</Command.Empty>
				{#each PEOPLE as group (group.team)}
					<Command.Group heading={group.team}>
						{#each group.names as name (name)}
							<Command.Item value={name} data-checked={notify.includes(name)} onSelect={() => toggleNotify(name)}>
								{name}
							</Command.Item>
						{/each}
					</Command.Group>
				{/each}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>`}
		>
			<Popover.Root bind:open={notifyOpen}>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="w-56 justify-between" role="combobox" aria-expanded={notifyOpen} aria-label="People to notify">
							{notify.length === 0 ? 'Notify nobody' : `Notify ${notify.length} ${notify.length === 1 ? 'person' : 'people'}`}
							<ChevronDownIcon data-icon="inline-end" />
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-64 p-0" align="start">
					<Command.Root>
						<Command.Input placeholder="Search people" />
						<Command.List>
							<Command.Empty>Nobody by that name.</Command.Empty>
							{#each PEOPLE as group (group.team)}
								<Command.Group heading={group.team}>
									{#each group.names as name (name)}
										<Command.Item value={name} data-checked={notify.includes(name)} onSelect={() => toggleNotify(name)}>
											{name}
										</Command.Item>
									{/each}
								</Command.Group>
							{/each}
						</Command.List>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
			{#if notify.length}
				<div class="flex flex-wrap justify-center gap-1.5">
					{#each notify as name (name)}
						<Badge variant="secondary">{name}</Badge>
					{/each}
				</div>
			{/if}
		</Demo>
	</Section>

	<!-- Calendar -->
	<Section
		title="Calendar"
		description="A month grid for picking dates in place. In a form field where space is short use Date picker, which puts the same grid in a popover."
	>
		<Demo
			label="Single date"
			spec="type=single · bind:value"
			class="flex-col"
			code={`<Calendar type="single" bind:value={day} />`}
		>
			<Calendar type="single" bind:value={day} />
			<span class="text-muted-foreground text-xs">{day ? fmt(day, long) : 'No date picked'}</span>
		</Demo>

		<Demo
			label="Several dates"
			spec="type=multiple · maxDays 3"
			class="flex-col"
			code={`<Calendar type="multiple" bind:value={windows} maxDays={3} />`}
		>
			<Calendar type="multiple" bind:value={windows} maxDays={3} />
			<span class="text-muted-foreground text-xs">
				{windows.length} of 3 maintenance windows{windows.length ? `: ${windows.map((d) => fmt(d)).join(', ')}` : ''}
			</span>
		</Demo>

		<Demo
			label="Month and year dropdowns"
			spec="captionLayout · dropdown · dropdown-months · dropdown-years"
			code={`<Calendar type="single" bind:value={launch} captionLayout="dropdown" />`}
		>
			<Calendar type="single" bind:value={launch} captionLayout="dropdown" />
			<Calendar type="single" captionLayout="dropdown-months" />
		</Demo>

		<Demo
			label="Unavailable days"
			spec="isDateUnavailable · minValue today"
			code={`<Calendar type="single" bind:value={fieldTrip} isDateUnavailable={weekends} minValue={now} />`}
		>
			<Calendar type="single" bind:value={fieldTrip} isDateUnavailable={weekends} minValue={now} />
		</Demo>

		<Demo
			label="Two months"
			spec="numberOfMonths 2 · stacks on narrow screens"
			code={`<Calendar type="single" numberOfMonths={2} />`}
		>
			<Calendar type="single" numberOfMonths={2} />
		</Demo>
	</Section>

	<!-- Date picker -->
	<Section
		title="Date picker"
		description="A button that opens a Calendar in a popover, for date fields in forms. When the calendar has room on the page, show it in place."
	>
		<Demo
			label="Default"
			spec="Popover · Calendar · closes on pick"
			code={`<Popover.Root bind:open={releaseOpen}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" class="w-56 justify-start" aria-label="Release date">
				<CalendarIcon data-icon="inline-start" />
				{#if release}{fmt(release, long)}{:else}<span class="text-muted-foreground">Pick a release date</span>{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<Calendar type="single" bind:value={release} onValueChange={() => (releaseOpen = false)} />
	</Popover.Content>
</Popover.Root>`}
		>
			<Popover.Root bind:open={releaseOpen}>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="w-56 justify-start" aria-label="Release date">
							<CalendarIcon data-icon="inline-start" />
							{#if release}{fmt(release, long)}{:else}<span class="text-muted-foreground">Pick a release date</span>{/if}
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" align="start">
					<Calendar type="single" bind:value={release} onValueChange={() => (releaseOpen = false)} />
				</Popover.Content>
			</Popover.Root>
		</Demo>

		<Demo
			label="In a field"
			spec="FieldLabel · id on the trigger"
			align="start"
			code={`<Field.Field class="w-60">
	<Field.Label for="sel-freeze-date">Code freeze</Field.Label>
	<Popover.Root bind:open={freezeOpen}>
		<Popover.Trigger id="sel-freeze-date">
			{#snippet child({ props })}
				<Button {...props} variant="outline" class="justify-between">
					{freezeDate ? fmt(freezeDate, long) : 'Pick a date'}
					<ChevronDownIcon data-icon="inline-end" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0" align="start">
			<Calendar type="single" bind:value={freezeDate} minValue={now} onValueChange={() => (freezeOpen = false)} />
		</Popover.Content>
	</Popover.Root>
	<Field.Description>Only fixes merge into main after this day.</Field.Description>
</Field.Field>`}
		>
			<Field.Field class="w-60">
				<Field.Label for="sel-freeze-date">Code freeze</Field.Label>
				<Popover.Root bind:open={freezeOpen}>
					<Popover.Trigger id="sel-freeze-date">
						{#snippet child({ props })}
							<Button {...props} variant="outline" class="justify-between">
								{freezeDate ? fmt(freezeDate, long) : 'Pick a date'}
								<ChevronDownIcon data-icon="inline-end" />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" align="start">
						<Calendar type="single" bind:value={freezeDate} minValue={now} onValueChange={() => (freezeOpen = false)} />
					</Popover.Content>
				</Popover.Root>
				<Field.Description>Only fixes merge into main after this day.</Field.Description>
			</Field.Field>
		</Demo>

		<Demo
			label="With month and year dropdowns"
			spec="captionLayout=dropdown · for dates far from today"
			align="start"
			code={`<Field.Field class="w-60">
	<Field.Label for="sel-contract-start">Contract start</Field.Label>
	<Popover.Root>
		<Popover.Trigger id="sel-contract-start">
			{#snippet child({ props })}
				<Button {...props} variant="outline" class="justify-between">
					{contractStart ? fmt(contractStart, long) : 'Pick a date'}
					<ChevronDownIcon data-icon="inline-end" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0" align="start">
			<Calendar type="single" bind:value={contractStart} captionLayout="dropdown" />
		</Popover.Content>
	</Popover.Root>
</Field.Field>`}
		>
			<Field.Field class="w-60">
				<Field.Label for="sel-contract-start">Contract start</Field.Label>
				<Popover.Root>
					<Popover.Trigger id="sel-contract-start">
						{#snippet child({ props })}
							<Button {...props} variant="outline" class="justify-between">
								{contractStart ? fmt(contractStart, long) : 'Pick a date'}
								<ChevronDownIcon data-icon="inline-end" />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" align="start">
						<Calendar type="single" bind:value={contractStart} captionLayout="dropdown" />
					</Popover.Content>
				</Popover.Root>
			</Field.Field>
		</Demo>

		<Demo
			label="A date range"
			spec="Popover · RangeCalendar · two months from md up"
			code={`<Popover.Root bind:open={reportOpen}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" class="w-64 justify-start" aria-label="Report period">
				<CalendarIcon data-icon="inline-start" />
				{#if report?.start && report.end}
					{fmt(report.start)} to {fmt(report.end)}
				{:else if report?.start}
					{fmt(report.start)}
				{:else}
					<span class="text-muted-foreground">Pick a period</span>
				{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<RangeCalendar bind:value={report} numberOfMonths={wide.current ? 2 : 1} maxValue={now} />
	</Popover.Content>
</Popover.Root>`}
		>
			<Popover.Root bind:open={reportOpen}>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="w-64 justify-start" aria-label="Report period">
							<CalendarIcon data-icon="inline-start" />
							{#if report?.start && report.end}
								{fmt(report.start)} to {fmt(report.end)}
							{:else if report?.start}
								{fmt(report.start)}
							{:else}
								<span class="text-muted-foreground">Pick a period</span>
							{/if}
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" align="start">
					<RangeCalendar bind:value={report} numberOfMonths={wide.current ? 2 : 1} maxValue={now} />
				</Popover.Content>
			</Popover.Root>
		</Demo>
	</Section>

	<!-- Range calendar -->
	<Section
		id="range-calendar"
		title="Range calendar"
		description="A month grid for picking a start and an end date. For a single day use Calendar."
	>
		<Demo
			label="Default"
			spec="bind:value · start and end"
			class="flex-col"
			code={`<RangeCalendar bind:value={range} />`}
		>
			<RangeCalendar bind:value={range} />
			<span class="text-muted-foreground text-xs">
				{#if range?.start && range.end}
					Atlas closed for re-surfacing from {fmt(range.start)} to {fmt(range.end)}
				{:else}
					Pick the last day
				{/if}
			</span>
		</Demo>

		<Demo
			label="Two months"
			spec="numberOfMonths 2"
			code={`<RangeCalendar bind:value={campaign} numberOfMonths={2} />`}
		>
			<RangeCalendar bind:value={campaign} numberOfMonths={2} />
		</Demo>

		<Demo
			label="Minimum and maximum length"
			spec="minDays 2 · maxDays 7 · minValue today"
			code={`<RangeCalendar bind:value={freeze} minDays={2} maxDays={7} minValue={now} />`}
		>
			<RangeCalendar bind:value={freeze} minDays={2} maxDays={7} minValue={now} />
		</Demo>

		<Demo
			label="With month and year dropdowns"
			spec="captionLayout=dropdown"
			code='<RangeCalendar captionLayout="dropdown" />'
		>
			<RangeCalendar captionLayout="dropdown" />
		</Demo>
	</Section>
</Page>
