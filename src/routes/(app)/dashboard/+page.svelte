<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import * as Breadcrumb from '#lib/components/ui/breadcrumb/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import {
		DashboardSidebar,
		Deployments,
		DeploymentsTable,
		DomainsPanel,
		NewDeploymentDialog,
		RANGES,
		RegionChart,
		RequestsChart,
		StatTile,
		statsFor,
		TeamPanel,
		type RangeId
	} from '#lib/components/dashboard/index.js';

	/**
	 * The Observatory console: a project sidebar beside one scrolling column of measures, traffic,
	 * deployments, domains and team. Grouping comes from hairlines and space, not boxes.
	 */
	let range = $state<RangeId>('30d');
	let rangeLabel = $derived(RANGES.find((r) => r.value === range)?.label ?? 'Last 30 days');
	let stats = $derived(statsFor(range));

	// The sidebar is open from lg up; between md and lg it starts as icons. The reader can still
	// toggle it, and that choice holds until the viewport crosses the breakpoint again.
	const wide = new MediaQuery('min-width: 1024px', true);
	let open = $derived(wide.current);

	const deployments = new Deployments();
</script>

<svelte:head>
	<title>Overview · Observatory · Isometric</title>
	<meta
		name="description"
		content="A static-site host's console built from the Isometric components: measures, traffic, deployments, domains and team."
	/>
</svelte:head>

<Sidebar.Provider bind:open class="min-h-0 flex-1 items-stretch">
	<DashboardSidebar />

	<div id="overview" class="flex min-w-0 flex-1 scroll-mt-20 flex-col">
		<h1 class="sr-only">Observatory overview</h1>

		<!-- toolbar -->
		<div
			class="border-border flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b px-4 py-3 sm:px-6 lg:px-8"
		>
			<div class="flex min-w-0 items-center gap-2">
				<Sidebar.Trigger class="-ms-1.5" />
				<Separator orientation="vertical" class="me-1 data-vertical:h-4 data-vertical:self-center" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Link href="#overview">Observatory</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator />
						<Breadcrumb.Item>
							<Breadcrumb.Page>Overview</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
			<div class="flex items-center gap-2">
				<Select.Root type="single" bind:value={() => range, (v) => (range = (v as RangeId) || range)}>
					<Select.Trigger class="w-36" aria-label="Date range">{rangeLabel}</Select.Trigger>
					<Select.Content align="end">
						<Select.Group>
							{#each RANGES as r (r.value)}
								<Select.Item value={r.value} label={r.label}>{r.label}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
				<NewDeploymentDialog {deployments} />
			</div>
		</div>

		<!-- measures -->
		<section aria-label="Measures, {rangeLabel.toLowerCase()}" class="border-border border-b">
			<div class="bg-border grid grid-cols-1 gap-px min-[480px]:grid-cols-2 xl:grid-cols-4">
				{#each stats as stat (stat.id)}
					<StatTile {stat} class="lg:px-8" />
				{/each}
			</div>
		</section>

		<!-- traffic -->
		<section
			id="traffic"
			aria-label="Traffic"
			class="border-border grid scroll-mt-20 grid-cols-1 border-b lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)]"
		>
			<div class="flex min-w-0 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
				<div class="flex flex-col gap-1">
					<h2 class="text-foreground text-[15px] font-medium">Requests per day</h2>
					<p class="text-muted-foreground text-sm">All regions, {rangeLabel.toLowerCase()}, ending 21 Oct.</p>
				</div>
				<RequestsChart {range} />
			</div>
			<div
				class="border-border flex min-w-0 flex-col gap-4 border-t px-4 py-6 sm:px-6 lg:border-t-0 lg:border-s lg:px-8"
			>
				<div class="flex flex-col gap-1">
					<h2 class="text-foreground text-[15px] font-medium">Requests by region</h2>
					<p class="text-muted-foreground text-sm">Where the responses were served from.</p>
				</div>
				<RegionChart {range} />
			</div>
		</section>

		<!-- deployments, domains, team -->
		<div class="grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_22rem]">
			<div class="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
				<DeploymentsTable {deployments} />
			</div>
			<div
				class="border-border grid grid-cols-1 border-t md:grid-cols-2 2xl:grid-cols-1 2xl:content-start 2xl:border-t-0 2xl:border-s"
			>
				<div class="px-4 py-6 sm:px-6 lg:px-8">
					<DomainsPanel />
				</div>
				<div
					class="border-border border-t px-4 py-6 sm:px-6 md:border-t-0 md:border-s lg:px-8 2xl:border-s-0 2xl:border-t"
				>
					<TeamPanel />
				</div>
			</div>
		</div>
	</div>
</Sidebar.Provider>
