<script lang="ts">
	import { toast } from 'svelte-sonner';
	import InfoIcon from '@lucide/svelte/icons/info';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import OctagonXIcon from '@lucide/svelte/icons/octagon-x';
	import TerminalIcon from '@lucide/svelte/icons/terminal';
	import RocketIcon from '@lucide/svelte/icons/rocket';
	import GitBranchIcon from '@lucide/svelte/icons/git-branch';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import SearchIcon from '@lucide/svelte/icons/search';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import { Page, Section, Demo } from '#lib/components/showcase/index.js';
	import { chapterBySlug } from '#lib/catalog.js';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Progress } from '#lib/components/ui/progress/index.js';
	import { Spinner } from '#lib/components/ui/spinner/index.js';
	import { Skeleton } from '#lib/components/ui/skeleton/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';

	const chapter = chapterBySlug('feedback')!;

	/* Toast */
	function fakeDeploy() {
		return new Promise<{ seconds: number }>((resolve) => setTimeout(() => resolve({ seconds: 38 }), 2000));
	}

	function deployWithPromise() {
		toast.promise(fakeDeploy(), {
			loading: 'Deploying stairs/landing to Frankfurt',
			success: (r) => `Deployed stairs/landing in ${r.seconds}s`,
			error: 'The deploy to Frankfurt failed'
		});
	}

	function purgeCache() {
		const id = toast.loading('Purging the cache in four regions');
		setTimeout(() => toast.success('Purged 1,284 cached paths', { id }), 2500);
	}

	function deleteBranch() {
		toast('Deleted branch rotor/snap', {
			description: 'Its 14 preview deployments were removed with it.',
			action: { label: 'Restore branch', onClick: () => toast.success('Restored rotor/snap') }
		});
	}

	/* Progress */
	let uploaded = $state(36);
	function stepUpload() {
		uploaded = uploaded >= 100 ? 0 : Math.min(100, uploaded + 16);
	}
	const STATIC_VALUES = [0, 25, 50, 75, 100];

	/* Skeleton */
	let loaded = $state(false);
	const SKELETON_ROWS = ['a', 'b', 'c'];
</script>

<svelte:head>
	<title>{chapter.title} · Isometric</title>
	<meta
		name="description"
		content="Alerts, toasts, progress bars, spinners, skeletons and empty states: how an Isometric interface says what it is doing."
	/>
</svelte:head>

<Page
	title={chapter.title}
	description={chapter.subtitle}
	chapter={{ numeral: chapter.numeral, connective: chapter.connective }}
