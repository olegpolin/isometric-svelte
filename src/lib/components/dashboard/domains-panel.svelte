<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { DOMAINS } from './data.js';

	/** The project's domains: certificate state and whether plain HTTP is redirected to HTTPS. */
	let { id = 'domains' }: { id?: string } = $props();

	let domains = $state(DOMAINS.map((d) => ({ ...d })));
</script>

<section {id} aria-labelledby="{id}-title" class="flex scroll-mt-20 flex-col gap-2">
	<div class="flex items-baseline justify-between gap-4">
		<h2 id="{id}-title" class="text-foreground text-[15px] font-medium">Domains</h2>
		<span class="type-label text-muted-foreground" aria-hidden="true">HTTPS redirect</span>
	</div>
	<Item.Group class="gap-0">
		{#each domains as d, i (d.name)}
			{#if i > 0}
				<Item.Separator class="my-0" />
			{/if}
			<Item.Root size="sm" class="px-0">
				<Item.Content class="min-w-0">
					<Item.Title class="w-full min-w-0">
						<span class="truncate font-mono text-[13px] font-normal">{d.name}</span>
					</Item.Title>
					<Item.Description class="flex items-center gap-2">
						<Badge variant={d.certificate.variant}>{d.certificate.label}</Badge>
						<span class="truncate">{d.note}</span>
					</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Switch bind:checked={d.redirect} aria-label="Redirect HTTP to HTTPS on {d.name}" />
				</Item.Actions>
			</Item.Root>
		{/each}
	</Item.Group>
</section>
