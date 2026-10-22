<script lang="ts">
	import { toast } from 'svelte-sonner';
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import ScrollTextIcon from '@lucide/svelte/icons/scroll-text';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import PauseIcon from '@lucide/svelte/icons/pause';
	import SlidersHorizontalIcon from '@lucide/svelte/icons/sliders-horizontal';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import SearchIcon from '@lucide/svelte/icons/search';
	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import LinkIcon from '@lucide/svelte/icons/link';
	import ImageIcon from '@lucide/svelte/icons/image';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import { Page, Section, Demo } from '#lib/components/showcase/index.js';
	import { chapterBySlug } from '#lib/catalog.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import * as AlertDialog from '#lib/components/ui/alert-dialog/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import * as Drawer from '#lib/components/ui/drawer/index.js';
	import * as Popover from '#lib/components/ui/popover/index.js';
	import * as HoverCard from '#lib/components/ui/hover-card/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import * as Kbd from '#lib/components/ui/kbd/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';

	const chapter = chapterBySlug('overlays')!;

	/* Dialog: invite form */
	let inviteOpen = $state(false);
	let inviteEmail = $state('');
	let inviteRole = $state('developer');
	let inviteTried = $state(false);
	let inviteInvalid = $derived(inviteTried && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail));

	function sendInvite(event: SubmitEvent) {
		event.preventDefault();
		inviteTried = true;
		if (inviteInvalid) return;
		toast.success(`Invited ${inviteEmail} as a ${inviteRole}`);
		inviteOpen = false;
		inviteEmail = '';
		inviteTried = false;
	}

	const LOG = [
		'Cloning observatory at 8ed905f (main)',
		'Restoring build cache: 38.4 GB from Frankfurt',
		'Installing dependencies: 1,204 packages',
		'Running vite build',
		'Transformed 3,812 modules',
		'Rendering 212 pages',
		'Compressing 1,284 assets with brotli',
		'Uploading to Frankfurt',
		'Uploading to San Francisco',
		'Uploading to Singapore',
		'Uploading to São Paulo',
		'Purging stale paths: 96',
		'Warming the edge in four regions',
		'Health check passed in 4 of 4 regions',
		'Aliasing observatory.example to this deployment',
		'Deployed in 38.2s'
	];

	const DIALOG_SIZES = [
		{ name: 'sm', cls: '', note: 'confirmations and short forms' },
		{ name: 'md', cls: 'sm:max-w-md', note: 'a form of three or four fields' },
		{ name: 'lg', cls: 'sm:max-w-lg', note: 'two columns or a preview' },
		{ name: 'xl', cls: 'sm:max-w-2xl', note: 'a table or a diff' }
	];

	/* Alert dialog */
	let deleted = $state(false);

	/* Sheet */
	const SIDES = ['top', 'right', 'bottom', 'left'] as const;
	let editOpen = $state(false);
	let projectName = $state('Observatory');
	let projectDescription = $state('Static site for the observatory and the Atlas guide.');

	function saveProject(event: SubmitEvent) {
		event.preventDefault();
		toast.success(`Saved changes to ${projectName}`);
		editOpen = false;
	}

	const REGIONS = [
		{ id: 'fra', name: 'Frankfurt', latency: '18 ms' },
		{ id: 'sfo', name: 'San Francisco', latency: '41 ms' },
		{ id: 'sin', name: 'Singapore', latency: '63 ms' },
		{ id: 'gru', name: 'São Paulo', latency: '87 ms' }
	];
	let regionsOn = $state<Record<string, boolean>>({ fra: true, sfo: true, sin: true, gru: false });

	/* Drawer */
	let feedbackOpen = $state(false);
	let feedbackText = $state('');
	function sendFeedback(event: SubmitEvent) {
		event.preventDefault();
		toast.success('Sent your note to the Atlas team');
		feedbackOpen = false;
		feedbackText = '';
	}

	/* Popover */
	let limitOpen = $state(false);
	let limit = $state('120');
	function saveLimit(event: SubmitEvent) {
		event.preventDefault();
		toast.success(`Set the bandwidth limit to ${limit} GB`);
		limitOpen = false;
	}
	const ALIGNS = ['start', 'center', 'end'] as const;

	/* Tooltip */
	const SIDES_TIP = ['top', 'right', 'bottom', 'left'] as const;
	const TOOLBAR = [
		{ label: 'Bold', Icon: BoldIcon },
		{ label: 'Italic', Icon: ItalicIcon },
		{ label: 'Insert link', Icon: LinkIcon },
		{ label: 'Insert image', Icon: ImageIcon }
	];
</script>

<svelte:head>
	<title>{chapter.title} · Isometric</title>
	<meta
		name="description"
		content="Dialogs, alert dialogs, sheets, drawers, popovers, hover cards and tooltips: the layers that rise over an Isometric page."
	/>
