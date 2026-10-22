<script lang="ts">
	import { AreaChart, BarChart, LineChart, PieChart } from 'layerchart';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import CircleXIcon from '@lucide/svelte/icons/circle-x';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import GitBranchIcon from '@lucide/svelte/icons/git-branch';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import KeyRoundIcon from '@lucide/svelte/icons/key-round';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
	import UserIcon from '@lucide/svelte/icons/user';
	import { Page, Section, Demo } from '#lib/components/showcase/index.js';
	import { IsoGlyph } from '#lib/components/app/index.js';
	import * as Accordion from '#lib/components/ui/accordion/index.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Carousel from '#lib/components/ui/carousel/index.js';
	import * as Chart from '#lib/components/ui/chart/index.js';
	import { Checkbox } from '#lib/components/ui/checkbox/index.js';
	import * as Collapsible from '#lib/components/ui/collapsible/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import * as Kbd from '#lib/components/ui/kbd/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { chapterBySlug } from '#lib/catalog.js';
	import {
		ATLAS_STOPS,
		BANDWIDTH,
		BUILD_MINUTES,
		DEPLOYMENTS,
		MONTHS,
		PAGE_STATS,
		PREVIEWS,
		RAINFALL,
		REGION_USAGE,
		STATUS_VARIANT,
		TTFB,
		formatInt,
		type PageStat
	} from '#lib/components/catalog/display.js';

	const chapter = chapterBySlug('display')!;

	// ---- table

	const totals = {
		requests: REGION_USAGE.reduce((n, r) => n + r.requests, 0),
		gigabytes: REGION_USAGE.reduce((n, r) => n + r.gigabytes, 0),
		cost: REGION_USAGE.reduce((n, r) => n + r.cost, 0)
	};

	let selected = $state<string[]>(['pv_2']);
	let allSelected = $derived(selected.length === PREVIEWS.length);
	let someSelected = $derived(selected.length > 0 && !allSelected);

	function selectAll(checked: boolean) {
		selected = checked ? PREVIEWS.map((p) => p.id) : [];
	}

	function selectRow(id: string, checked: boolean) {
		selected = checked ? [...selected, id] : selected.filter((s) => s !== id);
	}

	type SortKey = keyof PageStat;
	let sortKey = $state<SortKey>('requests');
	let sortDir = $state<'ascending' | 'descending'>('descending');

	let sortedPages = $derived(
		[...PAGE_STATS].sort((a, b) => {
			const x = a[sortKey];
			const y = b[sortKey];
			const order = typeof x === 'string' ? x.localeCompare(y as string) : x - (y as number);
			return sortDir === 'ascending' ? order : -order;
		})
	);

	function sortBy(key: SortKey) {
		if (sortKey === key) {
			sortDir = sortDir === 'ascending' ? 'descending' : 'ascending';
		} else {
			sortKey = key;
			sortDir = key === 'path' ? 'ascending' : 'descending';
		}
	}

	function ariaSort(key: SortKey) {
		return sortKey === key ? sortDir : 'none';
	}

	// ---- item

	let previewBranch = $state('stairs/landing');
	const BRANCHES = [
		{ name: 'main', note: 'Production · Frankfurt' },
		{ name: 'stairs/landing', note: 'Preview · built 2 hours ago' },
		{ name: 'rotor/snap', note: 'Preview · failed 12 minutes ago' }
	];

	// ---- charts

	const rainfallConfig = {
		singapore: { label: 'Singapore', color: 'var(--chart-1)' },
		saoPaulo: { label: 'São Paulo', color: 'var(--chart-2)' },
		frankfurt: { label: 'Frankfurt', color: 'var(--chart-3)' }
	} satisfies Chart.ChartConfig;

	const buildConfig = {
		september: { label: 'September', color: 'var(--chart-2)' },
		october: { label: 'October', color: 'var(--chart-1)' }
	} satisfies Chart.ChartConfig;

	const ttfbConfig = {
		frankfurt: { label: 'Frankfurt', color: 'var(--chart-1)' },
		singapore: { label: 'Singapore', color: 'var(--chart-2)' },
		saoPaulo: { label: 'São Paulo', color: 'var(--chart-3)' }
	} satisfies Chart.ChartConfig;

	const bandwidthConfig = {
		gigabytes: { label: 'Bandwidth' },
		...Object.fromEntries(BANDWIDTH.map((b) => [b.id, { label: b.region, color: b.color }]))
	} satisfies Chart.ChartConfig;

	const monthShort = (d: Date) => MONTHS[d.getMonth()];
	const monthLong = (d: Date) => d.toLocaleDateString('en-GB', { month: 'long' });
	const weekShort = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
	const weekLong = (d: Date) => `Week of ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`;

	// ---- accordion, collapsible

	let faq = $state('rollback');
	let settings = $state(['build', 'domains']);
	let branchesOpen = $state(false);
	let detailsOpen = $state(false);
</script>

<svelte:head>
	<title>{chapter.title} · Isometric</title>
	<meta
		name="description"
		content="Tables, cards, avatars, badges, keys, items, charts, carousels, accordions and collapsibles in the Isometric design system, with live demos and their source."
	/>
</svelte:head>

