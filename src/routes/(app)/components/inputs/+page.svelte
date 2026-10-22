<script lang="ts">
	import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from 'bits-ui';
	import SearchIcon from '@lucide/svelte/icons/search';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';
	import AtSignIcon from '@lucide/svelte/icons/at-sign';
	import GitBranchIcon from '@lucide/svelte/icons/git-branch';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import { Page, Section, Demo } from '#lib/components/showcase/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import * as InputGroup from '#lib/components/ui/input-group/index.js';
	import * as InputOTP from '#lib/components/ui/input-otp/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import * as NativeSelect from '#lib/components/ui/native-select/index.js';
	import * as RadioGroup from '#lib/components/ui/radio-group/index.js';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Checkbox } from '#lib/components/ui/checkbox/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Kbd } from '#lib/components/ui/kbd/index.js';
	import { Spinner } from '#lib/components/ui/spinner/index.js';
	import { chapterBySlug } from '#lib/catalog.js';

	const chapter = chapterBySlug('inputs')!;

	const REGIONS = [
		{ value: 'fra', label: 'Frankfurt', latency: '18 ms' },
		{ value: 'sfo', label: 'San Francisco', latency: '142 ms' },
		{ value: 'sin', label: 'Singapore', latency: '161 ms' },
		{ value: 'gru', label: 'São Paulo', latency: '204 ms' }
	];

	// Input group
	const INSTALL = 'npm i -g @observatory/cli';
	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;
	function copyInstall() {
		navigator.clipboard?.writeText(INSTALL).catch(() => {});
		copied = true;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = false), 1600);
	}
	let deployNote = $state('');

	// One-time code
	let otp = $state('');
	let recovery = $state('');
	let verifyCode = $state('');

	// Textarea
	let releaseNotes = $state('Moves the landing stairs to the new grid and trims 38.4 KB from the hero bundle.');

	// Native select
	let nativeRegion = $state('fra');

	// Field: a form that validates on submit
	type ProjectForm = { name: string; repository: string; region: string; email: string };
	const emptyProject: ProjectForm = { name: '', repository: '', region: '', email: '' };
	let project = $state<ProjectForm>({ ...emptyProject });
	let attempted = $state(false);
	let created = $state<{ name: string; region: string } | null>(null);

	function validate(f: ProjectForm) {
		const e: Partial<Record<keyof ProjectForm, string>> = {};
		if (!f.name.trim()) e.name = 'Enter a project name.';
		else if (!/^[a-z0-9-]{3,32}$/.test(f.name)) e.name = 'Use 3 to 32 lowercase letters, numbers or hyphens.';
		if (!f.repository.trim()) e.repository = 'Enter the repository to deploy from.';
		else if (!/^https:\/\/\S+\/\S+/.test(f.repository)) e.repository = 'Start the address with https:// and include the owner and repository.';
		if (!f.region) e.region = 'Choose a region for the first deploy.';
		if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter an address like ines@observatory.dev.';
		return e;
	}

	let errors = $derived(attempted ? validate(project) : {});
	const asErrors = (message?: string) => (message ? [{ message }] : []);

	function createProject(event: SubmitEvent) {
		event.preventDefault();
		attempted = true;
		created = null;
		if (Object.keys(validate(project)).length > 0) return;
		created = {
			name: project.name,
			region: REGIONS.find((r) => r.value === project.region)?.label ?? project.region
		};
		project = { ...emptyProject };
		attempted = false;
	}

	function resetProject() {
		project = { ...emptyProject };
		attempted = false;
		created = null;
	}

	// Field: horizontal and choice cards
	let notifyFailures = $state(true);
	let notifyPreviews = $state(false);
	let edgeRegion = $state('fra');
</script>

<svelte:head>
	<title>{chapter.title} · Isometric</title>
	<meta
		name="description"
		content="Input, input group, one-time code, textarea, label, field and native select: the controls that take typed text and the patterns that lay them out as forms."
	/>
</svelte:head>

<Page
	title={chapter.title}
	description={chapter.subtitle}
	chapter={{ numeral: chapter.numeral, connective: chapter.connective }}
