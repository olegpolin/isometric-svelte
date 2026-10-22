<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import { Progress } from '#lib/components/ui/progress/index.js';

	/**
	 * The components doing ordinary work: a settings card and a build table, side by side on paper,
	 * with the space around them left alone.
	 */
	let name = $state('Observatory');
	let region = $state('fra');
	let previews = $state(true);
	let tab = $state('builds');

	const regions = [
		{ value: 'fra', label: 'Frankfurt' },
		{ value: 'sfo', label: 'San Francisco' },
		{ value: 'sin', label: 'Singapore' },
		{ value: 'gru', label: 'São Paulo' }
	];

	const builds = [
		{ sha: 'c41e9a2', branch: 'main', duration: '1m 48s', status: 'Ready', progress: 100 },
		{ sha: '9b0f7d1', branch: 'stairs/landing', duration: '2m 03s', status: 'Ready', progress: 100 },
		{ sha: 'e27c0b8', branch: 'rotor/snap', duration: '0m 41s', status: 'Building', progress: 38 },
		{ sha: '51aa3f0', branch: 'main', duration: '1m 52s', status: 'Failed', progress: 100 }
	];

	let regionLabel = $derived(regions.find((r) => r.value === region)?.label ?? 'Choose a region');
</script>

<section aria-labelledby="in-use-title" class="bg-muted/50 border-border border-y">
	<div class="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
		<div class="flex max-w-md flex-col gap-4">
			<span class="type-numeral text-muted-foreground text-lg">IV</span>
			<h2 id="in-use-title" class="type-title text-2xl sm:text-3xl">In use</h2>
			<p class="text-muted-foreground text-base">
				Ordinary work: a settings card and a table of builds. Hairlines instead of shadows, the key
				colour only where something can be done.
			</p>
		</div>

		<div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
			<Card.Root>
				<Card.Header>
					<Card.Title>Project settings</Card.Title>
					<Card.Description>Where the site is built and served from.</Card.Description>
				</Card.Header>
				<Card.Content>
					<Field.FieldGroup>
						<Field.Field>
							<Field.FieldLabel for="project-name">Project name</Field.FieldLabel>
							<Input id="project-name" bind:value={name} />
							<Field.FieldDescription>Shown in the dashboard and in deploy mail.</Field.FieldDescription>
						</Field.Field>
						<Field.Field>
							<Field.FieldLabel for="project-region">Region</Field.FieldLabel>
							<Select.Root type="single" bind:value={region}>
								<Select.Trigger id="project-region" class="w-full">{regionLabel}</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each regions as r (r.value)}
											<Select.Item value={r.value} label={r.label}>{r.label}</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</Field.Field>
						<Field.Field orientation="horizontal">
							<Field.FieldContent>
								<Field.FieldLabel for="project-previews">Preview deployments</Field.FieldLabel>
								<Field.FieldDescription>Build every branch, not only main.</Field.FieldDescription>
							</Field.FieldContent>
							<Switch id="project-previews" bind:checked={previews} />
						</Field.Field>
					</Field.FieldGroup>
				</Card.Content>
				<Card.Footer class="justify-end gap-2">
					<Button variant="ghost" onclick={() => (name = 'Observatory')}>Reset</Button>
					<Button onclick={() => toast.success(`Saved ${name}`, { description: `${regionLabel}, previews ${previews ? 'on' : 'off'}.` })}>
						Save changes
					</Button>
				</Card.Footer>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Builds</Card.Title>
					<Card.Description>The last four builds of {name}.</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					<Tabs.Root bind:value={tab}>
						<Tabs.List>
							<Tabs.Trigger value="builds">Builds</Tabs.Trigger>
							<Tabs.Trigger value="domains">Domains</Tabs.Trigger>
							<Tabs.Trigger value="logs">Logs</Tabs.Trigger>
						</Tabs.List>
					</Tabs.Root>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Commit</Table.Head>
								<Table.Head>Branch</Table.Head>
								<Table.Head>Duration</Table.Head>
								<Table.Head>Status</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each builds as b (b.sha)}
								<Table.Row>
									<Table.Cell class="font-mono text-xs">{b.sha}</Table.Cell>
									<Table.Cell>{b.branch}</Table.Cell>
									<Table.Cell class="tabular-nums">{b.duration}</Table.Cell>
									<Table.Cell>
										{#if b.status === 'Building'}
											<span class="flex items-center gap-3">
												<Progress value={b.progress} class="w-20" />
												<span class="text-muted-foreground text-xs tabular-nums">{b.progress}%</span>
											</span>
										{:else}
											<Badge variant={b.status === 'Failed' ? 'destructive' : 'success'}>{b.status}</Badge>
										{/if}
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</section>