>
	<Section
		title="Alert"
		description="A message that stays in the page until its cause is dealt with. For something that passes, use a toast."
	>
		<Demo
			label="Default"
			spec="title · description"
			align="stretch"
			code={`<Alert.Root>
	<TerminalIcon />
	<Alert.Title>Build cache warmed</Alert.Title>
	<Alert.Description>The next deploy of main will reuse 38.4 GB of cached assets.</Alert.Description>
</Alert.Root>`}
		>
			<Alert.Root>
				<TerminalIcon />
				<Alert.Title>Build cache warmed</Alert.Title>
				<Alert.Description>The next deploy of main will reuse 38.4 GB of cached assets.</Alert.Description>
			</Alert.Root>
		</Demo>

		<Demo
			label="Variants"
			spec="default · destructive · success · warning · info"
			align="stretch"
			code={`<Alert.Root variant="destructive">
	<OctagonXIcon />
	<Alert.Title>Deploy to Singapore failed</Alert.Title>
	<Alert.Description>The build exited with code 1 at step 4 of 6.</Alert.Description>
</Alert.Root>`}
		>
			<Alert.Root variant="destructive">
				<OctagonXIcon />
				<Alert.Title>Deploy to Singapore failed</Alert.Title>
				<Alert.Description>The build exited with code 1 at step 4 of 6.</Alert.Description>
			</Alert.Root>
			<Alert.Root variant="success">
				<CircleCheckIcon />
				<Alert.Title>Observatory is live in four regions</Alert.Title>
				<Alert.Description>Frankfurt, San Francisco, Singapore and São Paulo all serve commit 8ed905f.</Alert.Description>
			</Alert.Root>
			<Alert.Root variant="warning">
				<TriangleAlertIcon />
				<Alert.Title>Bandwidth at 82% of the monthly allowance</Alert.Title>
				<Alert.Description>At the current rate the allowance runs out on the 27th.</Alert.Description>
			</Alert.Root>
			<Alert.Root variant="info">
				<InfoIcon />
				<Alert.Title>Scheduled maintenance in São Paulo</Alert.Title>
				<Alert.Description>Edge requests are routed through San Francisco on Sunday, 02:00 to 03:00 UTC.</Alert.Description>
			</Alert.Root>
		</Demo>

		<Demo
			label="With and without icon"
			spec="icon column · text only"
			align="stretch"
			code={`<Alert.Root variant="warning">
	<Alert.Title>The domain atlas.example expires in 9 days</Alert.Title>
	<Alert.Description>Renew it before the 31st to keep the Atlas guide reachable.</Alert.Description>
</Alert.Root>`}
		>
			<Alert.Root variant="warning">
				<Alert.Title>The domain atlas.example expires in 9 days</Alert.Title>
				<Alert.Description>Renew it before the 31st to keep the Atlas guide reachable.</Alert.Description>
			</Alert.Root>
			<Alert.Root variant="warning">
				<TriangleAlertIcon />
				<Alert.Title>The domain atlas.example expires in 9 days</Alert.Title>
				<Alert.Description>Renew it before the 31st to keep the Atlas guide reachable.</Alert.Description>
			</Alert.Root>
		</Demo>

		<Demo
			label="With an action"
			spec="Alert.Action · top right"
			align="stretch"
			code={`<Alert.Root variant="info">
	<GitBranchIcon />
	<Alert.Title>stairs/landing is 6 commits behind main</Alert.Title>
	<Alert.Description>Preview deployments use the branch as it is.</Alert.Description>
	<Alert.Action>
		<Button size="xs" variant="outline">Update branch</Button>
	</Alert.Action>
</Alert.Root>`}
		>
			<Alert.Root variant="info">
				<GitBranchIcon />
				<Alert.Title>stairs/landing is 6 commits behind main</Alert.Title>
				<Alert.Description>Preview deployments use the branch as it is.</Alert.Description>
				<Alert.Action>
					<Button size="xs" variant="outline">Update branch</Button>
				</Alert.Action>
			</Alert.Root>
		</Demo>

		<Demo
			label="Long description"
			spec="paragraphs · links"
			align="stretch"
			code={`<Alert.Root variant="destructive">
	<OctagonXIcon />
	<Alert.Title>Certificate renewal failed for atlas.example</Alert.Title>
	<Alert.Description>
		<p>The certificate authority could not reach the challenge file at /.well-known/acme-challenge. The current certificate stays valid until 3 November, so visitors see no change yet.</p>
		<p>Check that the DNS record for atlas.example still points at Observatory, then <a href="#alert">retry the renewal</a>.</p>
	</Alert.Description>
</Alert.Root>`}
		>
			<Alert.Root variant="destructive">
				<OctagonXIcon />
				<Alert.Title>Certificate renewal failed for atlas.example</Alert.Title>
				<Alert.Description>
					<p>The certificate authority could not reach the challenge file at /.well-known/acme-challenge. The current certificate stays valid until 3 November, so visitors see no change yet.</p>
					<p>Check that the DNS record for atlas.example still points at Observatory, then <a href="#alert">retry the renewal</a>.</p>
				</Alert.Description>
			</Alert.Root>
		</Demo>
	</Section>

	<Section
		title="Toast"
		description="A short note that the system did something, which leaves on its own. For anything the reader must act on, use an alert or a dialog."
	>
		<Demo
			label="Default"
			spec="toast()"
			code={`<Button variant="outline" onclick={() => toast('Copied the install command')}>
	Copy install command
</Button>`}
		>
			<Button variant="outline" onclick={() => toast('Copied the install command')}>
				Copy install command
			</Button>
		</Demo>

		<Demo
			label="Status"
			spec="success · error · warning · info"
			code={`<Button variant="outline" onclick={() => toast.success('Deployed main to production')}>
	Deploy main
</Button>`}
		>
			<Button variant="outline" onclick={() => toast.success('Deployed main to production')}>
				Deploy main
			</Button>
			<Button variant="outline" onclick={() => toast.error('Could not reach the Singapore edge')}>
				Ping Singapore
			</Button>
			<Button variant="outline" onclick={() => toast.warning('Error rate at 0.21% in the last hour')}>
				Check error rate
			</Button>
			<Button variant="outline" onclick={() => toast.info('Atlas has 3 new guide entries in review')}>
				Review guide entries
			</Button>
		</Demo>

		<Demo
			label="With a description and an action"
			spec="description · action"
			code={`<Button variant="destructive" onclick={deleteBranch}>Delete branch</Button>`}
		>
			<Button variant="destructive" onclick={deleteBranch}>Delete branch</Button>
		</Demo>

		<Demo
			label="Promise"
			spec="loading → success · 2s"
			code={`<Button onclick={deployWithPromise}>
	<RocketIcon data-icon="inline-start" />
	Deploy stairs/landing
</Button>`}
		>
			<Button onclick={deployWithPromise}>
				<RocketIcon data-icon="inline-start" />
				Deploy stairs/landing
			</Button>
		</Demo>

		<Demo
			label="Loading, then updated"
			spec="toast.loading · same id"
			code={`<Button variant="outline" onclick={purgeCache}>
	<RefreshCwIcon data-icon="inline-start" />
	Purge cache
</Button>`}
		>
			<Button variant="outline" onclick={purgeCache}>
				<RefreshCwIcon data-icon="inline-start" />
				Purge cache
			</Button>
		</Demo>
	</Section>

	<Section
		title="Progress"
		description="How far a task of known length has gone. When the length is unknown, use the indeterminate bar or a spinner."
	>
		<Demo
			label="Default"
			spec="value 64 · label · tabular percentage"
			code={`<div class="flex w-full max-w-sm flex-col gap-2">
	<div class="flex items-center justify-between gap-4 text-sm">
		<span id="progress-assets">Uploading assets to Frankfurt</span>
		<span class="text-muted-foreground tabular-nums">64%</span>
	</div>
	<Progress value={64} aria-labelledby="progress-assets" />
</div>`}
		>
			<div class="flex w-full max-w-sm flex-col gap-2">
				<div class="flex items-center justify-between gap-4 text-sm">
					<span id="progress-assets">Uploading assets to Frankfurt</span>
					<span class="text-muted-foreground tabular-nums">64%</span>
				</div>
				<Progress value={64} aria-labelledby="progress-assets" />
			</div>
		</Demo>

		<Demo
			label="Values"
			spec={STATIC_VALUES.join(' · ')}
			code={`<Progress value={25} aria-label="25%" />`}
		>
			<div class="flex w-full max-w-sm flex-col gap-3">
				{#each STATIC_VALUES as v (v)}
					<div class="flex items-center gap-3">
						<Progress value={v} aria-label="{v}%" />
						<span class="text-muted-foreground w-10 shrink-0 text-right text-xs tabular-nums">{v}%</span>
					</div>
				{/each}
			</div>
		</Demo>

		<Demo
			label="Live value"
			spec="steps of 16 · eased"
			code={`<div class="flex w-full max-w-sm flex-col gap-2">
	<div class="flex items-center justify-between gap-4 text-sm">
		<span id="progress-live">Building rotor/snap</span>
		<span class="text-muted-foreground tabular-nums">{uploaded}%</span>
	</div>
	<Progress value={uploaded} aria-labelledby="progress-live" />
</div>`}
		>
			<div class="flex w-full max-w-sm flex-col gap-4">
				<div class="flex w-full flex-col gap-2">
					<div class="flex items-center justify-between gap-4 text-sm">
						<span id="progress-live">Building rotor/snap</span>
						<span class="text-muted-foreground tabular-nums">{uploaded}%</span>
					</div>
					<Progress value={uploaded} aria-labelledby="progress-live" />
				</div>
				<div>
					<Button size="sm" variant="outline" onclick={stepUpload}>
						{uploaded >= 100 ? 'Start again' : 'Run the next build step'}
					</Button>
				</div>
			</div>
		</Demo>

		<Demo
			label="Indeterminate"
			spec={"value={null}"}
			code={`<div class="flex w-full max-w-sm flex-col gap-2">
	<span id="progress-dns" class="text-sm">Waiting for DNS to propagate</span>
	<Progress value={null} aria-labelledby="progress-dns" />
</div>`}
		>
			<div class="flex w-full max-w-sm flex-col gap-2">
				<span id="progress-dns" class="text-sm">Waiting for DNS to propagate</span>
				<Progress value={null} aria-labelledby="progress-dns" />
			</div>
		</Demo>
	</Section>

	<Section
		title="Spinner"
		description="Something is happening and its length is unknown. A hairline ring with one travelling dot; it takes the current text colour."
	>
		<Demo label="Default" spec="size-4 · currentColor" code={`<Spinner />`}>
			<Spinner />
		</Demo>

		<Demo
			label="Sizes"
			spec="size-4 · size-6 · size-8"
			code={`<Spinner class="size-4" />
<Spinner class="size-6" />
<Spinner class="size-8" />`}
		>
			<Spinner class="size-4" />
			<Spinner class="size-6" />
			<Spinner class="size-8" />
		</Demo>

		<Demo
			label="Colour"
			spec="text-muted-foreground · text-primary"
			code={`<Spinner class="size-6 text-muted-foreground" />
<Spinner class="size-6 text-primary" />`}
		>
			<Spinner class="size-6 text-muted-foreground" />
			<Spinner class="size-6 text-primary" />
		</Demo>

		<Demo
			label="In a button"
			spec="Spinner · disabled"
			code={`<Button disabled>
	<Spinner data-icon="inline-start" />
	Deploying main
</Button>`}
		>
			<Button disabled>
				<Spinner data-icon="inline-start" />
				Deploying main
			</Button>
			<Button variant="outline" disabled>
				<Spinner data-icon="inline-start" />
				Purging cache
			</Button>
			<Button variant="block" size="sm" disabled>
				<Spinner data-icon="inline-start" />
				Saving
			</Button>
		</Demo>

		<Demo
			label="With a status line"
			spec="inline · muted"
			code={`<div class="text-muted-foreground flex items-center gap-2 text-sm">
	<Spinner />
	<span>Building Atlas for São Paulo, step 3 of 6</span>
</div>`}
		>
			<div class="text-muted-foreground flex items-center gap-2 text-sm">
				<Spinner />
				<span>Building Atlas for São Paulo, step 3 of 6</span>
			</div>
		</Demo>
	</Section>

	<Section
		title="Skeleton"
		description="The shape of content that is on its way. Match the layout it replaces so nothing jumps when the content arrives."
	>
		<Demo
			label="Avatar and lines"
			spec="circle · two lines"
			code={`<div class="flex items-center gap-3">
	<Skeleton class="size-10 rounded-full" />
	<div class="flex flex-col gap-2">
		<Skeleton class="h-4 w-48" />
		<Skeleton class="h-3 w-32" />
	</div>
</div>`}
		>
			<div class="flex items-center gap-3">
				<Skeleton class="size-10 rounded-full" />
				<div class="flex flex-col gap-2">
					<Skeleton class="h-4 w-48" />
					<Skeleton class="h-3 w-32" />
				</div>
			</div>
		</Demo>

		<Demo
			label="Card"
			spec="header · body · footer"
			canvas="plain"
			code={`<Card.Root class="w-full max-w-sm">
	<Card.Header>
		<Skeleton class="h-4 w-40" />
		<Skeleton class="h-3 w-56" />
	</Card.Header>
	<Card.Content class="flex flex-col gap-2">
		<Skeleton class="h-24 w-full" />
		<Skeleton class="h-3 w-3/4" />
	</Card.Content>
</Card.Root>`}
		>
			<Card.Root class="w-full max-w-sm">
				<Card.Header>
					<Skeleton class="h-4 w-40" />
					<Skeleton class="h-3 w-56" />
				</Card.Header>
				<Card.Content class="flex flex-col gap-2">
					<Skeleton class="h-24 w-full" />
					<Skeleton class="h-3 w-3/4" />
				</Card.Content>
			</Card.Root>
		</Demo>

		<Demo
			label="Table rows"
			spec="one skeleton per cell"
			align="stretch"
			code={`<Table.Row>
	<Table.Cell><Skeleton class="h-4 w-16" /></Table.Cell>
	<Table.Cell><Skeleton class="h-4 w-28" /></Table.Cell>
	<Table.Cell class="hidden sm:table-cell"><Skeleton class="h-4 w-24" /></Table.Cell>
	<Table.Cell><Skeleton class="ms-auto h-4 w-10" /></Table.Cell>
</Table.Row>`}
		>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Commit</Table.Head>
						<Table.Head>Branch</Table.Head>
						<Table.Head class="hidden sm:table-cell">Region</Table.Head>
						<Table.Head class="text-right">Duration</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each SKELETON_ROWS as row (row)}
						<Table.Row>
							<Table.Cell><Skeleton class="h-4 w-16" /></Table.Cell>
							<Table.Cell><Skeleton class="h-4 w-28" /></Table.Cell>
							<Table.Cell class="hidden sm:table-cell"><Skeleton class="h-4 w-24" /></Table.Cell>
							<Table.Cell><Skeleton class="ms-auto h-4 w-10" /></Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Demo>

		<Demo
			label="Loading, then loaded"
			spec="same footprint in both states"
			canvas="plain"
			align="start"
			code={`{#if loaded}
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>Observatory</Card.Title>
			<Card.Description>main · deployed 4 minutes ago</Card.Description>
		</Card.Header>
		...
	</Card.Root>
{:else}
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Skeleton class="h-4 w-28" />
			<Skeleton class="h-3 w-44" />
		</Card.Header>
		...
	</Card.Root>
{/if}`}
		>
			<div class="flex w-full flex-col items-start gap-4">
				<Button size="sm" variant="outline" onclick={() => (loaded = !loaded)}>
					{loaded ? 'Show the loading state' : 'Load the project'}
				</Button>
				{#if loaded}
					<Card.Root class="w-full max-w-sm">
						<Card.Header>
							<Card.Title>Observatory</Card.Title>
							<Card.Description>main · deployed 4 minutes ago</Card.Description>
						</Card.Header>
						<Card.Content class="flex flex-col gap-3">
							<div class="flex items-center justify-between gap-4">
								<span class="text-muted-foreground">Requests this month</span>
								<span class="tabular-nums">1,284,903</span>
							</div>
							<div class="flex items-center justify-between gap-4">
								<span class="text-muted-foreground">Bandwidth</span>
								<span class="tabular-nums">38.4 GB</span>
							</div>
							<div class="flex items-center justify-between gap-4">
								<span class="text-muted-foreground">Regions</span>
								<Badge variant="secondary">4 live</Badge>
							</div>
						</Card.Content>
					</Card.Root>
				{:else}
					<Card.Root class="w-full max-w-sm" aria-busy="true" aria-label="Loading the project">
						<Card.Header>
							<Skeleton class="h-4 w-28" />
							<Skeleton class="h-3 w-44" />
						</Card.Header>
						<Card.Content class="flex flex-col gap-3">
							<div class="flex items-center justify-between gap-4">
								<Skeleton class="h-4 w-32" />
								<Skeleton class="h-4 w-20" />
							</div>
							<div class="flex items-center justify-between gap-4">
								<Skeleton class="h-4 w-20" />
								<Skeleton class="h-4 w-16" />
							</div>
							<div class="flex items-center justify-between gap-4">
								<Skeleton class="h-4 w-16" />
								<Skeleton class="h-5 w-12" />
							</div>
						</Card.Content>
					</Card.Root>
				{/if}
			</div>
		</Demo>
	</Section>

	<Section
		title="Empty"
		description="What a place looks like before anything is in it, and the one action that fills it. For a failed load, use an alert."
	>
		<Demo
			label="Default"
			spec="concentric rings · title · description"
			code={`<Empty.Root>
	<Empty.Header>
		<Empty.Media />
		<Empty.Title>No deployments yet</Empty.Title>
		<Empty.Description>Push to main and the first build of Observatory appears here.</Empty.Description>
	</Empty.Header>
</Empty.Root>`}
		>
			<Empty.Root>
				<Empty.Header>
					<Empty.Media />
					<Empty.Title>No deployments yet</Empty.Title>
					<Empty.Description>Push to main and the first build of Observatory appears here.</Empty.Description>
				</Empty.Header>
			</Empty.Root>
		</Demo>

		<Demo
			label="With an icon"
			spec="icon inside the rings"
			code={`<Empty.Root>
	<Empty.Header>
		<Empty.Media>
			<InboxIcon />
		</Empty.Media>
		<Empty.Title>No notifications</Empty.Title>
		<Empty.Description>Failed builds and expiring domains are reported here.</Empty.Description>
	</Empty.Header>
</Empty.Root>`}
		>
			<Empty.Root>
				<Empty.Header>
					<Empty.Media>
						<InboxIcon />
					</Empty.Media>
					<Empty.Title>No notifications</Empty.Title>
					<Empty.Description>Failed builds and expiring domains are reported here.</Empty.Description>
				</Empty.Header>
			</Empty.Root>
		</Demo>

		<Demo
			label="With a primary action"
			spec="title · description · action"
			code={`<Empty.Root>
	<Empty.Header>
		<Empty.Media>
			<FolderIcon />
		</Empty.Media>
		<Empty.Title>No projects in this team</Empty.Title>
		<Empty.Description>Import a repository to publish it to Frankfurt, San Francisco, Singapore and São Paulo.</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<Button>
			<PlusIcon data-icon="inline-start" />
			Import a repository
		</Button>
	</Empty.Content>
</Empty.Root>`}
		>
			<Empty.Root>
				<Empty.Header>
					<Empty.Media>
						<FolderIcon />
					</Empty.Media>
					<Empty.Title>No projects in this team</Empty.Title>
					<Empty.Description>Import a repository to publish it to Frankfurt, San Francisco, Singapore and São Paulo.</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<Button>
						<PlusIcon data-icon="inline-start" />
						Import a repository
					</Button>
				</Empty.Content>
			</Empty.Root>
		</Demo>

		<Demo
			label="In a bordered area"
			spec="hairline · fills its container"
			align="stretch"
			canvas="plain"
			code={`<Empty.Root class="border">
	<Empty.Header>
		<Empty.Media>
			<SearchIcon />
		</Empty.Media>
		<Empty.Title>No deployments match “rotor/snap”</Empty.Title>
		<Empty.Description>Check the branch name, or clear the filter to see all 212.</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<Button variant="outline" size="sm">Clear the filter</Button>
	</Empty.Content>
</Empty.Root>`}
		>
			<Empty.Root class="border">
				<Empty.Header>
					<Empty.Media>
						<SearchIcon />
					</Empty.Media>
					<Empty.Title>No deployments match “rotor/snap”</Empty.Title>
					<Empty.Description>Check the branch name, or clear the filter to see all 212.</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<Button variant="outline" size="sm">Clear the filter</Button>
				</Empty.Content>
			</Empty.Root>
		</Demo>

		<Demo
			label="Icon variant"
			spec='variant="icon" · a raised tile'
			code={`<Empty.Root>
	<Empty.Header>
		<Empty.Media variant="icon">
			<GitBranchIcon />
		</Empty.Media>
		<Empty.Title>No preview branches</Empty.Title>
		<Empty.Description>Every branch other than main gets its own preview address.</Empty.Description>
	</Empty.Header>
</Empty.Root>`}
		>
			<Empty.Root>
				<Empty.Header>
					<Empty.Media variant="icon">
						<GitBranchIcon />
					</Empty.Media>
					<Empty.Title>No preview branches</Empty.Title>
					<Empty.Description>Every branch other than main gets its own preview address.</Empty.Description>
				</Empty.Header>
			</Empty.Root>
		</Demo>
	</Section>
</Page>
