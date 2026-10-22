/**
 * Code strings for the actions chapter (`/components/actions`). Each one is the markup of the
 * demo it sits under, kept identical to the live markup in the page.
 */
import type { ButtonSize, ButtonVariant } from '#lib/components/ui/button/index.js';

export const BUTTON_VARIANTS: ButtonVariant[] = [
	'default',
	'secondary',
	'outline',
	'ghost',
	'link',
	'destructive',
	'block'
];

export const BUTTON_SIZES: ButtonSize[] = ['xs', 'sm', 'default', 'lg'];

export const REGIONS = [
	{ value: 'fra', label: 'Frankfurt' },
	{ value: 'sfo', label: 'San Francisco' },
	{ value: 'sin', label: 'Singapore' },
	{ value: 'gru', label: 'São Paulo' }
];

export const CODE = {
	buttonVariants: `<Button>Deploy main</Button>
<Button variant="secondary">Preview branch</Button>
<Button variant="outline">Copy deploy URL</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="link">View build log</Button>
<Button variant="destructive">Delete project</Button>
<Button variant="block">Promote to production</Button>`,

	buttonSizes: `<Button size="xs">Redeploy</Button>
<Button size="sm">Redeploy</Button>
<Button>Redeploy</Button>
<Button size="lg">Redeploy</Button>`,

	buttonIconSizes: `<Button variant="outline" size="icon-xs" aria-label="Add a domain"><PlusIcon /></Button>
<Button variant="outline" size="icon-sm" aria-label="Add a domain"><PlusIcon /></Button>
<Button variant="outline" size="icon" aria-label="Add a domain"><PlusIcon /></Button>
<Button variant="outline" size="icon-lg" aria-label="Add a domain"><PlusIcon /></Button>
<Button variant="ghost" size="icon-round" aria-label="Project settings"><SettingsIcon /></Button>`,

	buttonWithIcons: `<Button>
	<RocketIcon data-icon="inline-start" />
	Deploy main
</Button>
<Button variant="outline">
	Open dashboard
	<ArrowRightIcon data-icon="inline-end" />
</Button>
<Button variant="secondary">
	<GitBranchIcon data-icon="inline-start" />
	stairs/landing
	<ChevronDownIcon data-icon="inline-end" />
</Button>`,

	buttonLoading: `<Button onclick={redeploy} disabled={deploying}>
	{#if deploying}
		<Spinner data-icon="inline-start" />
		Redeploying
	{:else}
		<RefreshCwIcon data-icon="inline-start" />
		Redeploy main
	{/if}
</Button>
<Button variant="outline" disabled>Promote to production</Button>`,

	buttonLink: `<Button href="#button">Read the deploy guide</Button>
<Button href="#button" variant="outline">
	Open observatory.example
	<ExternalLinkIcon data-icon="inline-end" />
</Button>
<Button href="#button" variant="link">Pricing for teams</Button>
<Button href="#button" variant="link" disabled>Archived guide</Button>`,

	buttonFullWidth: `<Button class="w-full">Create project</Button>
<Button variant="outline" class="w-full">Import from a repository</Button>`,

	buttonMatrix: `{#each BUTTON_SIZES as size (size)}
	{#each BUTTON_VARIANTS as variant (variant)}
		<span><Button {variant} {size}>Deploy</Button></span>
	{/each}
{/each}`,

	groupHorizontal: `<ButtonGroup.Root aria-label="Deployment actions">
	<Button variant="outline">Redeploy</Button>
	<Button variant="outline">Promote</Button>
	<Button variant="outline">Roll back</Button>
</ButtonGroup.Root>`,

	groupVertical: `<ButtonGroup.Root orientation="vertical" aria-label="Map zoom">
	<Button variant="outline" size="icon" aria-label="Zoom in"><ZoomInIcon /></Button>
	<Button variant="outline" size="icon" aria-label="Zoom out"><ZoomOutIcon /></Button>
	<Button variant="outline" size="icon" aria-label="Locate me"><MapPinIcon /></Button>
</ButtonGroup.Root>`,

	groupText: `<ButtonGroup.Root class="w-full max-w-sm">
	<ButtonGroup.Text>https://</ButtonGroup.Text>
	<Input placeholder="observatory.example" aria-label="Domain" />
	<Button variant="outline">Add domain</Button>
</ButtonGroup.Root>`,

	groupSeparator: `<ButtonGroup.Root>
	<Button variant="secondary"><CopyIcon data-icon="inline-start" />Copy</Button>
	<ButtonGroup.Separator />
	<Button variant="secondary"><ClipboardIcon data-icon="inline-start" />Paste</Button>
</ButtonGroup.Root>`,

	groupDropdown: `<ButtonGroup.Root>
	<Button><RocketIcon data-icon="inline-start" />Deploy main</Button>
	<ButtonGroup.Separator />
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class={buttonVariants({ size: 'icon' })} aria-label="More ways to deploy">
			<ChevronDownIcon />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-60">
			<DropdownMenu.Group>
				<DropdownMenu.Item><GitBranchIcon />Deploy to preview</DropdownMenu.Item>
				<DropdownMenu.Item><RefreshCwIcon />Deploy with cache cleared</DropdownMenu.Item>
				<DropdownMenu.Item><CalendarIcon />Schedule for later</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</ButtonGroup.Root>`,

	groupNested: `<ButtonGroup.Root aria-label="Map editor">
	<ButtonGroup.Root>
		<Button variant="outline" size="icon" aria-label="Undo"><Undo2Icon /></Button>
		<Button variant="outline" size="icon" aria-label="Redo"><Redo2Icon /></Button>
	</ButtonGroup.Root>
	<ButtonGroup.Root>
		<Button variant="outline" size="icon" aria-label="Zoom out" disabled={zoom <= 25} onclick={() => (zoom -= 25)}>
			<ZoomOutIcon />
		</Button>
		<ButtonGroup.Text class="w-16 justify-center tabular-nums">{zoom}%</ButtonGroup.Text>
		<Button variant="outline" size="icon" aria-label="Zoom in" disabled={zoom >= 400} onclick={() => (zoom += 25)}>
			<ZoomInIcon />
		</Button>
	</ButtonGroup.Root>
</ButtonGroup.Root>`,

	toggleDefault: `<Toggle bind:pressed={watching} variant="outline">
	<EyeIcon data-icon="inline-start" />
	Watch branch
</Toggle>`,

	toggleVariants: `<Toggle aria-label="Pin deployment"><PinIcon /></Toggle>
<Toggle variant="outline" aria-label="Star project"><StarIcon /></Toggle>`,

	toggleSizes: `<Toggle variant="outline" size="sm" aria-label="Bold"><BoldIcon /></Toggle>
<Toggle variant="outline" aria-label="Bold"><BoldIcon /></Toggle>
<Toggle variant="outline" size="lg" aria-label="Bold"><BoldIcon /></Toggle>`,

	toggleWithIcon: `<Toggle variant="outline" pressed>
	<StarIcon data-icon="inline-start" />
	Starred
</Toggle>
<Toggle>
	<PinIcon data-icon="inline-start" />
	Pin to sidebar
</Toggle>`,

	toggleDisabled: `<Toggle variant="outline" disabled aria-label="Lock layout"><LockIcon /></Toggle>
<Toggle variant="outline" pressed disabled aria-label="Lock layout"><LockIcon /></Toggle>`,

	tgSingle: `<ToggleGroup.Root type="single" bind:value={range} aria-label="Time range">
	<ToggleGroup.Item value="24h">24 hours</ToggleGroup.Item>
	<ToggleGroup.Item value="7d">7 days</ToggleGroup.Item>
	<ToggleGroup.Item value="30d">30 days</ToggleGroup.Item>
</ToggleGroup.Root>`,

	tgMultiple: `<ToggleGroup.Root type="multiple" bind:value={marks} aria-label="Text style">
	<ToggleGroup.Item value="bold" aria-label="Bold"><BoldIcon /></ToggleGroup.Item>
	<ToggleGroup.Item value="italic" aria-label="Italic"><ItalicIcon /></ToggleGroup.Item>
	<ToggleGroup.Item value="underline" aria-label="Underline"><UnderlineIcon /></ToggleGroup.Item>
</ToggleGroup.Root>`,

	tgOutline: `<ToggleGroup.Root type="single" variant="outline" bind:value={align} aria-label="Caption alignment">
	<ToggleGroup.Item value="start" aria-label="Align left"><TextAlignStartIcon /></ToggleGroup.Item>
	<ToggleGroup.Item value="center" aria-label="Align centre"><TextAlignCenterIcon /></ToggleGroup.Item>
	<ToggleGroup.Item value="end" aria-label="Align right"><TextAlignEndIcon /></ToggleGroup.Item>
</ToggleGroup.Root>`,

	tgSpacing: `<ToggleGroup.Root type="single" variant="outline" spacing={2} bind:value={region} aria-label="Region" class="flex-wrap justify-center">
	{#each REGIONS as r (r.value)}
		<ToggleGroup.Item value={r.value}>{r.label}</ToggleGroup.Item>
	{/each}
</ToggleGroup.Root>`,

	tgVertical: `<ToggleGroup.Root type="single" variant="outline" orientation="vertical" bind:value={view} aria-label="Layout">
	<ToggleGroup.Item value="grid"><LayoutGridIcon data-icon="inline-start" />Grid</ToggleGroup.Item>
	<ToggleGroup.Item value="list"><ListIcon data-icon="inline-start" />List</ToggleGroup.Item>
	<ToggleGroup.Item value="map"><MapIcon data-icon="inline-start" />Map</ToggleGroup.Item>
</ToggleGroup.Root>`,

	tgSizes: `<ToggleGroup.Root type="single" variant="outline" size="sm" value="7d" aria-label="Time range">
	<ToggleGroup.Item value="24h">24h</ToggleGroup.Item>
	<ToggleGroup.Item value="7d">7d</ToggleGroup.Item>
	<ToggleGroup.Item value="30d">30d</ToggleGroup.Item>
</ToggleGroup.Root>
<ToggleGroup.Root type="single" variant="outline" size="lg" value="7d" aria-label="Time range">
	<ToggleGroup.Item value="24h">24h</ToggleGroup.Item>
	<ToggleGroup.Item value="7d">7d</ToggleGroup.Item>
	<ToggleGroup.Item value="30d">30d</ToggleGroup.Item>
</ToggleGroup.Root>`,

	ddFull: `<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>
		Observatory
		<ChevronDownIcon data-icon="inline-end" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-60">
		<DropdownMenu.Label>Observatory</DropdownMenu.Label>
		<DropdownMenu.Group>
			<DropdownMenu.Item><SettingsIcon />Settings<DropdownMenu.Shortcut>⌘,</DropdownMenu.Shortcut></DropdownMenu.Item>
			<DropdownMenu.Item><GlobeIcon />Domains<DropdownMenu.Shortcut>⌘D</DropdownMenu.Shortcut></DropdownMenu.Item>
			<DropdownMenu.Item><KeyRoundIcon />Environment variables</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Team</DropdownMenu.GroupHeading>
			<DropdownMenu.Item><UserPlusIcon />Invite to team<DropdownMenu.Shortcut>⌘I</DropdownMenu.Shortcut></DropdownMenu.Item>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger><UsersIcon />Move to team</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent class="w-48">
					<DropdownMenu.Group>
						<DropdownMenu.Item>Platform</DropdownMenu.Item>
						<DropdownMenu.Item>Atlas guide</DropdownMenu.Item>
						<DropdownMenu.Item>Field research</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item variant="destructive"><TrashIcon />Delete project<DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut></DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>`,

	ddCheckbox: `<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>
		<LayersIcon data-icon="inline-start" />
		Columns
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-52">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Show columns</DropdownMenu.GroupHeading>
			<DropdownMenu.CheckboxItem bind:checked={columns.branch}>Branch</DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxItem bind:checked={columns.region}>Region</DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxItem bind:checked={columns.duration}>Build duration</DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxItem bind:checked={columns.author}>Author</DropdownMenu.CheckboxItem>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>`,

	ddRadio: `<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>
		<GlobeIcon data-icon="inline-start" />
		{regionLabel}
		<ChevronDownIcon data-icon="inline-end" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-52">
		<DropdownMenu.RadioGroup bind:value={ddRegion}>
			<DropdownMenu.GroupHeading>Primary region</DropdownMenu.GroupHeading>
			{#each REGIONS as r (r.value)}
				<DropdownMenu.RadioItem value={r.value}>{r.label}</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>`,

	ddIcon: `<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon-round' })} aria-label="Actions for dpl_8f3k2q">
		<EllipsisIcon />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-48">
		<DropdownMenu.Group>
			<DropdownMenu.Item><FileTextIcon />View build log</DropdownMenu.Item>
			<DropdownMenu.Item><CopyIcon />Copy deploy URL</DropdownMenu.Item>
			<DropdownMenu.Item disabled><RefreshCwIcon />Redeploy</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>`,

	cmCanvas: `<ContextMenu.Root>
	<ContextMenu.Trigger class="border-border bg-background text-muted-foreground flex h-56 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center text-sm">
		<MapIcon />
		<span>Right-click the map, or press and hold on a touch screen</span>
	</ContextMenu.Trigger>
	<ContextMenu.Content class="w-64">
		<ContextMenu.Label>Kinetic garden</ContextMenu.Label>
		<ContextMenu.Group>
			<ContextMenu.Item><MapPinIcon />Drop a pin here<ContextMenu.Shortcut>P</ContextMenu.Shortcut></ContextMenu.Item>
			<ContextMenu.Item><CopyIcon />Copy coordinates<ContextMenu.Shortcut>⌘C</ContextMenu.Shortcut></ContextMenu.Item>
			<ContextMenu.Item><PencilIcon />Rename area<ContextMenu.Shortcut>F2</ContextMenu.Shortcut></ContextMenu.Item>
			<ContextMenu.Sub>
				<ContextMenu.SubTrigger><FolderIcon />Move to tour</ContextMenu.SubTrigger>
				<ContextMenu.SubContent class="w-48">
					<ContextMenu.Group>
						<ContextMenu.Item>Morning walk</ContextMenu.Item>
						<ContextMenu.Item>Stone and water</ContextMenu.Item>
						<ContextMenu.Item>Accessible route</ContextMenu.Item>
					</ContextMenu.Group>
				</ContextMenu.SubContent>
			</ContextMenu.Sub>
		</ContextMenu.Group>
		<ContextMenu.Separator />
		<ContextMenu.Group>
			<ContextMenu.GroupHeading>Show</ContextMenu.GroupHeading>
			<ContextMenu.CheckboxItem bind:checked={mapGrid}>Grid</ContextMenu.CheckboxItem>
			<ContextMenu.CheckboxItem bind:checked={mapLabels}>Sculpture labels</ContextMenu.CheckboxItem>
		</ContextMenu.Group>
		<ContextMenu.Separator />
		<ContextMenu.RadioGroup bind:value={basemap}>
			<ContextMenu.GroupHeading>Basemap</ContextMenu.GroupHeading>
			<ContextMenu.RadioItem value="paper">Paper</ContextMenu.RadioItem>
			<ContextMenu.RadioItem value="terrain">Terrain</ContextMenu.RadioItem>
			<ContextMenu.RadioItem value="night">Night</ContextMenu.RadioItem>
		</ContextMenu.RadioGroup>
		<ContextMenu.Separator />
		<ContextMenu.Group>
			<ContextMenu.Item variant="destructive"><TrashIcon />Remove area<ContextMenu.Shortcut>⌫</ContextMenu.Shortcut></ContextMenu.Item>
		</ContextMenu.Group>
	</ContextMenu.Content>
</ContextMenu.Root>`,

	cmRow: `<ContextMenu.Root>
	<ContextMenu.Trigger class="border-border bg-background flex w-full items-center gap-3 rounded-md border px-3 py-2 text-sm">
		<FileCodeIcon class="text-muted-foreground size-4" />
		<span class="flex-1 truncate font-mono">src/routes/+page.svelte</span>
		<span class="text-muted-foreground text-xs">4.2 KB</span>
	</ContextMenu.Trigger>
	<ContextMenu.Content class="w-56">
		<ContextMenu.Group>
			<ContextMenu.Item><FileTextIcon />Open in editor<ContextMenu.Shortcut>↵</ContextMenu.Shortcut></ContextMenu.Item>
			<ContextMenu.Item><CopyIcon />Copy path<ContextMenu.Shortcut>⌥⌘C</ContextMenu.Shortcut></ContextMenu.Item>
			<ContextMenu.Item><DownloadIcon />Download</ContextMenu.Item>
		</ContextMenu.Group>
		<ContextMenu.Separator />
		<ContextMenu.Group>
			<ContextMenu.Item variant="destructive"><TrashIcon />Delete file</ContextMenu.Item>
		</ContextMenu.Group>
	</ContextMenu.Content>
</ContextMenu.Root>`,

	menubar: `<Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger>File</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Group>
				<Menubar.Item><PlusIcon />New project<Menubar.Shortcut>⌘N</Menubar.Shortcut></Menubar.Item>
				<Menubar.Item><RocketIcon />New deploy hook</Menubar.Item>
				<Menubar.Sub>
					<Menubar.SubTrigger><FolderIcon />Open recent</Menubar.SubTrigger>
					<Menubar.SubContent class="w-48">
						<Menubar.Group>
							<Menubar.Item>observatory</Menubar.Item>
							<Menubar.Item>atlas-guide</Menubar.Item>
							<Menubar.Item>stairs-landing</Menubar.Item>
						</Menubar.Group>
					</Menubar.SubContent>
				</Menubar.Sub>
			</Menubar.Group>
			<Menubar.Separator />
			<Menubar.Group>
				<Menubar.Item><DownloadIcon />Export build logs</Menubar.Item>
				<Menubar.Item><PrinterIcon />Print<Menubar.Shortcut>⌘P</Menubar.Shortcut></Menubar.Item>
			</Menubar.Group>
			<Menubar.Separator />
			<Menubar.Group>
				<Menubar.Item variant="destructive"><TrashIcon />Delete project</Menubar.Item>
			</Menubar.Group>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>Edit</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Group>
				<Menubar.Item><Undo2Icon />Undo<Menubar.Shortcut>⌘Z</Menubar.Shortcut></Menubar.Item>
				<Menubar.Item><Redo2Icon />Redo<Menubar.Shortcut>⇧⌘Z</Menubar.Shortcut></Menubar.Item>
			</Menubar.Group>
			<Menubar.Separator />
			<Menubar.Group>
				<Menubar.Sub>
					<Menubar.SubTrigger><SearchIcon />Find</Menubar.SubTrigger>
					<Menubar.SubContent class="w-52">
						<Menubar.Group>
							<Menubar.Item>Search the project<Menubar.Shortcut>⌘F</Menubar.Shortcut></Menubar.Item>
							<Menubar.Item>Find next<Menubar.Shortcut>⌘G</Menubar.Shortcut></Menubar.Item>
							<Menubar.Item>Find previous<Menubar.Shortcut>⇧⌘G</Menubar.Shortcut></Menubar.Item>
						</Menubar.Group>
					</Menubar.SubContent>
				</Menubar.Sub>
			</Menubar.Group>
			<Menubar.Separator />
			<Menubar.Group>
				<Menubar.Item><ScissorsIcon />Cut<Menubar.Shortcut>⌘X</Menubar.Shortcut></Menubar.Item>
				<Menubar.Item><CopyIcon />Copy<Menubar.Shortcut>⌘C</Menubar.Shortcut></Menubar.Item>
				<Menubar.Item><ClipboardIcon />Paste<Menubar.Shortcut>⌘V</Menubar.Shortcut></Menubar.Item>
			</Menubar.Group>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>View</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Group>
				<Menubar.CheckboxItem bind:checked={showLog}>Build log</Menubar.CheckboxItem>
				<Menubar.CheckboxItem bind:checked={showPreview}>Preview frame</Menubar.CheckboxItem>
			</Menubar.Group>
			<Menubar.Separator />
			<Menubar.RadioGroup bind:value={viewRegion}>
				<Menubar.GroupHeading>Serve from</Menubar.GroupHeading>
				{#each REGIONS as r (r.value)}
					<Menubar.RadioItem value={r.value}>{r.label}</Menubar.RadioItem>
				{/each}
			</Menubar.RadioGroup>
			<Menubar.Separator />
			<Menubar.Group>
				<Menubar.Item inset>Enter full screen<Menubar.Shortcut>⌃⌘F</Menubar.Shortcut></Menubar.Item>
			</Menubar.Group>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>Help</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Group>
				<Menubar.Item><BookOpenIcon />Documentation</Menubar.Item>
				<Menubar.Item><KeyboardIcon />Keyboard shortcuts<Menubar.Shortcut>⌘/</Menubar.Shortcut></Menubar.Item>
				<Menubar.Item><ActivityIcon />Service status</Menubar.Item>
			</Menubar.Group>
			<Menubar.Separator />
			<Menubar.Group>
				<Menubar.Item><LifeBuoyIcon />Contact support</Menubar.Item>
			</Menubar.Group>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>`
};
