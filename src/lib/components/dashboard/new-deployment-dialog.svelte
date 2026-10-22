<script lang="ts">
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { toast } from 'svelte-sonner';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import * as RadioGroup from '#lib/components/ui/radio-group/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { BRANCHES, type Environment } from './data.js';
	import type { Deployments } from './deployments.svelte.js';

	/** "New deployment": pick a branch and an environment, optionally clear the cache, queue it. */
	let { deployments }: { deployments: Deployments } = $props();

	let open = $state(false);
	let branch = $state('main');
	let env = $state<Environment>('production');
	let clearCache = $state(false);

	const environments: { value: Environment; label: string; description: string }[] = [
		{ value: 'production', label: 'Production', description: 'Serves observatory.example once the build passes.' },
		{ value: 'preview', label: 'Preview', description: 'Gets its own address under preview.observatory.example.' }
	];

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const queued = deployments.queue(branch, env);
		const where = env === 'production' ? 'production' : 'preview';
		toast.success(`Queued ${branch} for ${where}`, {
			description: clearCache
				? `Commit ${queued.sha}, building from a clean cache in Frankfurt.`
				: `Commit ${queued.sha}, building with the warm cache in Frankfurt.`
		});
		open = false;
		clearCache = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props}>
				<PlusIcon data-icon="inline-start" />
				New deployment
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<form onsubmit={submit} class="flex flex-col gap-6">
			<Dialog.Header>
				<Dialog.Title>New deployment</Dialog.Title>
				<Dialog.Description>Build a branch of Observatory and publish it.</Dialog.Description>
			</Dialog.Header>

			<Field.FieldGroup>
				<Field.Field>
					<Field.FieldLabel for="deploy-branch">Branch</Field.FieldLabel>
					<Select.Root type="single" bind:value={branch}>
						<Select.Trigger id="deploy-branch" class="w-full font-mono text-[13px]">{branch}</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Branches</Select.Label>
								{#each BRANCHES as b (b)}
									<Select.Item value={b} label={b} class="font-mono text-[13px]">{b}</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</Field.Field>

				<Field.FieldSet>
					<Field.FieldLegend variant="label">Environment</Field.FieldLegend>
					<RadioGroup.Root bind:value={env} aria-label="Environment">
						{#each environments as e (e.value)}
							<Field.Field orientation="horizontal">
								<RadioGroup.Item value={e.value} id="deploy-env-{e.value}" />
								<Field.FieldContent>
									<Field.FieldLabel for="deploy-env-{e.value}" class="font-normal">{e.label}</Field.FieldLabel>
									<Field.FieldDescription>{e.description}</Field.FieldDescription>
								</Field.FieldContent>
							</Field.Field>
						{/each}
					</RadioGroup.Root>
				</Field.FieldSet>

				<Field.FieldSeparator />

				<Field.Field orientation="horizontal">
					<Field.FieldContent>
						<Field.FieldLabel for="deploy-clear-cache">Clear build cache</Field.FieldLabel>
						<Field.FieldDescription>
							Reinstall dependencies and re-encode every image. Adds about a minute.
						</Field.FieldDescription>
					</Field.FieldContent>
					<Switch id="deploy-clear-cache" bind:checked={clearCache} />
				</Field.Field>
			</Field.FieldGroup>

			<Dialog.Footer>
				<Dialog.Close>
					{#snippet child({ props })}
						<Button {...props} variant="outline">Cancel</Button>
					{/snippet}
				</Dialog.Close>
				<Button type="submit">Deploy to {env === 'production' ? 'production' : 'preview'}</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
