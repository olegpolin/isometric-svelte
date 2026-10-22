<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { IsoGlyph } from '#lib/components/app/index.js';
	import { FEATURED_WORK_ID, OPEN_NOW, Screen, TALKS } from '#lib/components/mobile/index.js';
	import * as Accordion from '#lib/components/ui/accordion/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { getWorks } from './atlas.remote';

	const works = $derived(await getWorks());
	const featured = $derived(works.find((w) => w.id === FEATURED_WORK_ID) ?? works[0]);

	// The greeting and date depend on the visitor's clock, so they are filled in on the client.
	let now = $state<Date | null>(null);
	onMount(() => {
		now = new Date();
	});

	const greeting = $derived.by(() => {
		const hour = now?.getHours() ?? 9;
		if (hour < 12) return 'Good morning';
		if (hour < 18) return 'Good afternoon';
		return 'Good evening';
	});

	const dateLabel = $derived(
		now ? now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Velden Sculpture Park'
	);
</script>

<Screen eyebrow={dateLabel} title={greeting}>
	<Card.Root variant="block" class="pt-0">
		<div class="bg-field text-field-foreground dark:field-pool relative flex h-72 items-center justify-center">
			<span class="type-eyebrow absolute top-4 left-4">Work of the week</span>
			<IsoGlyph cells={featured.cells} size={132} />
		</div>
		<Card.Header>
			<Card.Title>{featured.title}</Card.Title>
			<Card.Description>{featured.artist}, {featured.year}. {featured.medium}.</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-pretty">{featured.note}</p>
		</Card.Content>
		<Card.Footer>
			<Button href="/mobile/collection?work={featured.id}" size="lg" class="h-11 w-full">
				Read about this work
				<ArrowRightIcon data-icon="inline-end" />
			</Button>
		</Card.Footer>
	</Card.Root>

	<section aria-labelledby="open-now" class="flex flex-col gap-3">
		<div class="flex items-baseline justify-between gap-4">
			<h2 id="open-now" class="text-base font-medium">Open now</h2>
			<a
				href="/mobile/visit"
				class="text-muted-foreground hover:text-foreground focus-visible:focus-halo -my-3 flex h-11 items-center rounded-sm text-sm outline-none"
			>
				Plan a visit
			</a>
		</div>
		<ul
			aria-label="Open now"
			class="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none]"
		>
			{#each OPEN_NOW as place (place.id)}
				<li class="w-40 shrink-0 snap-start">
					<Card.Root size="sm" class="h-full pt-0">
						<div class="bg-muted flex h-24 items-center justify-center">
							<IsoGlyph cells={place.cells} size={52} />
						</div>
						<Card.Header>
							<Card.Title>{place.name}</Card.Title>
							<Card.Description class="flex items-center gap-1.5">
								<span aria-hidden="true" class="bg-success size-1.5 rounded-full"></span>
								{place.hours}
							</Card.Description>
						</Card.Header>
					</Card.Root>
				</li>
			{/each}
		</ul>
	</section>

	<section aria-labelledby="talks" class="flex flex-col gap-1">
		<h2 id="talks" class="text-base font-medium">Today’s talks</h2>
		<Accordion.Root type="single">
			{#each TALKS as talk (talk.id)}
				<Accordion.Item value={talk.id}>
					<Accordion.Trigger class="min-h-11">
						<span class="flex gap-3">
							<span class="text-muted-foreground font-normal tabular-nums">{talk.time}</span>
							<span>{talk.title}</span>
						</span>
					</Accordion.Trigger>
					<Accordion.Content>
						<div class="flex flex-col gap-2 pl-[3.25rem]">
							<p class="text-muted-foreground">{talk.speaker} · {talk.place} · {talk.length}</p>
							<p>{talk.summary}</p>
						</div>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</section>
</Screen>
