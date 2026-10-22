<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import RotateCwIcon from '@lucide/svelte/icons/rotate-cw';
	import ScrollTextIcon from '@lucide/svelte/icons/scroll-text';
	import SearchIcon from '@lucide/svelte/icons/search';
	import XIcon from '@lucide/svelte/icons/x';
	import { toast } from 'svelte-sonner';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import { formatDuration, personById, STATUS, type Deployment, type Environment } from './data.js';
	import type { Deployments } from './deployments.svelte.js';

	/**
	 * The ten most recent deployments per environment, filtered by branch. Each row has its own
	 * menu: redeploy, view logs, cancel (only while queued).
	 */
	let { deployments, id = 'deployments' }: { deployments: Deployments; id?: string } = $props();

	let tab = $state<Environment>('production');
	let query = $state('');
	let needle = $derived(query.trim().toLowerCase());

	const envs: { value: Environment; label: string }[] = [
		{ value: 'production', label: 'Production' },
		{ value: 'preview', label: 'Preview' }
	];

	function rowsFor(env: Environment) {
		return deployments.list
			.filter((d) => d.env === env)
			.slice(0, 10)
			.filter((d) => !needle || d.branch.toLowerCase().includes(needle));
	}

	function redeploy(d: Deployment) {
		const next = deployments.redeploy(d);
		toast.success(`Queued a redeploy of ${d.sha}`, { description: `${d.branch}, new commit ${next.sha}.` });
	}

	function viewLogs(d: Deployment) {
		toast.info(`Build log for ${d.sha}`, {
			description:
				d.status === 'failed'
					? 'Stopped at step 4 of 6: image encoding exited with code 1.'
					: d.status === 'queued'
						? 'Nothing yet; the build is waiting for a runner.'
						: `214 lines. Uploaded 1,284 files to 4 regions in ${formatDuration(d.duration ?? 0)}.`
		});
	}

	function cancel(d: Deployment) {
		deployments.cancel(d.sha);
		toast(`Cancelled ${d.sha}`, { description: `${d.branch} will not be built.` });
	}
</script>

<section {id} aria-labelledby="{id}-title" class="flex min-w-0 scroll-mt-20 flex-col gap-3">
	<Tabs.Root bind:value={tab} class="flex flex-col gap-3">
		<div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
			<div class="flex flex-col gap-1">
				<h2 id="{id}-title" class="text-foreground text-[15px] font-medium">Recent deployments</h2>
				<p class="text-muted-foreground text-sm">The last ten builds per environment.</p>
			</div>
			<InputGroup.Root class="w-full sm:w-60">
				<InputGroup.Input
					type="search"
					placeholder="Filter by branch"
					aria-label="Filter deployments by branch"
					bind:value={query}
				/>
				<InputGroup.Addon>
					<SearchIcon />
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>

		<Tabs.List aria-label="Environment">
			{#each envs as e (e.value)}
				<Tabs.Trigger value={e.value}>{e.label}</Tabs.Trigger>
			{/each}
		</Tabs.List>

		{#each envs as e (e.value)}
			{@const rows = rowsFor(e.value)}
			<Tabs.Content value={e.value}>
				{#if rows.length === 0}
					<Empty.Root class="py-10">
						<Empty.Header>
							<Empty.Media>
								<SearchIcon />
							</Empty.Media>
							<Empty.Title>No deployments match</Empty.Title>
							<Empty.Description>
								No {e.label.toLowerCase()} deployment in the last ten was built from a branch containing
								“{query.trim()}”.
							</Empty.Description>
						</Empty.Header>
						<Empty.Content>
							<Button variant="outline" size="sm" onclick={() => (query = '')}>
								<XIcon data-icon="inline-start" />
								Clear filter
							</Button>
						</Empty.Content>
					</Empty.Root>
				{:else}
					<Table.Root>
						<Table.Caption class="sr-only">
							{e.label} deployments{needle ? `, branches containing ${query.trim()}` : ''}
						</Table.Caption>
						<Table.Header>
							<Table.Row>
								<Table.Head>Commit</Table.Head>
								<Table.Head>Branch</Table.Head>
								<Table.Head class="hidden md:table-cell">Author</Table.Head>
								<Table.Head class="hidden text-end sm:table-cell">Duration</Table.Head>
								<Table.Head>Status</Table.Head>
								<Table.Head class="hidden lg:table-cell">Created</Table.Head>
								<Table.Head class="w-10"><span class="sr-only">Actions</span></Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each rows as d (d.sha)}
								{@const author = personById(d.author)}
								{@const status = STATUS[d.status]}
								<Table.Row>
									<Table.Cell class="max-w-0 min-w-14 xl:min-w-64">
										<span class="flex min-w-0 items-baseline gap-2.5">
											<span class="text-foreground font-mono text-xs">{d.sha}</span>
											<span class="text-muted-foreground hidden truncate xl:inline" title={d.message}>{d.message}</span>
										</span>
									</Table.Cell>
									<Table.Cell class="font-mono text-xs whitespace-nowrap">
										<span class="block max-w-24 truncate sm:max-w-none" title={d.branch}>{d.branch}</span>
									</Table.Cell>
									<Table.Cell class="hidden md:table-cell">
										<span class="flex items-center gap-2 whitespace-nowrap">
											<Avatar.Root size="sm">
												<Avatar.Fallback>{author.initials}</Avatar.Fallback>
											</Avatar.Root>
											{author.name.split(' ')[0]}
										</span>
									</Table.Cell>
									<Table.Cell class="hidden text-end tabular-nums whitespace-nowrap sm:table-cell">
										{#if d.duration === null}
											<span class="text-muted-foreground">Waiting</span>
										{:else}
											{formatDuration(d.duration)}
										{/if}
									</Table.Cell>
									<Table.Cell>
										<Badge variant={status.variant}>{status.label}</Badge>
									</Table.Cell>
									<Table.Cell class="text-muted-foreground hidden whitespace-nowrap lg:table-cell">{d.age}</Table.Cell>
									<Table.Cell class="py-1.5 text-end">
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												{#snippet child({ props })}
													<Button {...props} variant="ghost" size="icon-sm" aria-label="Actions for {d.sha}">
														<EllipsisIcon />
													</Button>
												{/snippet}
											</DropdownMenu.Trigger>
											<DropdownMenu.Content align="end" class="w-44">
												<DropdownMenu.Group>
													<DropdownMenu.Label class="font-mono normal-case tracking-normal">{d.sha}</DropdownMenu.Label>
													<DropdownMenu.Item onSelect={() => redeploy(d)}>
														<RotateCwIcon />
														Redeploy
													</DropdownMenu.Item>
													<DropdownMenu.Item onSelect={() => viewLogs(d)}>
														<ScrollTextIcon />
														View logs
													</DropdownMenu.Item>
												</DropdownMenu.Group>
												<DropdownMenu.Separator />
												<DropdownMenu.Group>
													<DropdownMenu.Item
														variant="destructive"
														disabled={d.status !== 'queued'}
														onSelect={() => cancel(d)}
													>
														<XIcon />
														Cancel
													</DropdownMenu.Item>
												</DropdownMenu.Group>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{/if}
			</Tabs.Content>
		{/each}
	</Tabs.Root>
</section>