{#snippet sortIcon(key: SortKey)}
	{#if sortKey !== key}
		<ArrowUpDownIcon data-icon="inline-end" />
	{:else if sortDir === 'ascending'}
		<ArrowUpIcon data-icon="inline-end" />
	{:else}
		<ArrowDownIcon data-icon="inline-end" />
	{/if}
{/snippet}

<Page
	title={chapter.title}
	description={chapter.subtitle}
	chapter={{ numeral: chapter.numeral, connective: chapter.connective }}
>
	<!-- Table -->
	<Section
		title="Table"
		description="Rows of records that share the same columns. For a handful of label and value pairs, use a description list or Item."
	>
		<Demo
			label="Default"
			spec="caption · header · body"
			align="stretch"
			code={`<Table.Root>
	<Table.Caption>The five most recent deployments of Observatory.</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>Branch</Table.Head>
			<Table.Head>Region</Table.Head>
			<Table.Head>Status</Table.Head>
			<Table.Head class="text-right">Duration</Table.Head>
			<Table.Head class="text-right">Size</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each DEPLOYMENTS as d (d.id)}
			<Table.Row>
				<Table.Cell>{d.branch}</Table.Cell>
				<Table.Cell>{d.region}</Table.Cell>
				<Table.Cell><Badge variant={STATUS_VARIANT[d.status]}>{d.status}</Badge></Table.Cell>
				<Table.Cell class="text-right">{d.duration}</Table.Cell>
				<Table.Cell class="text-right">{d.size}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>`}
		>
			<Table.Root>
				<Table.Caption>The five most recent deployments of Observatory.</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head>Branch</Table.Head>
						<Table.Head>Region</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head class="text-right">Duration</Table.Head>
						<Table.Head class="text-right">Size</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each DEPLOYMENTS as d (d.id)}
						<Table.Row>
							<Table.Cell>{d.branch}</Table.Cell>
							<Table.Cell>{d.region}</Table.Cell>
							<Table.Cell><Badge variant={STATUS_VARIANT[d.status]}>{d.status}</Badge></Table.Cell>
							<Table.Cell class="text-right">{d.duration}</Table.Cell>
							<Table.Cell class="text-right">{d.size}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Demo>

		<Demo
			label="With footer"
			spec="Table.Footer · totals"
			align="stretch"
			code={`<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Region</Table.Head>
			<Table.Head class="text-right">Requests</Table.Head>
			<Table.Head class="text-right">Bandwidth</Table.Head>
			<Table.Head class="text-right">Cost</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each REGION_USAGE as r (r.region)}
			<Table.Row>
				<Table.Cell>{r.region}</Table.Cell>
				<Table.Cell class="text-right">{formatInt(r.requests)}</Table.Cell>
				<Table.Cell class="text-right">{r.gigabytes.toFixed(1)} GB</Table.Cell>
				<Table.Cell class="text-right">{r.cost.toFixed(2)} EUR</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
	<Table.Footer>
		<Table.Row>
			<Table.Cell>October to date</Table.Cell>
			<Table.Cell class="text-right">{formatInt(totals.requests)}</Table.Cell>
			<Table.Cell class="text-right">{totals.gigabytes.toFixed(1)} GB</Table.Cell>
			<Table.Cell class="text-right">{totals.cost.toFixed(2)} EUR</Table.Cell>
		</Table.Row>
	</Table.Footer>
</Table.Root>`}
		>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Region</Table.Head>
						<Table.Head class="text-right">Requests</Table.Head>
						<Table.Head class="text-right">Bandwidth</Table.Head>
						<Table.Head class="text-right">Cost</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each REGION_USAGE as r (r.region)}
						<Table.Row>
							<Table.Cell>{r.region}</Table.Cell>
							<Table.Cell class="text-right">{formatInt(r.requests)}</Table.Cell>
							<Table.Cell class="text-right">{r.gigabytes.toFixed(1)} GB</Table.Cell>
							<Table.Cell class="text-right">{r.cost.toFixed(2)} EUR</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
				<Table.Footer>
					<Table.Row>
						<Table.Cell>October to date</Table.Cell>
						<Table.Cell class="text-right">{formatInt(totals.requests)}</Table.Cell>
						<Table.Cell class="text-right">{totals.gigabytes.toFixed(1)} GB</Table.Cell>
						<Table.Cell class="text-right">{totals.cost.toFixed(2)} EUR</Table.Cell>
					</Table.Row>
				</Table.Footer>
			</Table.Root>
		</Demo>

		<Demo
			label="Selectable rows"
			spec="Checkbox · data-state=selected · select all"
			align="stretch"
			code={`<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-8">
				<Checkbox
					checked={allSelected}
					indeterminate={someSelected}
					onCheckedChange={selectAll}
					aria-label="Select all previews"
				/>
			</Table.Head>
			<Table.Head>Branch</Table.Head>
			<Table.Head>Author</Table.Head>
			<Table.Head class="text-right">Built</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each PREVIEWS as p (p.id)}
			{@const checked = selected.includes(p.id)}
			<Table.Row data-state={checked ? 'selected' : undefined}>
				<Table.Cell>
					<Checkbox
						{checked}
						onCheckedChange={(v) => selectRow(p.id, v)}
						aria-label="Select {p.branch}"
					/>
				</Table.Cell>
				<Table.Cell>{p.branch}</Table.Cell>
				<Table.Cell>{p.author}</Table.Cell>
				<Table.Cell class="text-right">{p.age}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>`}
		>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-8">
							<Checkbox
								checked={allSelected}
								indeterminate={someSelected}
								onCheckedChange={selectAll}
								aria-label="Select all previews"
							/>
						</Table.Head>
						<Table.Head>Branch</Table.Head>
						<Table.Head>Author</Table.Head>
						<Table.Head class="text-right">Built</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each PREVIEWS as p (p.id)}
						{@const checked = selected.includes(p.id)}
						<Table.Row data-state={checked ? 'selected' : undefined}>
							<Table.Cell>
								<Checkbox
									{checked}
									onCheckedChange={(v) => selectRow(p.id, v)}
									aria-label="Select {p.branch}"
								/>
							</Table.Cell>
							<Table.Cell>{p.branch}</Table.Cell>
							<Table.Cell>{p.author}</Table.Cell>
							<Table.Cell class="text-right">{p.age}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
			<div class="flex items-center justify-between gap-4">
				<span class="text-muted-foreground text-sm" aria-live="polite">
					{selected.length} of {PREVIEWS.length} previews selected
				</span>
				<Button variant="ghost" size="sm" disabled={selected.length === 0} onclick={() => selectAll(false)}>
					Clear selection
				</Button>
			</div>
		</Demo>

		<Demo
			label="Sortable columns"
			spec="aria-sort · ascending · descending"
			align="stretch"
			code={`<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head aria-sort={ariaSort('path')}>
				<Button variant="ghost" size="xs" class="-ms-2" onclick={() => sortBy('path')}>
					Page {@render sortIcon('path')}
				</Button>
			</Table.Head>
			<Table.Head aria-sort={ariaSort('requests')} class="text-right">
				<Button variant="ghost" size="xs" class="-me-2" onclick={() => sortBy('requests')}>
					Requests {@render sortIcon('requests')}
				</Button>
			</Table.Head>
			<Table.Head aria-sort={ariaSort('p75')} class="text-right">
				<Button variant="ghost" size="xs" class="-me-2" onclick={() => sortBy('p75')}>
					TTFB p75 {@render sortIcon('p75')}
				</Button>
			</Table.Head>
			<Table.Head aria-sort={ariaSort('errorRate')} class="text-right">
				<Button variant="ghost" size="xs" class="-me-2" onclick={() => sortBy('errorRate')}>
					Errors {@render sortIcon('errorRate')}
				</Button>
			</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each sortedPages as page (page.path)}
			<Table.Row>
				<Table.Cell>{page.path}</Table.Cell>
				<Table.Cell class="text-right">{formatInt(page.requests)}</Table.Cell>
				<Table.Cell class="text-right">{page.p75} ms</Table.Cell>
				<Table.Cell class="text-right">{page.errorRate.toFixed(2)}%</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>`}
		>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head aria-sort={ariaSort('path')}>
							<Button variant="ghost" size="xs" class="-ms-2" onclick={() => sortBy('path')}>
								Page {@render sortIcon('path')}
							</Button>
						</Table.Head>
						<Table.Head aria-sort={ariaSort('requests')} class="text-right">
							<Button variant="ghost" size="xs" class="-me-2" onclick={() => sortBy('requests')}>
								Requests {@render sortIcon('requests')}
							</Button>
						</Table.Head>
						<Table.Head aria-sort={ariaSort('p75')} class="text-right">
							<Button variant="ghost" size="xs" class="-me-2" onclick={() => sortBy('p75')}>
								TTFB p75 {@render sortIcon('p75')}
							</Button>
						</Table.Head>
						<Table.Head aria-sort={ariaSort('errorRate')} class="text-right">
							<Button variant="ghost" size="xs" class="-me-2" onclick={() => sortBy('errorRate')}>
								Errors {@render sortIcon('errorRate')}
							</Button>
						</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each sortedPages as page (page.path)}
						<Table.Row>
							<Table.Cell>{page.path}</Table.Cell>
							<Table.Cell class="text-right">{formatInt(page.requests)}</Table.Cell>
							<Table.Cell class="text-right">{page.p75} ms</Table.Cell>
							<Table.Cell class="text-right">{page.errorRate.toFixed(2)}%</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Demo>
	</Section>

	<!-- Card -->
	<Section
		title="Card"
		description="A surface one step above the field that holds one subject: a project, a deploy, a stop on a map. For a row in a list, use Item."
	>
		<div class="grid gap-6 md:grid-cols-2">
			<Demo
				label="Default"
				spec="header · content"
				canvas="plain"
				code={`<Card.Root class="w-full max-w-sm">
	<Card.Header>
		<Card.Title>Observatory</Card.Title>
		<Card.Description>Static site · four regions · deployed 48s ago</Card.Description>
	</Card.Header>
	<Card.Content>
		<p>1,284,903 requests served from Frankfurt this month.</p>
	</Card.Content>
</Card.Root>`}
			>
				<Card.Root class="w-full max-w-sm">
					<Card.Header>
						<Card.Title>Observatory</Card.Title>
						<Card.Description>Static site · four regions · deployed 48s ago</Card.Description>
					</Card.Header>
					<Card.Content>
						<p>1,284,903 requests served from Frankfurt this month.</p>
					</Card.Content>
				</Card.Root>
			</Demo>

			<Demo
				label="Block"
				spec='variant="block" · extruded face'
				canvas="plain"
				code={`<Card.Root variant="block" class="w-full max-w-sm">
	<Card.Header>
		<Card.Title>Bandwidth this month</Card.Title>
		<Card.Description>1 to 22 October</Card.Description>
	</Card.Header>
	<Card.Content>
		<p>89.6 GB of the 100 GB included in the plan.</p>
	</Card.Content>
</Card.Root>`}
			>
				<Card.Root variant="block" class="w-full max-w-sm">
					<Card.Header>
						<Card.Title>Bandwidth this month</Card.Title>
						<Card.Description>1 to 22 October</Card.Description>
					</Card.Header>
					<Card.Content>
						<p>89.6 GB of the 100 GB included in the plan.</p>
					</Card.Content>
				</Card.Root>
			</Demo>

			<Demo
				label="With image"
				spec="bg-field panel · IsoGlyph"
				canvas="plain"
				code={`<Card.Root class="w-full max-w-sm pt-0">
	<div class="bg-field flex aspect-video items-center justify-center">
		<IsoGlyph cells={ATLAS_STOPS[1].cells} size={96} />
	</div>
	<Card.Header>
		<Card.Title>The rotor</Card.Title>
		<Card.Description>Stop 2 on the Atlas guide · lower terrace</Card.Description>
	</Card.Header>
	<Card.Content>
		<p>Seven blocks on one axis. It turns a quarter every hour, on the hour.</p>
	</Card.Content>
</Card.Root>`}
			>
				<Card.Root class="w-full max-w-sm pt-0">
					<div class="bg-field flex aspect-video items-center justify-center">
						<IsoGlyph cells={ATLAS_STOPS[1].cells} size={96} />
					</div>
					<Card.Header>
						<Card.Title>The rotor</Card.Title>
						<Card.Description>Stop 2 on the Atlas guide · lower terrace</Card.Description>
					</Card.Header>
					<Card.Content>
						<p>Seven blocks on one axis. It turns a quarter every hour, on the hour.</p>
					</Card.Content>
				</Card.Root>
			</Demo>

			<Demo
				label="With footer actions"
				spec="Card.Footer · Card.Action"
				canvas="plain"
				code={`<Card.Root class="w-full max-w-sm">
	<Card.Header>
		<Card.Title>stairs/landing</Card.Title>
		<Card.Description>Preview built 2 hours ago by Mira Okafor</Card.Description>
		<Card.Action>
			<Badge variant="success">Ready</Badge>
		</Card.Action>
	</Card.Header>
	<Card.Content>
		<p>36.9 MB · 214 pages · no failed checks</p>
	</Card.Content>
	<Card.Footer class="justify-end">
		<Button variant="outline">Open preview</Button>
		<Button>Promote to production</Button>
	</Card.Footer>
</Card.Root>`}
			>
				<Card.Root class="w-full max-w-sm">
					<Card.Header>
						<Card.Title>stairs/landing</Card.Title>
						<Card.Description>Preview built 2 hours ago by Mira Okafor</Card.Description>
						<Card.Action>
							<Badge variant="success">Ready</Badge>
						</Card.Action>
					</Card.Header>
					<Card.Content>
						<p>36.9 MB · 214 pages · no failed checks</p>
					</Card.Content>
					<Card.Footer class="justify-end">
						<Button variant="outline">Open preview</Button>
						<Button>Promote to production</Button>
					</Card.Footer>
				</Card.Root>
			</Demo>
		</div>

		<Demo
			label="Small"
			spec='size="sm" · 12px spacing'
			canvas="plain"
			code={`<Card.Root size="sm" class="w-full max-w-56">
	<Card.Header>
		<Card.Description>Error rate</Card.Description>
		<Card.Title>0.21%</Card.Title>
	</Card.Header>
	<Card.Content>
		<p>Down from 0.34% last week.</p>
	</Card.Content>
</Card.Root>`}
		>
			<Card.Root size="sm" class="w-full max-w-56">
				<Card.Header>
					<Card.Description>Error rate</Card.Description>
					<Card.Title>0.21%</Card.Title>
				</Card.Header>
				<Card.Content>
					<p>Down from 0.34% last week.</p>
				</Card.Content>
			</Card.Root>
			<Card.Root size="sm" class="w-full max-w-56">
				<Card.Header>
					<Card.Description>Builds this month</Card.Description>
					<Card.Title>1,051 minutes</Card.Title>
				</Card.Header>
				<Card.Content>
					<p>Across six packages.</p>
				</Card.Content>
			</Card.Root>
		</Demo>
	</Section>

	<!-- Avatar -->
	<Section
		title="Avatar"
		description="A person or a project, as a circle. It always carries a fallback for when the image does not load."
	>
		<Demo
			label="Sizes"
			spec="sm · default · lg"
			code={`<Avatar.Root size="sm"><Avatar.Fallback>MO</Avatar.Fallback></Avatar.Root>
<Avatar.Root><Avatar.Fallback>MO</Avatar.Fallback></Avatar.Root>
<Avatar.Root size="lg"><Avatar.Fallback>MO</Avatar.Fallback></Avatar.Root>`}
		>
			<Avatar.Root size="sm"><Avatar.Fallback>MO</Avatar.Fallback></Avatar.Root>
			<Avatar.Root><Avatar.Fallback>MO</Avatar.Fallback></Avatar.Root>
			<Avatar.Root size="lg"><Avatar.Fallback>MO</Avatar.Fallback></Avatar.Root>
		</Demo>

		<Demo
			label="Fallback"
			spec="initials · icon"
			code={`<Avatar.Root size="lg">
	<Avatar.Fallback>TR</Avatar.Fallback>
</Avatar.Root>
<Avatar.Root size="lg">
	<Avatar.Fallback><UserIcon class="size-4" /></Avatar.Fallback>
</Avatar.Root>`}
		>
			<Avatar.Root size="lg">
				<Avatar.Fallback>TR</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root size="lg">
				<Avatar.Fallback><UserIcon class="size-4" /></Avatar.Fallback>
			</Avatar.Root>
		</Demo>

		<Demo
			label="With status"
			spec="Avatar.Badge · signal"
			code={`<Avatar.Root size="lg">
	<Avatar.Fallback>IH</Avatar.Fallback>
	<Avatar.Badge aria-label="Online" />
</Avatar.Root>`}
		>
			<Avatar.Root size="lg">
				<Avatar.Fallback>IH</Avatar.Fallback>
				<Avatar.Badge aria-label="Online" />
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Fallback>JW</Avatar.Fallback>
				<Avatar.Badge aria-label="Online" />
			</Avatar.Root>
			<Avatar.Root size="sm">
				<Avatar.Fallback>TR</Avatar.Fallback>
				<Avatar.Badge aria-label="Online" />
			</Avatar.Root>
		</Demo>

		<Demo
			label="Group"
			spec="Avatar.Group · Avatar.GroupCount"
			code={`<Avatar.Group>
	<Avatar.Root><Avatar.Fallback>MO</Avatar.Fallback></Avatar.Root>
	<Avatar.Root><Avatar.Fallback>TR</Avatar.Fallback></Avatar.Root>
	<Avatar.Root><Avatar.Fallback>IH</Avatar.Fallback></Avatar.Root>
	<Avatar.Root><Avatar.Fallback>JW</Avatar.Fallback></Avatar.Root>
	<Avatar.GroupCount>+5</Avatar.GroupCount>
</Avatar.Group>`}
		>
			<Avatar.Group>
				<Avatar.Root><Avatar.Fallback>MO</Avatar.Fallback></Avatar.Root>
				<Avatar.Root><Avatar.Fallback>TR</Avatar.Fallback></Avatar.Root>
				<Avatar.Root><Avatar.Fallback>IH</Avatar.Fallback></Avatar.Root>
				<Avatar.Root><Avatar.Fallback>JW</Avatar.Fallback></Avatar.Root>
				<Avatar.GroupCount>+5</Avatar.GroupCount>
			</Avatar.Group>
			<Avatar.Group>
				<Avatar.Root size="lg"><Avatar.Fallback>MO</Avatar.Fallback></Avatar.Root>
				<Avatar.Root size="lg"><Avatar.Fallback>TR</Avatar.Fallback></Avatar.Root>
				<Avatar.Root size="lg"><Avatar.Fallback>IH</Avatar.Fallback></Avatar.Root>
				<Avatar.GroupCount>+6</Avatar.GroupCount>
			</Avatar.Group>
		</Demo>
	</Section>

	<!-- Badge -->
	<Section
		title="Badge"
		description="A short status or count attached to something else. If it can be pressed to change state, use Toggle or Button."
	>
		<Demo
			label="Variants"
			spec="default · secondary · outline · destructive · signal · success · warning · ghost"
			code={`<Badge>Production</Badge>
<Badge variant="secondary">Preview</Badge>
<Badge variant="outline">Frankfurt</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="signal">Live</Badge>
<Badge variant="success">Ready</Badge>
<Badge variant="warning">Building</Badge>
<Badge variant="ghost">Archived</Badge>`}
		>
			<Badge>Production</Badge>
			<Badge variant="secondary">Preview</Badge>
			<Badge variant="outline">Frankfurt</Badge>
			<Badge variant="destructive">Failed</Badge>
			<Badge variant="signal">Live</Badge>
			<Badge variant="success">Ready</Badge>
			<Badge variant="warning">Building</Badge>
			<Badge variant="ghost">Archived</Badge>
		</Demo>

		<Demo
			label="With icon"
			spec="data-icon · inline-start · inline-end"
			code={`<Badge variant="success"><CircleCheckIcon data-icon="inline-start" />Ready</Badge>
<Badge variant="secondary"><ClockIcon data-icon="inline-start" />Queued</Badge>
<Badge variant="destructive"><CircleXIcon data-icon="inline-start" />Failed</Badge>
<Badge variant="outline"><ShieldCheckIcon data-icon="inline-start" />SSL valid</Badge>`}
		>
			<Badge variant="success"><CircleCheckIcon data-icon="inline-start" />Ready</Badge>
			<Badge variant="secondary"><ClockIcon data-icon="inline-start" />Queued</Badge>
			<Badge variant="destructive"><CircleXIcon data-icon="inline-start" />Failed</Badge>
			<Badge variant="outline"><ShieldCheckIcon data-icon="inline-start" />SSL valid</Badge>
		</Demo>

		<Demo
			label="As a count"
			spec="signal · one per view"
			code={`<Button variant="outline">
	Open deploy queue
	<Badge variant="signal">4</Badge>
</Button>`}
		>
			<Button variant="outline">
				Open deploy queue
				<Badge variant="signal">4</Badge>
			</Button>
			<span class="flex items-center gap-2 text-sm">
				Failed checks <Badge variant="secondary">12</Badge>
			</span>
		</Demo>

		<Demo
			label="As a link"
			spec="href · link · outline"
			code={`<Badge href="#badge" variant="link">observatory.dev</Badge>
<Badge href="#badge" variant="outline">
	Build log<ArrowUpRightIcon data-icon="inline-end" />
</Badge>`}
		>
			<Badge href="#badge" variant="link">observatory.dev</Badge>
			<Badge href="#badge" variant="outline">
				Build log<ArrowUpRightIcon data-icon="inline-end" />
			</Badge>
		</Demo>
	</Section>

	<!-- Kbd -->
	<Section title="Kbd" description="A key, or a combination of keys, the reader can press.">
		<Demo
			label="Single keys"
			spec="Kbd · text or symbol"
			code={`<Kbd.Root>Esc</Kbd.Root>
<Kbd.Root>Tab</Kbd.Root>
<Kbd.Root>⌘</Kbd.Root>
<Kbd.Root>⇧</Kbd.Root>
<Kbd.Root>↵</Kbd.Root>
<Kbd.Root>/</Kbd.Root>`}
		>
			<Kbd.Root>Esc</Kbd.Root>
			<Kbd.Root>Tab</Kbd.Root>
			<Kbd.Root>⌘</Kbd.Root>
			<Kbd.Root>⇧</Kbd.Root>
			<Kbd.Root>↵</Kbd.Root>
			<Kbd.Root>/</Kbd.Root>
		</Demo>

		<Demo
			label="Combinations"
			spec="Kbd.Group"
			code={`<Kbd.Group>
	<Kbd.Root>⌘</Kbd.Root>
	<Kbd.Root>K</Kbd.Root>
</Kbd.Group>
<Kbd.Group>
	<Kbd.Root>Ctrl</Kbd.Root>
	<span>+</span>
	<Kbd.Root>Shift</Kbd.Root>
	<span>+</span>
	<Kbd.Root>P</Kbd.Root>
</Kbd.Group>`}
		>
			<Kbd.Group>
				<Kbd.Root>⌘</Kbd.Root>
				<Kbd.Root>K</Kbd.Root>
			</Kbd.Group>
			<Kbd.Group>
				<Kbd.Root>Ctrl</Kbd.Root>
				<span>+</span>
				<Kbd.Root>Shift</Kbd.Root>
				<span>+</span>
				<Kbd.Root>P</Kbd.Root>
			</Kbd.Group>
		</Demo>

		<Demo
			label="In a sentence"
			spec="inline with body text"
			code={`<p>
	Press <Kbd.Root>/</Kbd.Root> to search the catalog, or <Kbd.Group><Kbd.Root>⌘</Kbd.Root><Kbd.Root>↵</Kbd.Root></Kbd.Group> to deploy the open branch.
</p>`}
		>
			<p>
				Press <Kbd.Root>/</Kbd.Root> to search the catalog, or <Kbd.Group><Kbd.Root>⌘</Kbd.Root><Kbd.Root>↵</Kbd.Root></Kbd.Group> to deploy the open branch.
			</p>
		</Demo>
	</Section>

	<!-- Item -->
	<Section
		title="Item"
		description="One row in a list: media, a title and description, and actions. For rows that share columns, use Table."
	>
		<Demo
			label="Variants"
			spec="default · outline · muted"
			align="start"
			code={`<Item.Group class="max-w-md">
	<Item.Root>
		<Item.Content>
			<Item.Title>Frankfurt</Item.Title>
			<Item.Description>Primary region · 84 ms p75</Item.Description>
		</Item.Content>
	</Item.Root>
	<Item.Root variant="outline">
		<Item.Content>
			<Item.Title>San Francisco</Item.Title>
			<Item.Description>Edge region · 92 ms p75</Item.Description>
		</Item.Content>
	</Item.Root>
	<Item.Root variant="muted">
		<Item.Content>
			<Item.Title>São Paulo</Item.Title>
			<Item.Description>Edge region · 144 ms p75</Item.Description>
		</Item.Content>
	</Item.Root>
</Item.Group>`}
		>
			<Item.Group class="max-w-md">
				<Item.Root>
					<Item.Content>
						<Item.Title>Frankfurt</Item.Title>
						<Item.Description>Primary region · 84 ms p75</Item.Description>
					</Item.Content>
				</Item.Root>
				<Item.Root variant="outline">
					<Item.Content>
						<Item.Title>San Francisco</Item.Title>
						<Item.Description>Edge region · 92 ms p75</Item.Description>
					</Item.Content>
				</Item.Root>
				<Item.Root variant="muted">
					<Item.Content>
						<Item.Title>São Paulo</Item.Title>
						<Item.Description>Edge region · 144 ms p75</Item.Description>
					</Item.Content>
				</Item.Root>
			</Item.Group>
		</Demo>

		<Demo
			label="With icon and actions"
			spec='Item.Media variant="icon" · Item.Actions'
			align="start"
			code={`<Item.Group class="max-w-md">
	<Item.Root variant="outline">
		<Item.Media variant="icon"><GlobeIcon /></Item.Media>
		<Item.Content>
			<Item.Title>observatory.dev</Item.Title>
			<Item.Description>Primary domain · certificate renews 14 March 2027</Item.Description>
		</Item.Content>
		<Item.Actions>
			<Button variant="outline" size="sm">Manage domain</Button>
		</Item.Actions>
	</Item.Root>
	<Item.Root variant="outline">
		<Item.Media variant="icon"><KeyRoundIcon /></Item.Media>
		<Item.Content>
			<Item.Title>Deploy key</Item.Title>
			<Item.Description>Added by Ines Halloran on 3 September</Item.Description>
		</Item.Content>
		<Item.Actions>
			<Button variant="ghost" size="sm">Revoke key</Button>
		</Item.Actions>
	</Item.Root>
</Item.Group>`}
		>
			<Item.Group class="max-w-md">
				<Item.Root variant="outline">
					<Item.Media variant="icon"><GlobeIcon /></Item.Media>
					<Item.Content>
						<Item.Title>observatory.dev</Item.Title>
						<Item.Description>Primary domain · certificate renews 14 March 2027</Item.Description>
					</Item.Content>
					<Item.Actions>
						<Button variant="outline" size="sm">Manage domain</Button>
					</Item.Actions>
				</Item.Root>
				<Item.Root variant="outline">
					<Item.Media variant="icon"><KeyRoundIcon /></Item.Media>
					<Item.Content>
						<Item.Title>Deploy key</Item.Title>
						<Item.Description>Added by Ines Halloran on 3 September</Item.Description>
					</Item.Content>
					<Item.Actions>
						<Button variant="ghost" size="sm">Revoke key</Button>
					</Item.Actions>
				</Item.Root>
			</Item.Group>
		</Demo>

		<Demo
			label="With image media"
			spec='Item.Media variant="image" · Item.Separator'
			align="start"
			code={`<Item.Group class="max-w-md gap-0">
	{#each ATLAS_STOPS.slice(0, 3) as stop, i (stop.id)}
		{#if i > 0}<Item.Separator class="my-0" />{/if}
		<Item.Root>
			<Item.Media variant="image">
				<div class="bg-field flex size-full items-center justify-center">
					<IsoGlyph cells={stop.cells} size={26} />
				</div>
			</Item.Media>
			<Item.Content>
				<Item.Title>{stop.name}</Item.Title>
				<Item.Description>{stop.note}</Item.Description>
			</Item.Content>
		</Item.Root>
	{/each}
</Item.Group>`}
		>
			<Item.Group class="max-w-md gap-0">
				{#each ATLAS_STOPS.slice(0, 3) as stop, i (stop.id)}
					{#if i > 0}<Item.Separator class="my-0" />{/if}
					<Item.Root>
						<Item.Media variant="image">
							<div class="bg-field flex size-full items-center justify-center">
								<IsoGlyph cells={stop.cells} size={26} />
							</div>
						</Item.Media>
						<Item.Content>
							<Item.Title>{stop.name}</Item.Title>
							<Item.Description>{stop.note}</Item.Description>
						</Item.Content>
					</Item.Root>
				{/each}
			</Item.Group>
		</Demo>

		<Demo
			label="Selected"
			spec="child snippet · button · aria-pressed"
			align="start"
			code={`<Item.Group class="max-w-md" aria-label="Branch to preview">
	{#each BRANCHES as branch (branch.name)}
		{@const active = previewBranch === branch.name}
		<Item.Root variant={active ? 'muted' : 'outline'}>
			{#snippet child({ props })}
				<button {...props} type="button" aria-pressed={active} onclick={() => (previewBranch = branch.name)}>
					<Item.Media variant="icon"><GitBranchIcon /></Item.Media>
					<Item.Content>
						<Item.Title>{branch.name}</Item.Title>
						<Item.Description>{branch.note}</Item.Description>
					</Item.Content>
					{#if active}
						<Item.Actions><CheckIcon class="size-4" /></Item.Actions>
					{/if}
				</button>
			{/snippet}
		</Item.Root>
	{/each}
</Item.Group>`}
		>
			<Item.Group class="max-w-md" aria-label="Branch to preview">
				{#each BRANCHES as branch (branch.name)}
					{@const active = previewBranch === branch.name}
					<Item.Root variant={active ? 'muted' : 'outline'}>
						{#snippet child({ props })}
							<button {...props} type="button" aria-pressed={active} onclick={() => (previewBranch = branch.name)}>
								<Item.Media variant="icon"><GitBranchIcon /></Item.Media>
								<Item.Content>
									<Item.Title>{branch.name}</Item.Title>
									<Item.Description>{branch.note}</Item.Description>
								</Item.Content>
								{#if active}
									<Item.Actions><CheckIcon class="size-4" /></Item.Actions>
								{/if}
							</button>
						{/snippet}
					</Item.Root>
				{/each}
			</Item.Group>
		</Demo>

		<Demo
			label="As a link"
			spec="child snippet · a"
			align="start"
			code={`<Item.Root variant="outline" class="max-w-md">
	{#snippet child({ props })}
		<a href="#item" {...props}>
			<Item.Content>
				<Item.Title>Read the deploy guide</Item.Title>
				<Item.Description>Branches, previews and promoting to production.</Item.Description>
			</Item.Content>
			<Item.Actions><ArrowUpRightIcon class="size-4" /></Item.Actions>
		</a>
	{/snippet}
</Item.Root>`}
		>
			<Item.Root variant="outline" class="max-w-md">
				{#snippet child({ props })}
					<a href="#item" {...props}>
						<Item.Content>
							<Item.Title>Read the deploy guide</Item.Title>
							<Item.Description>Branches, previews and promoting to production.</Item.Description>
						</Item.Content>
						<Item.Actions><ArrowUpRightIcon class="size-4" /></Item.Actions>
					</a>
				{/snippet}
			</Item.Root>
		</Demo>
	</Section>

	<!-- Chart -->
	<Section
		title="Chart"
		description="LayerChart inside a container that maps series to the palette's chart tokens. Pair a chart with the exact figures when the numbers matter."
	>
		<Demo
			label="Area"
			spec="AreaChart · overlap · legend"
			align="stretch"
			code={`<Chart.Container config={rainfallConfig} class="aspect-auto h-64 w-full">
	<AreaChart
		data={RAINFALL}
		x="month"
		padding={{ top: 8, right: 8, bottom: 52, left: 52 }}
		seriesLayout="overlap"
		legend
		series={[
			{ key: 'singapore', label: 'Singapore', color: rainfallConfig.singapore.color },
			{ key: 'saoPaulo', label: 'São Paulo', color: rainfallConfig.saoPaulo.color },
			{ key: 'frankfurt', label: 'Frankfurt', color: rainfallConfig.frankfurt.color }
		]}
		props={{
			area: { fillOpacity: 0.16, line: { strokeWidth: 1.5 } },
			xAxis: { format: monthShort },
			yAxis: { format: (v: number) => \`\${v} mm\`, ticks: 4 }
		}}
	>
		{#snippet tooltip()}
			<Chart.Tooltip indicator="line" labelFormatter={monthLong} />
		{/snippet}
	</AreaChart>
</Chart.Container>`}
		>
			<p class="text-muted-foreground text-sm">Average monthly rainfall, 1991 to 2020</p>
			<Chart.Container config={rainfallConfig} class="aspect-auto h-64 w-full">
				<AreaChart
					data={RAINFALL}
					x="month"
					padding={{ top: 8, right: 8, bottom: 52, left: 52 }}
					seriesLayout="overlap"
					legend
					series={[
						{ key: 'singapore', label: 'Singapore', color: rainfallConfig.singapore.color },
						{ key: 'saoPaulo', label: 'São Paulo', color: rainfallConfig.saoPaulo.color },
						{ key: 'frankfurt', label: 'Frankfurt', color: rainfallConfig.frankfurt.color }
					]}
					props={{
						area: { fillOpacity: 0.16, line: { strokeWidth: 1.5 } },
						xAxis: { format: monthShort },
						yAxis: { format: (v: number) => `${v} mm`, ticks: 4 }
					}}
				>
					{#snippet tooltip()}
						<Chart.Tooltip indicator="line" labelFormatter={monthLong} />
					{/snippet}
				</AreaChart>
			</Chart.Container>
		</Demo>

		<Demo
			label="Bar"
			spec="BarChart · grouped · two series"
			align="stretch"
			code={`<Chart.Container config={buildConfig} class="aspect-auto h-64 w-full">
	<BarChart
		data={BUILD_MINUTES}
		x="pkg"
		padding={{ top: 8, right: 8, bottom: 52, left: 52 }}
		seriesLayout="group"
		bandPadding={0.3}
		legend
		series={[
			{ key: 'september', label: 'September', color: buildConfig.september.color },
			{ key: 'october', label: 'October', color: buildConfig.october.color }
		]}
		props={{ yAxis: { format: (v: number) => \`\${v} min\`, ticks: 4 } }}
	>
		{#snippet tooltip()}
			<Chart.Tooltip />
		{/snippet}
	</BarChart>
</Chart.Container>`}
		>
			<p class="text-muted-foreground text-sm">Build minutes per package</p>
			<Chart.Container config={buildConfig} class="aspect-auto h-64 w-full">
				<BarChart
					data={BUILD_MINUTES}
					x="pkg"
					padding={{ top: 8, right: 8, bottom: 52, left: 52 }}
					seriesLayout="group"
					bandPadding={0.3}
					legend
					series={[
						{ key: 'september', label: 'September', color: buildConfig.september.color },
						{ key: 'october', label: 'October', color: buildConfig.october.color }
					]}
					props={{ yAxis: { format: (v: number) => `${v} min`, ticks: 4 } }}
				>
					{#snippet tooltip()}
						<Chart.Tooltip />
					{/snippet}
				</BarChart>
			</Chart.Container>
		</Demo>

		<Demo
			label="Line"
			spec="LineChart · three series · points"
			align="stretch"
			code={`<Chart.Container config={ttfbConfig} class="aspect-auto h-64 w-full">
	<LineChart
		data={TTFB}
		x="week"
		padding={{ top: 8, right: 8, bottom: 52, left: 52 }}
		legend
		points={{ r: 2.5 }}
		series={[
			{ key: 'frankfurt', label: 'Frankfurt', color: ttfbConfig.frankfurt.color },
			{ key: 'singapore', label: 'Singapore', color: ttfbConfig.singapore.color },
			{ key: 'saoPaulo', label: 'São Paulo', color: ttfbConfig.saoPaulo.color }
		]}
		props={{
			spline: { strokeWidth: 1.5 },
			xAxis: { format: weekShort, ticks: 6 },
			yAxis: { format: (v: number) => \`\${v} ms\`, ticks: 4 }
		}}
	>
		{#snippet tooltip()}
			<Chart.Tooltip labelFormatter={weekLong} />
		{/snippet}
	</LineChart>
</Chart.Container>`}
		>
			<p class="text-muted-foreground text-sm">Time to first byte, 75th percentile, per week</p>
			<Chart.Container config={ttfbConfig} class="aspect-auto h-64 w-full">
				<LineChart
					data={TTFB}
					x="week"
					padding={{ top: 8, right: 8, bottom: 52, left: 52 }}
					legend
					points={{ r: 2.5 }}
					series={[
						{ key: 'frankfurt', label: 'Frankfurt', color: ttfbConfig.frankfurt.color },
						{ key: 'singapore', label: 'Singapore', color: ttfbConfig.singapore.color },
						{ key: 'saoPaulo', label: 'São Paulo', color: ttfbConfig.saoPaulo.color }
					]}
					props={{
						spline: { strokeWidth: 1.5 },
						xAxis: { format: weekShort, ticks: 6 },
						yAxis: { format: (v: number) => `${v} ms`, ticks: 4 }
					}}
				>
					{#snippet tooltip()}
						<Chart.Tooltip labelFormatter={weekLong} />
					{/snippet}
				</LineChart>
			</Chart.Container>
		</Demo>

		<Demo
			label="Donut"
			spec="PieChart · innerRadius · legend"
			align="stretch"
			code={`<Chart.Container config={bandwidthConfig} class="aspect-auto h-64 w-full">
	<PieChart
		data={BANDWIDTH}
		key="id"
		label="region"
		value="gigabytes"
		c="color"
		innerRadius={0.62}
		padAngle={0.015}
		legend
	>
		{#snippet tooltip()}
			<Chart.Tooltip hideLabel />
		{/snippet}
	</PieChart>
</Chart.Container>`}
		>
			<p class="text-muted-foreground text-sm">Bandwidth by region this month, in gigabytes</p>
			<Chart.Container config={bandwidthConfig} class="aspect-auto h-64 w-full">
				<PieChart
					data={BANDWIDTH}
					key="id"
					label="region"
					value="gigabytes"
					c="color"
					innerRadius={0.62}
					padAngle={0.015}
					legend
				>
					{#snippet tooltip()}
						<Chart.Tooltip hideLabel />
					{/snippet}
				</PieChart>
			</Chart.Container>
		</Demo>
	</Section>

	<!-- Carousel -->
	<Section
		title="Carousel"
		description="A row of slides seen one or a few at a time. Use it when the order matters less than the browsing; otherwise lay the items out in a grid."
	>
		<Demo
			label="Basic"
			spec="Carousel.Previous · Carousel.Next"
			code={`<Carousel.Root class="w-full max-w-xs">
	<Carousel.Content>
		{#each ATLAS_STOPS as stop (stop.id)}
			<Carousel.Item>
				<div class="bg-field text-field-foreground flex aspect-[3/2] flex-col items-center justify-center gap-3 rounded-lg">
					<IsoGlyph cells={stop.cells} size={72} />
					<span class="text-sm">{stop.name}</span>
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous />
	<Carousel.Next />
</Carousel.Root>`}
		>
			<div class="flex w-full justify-center px-12">
				<Carousel.Root class="w-full max-w-xs">
					<Carousel.Content>
						{#each ATLAS_STOPS as stop (stop.id)}
							<Carousel.Item>
								<div class="bg-field text-field-foreground flex aspect-[3/2] flex-col items-center justify-center gap-3 rounded-lg">
									<IsoGlyph cells={stop.cells} size={72} />
									<span class="text-sm">{stop.name}</span>
								</div>
							</Carousel.Item>
						{/each}
					</Carousel.Content>
					<Carousel.Previous />
					<Carousel.Next />
				</Carousel.Root>
			</div>
		</Demo>

		<Demo
			label="With dots"
			spec="Carousel.Dots · one per snap"
			code={`<Carousel.Root class="w-full max-w-xs">
	<Carousel.Content>
		{#each ATLAS_STOPS as stop (stop.id)}
			<Carousel.Item>
				<Card.Root size="sm">
					<Card.Header>
						<Card.Title>{stop.name}</Card.Title>
						<Card.Description>{stop.note}</Card.Description>
					</Card.Header>
				</Card.Root>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Dots class="mt-3" />
</Carousel.Root>`}
		>
			<Carousel.Root class="w-full max-w-xs">
				<Carousel.Content>
					{#each ATLAS_STOPS as stop (stop.id)}
						<Carousel.Item>
							<Card.Root size="sm">
								<Card.Header>
									<Card.Title>{stop.name}</Card.Title>
									<Card.Description>{stop.note}</Card.Description>
								</Card.Header>
							</Card.Root>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Dots class="mt-3" />
			</Carousel.Root>
		</Demo>

		<Demo
			label="Several per view"
			spec="basis-1/3 · align start"
			code={`<Carousel.Root opts={{ align: 'start' }} class="w-full max-w-md">
	<Carousel.Content>
		{#each ATLAS_STOPS as stop (stop.id)}
			<Carousel.Item class="basis-1/2 sm:basis-1/3">
				<div class="bg-field flex aspect-square items-center justify-center rounded-lg">
					<IsoGlyph cells={stop.cells} size={48} />
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous />
	<Carousel.Next />
</Carousel.Root>`}
		>
			<div class="flex w-full justify-center px-12">
				<Carousel.Root opts={{ align: 'start' }} class="w-full max-w-md">
					<Carousel.Content>
						{#each ATLAS_STOPS as stop (stop.id)}
							<Carousel.Item class="basis-1/2 sm:basis-1/3">
								<div class="bg-field flex aspect-square items-center justify-center rounded-lg">
									<IsoGlyph cells={stop.cells} size={48} />
								</div>
							</Carousel.Item>
						{/each}
					</Carousel.Content>
					<Carousel.Previous />
					<Carousel.Next />
				</Carousel.Root>
			</div>
		</Demo>

		<Demo
			label="Vertical"
			spec='orientation="vertical" · two per view'
			code={`<Carousel.Root orientation="vertical" opts={{ align: 'start' }} class="w-full max-w-xs">
	<Carousel.Content class="-mt-2 h-48">
		{#each ATLAS_STOPS as stop (stop.id)}
			<Carousel.Item class="basis-1/2 pt-2">
				<Item.Root variant="outline" class="h-full">
					<Item.Content>
						<Item.Title>{stop.name}</Item.Title>
						<Item.Description>{stop.note}</Item.Description>
					</Item.Content>
				</Item.Root>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous />
	<Carousel.Next />
</Carousel.Root>`}
		>
			<div class="flex w-full justify-center py-12">
				<Carousel.Root orientation="vertical" opts={{ align: 'start' }} class="w-full max-w-xs">
					<Carousel.Content class="-mt-2 h-48">
						{#each ATLAS_STOPS as stop (stop.id)}
							<Carousel.Item class="basis-1/2 pt-2">
								<Item.Root variant="outline" class="h-full">
									<Item.Content>
										<Item.Title>{stop.name}</Item.Title>
										<Item.Description>{stop.note}</Item.Description>
									</Item.Content>
								</Item.Root>
							</Carousel.Item>
						{/each}
					</Carousel.Content>
					<Carousel.Previous />
					<Carousel.Next />
				</Carousel.Root>
			</div>
		</Demo>
	</Section>

	<!-- Accordion -->
	<Section
		title="Accordion"
		description="Stacked sections the reader opens one at a time or several at once. If only one block of detail hides, use Collapsible."
	>
		<Demo
			label="Single"
			spec='type="single" · one open at a time'
			align="start"
			code={`<Accordion.Root type="single" bind:value={faq} class="max-w-lg">
	<Accordion.Item value="previews">
		<Accordion.Trigger>How long is a preview kept?</Accordion.Trigger>
		<Accordion.Content>
			Thirty days after its branch was last pushed. Previews of open pull requests are kept until the request closes.
		</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="rollback">
		<Accordion.Trigger>Can I roll back a deploy?</Accordion.Trigger>
		<Accordion.Content>
			Yes. Every production deploy stays on disk, so promoting an earlier one takes effect in all four regions within a few seconds.
		</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="regions">
		<Accordion.Trigger>Which region answers a visitor in Lima?</Accordion.Trigger>
		<Accordion.Content>São Paulo, the closest of the four by round-trip time.</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="custom" disabled>
		<Accordion.Trigger>Can I add a fifth region?</Accordion.Trigger>
		<Accordion.Content>Not on the current plan.</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>`}
		>
			<Accordion.Root type="single" bind:value={faq} class="max-w-lg">
				<Accordion.Item value="previews">
					<Accordion.Trigger>How long is a preview kept?</Accordion.Trigger>
					<Accordion.Content>
						Thirty days after its branch was last pushed. Previews of open pull requests are kept until the request closes.
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="rollback">
					<Accordion.Trigger>Can I roll back a deploy?</Accordion.Trigger>
					<Accordion.Content>
						Yes. Every production deploy stays on disk, so promoting an earlier one takes effect in all four regions within a few seconds.
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="regions">
					<Accordion.Trigger>Which region answers a visitor in Lima?</Accordion.Trigger>
					<Accordion.Content>São Paulo, the closest of the four by round-trip time.</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="custom" disabled>
					<Accordion.Trigger>Can I add a fifth region?</Accordion.Trigger>
					<Accordion.Content>Not on the current plan.</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Demo>

		<Demo
			label="Multiple"
			spec='type="multiple" · several open'
			align="start"
			code={`<Accordion.Root type="multiple" bind:value={settings} class="max-w-lg">
	<Accordion.Item value="build">
		<Accordion.Trigger>Build</Accordion.Trigger>
		<Accordion.Content>Runs npm run build in packages/site and publishes the build folder.</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="domains">
		<Accordion.Trigger>Domains</Accordion.Trigger>
		<Accordion.Content>observatory.dev, with www.observatory.dev redirecting to it.</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="env">
		<Accordion.Trigger>Environment variables</Accordion.Trigger>
		<Accordion.Content>Four variables, two of them limited to production.</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>`}
		>
			<Accordion.Root type="multiple" bind:value={settings} class="max-w-lg">
				<Accordion.Item value="build">
					<Accordion.Trigger>Build</Accordion.Trigger>
					<Accordion.Content>Runs npm run build in packages/site and publishes the build folder.</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="domains">
					<Accordion.Trigger>Domains</Accordion.Trigger>
					<Accordion.Content>observatory.dev, with www.observatory.dev redirecting to it.</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="env">
					<Accordion.Trigger>Environment variables</Accordion.Trigger>
					<Accordion.Content>Four variables, two of them limited to production.</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Demo>
	</Section>

	<!-- Collapsible -->
	<Section
		title="Collapsible"
		description="One block of detail that opens and closes under its trigger. For a stack of such blocks, use Accordion."
	>
		<Demo
			label="Default"
			spec="Collapsible.Trigger · child snippet"
			align="start"
			code={`<Collapsible.Root bind:open={branchesOpen} class="flex w-full max-w-sm flex-col gap-2">
	<div class="flex items-center justify-between gap-4">
		<span class="text-sm font-medium">Four branches with previews</span>
		<Collapsible.Trigger>
			{#snippet child({ props })}
				<Button variant="ghost" size="sm" {...props}>
					{branchesOpen ? 'Hide branches' : 'Show all branches'}
					<ChevronsUpDownIcon data-icon="inline-end" />
				</Button>
			{/snippet}
		</Collapsible.Trigger>
	</div>
	<Item.Root variant="outline" size="xs">
		<Item.Content><Item.Title>stairs/landing</Item.Title></Item.Content>
	</Item.Root>
	<Collapsible.Content class="flex flex-col gap-2">
		{#each ['rotor/snap', 'atlas/stops', 'atlas/offline-map'] as name (name)}
			<Item.Root variant="outline" size="xs">
				<Item.Content><Item.Title>{name}</Item.Title></Item.Content>
			</Item.Root>
		{/each}
	</Collapsible.Content>
</Collapsible.Root>`}
		>
			<Collapsible.Root bind:open={branchesOpen} class="flex w-full max-w-sm flex-col gap-2">
				<div class="flex items-center justify-between gap-4">
					<span class="text-sm font-medium">Four branches with previews</span>
					<Collapsible.Trigger>
						{#snippet child({ props })}
							<Button variant="ghost" size="sm" {...props}>
								{branchesOpen ? 'Hide branches' : 'Show all branches'}
								<ChevronsUpDownIcon data-icon="inline-end" />
							</Button>
						{/snippet}
					</Collapsible.Trigger>
				</div>
				<Item.Root variant="outline" size="xs">
					<Item.Content><Item.Title>stairs/landing</Item.Title></Item.Content>
				</Item.Root>
				<Collapsible.Content class="flex flex-col gap-2">
					{#each ['rotor/snap', 'atlas/stops', 'atlas/offline-map'] as name (name)}
						<Item.Root variant="outline" size="xs">
							<Item.Content><Item.Title>{name}</Item.Title></Item.Content>
						</Item.Root>
					{/each}
				</Collapsible.Content>
			</Collapsible.Root>
		</Demo>

		<Demo
			label="Details under a summary"
			spec="link trigger · open state in the label"
			align="start"
			code={`<Collapsible.Root bind:open={detailsOpen} class="flex w-full max-w-sm flex-col gap-3">
	<p class="text-sm">
		main deployed to Frankfurt in 48s.
		<Collapsible.Trigger>
			{#snippet child({ props })}
				<Button variant="link" size="xs" {...props}>
					{detailsOpen ? 'Hide build details' : 'Show build details'}
				</Button>
			{/snippet}
		</Collapsible.Trigger>
	</p>
	<Collapsible.Content>
		<dl class="text-muted-foreground grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
			<dt>Commit</dt><dd>4c1e9a7 · Tighten the stair spacing</dd>
			<dt>Pages</dt><dd>214, of which 12 changed</dd>
			<dt>Size</dt><dd>38.4 MB</dd>
		</dl>
	</Collapsible.Content>
</Collapsible.Root>`}
		>
			<Collapsible.Root bind:open={detailsOpen} class="flex w-full max-w-sm flex-col gap-3">
				<p class="text-sm">
					main deployed to Frankfurt in 48s.
					<Collapsible.Trigger>
						{#snippet child({ props })}
							<Button variant="link" size="xs" {...props}>
								{detailsOpen ? 'Hide build details' : 'Show build details'}
							</Button>
						{/snippet}
					</Collapsible.Trigger>
				</p>
				<Collapsible.Content>
					<dl class="text-muted-foreground grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
						<dt>Commit</dt><dd>4c1e9a7 · Tighten the stair spacing</dd>
						<dt>Pages</dt><dd>214, of which 12 changed</dd>
						<dt>Size</dt><dd>38.4 MB</dd>
					</dl>
				</Collapsible.Content>
			</Collapsible.Root>
		</Demo>
	</Section>
</Page>
