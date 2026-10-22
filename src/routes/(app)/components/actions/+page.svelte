<script lang="ts">
	import ActivityIcon from '@lucide/svelte/icons/activity';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import BoldIcon from '@lucide/svelte/icons/bold';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ClipboardIcon from '@lucide/svelte/icons/clipboard';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import FileCodeIcon from '@lucide/svelte/icons/file-code';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import GitBranchIcon from '@lucide/svelte/icons/git-branch';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import KeyRoundIcon from '@lucide/svelte/icons/key-round';
	import KeyboardIcon from '@lucide/svelte/icons/keyboard';
	import LayersIcon from '@lucide/svelte/icons/layers';
	import LayoutGridIcon from '@lucide/svelte/icons/layout-grid';
	import LifeBuoyIcon from '@lucide/svelte/icons/life-buoy';
	import ListIcon from '@lucide/svelte/icons/list';
	import LockIcon from '@lucide/svelte/icons/lock';
	import MapIcon from '@lucide/svelte/icons/map';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import PinIcon from '@lucide/svelte/icons/pin';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import PrinterIcon from '@lucide/svelte/icons/printer';
	import Redo2Icon from '@lucide/svelte/icons/redo-2';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import RocketIcon from '@lucide/svelte/icons/rocket';
	import ScissorsIcon from '@lucide/svelte/icons/scissors';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import StarIcon from '@lucide/svelte/icons/star';
	import TextAlignCenterIcon from '@lucide/svelte/icons/text-align-center';
	import TextAlignEndIcon from '@lucide/svelte/icons/text-align-end';
	import TextAlignStartIcon from '@lucide/svelte/icons/text-align-start';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import Undo2Icon from '@lucide/svelte/icons/undo-2';
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import UsersIcon from '@lucide/svelte/icons/users';
	import ZoomInIcon from '@lucide/svelte/icons/zoom-in';
	import ZoomOutIcon from '@lucide/svelte/icons/zoom-out';
	import { Page, Section, Demo } from '#lib/components/showcase/index.js';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import * as ButtonGroup from '#lib/components/ui/button-group/index.js';
	import * as ContextMenu from '#lib/components/ui/context-menu/index.js';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import * as Menubar from '#lib/components/ui/menubar/index.js';
	import { Spinner } from '#lib/components/ui/spinner/index.js';
	import { Toggle } from '#lib/components/ui/toggle/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import { BUTTON_SIZES, BUTTON_VARIANTS, CODE, REGIONS } from '#lib/components/catalog/actions.js';
	import { chapterBySlug } from '#lib/catalog.js';

	const chapter = chapterBySlug('actions')!;

	// Button
	let deploying = $state(false);
	function redeploy() {
		deploying = true;
		setTimeout(() => (deploying = false), 2400);
	}

	// Button group
	let zoom = $state(100);

	// Toggle
	let watching = $state(true);

	// Toggle group
	let range = $state('7d');
	let marks = $state<string[]>(['bold']);
	let align = $state('start');
	let region = $state('fra');
	let view = $state('grid');

	const regionName = (value: string) => REGIONS.find((r) => r.value === value)?.label ?? 'none';

	// Dropdown menu
	let columns = $state({ branch: true, region: true, duration: false, author: true });
	let ddRegion = $state('sin');
	let regionLabel = $derived(regionName(ddRegion));
	let shownColumns = $derived(
		Object.entries(columns)
			.filter(([, on]) => on)
			.map(([name]) => name)
	);

	// Context menu
	let mapGrid = $state(true);
	let mapLabels = $state(false);
	let basemap = $state('paper');

	// Menubar
	let showLog = $state(true);
	let showPreview = $state(false);
	let viewRegion = $state('gru');
</script>

<svelte:head>
	<title>{chapter.title} · Isometric</title>
	<meta
		name="description"
		content="Buttons, button groups, toggles, toggle groups, dropdown menus, context menus and the menubar: every variant, size and state, live."
	/>
</svelte:head>