>
	<!-- Input -->
	<Section
		title="Input"
		description="A single line of typed text. For more than a sentence use Textarea; for a fixed set of values use Select or Radio group."
	>
		<Demo
			label="Default"
			spec="text · placeholder"
			code='<Input class="max-w-xs" placeholder="observatory" aria-label="Project name" />'
		>
			<Input class="max-w-xs" placeholder="observatory" aria-label="Project name" />
		</Demo>

		<Demo
			label="Types"
			spec="email · password · number · search"
			align="start"
			code='<Input type="email" class="w-56" placeholder="ines@observatory.dev" aria-label="Email" />'
		>
			<Input type="email" class="w-56" placeholder="ines@observatory.dev" aria-label="Email" />
			<Input type="password" class="w-56" value="correct-horse" aria-label="Deploy token" />
			<Input type="number" class="w-32" value="3" min="1" max="12" aria-label="Instances" />
			<Input type="search" class="w-56" placeholder="Search deployments" aria-label="Search deployments" />
		</Demo>

		<Demo
			label="File"
			spec="type=file"
			code='<Input type="file" class="max-w-xs" aria-label="Upload a build artifact" />'
		>
			<Input type="file" class="max-w-xs" aria-label="Upload a build artifact" />
		</Demo>

		<Demo
			label="States"
			spec="disabled · read-only · invalid"
			align="start"
			code='<Input class="w-56" value="observatory" disabled aria-label="Project name" />'
		>
			<Input class="w-56" value="observatory" disabled aria-label="Project name" />
			<Input class="w-56" value="prj_7f3a91c2" readonly aria-label="Project ID" />
			<Input class="w-56" value="Observatory!" aria-invalid="true" aria-label="Project slug" />
		</Demo>

		<Demo
			label="With a label and description"
			spec="Field · FieldLabel · FieldDescription"
			align="start"
			code={`<Field.Field class="max-w-sm">
	<Field.Label for="in-domain">Custom domain</Field.Label>
	<Input id="in-domain" placeholder="atlas.example.org" />
	<Field.Description>Point a CNAME record at observatory.app before you save.</Field.Description>
</Field.Field>`}
		>
			<Field.Field class="max-w-sm">
				<Field.Label for="in-domain">Custom domain</Field.Label>
				<Input id="in-domain" placeholder="atlas.example.org" />
				<Field.Description>Point a CNAME record at observatory.app before you save.</Field.Description>
			</Field.Field>
		</Demo>

		<Demo
			label="With a button"
			spec="Input · Button"
			code={`<div class="flex w-full max-w-sm gap-2">
	<Input type="email" placeholder="ana.ribeiro@observatory.dev" aria-label="Email to invite" />
	<Button>Invite to team</Button>
</div>`}
		>
			<div class="flex w-full max-w-sm gap-2">
				<Input type="email" placeholder="ana.ribeiro@observatory.dev" aria-label="Email to invite" />
				<Button>Invite to team</Button>
			</div>
		</Demo>
	</Section>

	<!-- Input group -->
	<Section
		title="Input group"
		description="An input with icons, text, buttons or a hint attached inside its border. Use it when the extra part belongs to the value; put separate actions beside the field instead."
	>
		<Demo
			label="With an icon"
			spec="addon · inline-start"
			code={`<InputGroup.Root class="max-w-xs">
	<InputGroup.Input placeholder="Search deployments" aria-label="Search deployments" />
	<InputGroup.Addon>
		<SearchIcon />
	</InputGroup.Addon>
</InputGroup.Root>`}
		>
			<InputGroup.Root class="max-w-xs">
				<InputGroup.Input placeholder="Search deployments" aria-label="Search deployments" />
				<InputGroup.Addon>
					<SearchIcon />
				</InputGroup.Addon>
			</InputGroup.Root>
		</Demo>

		<Demo
			label="Prefix and suffix"
			spec="InputGroupText · inline-start · inline-end"
			code={`<InputGroup.Root class="max-w-sm">
	<InputGroup.Input placeholder="atlas" aria-label="Subdomain" />
	<InputGroup.Addon>
		<InputGroup.Text>https://</InputGroup.Text>
	</InputGroup.Addon>
	<InputGroup.Addon align="inline-end">
		<InputGroup.Text>.observatory.app</InputGroup.Text>
	</InputGroup.Addon>
</InputGroup.Root>`}
		>
			<InputGroup.Root class="max-w-sm">
				<InputGroup.Input placeholder="atlas" aria-label="Subdomain" />
				<InputGroup.Addon>
					<InputGroup.Text>https://</InputGroup.Text>
				</InputGroup.Addon>
				<InputGroup.Addon align="inline-end">
					<InputGroup.Text>.observatory.app</InputGroup.Text>
				</InputGroup.Addon>
			</InputGroup.Root>
		</Demo>

		<Demo
			label="With a button"
			spec="InputGroupButton · icon-xs"
			code={`<InputGroup.Root class="max-w-sm">
	<InputGroup.Input value="npm i -g @observatory/cli" readonly aria-label="Install command" />
	<InputGroup.Addon align="inline-end">
		<InputGroup.Button size="icon-xs" aria-label="Copy install command" onclick={copyInstall}>
			{#if copied}<CheckIcon />{:else}<CopyIcon />{/if}
		</InputGroup.Button>
	</InputGroup.Addon>
</InputGroup.Root>`}
		>
			<InputGroup.Root class="max-w-sm">
				<InputGroup.Input value={INSTALL} readonly aria-label="Install command" />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button size="icon-xs" aria-label="Copy install command" onclick={copyInstall}>
						{#if copied}<CheckIcon />{:else}<CopyIcon />{/if}
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</Demo>

		<Demo
			label="With a keyboard hint"
			spec="Kbd · inline-end"
			code={`<InputGroup.Root class="max-w-xs">
	<InputGroup.Input placeholder="Jump to a branch" aria-label="Jump to a branch" />
	<InputGroup.Addon>
		<GitBranchIcon />
	</InputGroup.Addon>
	<InputGroup.Addon align="inline-end">
		<Kbd>/</Kbd>
	</InputGroup.Addon>
</InputGroup.Root>`}
		>
			<InputGroup.Root class="max-w-xs">
				<InputGroup.Input placeholder="Jump to a branch" aria-label="Jump to a branch" />
				<InputGroup.Addon>
					<GitBranchIcon />
				</InputGroup.Addon>
				<InputGroup.Addon align="inline-end">
					<Kbd>/</Kbd>
				</InputGroup.Addon>
			</InputGroup.Root>
		</Demo>

		<Demo
			label="States"
			spec="checking · invalid · disabled"
			align="start"
			code={`<InputGroup.Root class="w-56">
	<InputGroup.Input value="stairs-landing" aria-label="Preview name" />
	<InputGroup.Addon align="inline-end">
		<Spinner />
	</InputGroup.Addon>
</InputGroup.Root>`}
		>
			<InputGroup.Root class="w-56">
				<InputGroup.Input value="stairs-landing" aria-label="Preview name" />
				<InputGroup.Addon align="inline-end">
					<Spinner />
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root class="w-56">
				<InputGroup.Input value="ines@observatory" aria-invalid="true" aria-label="Alert email" />
				<InputGroup.Addon>
					<AtSignIcon />
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root class="w-56">
				<InputGroup.Input value="main" disabled aria-label="Production branch" />
				<InputGroup.Addon>
					<GitBranchIcon />
				</InputGroup.Addon>
			</InputGroup.Root>
		</Demo>

		<Demo
			label="Textarea with a toolbar"
			spec="InputGroupTextarea · block-end"
			code={`<InputGroup.Root class="max-w-md">
	<InputGroup.Textarea bind:value={deployNote} maxlength={280} placeholder="Leave a note on this deploy" aria-label="Deploy note" />
	<InputGroup.Addon align="block-end">
		<InputGroup.Text>{deployNote.length} / 280</InputGroup.Text>
		<InputGroup.Button variant="default" size="sm" class="ml-auto">Post note</InputGroup.Button>
	</InputGroup.Addon>
</InputGroup.Root>`}
		>
			<InputGroup.Root class="max-w-md">
				<InputGroup.Textarea bind:value={deployNote} maxlength={280} placeholder="Leave a note on this deploy" aria-label="Deploy note" />
				<InputGroup.Addon align="block-end">
					<InputGroup.Text>{deployNote.length} / 280</InputGroup.Text>
					<InputGroup.Button variant="default" size="sm" class="ml-auto">Post note</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</Demo>
	</Section>

	<!-- One-time code -->
	<Section
		title="One-time code"
		description="A short code typed one character per cell, with paste and password-manager support. Use it for verification codes, not for passwords."
	>
		<Demo
			label="Six digits"
			spec="maxlength 6 · digits only"
			code={`<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS} bind:value={otp} aria-label="Verification code">
	{#snippet children({ cells })}
		<InputOTP.Group>
			{#each cells as cell (cell)}
				<InputOTP.Slot {cell} />
			{/each}
		</InputOTP.Group>
	{/snippet}
</InputOTP.Root>`}
		>
			<div class="flex flex-col items-center gap-3">
				<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS} bind:value={otp} aria-label="Verification code">
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
				<p class="text-muted-foreground text-xs">{otp.length} of 6 entered</p>
			</div>
		</Demo>

		<Demo
			label="With a separator"
			spec="two groups · letters and digits"
			code={`<InputOTP.Root maxlength={8} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} bind:value={recovery} aria-label="Recovery code">
	{#snippet children({ cells })}
		<InputOTP.Group>
			{#each cells.slice(0, 4) as cell (cell)}
				<InputOTP.Slot {cell} />
			{/each}
		</InputOTP.Group>
		<InputOTP.Separator />
		<InputOTP.Group>
			{#each cells.slice(4) as cell (cell)}
				<InputOTP.Slot {cell} />
			{/each}
		</InputOTP.Group>
	{/snippet}
</InputOTP.Root>`}
		>
			<InputOTP.Root maxlength={8} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} bind:value={recovery} aria-label="Recovery code">
				{#snippet children({ cells })}
					<InputOTP.Group>
						{#each cells.slice(0, 4) as cell (cell)}
							<InputOTP.Slot {cell} />
						{/each}
					</InputOTP.Group>
					<InputOTP.Separator />
					<InputOTP.Group>
						{#each cells.slice(4) as cell (cell)}
							<InputOTP.Slot {cell} />
						{/each}
					</InputOTP.Group>
				{/snippet}
			</InputOTP.Root>
		</Demo>

		<Demo
			label="States"
			spec="invalid · disabled"
			class="flex-col"
			code={`<InputOTP.Root maxlength={6} value="204816" aria-label="Expired code">
	{#snippet children({ cells })}
		<InputOTP.Group>
			{#each cells as cell (cell)}
				<InputOTP.Slot {cell} aria-invalid="true" />
			{/each}
		</InputOTP.Group>
	{/snippet}
</InputOTP.Root>`}
		>
			<InputOTP.Root maxlength={6} value="204816" aria-label="Expired code">
				{#snippet children({ cells })}
					<InputOTP.Group>
						{#each cells as cell (cell)}
							<InputOTP.Slot {cell} aria-invalid="true" />
						{/each}
					</InputOTP.Group>
				{/snippet}
			</InputOTP.Root>
			<InputOTP.Root maxlength={6} disabled aria-label="Verification code, unavailable">
				{#snippet children({ cells })}
					<InputOTP.Group>
						{#each cells as cell (cell)}
							<InputOTP.Slot {cell} />
						{/each}
					</InputOTP.Group>
				{/snippet}
			</InputOTP.Root>
		</Demo>

		<Demo
			label="In a field"
			spec="Field · inputId · button enabled when complete"
			align="start"
			code={`<Field.Group class="w-fit">
	<Field.Field>
		<Field.Label for="in-otp-verify">Verification code</Field.Label>
		<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS} inputId="in-otp-verify" bind:value={verifyCode}>
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
		<Field.Description>Sent to the phone ending in 0417. It expires in 10 minutes.</Field.Description>
	</Field.Field>
	<Button class="w-fit" disabled={verifyCode.length < 6}>Verify and sign in</Button>
</Field.Group>`}
		>
			<Field.Group class="w-fit">
				<Field.Field>
					<Field.Label for="in-otp-verify">Verification code</Field.Label>
					<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS} inputId="in-otp-verify" bind:value={verifyCode}>
						{#snippet children({ cells })}
							<InputOTP.Group>
								{#each cells as cell (cell)}
									<InputOTP.Slot {cell} />
								{/each}
							</InputOTP.Group>
						{/snippet}
					</InputOTP.Root>
					<Field.Description>Sent to the phone ending in 0417. It expires in 10 minutes.</Field.Description>
				</Field.Field>
				<Button class="w-fit" disabled={verifyCode.length < 6}>Verify and sign in</Button>
			</Field.Group>
		</Demo>
	</Section>

	<!-- Textarea -->
	<Section
		title="Textarea"
		description="Several lines of typed text that grow with their content. For a single value use Input."
	>
		<Demo
			label="Default"
			spec="grows with its content"
			code='<Textarea class="max-w-md" placeholder="What changed in this deploy?" aria-label="Deploy summary" />'
		>
			<Textarea class="max-w-md" placeholder="What changed in this deploy?" aria-label="Deploy summary" />
		</Demo>

		<Demo
			label="With a live count"
			spec="bind:value · maxlength 280"
			align="start"
			code={`<Field.Field class="max-w-md">
	<Field.Label for="in-release-notes">Release notes</Field.Label>
	<Textarea id="in-release-notes" bind:value={releaseNotes} maxlength={280} />
	<Field.Description>{280 - releaseNotes.length} characters left. Shown on the deploy page for stairs/landing.</Field.Description>
</Field.Field>`}
		>
			<Field.Field class="max-w-md">
				<Field.Label for="in-release-notes">Release notes</Field.Label>
				<Textarea id="in-release-notes" bind:value={releaseNotes} maxlength={280} />
				<Field.Description>{280 - releaseNotes.length} characters left. Shown on the deploy page for stairs/landing.</Field.Description>
			</Field.Field>
		</Demo>

		<Demo
			label="States"
			spec="disabled · invalid"
			align="start"
			code='<Textarea class="w-64" value="Locked while the deploy is running." disabled aria-label="Deploy note" />'
		>
			<Textarea class="w-64" value="Locked while the deploy is running." disabled aria-label="Deploy note" />
			<Field.Field class="w-64" data-invalid="true">
				<Field.Label for="in-headers">Response headers</Field.Label>
				<Textarea id="in-headers" value="cache-control max-age=3600" aria-invalid="true" />
				<Field.Error>Separate each header name from its value with a colon.</Field.Error>
			</Field.Field>
		</Demo>
	</Section>

	<!-- Label -->
	<Section
		title="Label"
		description="The visible name of a control, tied to it with for and id. Inside forms, Field label wraps it with the field's spacing and states."
	>
		<Demo
			label="With an input"
			spec="for · id"
			align="start"
			code={`<div class="flex w-full max-w-xs flex-col gap-2">
	<Label for="in-label-team">Team name</Label>
	<Input id="in-label-team" placeholder="Atlas guides" />
</div>`}
		>
			<div class="flex w-full max-w-xs flex-col gap-2">
				<Label for="in-label-team">Team name</Label>
				<Input id="in-label-team" placeholder="Atlas guides" />
			</div>
		</Demo>

		<Demo
			label="With a checkbox"
			spec="checked · disabled peer"
			align="start"
			class="flex-col"
			code={`<div class="flex items-center gap-2">
	<Checkbox id="in-label-notify" checked />
	<Label for="in-label-notify">Email me when a build fails</Label>
</div>`}
		>
			<div class="flex items-center gap-2">
				<Checkbox id="in-label-notify" checked />
				<Label for="in-label-notify">Email me when a build fails</Label>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox id="in-label-sso" disabled />
				<Label for="in-label-sso">Require single sign-on (on the team plan)</Label>
			</div>
		</Demo>
	</Section>

	<!-- Field -->
	<Section
		title="Field"
		description="The layout every form is built from: a label, a control, a description and an error, grouped into sets with legends."
	>
		<Demo
			label="A form that validates on submit"
			spec="FieldGroup · data-invalid · aria-invalid · FieldError"
			align="start"
			code={`<form class="w-full max-w-md" novalidate onsubmit={createProject}>
	<Field.Group>
		<Field.Field data-invalid={!!errors.name || undefined}>
			<Field.Label for="in-project-name">Project name</Field.Label>
			<Input id="in-project-name" bind:value={project.name} placeholder="observatory" aria-invalid={!!errors.name || undefined} />
			<Field.Description>Lowercase letters, numbers and hyphens. Used in the preview address.</Field.Description>
			<Field.Error errors={asErrors(errors.name)} />
		</Field.Field>
		<Field.Field data-invalid={!!errors.repository || undefined}>
			<Field.Label for="in-project-repo">Repository</Field.Label>
			<Input id="in-project-repo" bind:value={project.repository} placeholder="https://git.example.org/atlas/observatory" aria-invalid={!!errors.repository || undefined} />
			<Field.Error errors={asErrors(errors.repository)} />
		</Field.Field>
		<Field.Field data-invalid={!!errors.region || undefined}>
			<Field.Label for="in-project-region">Region</Field.Label>
			<NativeSelect.Root id="in-project-region" class="w-full" bind:value={project.region} aria-invalid={!!errors.region || undefined}>
				<NativeSelect.Option value="">Choose a region</NativeSelect.Option>
				{#each REGIONS as region (region.value)}
					<NativeSelect.Option value={region.value}>{region.label}</NativeSelect.Option>
				{/each}
			</NativeSelect.Root>
			<Field.Error errors={asErrors(errors.region)} />
		</Field.Field>
		<Field.Field data-invalid={!!errors.email || undefined}>
			<Field.Label for="in-project-email">Alert email</Field.Label>
			<Input id="in-project-email" type="email" bind:value={project.email} placeholder="ines@observatory.dev" aria-invalid={!!errors.email || undefined} />
			<Field.Description>Optional. Failed builds are reported here.</Field.Description>
			<Field.Error errors={asErrors(errors.email)} />
		</Field.Field>
		<Field.Field orientation="horizontal">
			<Button type="submit">Create project</Button>
			<Button type="button" variant="outline" onclick={resetProject}>Clear form</Button>
		</Field.Field>
	</Field.Group>
</form>`}
		>
			<form class="w-full max-w-md" novalidate onsubmit={createProject}>
				<Field.Group>
					<Field.Field data-invalid={!!errors.name || undefined}>
						<Field.Label for="in-project-name">Project name</Field.Label>
						<Input id="in-project-name" bind:value={project.name} placeholder="observatory" aria-invalid={!!errors.name || undefined} />
						<Field.Description>Lowercase letters, numbers and hyphens. Used in the preview address.</Field.Description>
						<Field.Error errors={asErrors(errors.name)} />
					</Field.Field>
					<Field.Field data-invalid={!!errors.repository || undefined}>
						<Field.Label for="in-project-repo">Repository</Field.Label>
						<Input id="in-project-repo" bind:value={project.repository} placeholder="https://git.example.org/atlas/observatory" aria-invalid={!!errors.repository || undefined} />
						<Field.Error errors={asErrors(errors.repository)} />
					</Field.Field>
					<Field.Field data-invalid={!!errors.region || undefined}>
						<Field.Label for="in-project-region">Region</Field.Label>
						<NativeSelect.Root id="in-project-region" class="w-full" bind:value={project.region} aria-invalid={!!errors.region || undefined}>
							<NativeSelect.Option value="">Choose a region</NativeSelect.Option>
							{#each REGIONS as region (region.value)}
								<NativeSelect.Option value={region.value}>{region.label}</NativeSelect.Option>
							{/each}
						</NativeSelect.Root>
						<Field.Error errors={asErrors(errors.region)} />
					</Field.Field>
					<Field.Field data-invalid={!!errors.email || undefined}>
						<Field.Label for="in-project-email">Alert email</Field.Label>
						<Input id="in-project-email" type="email" bind:value={project.email} placeholder="ines@observatory.dev" aria-invalid={!!errors.email || undefined} />
						<Field.Description>Optional. Failed builds are reported here.</Field.Description>
						<Field.Error errors={asErrors(errors.email)} />
					</Field.Field>
					<Field.Field orientation="horizontal">
						<Button type="submit">Create project</Button>
						<Button type="button" variant="outline" onclick={resetProject}>Clear form</Button>
					</Field.Field>
				</Field.Group>
			</form>
			{#if created}
				<Alert.Root variant="success" class="max-w-md">
					<CircleCheckIcon />
					<Alert.Title>{created.name} is building in {created.region}</Alert.Title>
					<Alert.Description>The first deploy usually takes under two minutes.</Alert.Description>
				</Alert.Root>
			{/if}
		</Demo>

		<Demo
			label="Horizontal"
			spec="orientation=horizontal · FieldContent"
			align="start"
			code={`<Field.Group class="max-w-md">
	<Field.Field orientation="horizontal">
		<Field.Content>
			<Field.Label for="in-notify-failures">Failed deploys</Field.Label>
			<Field.Description>Email the team when a production build fails.</Field.Description>
		</Field.Content>
		<Switch id="in-notify-failures" bind:checked={notifyFailures} />
	</Field.Field>
	<Field.Field orientation="horizontal">
		<Field.Content>
			<Field.Label for="in-notify-previews">Preview links</Field.Label>
			<Field.Description>Post each preview address to the branch's pull request.</Field.Description>
		</Field.Content>
		<Switch id="in-notify-previews" bind:checked={notifyPreviews} />
	</Field.Field>
</Field.Group>`}
		>
			<Field.Group class="max-w-md">
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Label for="in-notify-failures">Failed deploys</Field.Label>
						<Field.Description>Email the team when a production build fails.</Field.Description>
					</Field.Content>
					<Switch id="in-notify-failures" bind:checked={notifyFailures} />
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Label for="in-notify-previews">Preview links</Field.Label>
						<Field.Description>Post each preview address to the branch's pull request.</Field.Description>
					</Field.Content>
					<Switch id="in-notify-previews" bind:checked={notifyPreviews} />
				</Field.Field>
			</Field.Group>
		</Demo>

		<Demo
			label="Responsive"
			spec="orientation=responsive · stacks below the md container"
			align="stretch"
			code={`<Field.Group>
	<Field.Field orientation="responsive">
		<Field.Content>
			<Field.Label for="in-build-command">Build command</Field.Label>
			<Field.Description>Runs in the repository root.</Field.Description>
		</Field.Content>
		<Input id="in-build-command" class="sm:max-w-64" value="npm run build" />
	</Field.Field>
	<Field.Separator />
	<Field.Field orientation="responsive">
		<Field.Content>
			<Field.Label for="in-output-dir">Output directory</Field.Label>
			<Field.Description>Everything in it is published.</Field.Description>
		</Field.Content>
		<Input id="in-output-dir" class="sm:max-w-64" value="build" />
	</Field.Field>
</Field.Group>`}
		>
			<Field.Group>
				<Field.Field orientation="responsive">
					<Field.Content>
						<Field.Label for="in-build-command">Build command</Field.Label>
						<Field.Description>Runs in the repository root.</Field.Description>
					</Field.Content>
					<Input id="in-build-command" class="sm:max-w-64" value="npm run build" />
				</Field.Field>
				<Field.Separator />
				<Field.Field orientation="responsive">
					<Field.Content>
						<Field.Label for="in-output-dir">Output directory</Field.Label>
						<Field.Description>Everything in it is published.</Field.Description>
					</Field.Content>
					<Input id="in-output-dir" class="sm:max-w-64" value="build" />
				</Field.Field>
			</Field.Group>
		</Demo>

		<Demo
			label="A fieldset with a legend"
			spec="FieldSet · FieldLegend · checkbox group"
			align="start"
			code={`<Field.Set class="max-w-md">
	<Field.Legend>Deploy hooks</Field.Legend>
	<Field.Description>Choose which events call the Atlas webhook.</Field.Description>
	<Field.Group data-slot="checkbox-group">
		<Field.Field orientation="horizontal">
			<Checkbox id="in-hook-started" checked />
			<Field.Label for="in-hook-started">Build started</Field.Label>
		</Field.Field>
		<Field.Field orientation="horizontal">
			<Checkbox id="in-hook-ready" checked />
			<Field.Label for="in-hook-ready">Deploy ready</Field.Label>
		</Field.Field>
		<Field.Field orientation="horizontal">
			<Checkbox id="in-hook-failed" />
			<Field.Label for="in-hook-failed">Build failed</Field.Label>
		</Field.Field>
	</Field.Group>
</Field.Set>`}
		>
			<Field.Set class="max-w-md">
				<Field.Legend>Deploy hooks</Field.Legend>
				<Field.Description>Choose which events call the Atlas webhook.</Field.Description>
				<Field.Group data-slot="checkbox-group">
					<Field.Field orientation="horizontal">
						<Checkbox id="in-hook-started" checked />
						<Field.Label for="in-hook-started">Build started</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal">
						<Checkbox id="in-hook-ready" checked />
						<Field.Label for="in-hook-ready">Deploy ready</Field.Label>
					</Field.Field>
					<Field.Field orientation="horizontal">
						<Checkbox id="in-hook-failed" />
						<Field.Label for="in-hook-failed">Build failed</Field.Label>
					</Field.Field>
				</Field.Group>
			</Field.Set>
		</Demo>

		<Demo
			label="Choice cards"
			spec="FieldLabel wrapping a horizontal Field · RadioGroup"
			align="start"
			code={`<Field.Set class="w-full max-w-md">
	<Field.Legend variant="label">Edge region</Field.Legend>
	<Field.Description>Where the Atlas API runs. Static files are served from every region.</Field.Description>
	<RadioGroup.Root bind:value={edgeRegion}>
		{#each REGIONS as region (region.value)}
			<Field.Label for="in-edge-{region.value}">
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Title>{region.label}</Field.Title>
						<Field.Description>Median latency from your visitors: {region.latency}</Field.Description>
					</Field.Content>
					<RadioGroup.Item value={region.value} id="in-edge-{region.value}" />
				</Field.Field>
			</Field.Label>
		{/each}
	</RadioGroup.Root>
</Field.Set>`}
		>
			<Field.Set class="w-full max-w-md">
				<Field.Legend variant="label">Edge region</Field.Legend>
				<Field.Description>Where the Atlas API runs. Static files are served from every region.</Field.Description>
				<RadioGroup.Root bind:value={edgeRegion}>
					{#each REGIONS as region (region.value)}
						<Field.Label for="in-edge-{region.value}">
							<Field.Field orientation="horizontal">
								<Field.Content>
									<Field.Title>{region.label}</Field.Title>
									<Field.Description>Median latency from your visitors: {region.latency}</Field.Description>
								</Field.Content>
								<RadioGroup.Item value={region.value} id="in-edge-{region.value}" />
							</Field.Field>
						</Field.Label>
					{/each}
				</RadioGroup.Root>
			</Field.Set>
		</Demo>

		<Demo
			label="States"
			spec="data-disabled · data-invalid"
			align="start"
			code={`<Field.Field class="w-64" data-disabled="true">
	<Field.Label for="in-field-branch">Production branch</Field.Label>
	<Input id="in-field-branch" value="main" disabled />
	<Field.Description>Set by the team owner.</Field.Description>
</Field.Field>`}
		>
			<Field.Field class="w-64" data-disabled="true">
				<Field.Label for="in-field-branch">Production branch</Field.Label>
				<Input id="in-field-branch" value="main" disabled />
				<Field.Description>Set by the team owner.</Field.Description>
			</Field.Field>
			<Field.Field class="w-64" data-invalid="true">
				<Field.Label for="in-field-budget">Monthly bandwidth cap</Field.Label>
				<Input id="in-field-budget" value="0.5 TB" aria-invalid="true" />
				<Field.Error>Set the cap above this month's 38.4 GB.</Field.Error>
			</Field.Field>
		</Demo>
	</Section>

	<!-- Native select -->
	<Section
		title="Native select"
		description="The browser's own select, styled to match. Use it where the platform picker is better (phones, long lists, forms without script); use Select when options need icons or groups styled in the page."
	>
		<Demo
			label="Default"
			spec="bind:value"
			code={`<NativeSelect.Root bind:value={nativeRegion} aria-label="Region">
	{#each REGIONS as region (region.value)}
		<NativeSelect.Option value={region.value}>{region.label}</NativeSelect.Option>
	{/each}
</NativeSelect.Root>`}
		>
			<NativeSelect.Root bind:value={nativeRegion} aria-label="Region">
				{#each REGIONS as region (region.value)}
					<NativeSelect.Option value={region.value}>{region.label}</NativeSelect.Option>
				{/each}
			</NativeSelect.Root>
			<span class="text-muted-foreground text-xs">value: {nativeRegion}</span>
		</Demo>

		<Demo
			label="Option groups"
			spec="NativeSelectOptGroup"
			code={`<NativeSelect.Root aria-label="Branch">
	<NativeSelect.OptGroup label="Production">
		<NativeSelect.Option value="main">main</NativeSelect.Option>
	</NativeSelect.OptGroup>
	<NativeSelect.OptGroup label="Previews">
		<NativeSelect.Option value="stairs/landing">stairs/landing</NativeSelect.Option>
		<NativeSelect.Option value="rotor/snap">rotor/snap</NativeSelect.Option>
		<NativeSelect.Option value="atlas/offline">atlas/offline</NativeSelect.Option>
	</NativeSelect.OptGroup>
</NativeSelect.Root>`}
		>
			<NativeSelect.Root aria-label="Branch">
				<NativeSelect.OptGroup label="Production">
					<NativeSelect.Option value="main">main</NativeSelect.Option>
				</NativeSelect.OptGroup>
				<NativeSelect.OptGroup label="Previews">
					<NativeSelect.Option value="stairs/landing">stairs/landing</NativeSelect.Option>
					<NativeSelect.Option value="rotor/snap">rotor/snap</NativeSelect.Option>
					<NativeSelect.Option value="atlas/offline">atlas/offline</NativeSelect.Option>
				</NativeSelect.OptGroup>
			</NativeSelect.Root>
		</Demo>

		<Demo
			label="Sizes"
			spec="sm · default"
			code={`<NativeSelect.Root size="sm" aria-label="Rows per page">
	<NativeSelect.Option value="25">25 rows</NativeSelect.Option>
	<NativeSelect.Option value="50">50 rows</NativeSelect.Option>
	<NativeSelect.Option value="100">100 rows</NativeSelect.Option>
</NativeSelect.Root>`}
		>
			<NativeSelect.Root size="sm" aria-label="Rows per page">
				<NativeSelect.Option value="25">25 rows</NativeSelect.Option>
				<NativeSelect.Option value="50">50 rows</NativeSelect.Option>
				<NativeSelect.Option value="100">100 rows</NativeSelect.Option>
			</NativeSelect.Root>
			<NativeSelect.Root aria-label="Rows per page, default size">
				<NativeSelect.Option value="25">25 rows</NativeSelect.Option>
				<NativeSelect.Option value="50">50 rows</NativeSelect.Option>
				<NativeSelect.Option value="100">100 rows</NativeSelect.Option>
			</NativeSelect.Root>
		</Demo>

		<Demo
			label="States"
			spec="disabled · invalid"
			code={`<NativeSelect.Root disabled aria-label="Node version">
	<NativeSelect.Option value="22">Node 22</NativeSelect.Option>
</NativeSelect.Root>`}
		>
			<NativeSelect.Root disabled aria-label="Node version">
				<NativeSelect.Option value="22">Node 22</NativeSelect.Option>
			</NativeSelect.Root>
			<NativeSelect.Root aria-invalid="true" aria-label="Framework preset">
				<NativeSelect.Option value="">No preset</NativeSelect.Option>
				<NativeSelect.Option value="sveltekit">SvelteKit</NativeSelect.Option>
			</NativeSelect.Root>
		</Demo>

		<Demo
			label="In a field"
			spec="Field · full width"
			align="start"
			code={`<Field.Field class="max-w-xs">
	<Field.Label for="in-native-node">Node version</Field.Label>
	<NativeSelect.Root id="in-native-node" class="w-full" value="22">
		<NativeSelect.Option value="24">Node 24 (current)</NativeSelect.Option>
		<NativeSelect.Option value="22">Node 22 (long-term support)</NativeSelect.Option>
		<NativeSelect.Option value="20">Node 20</NativeSelect.Option>
	</NativeSelect.Root>
	<Field.Description>Applies to builds from the next push.</Field.Description>
</Field.Field>`}
		>
			<Field.Field class="max-w-xs">
				<Field.Label for="in-native-node">Node version</Field.Label>
				<NativeSelect.Root id="in-native-node" class="w-full" value="22">
					<NativeSelect.Option value="24">Node 24 (current)</NativeSelect.Option>
					<NativeSelect.Option value="22">Node 22 (long-term support)</NativeSelect.Option>
					<NativeSelect.Option value="20">Node 20</NativeSelect.Option>
				</NativeSelect.Root>
				<Field.Description>Applies to builds from the next push.</Field.Description>
			</Field.Field>
		</Demo>
	</Section>
</Page>