</svelte:head>

{#snippet person(name: string, initials: string, role: string, joined: string)}
	<div class="flex gap-3">
		<Avatar.Root size="lg">
			<Avatar.Fallback>{initials}</Avatar.Fallback>
		</Avatar.Root>
		<div class="flex min-w-0 flex-col gap-1">
			<span class="text-foreground font-medium">{name}</span>
			<span class="text-muted-foreground">{role}</span>
			<span class="text-muted-foreground flex items-center gap-1.5 text-xs">
				<CalendarIcon class="size-3.5" />
				{joined}
			</span>
		</div>
	</div>
{/snippet}

<Page
	title={chapter.title}
	description={chapter.subtitle}
	chapter={{ numeral: chapter.numeral, connective: chapter.connective }}
>
	<Section
		title="Dialog"
		description="A modal layer for a short task that must be finished or dismissed before going on. To confirm a destructive step, use an alert dialog."
	>
		<Demo
			label="A form"
			spec="Field · validation on submit · footer"
			code={`<Dialog.Root bind:open={inviteOpen}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props}>
				<UserPlusIcon data-icon="inline-start" />
				Invite to team
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<form onsubmit={sendInvite} novalidate class="flex flex-col gap-6">
			<Dialog.Header>
				<Dialog.Title>Invite to Observatory</Dialog.Title>
				<Dialog.Description>They get an email with a link that works for 7 days.</Dialog.Description>
			</Dialog.Header>
			<Field.FieldGroup>
				<Field.Field data-invalid={inviteInvalid || undefined}>
					<Field.FieldLabel for="invite-email">Email</Field.FieldLabel>
					<Input id="invite-email" type="email" placeholder="ines.halloran@example.com" bind:value={inviteEmail} aria-invalid={inviteInvalid || undefined} />
					{#if inviteInvalid}
						<Field.FieldError>Enter an email address, like ines.halloran@example.com.</Field.FieldError>
					{/if}
				</Field.Field>
				<Field.Field>
					<Field.FieldLabel id="invite-role-label">Role</Field.FieldLabel>
					<ToggleGroup.Root type="single" variant="outline" bind:value={inviteRole} aria-labelledby="invite-role-label">
						<ToggleGroup.Item value="viewer">Viewer</ToggleGroup.Item>
						<ToggleGroup.Item value="developer">Developer</ToggleGroup.Item>
						<ToggleGroup.Item value="owner">Owner</ToggleGroup.Item>
					</ToggleGroup.Root>
				</Field.Field>
			</Field.FieldGroup>
			<Dialog.Footer>
				<Dialog.Close>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Cancel</Button>
					{/snippet}
				</Dialog.Close>
				<Button type="submit">Send invite</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>`}
		>
			<Dialog.Root bind:open={inviteOpen}>
				<Dialog.Trigger>
					{#snippet child({ props })}
						<Button {...props}>
							<UserPlusIcon data-icon="inline-start" />
							Invite to team
						</Button>
					{/snippet}
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-md">
					<form onsubmit={sendInvite} novalidate class="flex flex-col gap-6">
						<Dialog.Header>
							<Dialog.Title>Invite to Observatory</Dialog.Title>
							<Dialog.Description>They get an email with a link that works for 7 days.</Dialog.Description>
						</Dialog.Header>
						<Field.FieldGroup>
							<Field.Field data-invalid={inviteInvalid || undefined}>
								<Field.FieldLabel for="invite-email">Email</Field.FieldLabel>
								<Input id="invite-email" type="email" placeholder="ines.halloran@example.com" bind:value={inviteEmail} aria-invalid={inviteInvalid || undefined} />
								{#if inviteInvalid}
									<Field.FieldError>Enter an email address, like ines.halloran@example.com.</Field.FieldError>
								{/if}
							</Field.Field>
							<Field.Field>
								<Field.FieldLabel id="invite-role-label">Role</Field.FieldLabel>
								<ToggleGroup.Root type="single" variant="outline" bind:value={inviteRole} aria-labelledby="invite-role-label">
									<ToggleGroup.Item value="viewer">Viewer</ToggleGroup.Item>
									<ToggleGroup.Item value="developer">Developer</ToggleGroup.Item>
									<ToggleGroup.Item value="owner">Owner</ToggleGroup.Item>
								</ToggleGroup.Root>
							</Field.Field>
						</Field.FieldGroup>
						<Dialog.Footer>
							<Dialog.Close>
								{#snippet child({ props })}
									<Button variant="outline" {...props}>Cancel</Button>
								{/snippet}
							</Dialog.Close>
							<Button type="submit">Send invite</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</Demo>

		<Demo
			label="Long content"
			spec="header and footer fixed · body scrolls"
			code={`<Dialog.Root>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>
				<ScrollTextIcon data-icon="inline-start" />
				Read the build log
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="grid max-h-[80dvh] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Build log for 8ed905f</Dialog.Title>
			<Dialog.Description>main · Frankfurt · 38.2s</Dialog.Description>
		</Dialog.Header>
		<ol class="-mx-5 overflow-y-auto px-5 font-mono text-xs">
			{#each LOG as line, i (i)}
				<li class="flex gap-3 py-1">...</li>
			{/each}
		</ol>
		<Dialog.Footer showCloseButton />
	</Dialog.Content>
</Dialog.Root>`}
		>
			<Dialog.Root>
				<Dialog.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>
							<ScrollTextIcon data-icon="inline-start" />
							Read the build log
						</Button>
					{/snippet}
				</Dialog.Trigger>
				<Dialog.Content class="grid max-h-[80dvh] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-lg">
					<Dialog.Header>
						<Dialog.Title>Build log for 8ed905f</Dialog.Title>
						<Dialog.Description>main · Frankfurt · 38.2s</Dialog.Description>
					</Dialog.Header>
					<ol class="-mx-5 overflow-y-auto px-5 font-mono text-xs">
						{#each [...LOG, ...LOG] as line, i (i)}
							<li class="flex gap-3 py-1">
								<span class="text-muted-foreground w-6 shrink-0 text-right tabular-nums">{i + 1}</span>
								<span>{line}</span>
							</li>
						{/each}
					</ol>
					<Dialog.Footer showCloseButton />
				</Dialog.Content>
			</Dialog.Root>
		</Demo>

		<Demo
			label="Custom close"
			spec={"showCloseButton={false} · Dialog.Close"}
			code={`<Dialog.Root>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>Show the deploy summary</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content showCloseButton={false}>
		<Dialog.Header>
			<Dialog.Title>stairs/landing is live</Dialog.Title>
			<Dialog.Description>Built in 38.2s and served from four regions.</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Dialog.Close>
				{#snippet child({ props })}
					<Button {...props}>Back to deployments</Button>
				{/snippet}
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>`}
		>
			<Dialog.Root>
				<Dialog.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Show the deploy summary</Button>
					{/snippet}
				</Dialog.Trigger>
				<Dialog.Content showCloseButton={false}>
					<Dialog.Header>
						<Dialog.Title>stairs/landing is live</Dialog.Title>
						<Dialog.Description>Built in 38.2s and served from four regions.</Dialog.Description>
					</Dialog.Header>
					<Dialog.Footer>
						<Dialog.Close>
							{#snippet child({ props })}
								<Button {...props}>Back to deployments</Button>
							{/snippet}
						</Dialog.Close>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</Demo>

		<Demo
			label="Sizes"
			spec="sm · md · lg · xl, set with max-w-*"
			code={`<Dialog.Content class="sm:max-w-lg">...</Dialog.Content>`}
		>
			{#each DIALOG_SIZES as s (s.name)}
				<Dialog.Root>
					<Dialog.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" size="sm" {...props}>Open {s.name}</Button>
						{/snippet}
					</Dialog.Trigger>
					<Dialog.Content class={s.cls}>
						<Dialog.Header>
							<Dialog.Title>Dialog, size {s.name}</Dialog.Title>
							<Dialog.Description>For {s.note}.</Dialog.Description>
						</Dialog.Header>
						<Dialog.Footer showCloseButton />
					</Dialog.Content>
				</Dialog.Root>
			{/each}
		</Demo>
	</Section>

	<Section
		title="Alert dialog"
		description="Interrupts to confirm a step that cannot be undone, or to report something the reader must acknowledge. It does not close on an outside click."
	>
		<Demo
			label="Confirm a deletion"
			spec="destructive action · cancel first"
			code={`<AlertDialog.Root>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Button variant="destructive" {...props}>
				<Trash2Icon data-icon="inline-start" />
				Delete project
			</Button>
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Observatory?</AlertDialog.Title>
			<AlertDialog.Description>
				This removes 212 deployments and the domain observatory.example from all four regions. It cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Keep the project</AlertDialog.Cancel>
			<AlertDialog.Action variant="destructive" onclick={() => (deleted = true)}>Delete Observatory</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>`}
		>
			<div class="flex flex-col items-center gap-3">
				<AlertDialog.Root>
					<AlertDialog.Trigger>
						{#snippet child({ props })}
							<Button variant="destructive" {...props}>
								<Trash2Icon data-icon="inline-start" />
								Delete project
							</Button>
						{/snippet}
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Delete Observatory?</AlertDialog.Title>
							<AlertDialog.Description>
								This removes 212 deployments and the domain observatory.example from all four regions. It cannot be undone.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Keep the project</AlertDialog.Cancel>
							<AlertDialog.Action variant="destructive" onclick={() => (deleted = true)}>Delete Observatory</AlertDialog.Action>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
				{#if deleted}
					<span class="text-muted-foreground text-xs">
						Deleted (in this demo only).
						<Button variant="link" size="xs" onclick={() => (deleted = false)}>Restore the demo</Button>
					</span>
				{/if}
			</div>
		</Demo>

		<Demo
			label="Informational"
			spec='size="sm" · media · one action'
			code={`<AlertDialog.Root>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>Deploy to São Paulo</Button>
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Content size="sm">
		<AlertDialog.Header>
			<AlertDialog.Media>
				<PauseIcon />
			</AlertDialog.Media>
			<AlertDialog.Title>Deploys to São Paulo are paused</AlertDialog.Title>
			<AlertDialog.Description>Maintenance runs until 03:00 UTC. Your build is queued and starts on its own.</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer class="grid-cols-1">
			<AlertDialog.Action>Keep it queued</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>`}
		>
			<AlertDialog.Root>
				<AlertDialog.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Deploy to São Paulo</Button>
					{/snippet}
				</AlertDialog.Trigger>
				<AlertDialog.Content size="sm">
					<AlertDialog.Header>
						<AlertDialog.Media>
							<PauseIcon />
						</AlertDialog.Media>
						<AlertDialog.Title>Deploys to São Paulo are paused</AlertDialog.Title>
						<AlertDialog.Description>Maintenance runs until 03:00 UTC. Your build is queued and starts on its own.</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer class="grid-cols-1">
						<AlertDialog.Action>Keep it queued</AlertDialog.Action>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</Demo>
	</Section>

	<Section
		title="Sheet"
		description="A panel that slides in from an edge for a task beside the page: editing a record, filtering a list. For a short, blocking question use a dialog."
	>
		<Demo
			label="Sides"
			spec="top · right · bottom · left"
			code={`<Sheet.Root>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>Open from the right</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Sheet from the right</Sheet.Title>
			<Sheet.Description>Slides in on the move curve and settles against the edge.</Sheet.Description>
		</Sheet.Header>
	</Sheet.Content>
</Sheet.Root>`}
		>
			{#each SIDES as side (side)}
				<Sheet.Root>
					<Sheet.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" {...props}>Open from the {side}</Button>
						{/snippet}
					</Sheet.Trigger>
					<Sheet.Content {side}>
						<Sheet.Header>
							<Sheet.Title>Sheet from the {side}</Sheet.Title>
							<Sheet.Description>Slides in on the move curve and settles against the edge.</Sheet.Description>
						</Sheet.Header>
					</Sheet.Content>
				</Sheet.Root>
			{/each}
		</Demo>

		<Demo
			label="A form"
			spec="Field · footer with save and cancel"
			code={`<Sheet.Root bind:open={editOpen}>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button {...props}>Edit project</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content>
		<form onsubmit={saveProject} class="flex h-full flex-col">
			<Sheet.Header>
				<Sheet.Title>Edit Observatory</Sheet.Title>
				<Sheet.Description>Changes apply to the next deployment.</Sheet.Description>
			</Sheet.Header>
			<Field.FieldGroup class="px-5">
				<Field.Field>
					<Field.FieldLabel for="project-name">Name</Field.FieldLabel>
					<Input id="project-name" bind:value={projectName} required />
				</Field.Field>
				<Field.Field>
					<Field.FieldLabel for="project-description">Description</Field.FieldLabel>
					<Textarea id="project-description" bind:value={projectDescription} />
					<Field.FieldDescription>Shown on the project card and in search results.</Field.FieldDescription>
				</Field.Field>
			</Field.FieldGroup>
			<Sheet.Footer>
				<Button type="submit">Save changes</Button>
				<Sheet.Close>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Cancel</Button>
					{/snippet}
				</Sheet.Close>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>`}
		>
			<Sheet.Root bind:open={editOpen}>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<Button {...props}>Edit project</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content>
					<form onsubmit={saveProject} class="flex h-full flex-col">
						<Sheet.Header>
							<Sheet.Title>Edit Observatory</Sheet.Title>
							<Sheet.Description>Changes apply to the next deployment.</Sheet.Description>
						</Sheet.Header>
						<Field.FieldGroup class="px-5">
							<Field.Field>
								<Field.FieldLabel for="project-name">Name</Field.FieldLabel>
								<Input id="project-name" bind:value={projectName} required />
							</Field.Field>
							<Field.Field>
								<Field.FieldLabel for="project-description">Description</Field.FieldLabel>
								<Textarea id="project-description" bind:value={projectDescription} />
								<Field.FieldDescription>Shown on the project card and in search results.</Field.FieldDescription>
							</Field.Field>
						</Field.FieldGroup>
						<Sheet.Footer>
							<Button type="submit">Save changes</Button>
							<Sheet.Close>
								{#snippet child({ props })}
									<Button variant="outline" {...props}>Cancel</Button>
								{/snippet}
							</Sheet.Close>
						</Sheet.Footer>
					</form>
				</Sheet.Content>
			</Sheet.Root>
		</Demo>

		<Demo
			label="A list with a footer"
			spec='side="left" · Sheet.Footer'
			code={`<Sheet.Root>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>
				<MapPinIcon data-icon="inline-start" />
				Choose regions
			</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content side="left">
		<Sheet.Header>
			<Sheet.Title>Regions</Sheet.Title>
			<Sheet.Description>Observatory is served from the regions switched on.</Sheet.Description>
		</Sheet.Header>
		<Field.FieldGroup class="px-5">
			{#each REGIONS as r (r.id)}
				<Field.Field orientation="horizontal">
					<Field.FieldLabel for="region-{r.id}">{r.name}</Field.FieldLabel>
					<Switch id="region-{r.id}" bind:checked={regionsOn[r.id]} />
				</Field.Field>
			{/each}
		</Field.FieldGroup>
		<Sheet.Footer>
			<Sheet.Close>
				{#snippet child({ props })}
					<Button {...props}>Apply to the next deploy</Button>
				{/snippet}
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>`}
		>
			<Sheet.Root>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>
							<MapPinIcon data-icon="inline-start" />
							Choose regions
						</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content side="left">
					<Sheet.Header>
						<Sheet.Title>Regions</Sheet.Title>
						<Sheet.Description>Observatory is served from the regions switched on.</Sheet.Description>
					</Sheet.Header>
					<Field.FieldGroup class="px-5">
						{#each REGIONS as r (r.id)}
							<Field.Field orientation="horizontal">
								<Field.FieldLabel for="region-{r.id}">
									{r.name}
									<span class="text-muted-foreground font-normal tabular-nums">{r.latency}</span>
								</Field.FieldLabel>
								<Switch id="region-{r.id}" bind:checked={regionsOn[r.id]} />
							</Field.Field>
						{/each}
					</Field.FieldGroup>
					<Sheet.Footer>
						<Sheet.Close>
							{#snippet child({ props })}
								<Button {...props}>Apply to the next deploy</Button>
							{/snippet}
						</Sheet.Close>
					</Sheet.Footer>
				</Sheet.Content>
			</Sheet.Root>
		</Demo>
	</Section>

	<Section
		title="Drawer"
		description="A sheet that can be dragged, made for touch. On a phone it replaces the dialog; on a desktop, prefer a dialog or a sheet."
	>
		<Demo
			label="Bottom, with a form"
			spec="handle · drag to dismiss"
			code={`<Drawer.Root bind:open={feedbackOpen}>
	<Drawer.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>Send feedback on Atlas</Button>
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content>
		<form onsubmit={sendFeedback} class="mx-auto flex w-full max-w-md flex-col">
			<Drawer.Header>
				<Drawer.Title>Feedback on Atlas</Drawer.Title>
				<Drawer.Description>The guide team reads every note within two days.</Drawer.Description>
			</Drawer.Header>
			<Field.FieldGroup class="px-5">
				<Field.Field>
					<Field.FieldLabel for="feedback-text">What should change?</Field.FieldLabel>
					<Textarea id="feedback-text" bind:value={feedbackText} placeholder="The map for the north lawn shows the old path." required />
				</Field.Field>
			</Field.FieldGroup>
			<Drawer.Footer>
				<Button type="submit">Send note</Button>
				<Drawer.Close>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Cancel</Button>
					{/snippet}
				</Drawer.Close>
			</Drawer.Footer>
		</form>
	</Drawer.Content>
</Drawer.Root>`}
		>
			<Drawer.Root bind:open={feedbackOpen}>
				<Drawer.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Send feedback on Atlas</Button>
					{/snippet}
				</Drawer.Trigger>
				<Drawer.Content>
					<form onsubmit={sendFeedback} class="mx-auto flex w-full max-w-md flex-col">
						<Drawer.Header>
							<Drawer.Title>Feedback on Atlas</Drawer.Title>
							<Drawer.Description>The guide team reads every note within two days.</Drawer.Description>
						</Drawer.Header>
						<Field.FieldGroup class="px-5">
							<Field.Field>
								<Field.FieldLabel for="feedback-text">What should change?</Field.FieldLabel>
								<Textarea id="feedback-text" bind:value={feedbackText} placeholder="The map for the north lawn shows the old path." required />
							</Field.Field>
						</Field.FieldGroup>
						<Drawer.Footer>
							<Button type="submit">Send note</Button>
							<Drawer.Close>
								{#snippet child({ props })}
									<Button variant="outline" {...props}>Cancel</Button>
								{/snippet}
							</Drawer.Close>
						</Drawer.Footer>
					</form>
				</Drawer.Content>
			</Drawer.Root>
		</Demo>

		<Demo
			label="Direction"
			spec='direction="right"'
			code={`<Drawer.Root direction="right">
	<Drawer.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>Show deployment details</Button>
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Deployment 8ed905f</Drawer.Title>
			<Drawer.Description>main · deployed 4 minutes ago by Ines Halloran</Drawer.Description>
		</Drawer.Header>
		<Drawer.Footer>
			<Drawer.Close>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Close details</Button>
				{/snippet}
			</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>`}
		>
			<Drawer.Root direction="right">
				<Drawer.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Show deployment details</Button>
					{/snippet}
				</Drawer.Trigger>
				<Drawer.Content>
					<Drawer.Header>
						<Drawer.Title>Deployment 8ed905f</Drawer.Title>
						<Drawer.Description>main · deployed 4 minutes ago by Ines Halloran</Drawer.Description>
					</Drawer.Header>
					<dl class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-3 px-5">
						<dt class="text-muted-foreground">Duration</dt>
						<dd class="tabular-nums">38.2s</dd>
						<dt class="text-muted-foreground">Assets</dt>
						<dd class="tabular-nums">1,284</dd>
						<dt class="text-muted-foreground">Regions</dt>
						<dd>Frankfurt, San Francisco, Singapore, São Paulo</dd>
					</dl>
					<Drawer.Footer>
						<Drawer.Close>
							{#snippet child({ props })}
								<Button variant="outline" {...props}>Close details</Button>
							{/snippet}
						</Drawer.Close>
					</Drawer.Footer>
				</Drawer.Content>
			</Drawer.Root>
		</Demo>

		<Demo
			label="Nested"
			spec="Drawer.NestedRoot · stacks over the first"
			code={`<Drawer.Root>
	<Drawer.Trigger>...</Drawer.Trigger>
	<Drawer.Content>
		...
		<Drawer.NestedRoot>
			<Drawer.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>See the 3 changed pages</Button>
				{/snippet}
			</Drawer.Trigger>
			<Drawer.Content>...</Drawer.Content>
		</Drawer.NestedRoot>
	</Drawer.Content>
</Drawer.Root>`}
		>
			<Drawer.Root>
				<Drawer.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Review the preview</Button>
					{/snippet}
				</Drawer.Trigger>
				<Drawer.Content>
					<div class="mx-auto flex w-full max-w-md flex-col">
						<Drawer.Header>
							<Drawer.Title>Preview of rotor/snap</Drawer.Title>
							<Drawer.Description>3 pages changed against main.</Drawer.Description>
						</Drawer.Header>
						<Drawer.Footer>
							<Drawer.NestedRoot>
								<Drawer.Trigger>
									{#snippet child({ props })}
										<Button variant="outline" {...props}>See the 3 changed pages</Button>
									{/snippet}
								</Drawer.Trigger>
								<Drawer.Content>
									<div class="mx-auto flex w-full max-w-md flex-col">
										<Drawer.Header>
											<Drawer.Title>Changed pages</Drawer.Title>
											<Drawer.Description>/atlas/north-lawn, /atlas/rotor, /pricing</Drawer.Description>
										</Drawer.Header>
										<Drawer.Footer>
											<Drawer.Close>
												{#snippet child({ props })}
													<Button {...props}>Back to the preview</Button>
												{/snippet}
											</Drawer.Close>
										</Drawer.Footer>
									</div>
								</Drawer.Content>
							</Drawer.NestedRoot>
							<Drawer.Close>
								{#snippet child({ props })}
									<Button variant="ghost" {...props}>Close</Button>
								{/snippet}
							</Drawer.Close>
						</Drawer.Footer>
					</div>
				</Drawer.Content>
			</Drawer.Root>
		</Demo>
	</Section>

	<Section
		title="Popover"
		description="A small layer anchored to its trigger, for a detail or a quick setting. It stays until dismissed; for a label on hover, use a tooltip."
	>
		<Demo
			label="Default"
			spec="header · title · description"
			code={`<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>Show cache details</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content>
		<Popover.Header>
			<Popover.Title>Build cache</Popover.Title>
			<Popover.Description>38.4 GB across four regions, last purged 6 days ago.</Popover.Description>
		</Popover.Header>
	</Popover.Content>
</Popover.Root>`}
		>
			<Popover.Root>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Show cache details</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content>
					<Popover.Header>
						<Popover.Title>Build cache</Popover.Title>
						<Popover.Description>38.4 GB across four regions, last purged 6 days ago.</Popover.Description>
					</Popover.Header>
				</Popover.Content>
			</Popover.Root>
		</Demo>

		<Demo
			label="A small form"
			spec="one field · saves and closes"
			code={`<Popover.Root bind:open={limitOpen}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>
				<SlidersHorizontalIcon data-icon="inline-start" />
				Set bandwidth limit
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content>
		<form onsubmit={saveLimit} class="flex flex-col gap-3">
			<Popover.Header>
				<Popover.Title>Monthly bandwidth limit</Popover.Title>
				<Popover.Description>Deploys pause when Observatory reaches it.</Popover.Description>
			</Popover.Header>
			<Field.FieldGroup>
				<Field.Field>
					<Field.FieldLabel for="bandwidth-limit">Limit in GB</Field.FieldLabel>
					<Input id="bandwidth-limit" type="number" min="1" bind:value={limit} />
				</Field.Field>
			</Field.FieldGroup>
			<Button type="submit" size="sm">Save limit</Button>
		</form>
	</Popover.Content>
</Popover.Root>`}
		>
			<Popover.Root bind:open={limitOpen}>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>
							<SlidersHorizontalIcon data-icon="inline-start" />
							Set bandwidth limit
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content>
					<form onsubmit={saveLimit} class="flex flex-col gap-3">
						<Popover.Header>
							<Popover.Title>Monthly bandwidth limit</Popover.Title>
							<Popover.Description>Deploys pause when Observatory reaches it.</Popover.Description>
						</Popover.Header>
						<Field.FieldGroup>
							<Field.Field>
								<Field.FieldLabel for="bandwidth-limit">Limit in GB</Field.FieldLabel>
								<Input id="bandwidth-limit" type="number" min="1" bind:value={limit} />
							</Field.Field>
						</Field.FieldGroup>
						<Button type="submit" size="sm">Save limit</Button>
					</form>
				</Popover.Content>
			</Popover.Root>
		</Demo>

		<Demo
			label="Alignment"
			spec="start · center · end"
			code={`<Popover.Content align="start">...</Popover.Content>`}
		>
			{#each ALIGNS as align (align)}
				<Popover.Root>
					<Popover.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" size="sm" {...props}>Align {align}</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content {align} class="w-56">
						<Popover.Header>
							<Popover.Title>align="{align}"</Popover.Title>
							<Popover.Description>The layer lines up with the {align} of its trigger.</Popover.Description>
						</Popover.Header>
					</Popover.Content>
				</Popover.Root>
			{/each}
		</Demo>
	</Section>

	<Section
		title="Hover card"
		description="A preview of what a link points to, shown on hover or focus. Keep anything the reader must act on out of it; touch screens never see it."
	>
		<Demo
			label="A person"
			spec="avatar · name · role · joined"
			code={`<HoverCard.Root>
	<HoverCard.Trigger href="#hover-card">Ines Halloran</HoverCard.Trigger>
	<HoverCard.Content>
		<div class="flex gap-3">
			<Avatar.Root size="lg">
				<Avatar.Fallback>IH</Avatar.Fallback>
			</Avatar.Root>
			<div class="flex min-w-0 flex-col gap-1">
				<span class="text-foreground font-medium">Ines Halloran</span>
				<span class="text-muted-foreground">Owner of Observatory</span>
				<span class="text-muted-foreground flex items-center gap-1.5 text-xs">
					<CalendarIcon class="size-3.5" />
					Joined March 2023
				</span>
			</div>
		</div>
	</HoverCard.Content>
</HoverCard.Root>`}
		>
			<HoverCard.Root>
				<HoverCard.Trigger href="#hover-card" class="text-sm font-medium underline underline-offset-4">Ines Halloran</HoverCard.Trigger>
				<HoverCard.Content>
					{@render person('Ines Halloran', 'IH', 'Owner of Observatory', 'Joined March 2023')}
				</HoverCard.Content>
			</HoverCard.Root>
		</Demo>

		<Demo
			label="In running text"
			spec="inline trigger · side top"
			code={`<p class="text-muted-foreground max-w-sm text-sm">
	rotor/snap was last deployed by
	<HoverCard.Root>
		<HoverCard.Trigger href="#hover-card">Tomás Okafor</HoverCard.Trigger>
		<HoverCard.Content side="top">...</HoverCard.Content>
	</HoverCard.Root>
	4 minutes ago.
</p>`}
		>
			<p class="text-muted-foreground max-w-sm text-sm">
				rotor/snap was last deployed by
				<HoverCard.Root>
					<HoverCard.Trigger href="#hover-card" class="text-foreground font-medium underline underline-offset-4">Tomás Okafor</HoverCard.Trigger>
					<HoverCard.Content side="top">
						{@render person('Tomás Okafor', 'TO', 'Developer on Atlas', 'Joined August 2024')}
					</HoverCard.Content>
				</HoverCard.Root>
				4 minutes ago.
			</p>
		</Demo>

		<Demo
			label="A team"
			spec="badge · counts"
			code={`<HoverCard.Root>
	<HoverCard.Trigger href="#hover-card">@atlas-guides</HoverCard.Trigger>
	<HoverCard.Content class="flex flex-col gap-2">...</HoverCard.Content>
</HoverCard.Root>`}
		>
			<HoverCard.Root>
				<HoverCard.Trigger href="#hover-card" class="font-mono text-sm underline underline-offset-4">@atlas-guides</HoverCard.Trigger>
				<HoverCard.Content class="flex flex-col gap-2">
					<div class="flex items-center justify-between gap-2">
						<span class="text-foreground font-medium">Atlas guides</span>
						<Badge variant="outline">Team</Badge>
					</div>
					<p class="text-muted-foreground">Writes and maintains the sculpture-park guide.</p>
					<span class="text-muted-foreground text-xs tabular-nums">6 members · 48 deployments this week</span>
				</HoverCard.Content>
			</HoverCard.Root>
		</Demo>
	</Section>

	<Section
		title="Tooltip"
		description="A short label for a control that has no visible text, shown on hover and focus. Never put anything interactive or essential in it."
	>
		<Tooltip.Provider>
			<Demo
				label="On an icon button"
				spec="names the action"
				code={`<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<Button variant="ghost" size="icon-round" aria-label="Copy commit hash" {...props}>
				<CopyIcon />
			</Button>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content>Copy commit hash</Tooltip.Content>
</Tooltip.Root>`}
			>
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button variant="ghost" size="icon-round" aria-label="Copy commit hash" {...props}>
								<CopyIcon />
							</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>Copy commit hash</Tooltip.Content>
				</Tooltip.Root>
			</Demo>

			<Demo
				label="On text"
				spec="explains a term"
				code={`<p class="text-sm">
	Median
	<Tooltip.Root>
		<Tooltip.Trigger class="underline decoration-dotted underline-offset-4">TTFB</Tooltip.Trigger>
		<Tooltip.Content>Time to first byte, measured at the edge</Tooltip.Content>
	</Tooltip.Root>
	in Frankfurt is 18 ms.
</p>`}
			>
				<p class="text-sm">
					Median
					<Tooltip.Root>
						<Tooltip.Trigger class="underline decoration-dotted underline-offset-4">TTFB</Tooltip.Trigger>
						<Tooltip.Content>Time to first byte, measured at the edge</Tooltip.Content>
					</Tooltip.Root>
					in Frankfurt is 18 ms.
				</p>
			</Demo>

			<Demo
				label="Sides"
				spec="top · right · bottom · left"
				code={`<Tooltip.Content side="right">Opens to the right</Tooltip.Content>`}
			>
				{#each SIDES_TIP as side (side)}
					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet child({ props })}
								<Button variant="outline" size="sm" {...props}>{side}</Button>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content {side}>Opens to the {side}</Tooltip.Content>
					</Tooltip.Root>
				{/each}
			</Demo>

			<Demo
				label="With a shortcut"
				spec="Kbd inside the tooltip"
				code={`<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>
				<SearchIcon data-icon="inline-start" />
				Search deployments
			</Button>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content>
		Search deployments
		<Kbd.Group>
			<Kbd.Root>Ctrl</Kbd.Root>
			<Kbd.Root>K</Kbd.Root>
		</Kbd.Group>
	</Tooltip.Content>
</Tooltip.Root>`}
			>
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" {...props}>
								<SearchIcon data-icon="inline-start" />
								Search deployments
							</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>
						Search deployments
						<Kbd.Group>
							<Kbd.Root>Ctrl</Kbd.Root>
							<Kbd.Root>K</Kbd.Root>
						</Kbd.Group>
					</Tooltip.Content>
				</Tooltip.Root>
			</Demo>
		</Tooltip.Provider>

		<Demo
			label="A delayed group"
			spec="Tooltip.Provider · 500 ms delay, then instant between neighbours"
			code={`<Tooltip.Provider delayDuration={500} skipDelayDuration={300}>
	{#each TOOLBAR as tool (tool.label)}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button variant="ghost" size="icon-sm" aria-label={tool.label} {...props}>
						<tool.Icon />
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>{tool.label}</Tooltip.Content>
		</Tooltip.Root>
	{/each}
</Tooltip.Provider>`}
		>
			<div class="border-border flex gap-1 rounded-md border p-1" role="toolbar" aria-label="Formatting">
				<Tooltip.Provider delayDuration={500} skipDelayDuration={300}>
					{#each TOOLBAR as tool (tool.label)}
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<Button variant="ghost" size="icon-sm" aria-label={tool.label} {...props}>
										<tool.Icon />
									</Button>
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content>{tool.label}</Tooltip.Content>
						</Tooltip.Root>
					{/each}
				</Tooltip.Provider>
			</div>
		</Demo>
	</Section>
</Page>