<Page
	title={chapter.title}
	description={chapter.subtitle}
	chapter={{ numeral: chapter.numeral, connective: chapter.connective }}
>
	<!-- ============================================================ Button -->
	<Section
		title="Button"
		description="Starts an action. Keep one default button per view; to move somewhere else, pass href and it renders a link."
	>
		<Demo
			label="Variants"
			spec="default · secondary · outline · ghost · link · destructive · block"
			code={CODE.buttonVariants}
		>
			<Button>Deploy main</Button>
			<Button variant="secondary">Preview branch</Button>
			<Button variant="outline">Copy deploy URL</Button>
			<Button variant="ghost">Cancel</Button>
			<Button variant="link">View build log</Button>
			<Button variant="destructive">Delete project</Button>
			<Button variant="block">Promote to production</Button>
		</Demo>

		<Demo label="Sizes" spec="xs · sm · default · lg" code={CODE.buttonSizes}>
			<Button size="xs">Redeploy</Button>
			<Button size="sm">Redeploy</Button>
			<Button>Redeploy</Button>
			<Button size="lg">Redeploy</Button>
		</Demo>

		<Demo
			label="Icon sizes"
			spec="icon-xs · icon-sm · icon · icon-lg · icon-round"
			code={CODE.buttonIconSizes}
		>
			<Button variant="outline" size="icon-xs" aria-label="Add a domain"><PlusIcon /></Button>
			<Button variant="outline" size="icon-sm" aria-label="Add a domain"><PlusIcon /></Button>
			<Button variant="outline" size="icon" aria-label="Add a domain"><PlusIcon /></Button>
			<Button variant="outline" size="icon-lg" aria-label="Add a domain"><PlusIcon /></Button>
			<Button variant="ghost" size="icon-round" aria-label="Project settings"><SettingsIcon /></Button>
		</Demo>

		<Demo
			label="With icons"
			spec="data-icon inline-start · inline-end"
			code={CODE.buttonWithIcons}
		>
			<Button>
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
			</Button>
		</Demo>

		<Demo
			label="Loading and disabled"
			spec="Spinner + disabled · disabled · press to redeploy"
			code={CODE.buttonLoading}
		>
			<Button onclick={redeploy} disabled={deploying}>
				{#if deploying}
					<Spinner data-icon="inline-start" />
					Redeploying
				{:else}
					<RefreshCwIcon data-icon="inline-start" />
					Redeploy main
				{/if}
			</Button>
			<Button variant="outline" disabled>Promote to production</Button>
		</Demo>

		<Demo label="As a link" spec="href renders an anchor · disabled link" code={CODE.buttonLink}>
			<Button href="#button">Read the deploy guide</Button>
			<Button href="#button" variant="outline">
				Open observatory.example
				<ExternalLinkIcon data-icon="inline-end" />
			</Button>
			<Button href="#button" variant="link">Pricing for teams</Button>
			<Button href="#button" variant="link" disabled>Archived guide</Button>
		</Demo>

		<Demo label="Full width" spec="class w-full" align="stretch" code={CODE.buttonFullWidth}>
			<div class="mx-auto flex w-full max-w-sm flex-col gap-2">
				<Button class="w-full">Create project</Button>
				<Button variant="outline" class="w-full">Import from a repository</Button>
			</div>
		</Demo>

		<Demo
			label="Variants by sizes"
			spec="7 variants · 4 sizes"
			align="stretch"
			code={CODE.buttonMatrix}
		>
			<div class="w-full overflow-x-auto">
				<div class="grid w-max grid-cols-[4rem_repeat(7,auto)] items-center gap-x-4 gap-y-3">
					<span></span>
					{#each BUTTON_VARIANTS as variant (variant)}
						<span class="text-muted-foreground text-xs">{variant}</span>
					{/each}
					{#each BUTTON_SIZES as size (size)}
						<span class="text-muted-foreground text-xs">{size}</span>
						{#each BUTTON_VARIANTS as variant (variant)}
							<span><Button {variant} {size}>Deploy</Button></span>
						{/each}
					{/each}
				</div>
			</div>
		</Demo>
	</Section>

	<!-- ============================================================ Button group -->
	<Section
		title="Button group"
		description="Joins related buttons into one block. For a set of options where one or several stay selected, use Toggle group."
	>
		<Demo label="Horizontal" spec="orientation horizontal" code={CODE.groupHorizontal}>
			<ButtonGroup.Root aria-label="Deployment actions">
				<Button variant="outline">Redeploy</Button>
				<Button variant="outline">Promote</Button>
				<Button variant="outline">Roll back</Button>
			</ButtonGroup.Root>
		</Demo>

		<Demo label="Vertical" spec="orientation vertical · icon buttons" code={CODE.groupVertical}>
			<ButtonGroup.Root orientation="vertical" aria-label="Map zoom">
				<Button variant="outline" size="icon" aria-label="Zoom in"><ZoomInIcon /></Button>
				<Button variant="outline" size="icon" aria-label="Zoom out"><ZoomOutIcon /></Button>
				<Button variant="outline" size="icon" aria-label="Locate me"><MapPinIcon /></Button>
			</ButtonGroup.Root>
		</Demo>

		<Demo label="With a text addon" spec="ButtonGroup.Text · Input · Button" code={CODE.groupText}>
			<ButtonGroup.Root class="w-full max-w-sm">
				<ButtonGroup.Text>https://</ButtonGroup.Text>
				<Input placeholder="observatory.example" aria-label="Domain" />
				<Button variant="outline">Add domain</Button>
			</ButtonGroup.Root>
		</Demo>

		<Demo label="With a separator" spec="ButtonGroup.Separator between filled buttons" code={CODE.groupSeparator}>
			<ButtonGroup.Root>
				<Button variant="secondary"><CopyIcon data-icon="inline-start" />Copy</Button>
				<ButtonGroup.Separator />
				<Button variant="secondary"><ClipboardIcon data-icon="inline-start" />Paste</Button>
			</ButtonGroup.Root>
		</Demo>

		<Demo label="With a dropdown" spec="split button · menu as the last item" code={CODE.groupDropdown}>
			<ButtonGroup.Root>
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
			</ButtonGroup.Root>
		</Demo>

		<Demo label="Nested groups" spec="groups inside a group · live zoom" code={CODE.groupNested}>
			<ButtonGroup.Root aria-label="Map editor">
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
			</ButtonGroup.Root>
		</Demo>
	</Section>

	<!-- ============================================================ Toggle -->
	<Section
		title="Toggle"
		description="A two-state button that stays pressed. For a setting that takes effect at once, use Switch."
	>
		<Demo label="Pressed state" spec="bind:pressed" code={CODE.toggleDefault}>
			<Toggle bind:pressed={watching} variant="outline">
				<EyeIcon data-icon="inline-start" />
				Watch branch
			</Toggle>
			<span class="text-muted-foreground text-sm" aria-live="polite">
				{watching
					? 'You get a message on every deploy of stairs/landing.'
					: 'Not watching stairs/landing.'}
			</span>
		</Demo>

		<Demo label="Variants" spec="default · outline" code={CODE.toggleVariants}>
			<Toggle aria-label="Pin deployment"><PinIcon /></Toggle>
			<Toggle variant="outline" aria-label="Star project"><StarIcon /></Toggle>
		</Demo>

		<Demo label="Sizes" spec="sm · default · lg" code={CODE.toggleSizes}>
			<Toggle variant="outline" size="sm" aria-label="Bold"><BoldIcon /></Toggle>
			<Toggle variant="outline" aria-label="Bold"><BoldIcon /></Toggle>
			<Toggle variant="outline" size="lg" aria-label="Bold"><BoldIcon /></Toggle>
		</Demo>

		<Demo label="With icon and text" spec="data-icon inline-start · pressed" code={CODE.toggleWithIcon}>
			<Toggle variant="outline" pressed>
				<StarIcon data-icon="inline-start" />
				Starred
			</Toggle>
			<Toggle>
				<PinIcon data-icon="inline-start" />
				Pin to sidebar
			</Toggle>
		</Demo>

		<Demo label="Disabled" spec="off · on" code={CODE.toggleDisabled}>
			<Toggle variant="outline" disabled aria-label="Lock layout"><LockIcon /></Toggle>
			<Toggle variant="outline" pressed disabled aria-label="Lock layout"><LockIcon /></Toggle>
		</Demo>
	</Section>

	<!-- ============================================================ Toggle group -->
	<Section
		title="Toggle group"
		description="A short set of options, two to seven, where one or several stay selected. For a longer list, use Select."
	>
		<Demo label="Single" spec="type single · bind:value" code={CODE.tgSingle}>
			<ToggleGroup.Root type="single" bind:value={range} aria-label="Time range">
				<ToggleGroup.Item value="24h">24 hours</ToggleGroup.Item>
				<ToggleGroup.Item value="7d">7 days</ToggleGroup.Item>
				<ToggleGroup.Item value="30d">30 days</ToggleGroup.Item>
			</ToggleGroup.Root>
			<span class="text-muted-foreground text-sm tabular-nums">
				{range === '24h' ? '48,210' : range === '7d' ? '312,644' : '1,284,903'} requests
			</span>
		</Demo>

		<Demo label="Multiple" spec="type multiple · bind:value" code={CODE.tgMultiple}>
			<ToggleGroup.Root type="multiple" bind:value={marks} aria-label="Text style">
				<ToggleGroup.Item value="bold" aria-label="Bold"><BoldIcon /></ToggleGroup.Item>
				<ToggleGroup.Item value="italic" aria-label="Italic"><ItalicIcon /></ToggleGroup.Item>
				<ToggleGroup.Item value="underline" aria-label="Underline"><UnderlineIcon /></ToggleGroup.Item>
			</ToggleGroup.Root>
			<span class="text-muted-foreground text-sm">
				{marks.length ? marks.join(', ') : 'plain text'}
			</span>
		</Demo>

		<Demo label="Outline" spec="variant outline" code={CODE.tgOutline}>
			<ToggleGroup.Root type="single" variant="outline" bind:value={align} aria-label="Caption alignment">
				<ToggleGroup.Item value="start" aria-label="Align left"><TextAlignStartIcon /></ToggleGroup.Item>
				<ToggleGroup.Item value="center" aria-label="Align centre"><TextAlignCenterIcon /></ToggleGroup.Item>
				<ToggleGroup.Item value="end" aria-label="Align right"><TextAlignEndIcon /></ToggleGroup.Item>
			</ToggleGroup.Root>
		</Demo>

		<Demo label="With spacing" spec="spacing 2 · items stand apart" code={CODE.tgSpacing}>
			<ToggleGroup.Root type="single" variant="outline" spacing={2} bind:value={region} aria-label="Region" class="flex-wrap justify-center">
				{#each REGIONS as r (r.value)}
					<ToggleGroup.Item value={r.value}>{r.label}</ToggleGroup.Item>
				{/each}
			</ToggleGroup.Root>
			<span class="text-muted-foreground w-full text-center text-sm">
				Serving from {regionName(region)}
			</span>
		</Demo>

		<Demo label="Vertical" spec="orientation vertical" code={CODE.tgVertical}>
			<ToggleGroup.Root type="single" variant="outline" orientation="vertical" bind:value={view} aria-label="Layout">
				<ToggleGroup.Item value="grid"><LayoutGridIcon data-icon="inline-start" />Grid</ToggleGroup.Item>
				<ToggleGroup.Item value="list"><ListIcon data-icon="inline-start" />List</ToggleGroup.Item>
				<ToggleGroup.Item value="map"><MapIcon data-icon="inline-start" />Map</ToggleGroup.Item>
			</ToggleGroup.Root>
		</Demo>

		<Demo label="Sizes" spec="sm · lg" code={CODE.tgSizes}>
			<ToggleGroup.Root type="single" variant="outline" size="sm" value="7d" aria-label="Time range">
				<ToggleGroup.Item value="24h">24h</ToggleGroup.Item>
				<ToggleGroup.Item value="7d">7d</ToggleGroup.Item>
				<ToggleGroup.Item value="30d">30d</ToggleGroup.Item>
			</ToggleGroup.Root>
			<ToggleGroup.Root type="single" variant="outline" size="lg" value="7d" aria-label="Time range">
				<ToggleGroup.Item value="24h">24h</ToggleGroup.Item>
				<ToggleGroup.Item value="7d">7d</ToggleGroup.Item>
				<ToggleGroup.Item value="30d">30d</ToggleGroup.Item>
			</ToggleGroup.Root>
		</Demo>
	</Section>

	<!-- ============================================================ Dropdown menu -->
	<Section
		title="Dropdown menu"
		description="A list of actions opened from a button. For choosing one value in a form, use Select."
	>
		<Demo
			label="Groups, labels and shortcuts"
			spec="label · group heading · shortcut · icons · submenu · destructive"
			code={CODE.ddFull}
		>
			<DropdownMenu.Root>
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
			</DropdownMenu.Root>
		</Demo>

		<Demo label="Checkbox items" spec="CheckboxItem · bind:checked" code={CODE.ddCheckbox}>
			<DropdownMenu.Root>
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
			</DropdownMenu.Root>
			<span class="text-muted-foreground text-sm">
				Showing {shownColumns.length ? shownColumns.join(', ') : 'no extra columns'}
			</span>
		</Demo>

		<Demo label="Radio items" spec="RadioGroup · bind:value" code={CODE.ddRadio}>
			<DropdownMenu.Root>
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
			</DropdownMenu.Root>
		</Demo>

		<Demo label="From an icon button" spec="ghost icon-round trigger · disabled item" code={CODE.ddIcon}>
			<div class="border-border bg-background flex w-full max-w-md items-center gap-3 rounded-md border py-2 pr-2 pl-3 text-sm">
				<span class="flex min-w-0 flex-1 flex-col">
					<span class="truncate font-mono">dpl_8f3k2q</span>
					<span class="text-muted-foreground truncate text-xs">rotor/snap · Singapore · 41 s</span>
				</span>
				<DropdownMenu.Root>
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
				</DropdownMenu.Root>
			</div>
		</Demo>
	</Section>

	<!-- ============================================================ Context menu -->
	<Section
		title="Context menu"
		description="The same list of actions, opened by right-clicking or pressing and holding an area. Always offer the actions somewhere visible too."
	>
		<Demo
			label="On a canvas"
			spec="label · shortcuts · submenu · checkbox · radio · destructive"
			align="stretch"
			code={CODE.cmCanvas}
		>
			<ContextMenu.Root>
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
			</ContextMenu.Root>
			<p class="text-muted-foreground text-xs">
				Grid {mapGrid ? 'on' : 'off'} · labels {mapLabels ? 'on' : 'off'} · {basemap} basemap
			</p>
		</Demo>

		<Demo label="On a list row" spec="trigger wraps one row" align="stretch" code={CODE.cmRow}>
			<div class="mx-auto flex w-full max-w-md flex-col gap-2">
				<ContextMenu.Root>
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
				</ContextMenu.Root>
			</div>
		</Demo>
	</Section>

	<!-- ============================================================ Menubar -->
	<Section
		title="Menubar"
		description="A row of menus for an application with many commands, as in a desktop editor. A website rarely needs one; use Navigation menu for site links."
	>
		<Demo
			label="Application menu"
			spec="File · Edit · View · Help · submenus · checkbox · radio"
			code={CODE.menubar}
		>
			<Menubar.Root>
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
			</Menubar.Root>
			<span class="text-muted-foreground w-full text-center text-xs">
				Build log {showLog ? 'shown' : 'hidden'} · preview frame {showPreview ? 'shown' : 'hidden'} ·
				serving from {regionName(viewRegion)}
			</span>
		</Demo>
	</Section>
</Page>
