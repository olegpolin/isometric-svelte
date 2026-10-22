<script lang="ts">
	import { page } from '$app/state';
	import { SvelteSet } from 'svelte/reactivity';
	import { toast } from 'svelte-sonner';
	import SearchIcon from '@lucide/svelte/icons/search';
	import RouteIcon from '@lucide/svelte/icons/route';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';
	import { IsoGlyph } from '#lib/components/app/index.js';
	import { LONGEST_WALK, MATERIALS, Screen, type Material } from '#lib/components/mobile/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Drawer from '#lib/components/ui/drawer/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import { Progress } from '#lib/components/ui/progress/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import { getWorks } from '../atlas.remote';

	const works = $derived(await getWorks());

	let search = $state('');
	let material = $state<Material | 'all'>('all');

	const results = $derived.by(() => {
		const q = search.trim().toLowerCase();
		return works.filter(
			(w) =>
				(material === 'all' || w.material === material) &&
				(!q || w.title.toLowerCase().includes(q) || w.artist.toLowerCase().includes(q))
		);
	});

	// A link from Today opens the drawer on arrival (`?work=threshold`).
	let selectedId = $state(page.url.searchParams.get('work'));
	let open = $state(page.url.searchParams.has('work'));
	const selected = $derived(works.find((w) => w.id === selectedId));

	const route = new SvelteSet<string>();

	function show(id: string) {
		selectedId = id;
		open = true;
	}

	function toggleRoute() {
		if (!selected) return;
		if (route.has(selected.id)) {
			route.delete(selected.id);
			toast(`Removed ${selected.title} from your route`);
		} else {
			route.add(selected.id);
			toast.success(`Added ${selected.title} to your route`, {
				description: `${route.size} ${route.size === 1 ? 'stop' : 'stops'} on today’s walk`
			});
			open = false;
		}
	}

	function clearFilters() {
		search = '';
		material = 'all';
	}
</script>

<Screen eyebrow="Velden Sculpture Park" title="Collection">
	<div class="flex flex-col gap-3">
		<InputGroup.Root class="h-11">
			<InputGroup.Input
				type="search"
				enterkeyhint="search"
				bind:value={search}
				placeholder="Search works or artists"
				aria-label="Search works or artists"
				class="[&::-webkit-search-cancel-button]:appearance-none"
			/>
			<InputGroup.Addon>
				<SearchIcon />
			</InputGroup.Addon>
			{#if search}
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button
						size="icon-sm"
						class="size-9 rounded-full"
						aria-label="Clear search"
						onclick={() => (search = '')}
					>
						<XIcon />
					</InputGroup.Button>
				</InputGroup.Addon>
			{/if}
		</InputGroup.Root>

		<ToggleGroup.Root
			type="single"
			variant="outline"
			bind:value={() => material, (v) => (material = (v || 'all') as Material | 'all')}
			aria-label="Filter by material"
			class="w-full"
		>
			{#each MATERIALS as m (m.value)}
				<ToggleGroup.Item value={m.value} class="h-11 flex-1">{m.label}</ToggleGroup.Item>
			{/each}
		</ToggleGroup.Root>
	</div>

	<section aria-labelledby="works" class="flex flex-col gap-2">
		<h2 id="works" class="sr-only">Works</h2>
		<p class="text-muted-foreground text-sm" aria-live="polite">
			{results.length}
			{results.length === 1 ? 'work' : 'works'}
		</p>

		{#if results.length}
			<Item.Group class="-mx-3">
				{#each results as work (work.id)}
					<Item.Root size="sm">
						{#snippet child({ props })}
							<button type="button" {...props} onclick={() => show(work.id)}>
								<Item.Media class="bg-muted size-11 rounded-md">
									<IsoGlyph cells={work.cells} size={28} />
								</Item.Media>
								<Item.Content>
									<Item.Title>{work.title}</Item.Title>
									<Item.Description>{work.artist}, {work.year}</Item.Description>
								</Item.Content>
								{#if work.outdoors}
									<Item.Actions>
										<Badge variant="outline">Outdoors</Badge>
									</Item.Actions>
								{/if}
							</button>
						{/snippet}
					</Item.Root>
				{/each}
			</Item.Group>
		{:else}
			<Empty.Root>
				<Empty.Header>
					<Empty.Media />
					<Empty.Title>No works match</Empty.Title>
					<Empty.Description>Try another material or a shorter search.</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<Button variant="outline" size="lg" class="h-11" onclick={clearFilters}>Show all works</Button>
				</Empty.Content>
			</Empty.Root>
		{/if}
	</section>
</Screen>

<Drawer.Root bind:open shouldScaleBackground={false}>
	<Drawer.Content class="data-[vaul-drawer-direction=bottom]:max-h-[88%]">
		{#if selected}
			<div class="flex min-h-0 flex-col overflow-y-auto">
				<Drawer.Header class="group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left">
					<Drawer.Title>{selected.title}</Drawer.Title>
					<Drawer.Description>{selected.artist}, {selected.year}. {selected.medium}.</Drawer.Description>
				</Drawer.Header>
				<div class="flex flex-col gap-5 px-5 pb-2">
					<div class="bg-field dark:field-pool flex h-40 items-center justify-center rounded-lg">
						<IsoGlyph cells={selected.cells} size={96} />
					</div>
					<p class="text-pretty">{selected.note}</p>
					<div class="flex flex-col gap-2">
						<div class="flex items-baseline justify-between gap-4 text-sm">
							<span id="walk-label" class="font-medium">Walking distance</span>
							<span class="text-muted-foreground tabular-nums">{selected.walk} min from the north gate</span>
						</div>
						<Progress value={(selected.walk / LONGEST_WALK) * 100} aria-labelledby="walk-label" />
					</div>
					<dl class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
						<dt class="text-muted-foreground">Where</dt>
						<dd>{selected.location}</dd>
						<dt class="text-muted-foreground">Setting</dt>
						<dd>{selected.outdoors ? 'Outdoors' : 'Indoors'}</dd>
					</dl>
				</div>
			</div>
			<Drawer.Footer>
				<Button
					size="lg"
					variant={route.has(selected.id) ? 'outline' : 'default'}
					class="h-11"
					onclick={toggleRoute}
				>
					{#if route.has(selected.id)}
						<CheckIcon data-icon="inline-start" />
						Remove from route
					{:else}
						<RouteIcon data-icon="inline-start" />
						Add to route
					{/if}
				</Button>
				<Drawer.Close>
					{#snippet child({ props })}
						<Button {...props} variant="ghost" size="lg" class="h-11">Back to the collection</Button>
					{/snippet}
				</Drawer.Close>
			</Drawer.Footer>
		{/if}
	</Drawer.Content>
</Drawer.Root>
