<script lang="ts">
	import { toast } from 'svelte-sonner';

	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import BellIcon from '@lucide/svelte/icons/bell';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import InfoIcon from '@lucide/svelte/icons/info';
	import LandmarkIcon from '@lucide/svelte/icons/landmark';
	import MapIcon from '@lucide/svelte/icons/map';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import MoreHorizontalIcon from '@lucide/svelte/icons/more-horizontal';
	import PaletteIcon from '@lucide/svelte/icons/palette';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import ShareIcon from '@lucide/svelte/icons/share';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import TypeIcon from '@lucide/svelte/icons/type';

	import * as AlertDialog from '#lib/components/ui/alert-dialog/index.js';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import * as Breadcrumb from '#lib/components/ui/breadcrumb/index.js';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import * as Command from '#lib/components/ui/command/index.js';
	import * as ContextMenu from '#lib/components/ui/context-menu/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import * as Drawer from '#lib/components/ui/drawer/index.js';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import * as HoverCard from '#lib/components/ui/hover-card/index.js';
	import * as Menubar from '#lib/components/ui/menubar/index.js';
	import * as NavigationMenu from '#lib/components/ui/navigation-menu/index.js';
	import * as Pagination from '#lib/components/ui/pagination/index.js';
	import * as Popover from '#lib/components/ui/popover/index.js';
	import { Progress } from '#lib/components/ui/progress/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import { Skeleton } from '#lib/components/ui/skeleton/index.js';
	import { Toaster } from '#lib/components/ui/sonner/index.js';
	import { Spinner } from '#lib/components/ui/spinner/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';

	// ---- mode and palette toolbar -------------------------------------------------------------
	const palettes = ['sun', 'ember', 'lagoon', 'dusk', 'moss', 'coral'] as const;
	let isDark = $state(false);
	let palette = $state<string>('sun');

	function toggleDark() {
		isDark = document.documentElement.classList.toggle('dark');
	}

	function cyclePalette() {
		const current = document.documentElement.dataset.theme ?? 'sun';
		const index = palettes.indexOf(current as (typeof palettes)[number]);
		palette = palettes[(index + 1) % palettes.length];
		document.documentElement.dataset.theme = palette;
	}

	// ---- menu state ---------------------------------------------------------------------------
	let showGrid = $state(true);
	let snapToFaces = $state(false);
	let showShadows = $state(true);
	let menuPalette = $state('sun');
	let contextPalette = $state('lagoon');
	let menubarView = $state('isometric');
	let menubarRulers = $state(true);

	// ---- navigation and paging ----------------------------------------------------------------
	const cities = [
		{ name: 'Lisbon', note: 'Seven hills, one tram line, a great deal of tile.' },
		{ name: 'Kyoto', note: 'Gates in vermilion, gardens raked to a line.' },
		{ name: 'Reykjavík', note: 'Basalt columns and a church shaped like them.' },
		{ name: 'Marrakesh', note: 'Ochre walls, zellige, and courtyards open to the sky.' }
	];
	let page = $state(4);

	// ---- overlays -----------------------------------------------------------------------------
	let commandOpen = $state(false);
	const sheetSides = ['top', 'right', 'bottom', 'left'] as const;

	// ---- feedback -----------------------------------------------------------------------------
	let progressValue = $state(35);

	function advanceProgress() {
		progressValue = progressValue >= 100 ? 0 : Math.min(100, progressValue + 20);
	}

	function promiseToast() {
		toast.promise(new Promise((resolve) => setTimeout(resolve, 2400)), {
			loading: 'Rendering the Lisbon monument',
			success: 'Monument rendered at 2048 x 2048',
			error: 'Rendering failed'
		});
	}
</script>

<svelte:head>
	<title>Surfaces lab</title>
</svelte:head>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			commandOpen = !commandOpen;
		}
	}}
/>

<Toaster />

<!-- fixed toolbar: mode and palette -->
<div
	class="fixed top-3 right-3 z-40 flex items-center gap-1 rounded-lg border border-border bg-popover p-1 shadow-float"
>
	<Button variant="ghost" size="sm" onclick={toggleDark}>{isDark ? 'Light mode' : 'Dark mode'}</Button>
	<Button variant="ghost" size="sm" onclick={cyclePalette}>
		<PaletteIcon data-icon="inline-start" />
		{palette}
	</Button>
</div>

<Tooltip.Provider>
	<main class="mx-auto flex max-w-5xl flex-col gap-16 px-6 pt-20 pb-32">
		<header class="flex flex-col gap-3">
			<p class="type-eyebrow text-muted-foreground">Lab</p>
			<h1 class="type-title text-4xl">Surfaces</h1>
			<p class="max-w-[65ch] text-muted-foreground">
				Menus, navigation, overlays and feedback. Tab through for focus, hover for live states, and use
				the toolbar to switch mode and palette.
			</p>
		</header>

		<!-- ============================================================ menus -->
		<section class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Dropdown, context menu, menubar</h2>

			<div class="flex flex-wrap items-start gap-4">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>
						Monument
						<MoreHorizontalIcon data-icon="inline-end" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-60">
						<DropdownMenu.Group>
							<DropdownMenu.Label>Lisbon monument</DropdownMenu.Label>
							<DropdownMenu.Item>
								<CopyIcon />
								Duplicate
								<DropdownMenu.Shortcut>Ctrl D</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<ShareIcon />
								Copy share link
								<DropdownMenu.Shortcut>Ctrl L</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>
									<DownloadIcon />
									Export as
								</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.Group>
										<DropdownMenu.Item>PNG at 2048 px</DropdownMenu.Item>
										<DropdownMenu.Item>SVG outline</DropdownMenu.Item>
										<DropdownMenu.Item>glTF model</DropdownMenu.Item>
									</DropdownMenu.Group>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
							<DropdownMenu.Item disabled>
								<ArchiveIcon />
								Archive (read only)
							</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Label>View</DropdownMenu.Label>
							<DropdownMenu.CheckboxItem bind:checked={showGrid}>Show grid</DropdownMenu.CheckboxItem>
							<DropdownMenu.CheckboxItem bind:checked={snapToFaces}>Snap to faces</DropdownMenu.CheckboxItem>
							<DropdownMenu.CheckboxItem indeterminate>Show labels (mixed)</DropdownMenu.CheckboxItem>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.RadioGroup bind:value={menuPalette}>
							<DropdownMenu.GroupHeading>Palette</DropdownMenu.GroupHeading>
							{#each palettes.slice(0, 4) as name (name)}
								<DropdownMenu.RadioItem value={name}>{name}</DropdownMenu.RadioItem>
							{/each}
						</DropdownMenu.RadioGroup>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item variant="destructive">
								<TrashIcon />
								Delete monument
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>

				<ContextMenu.Root>
					<ContextMenu.Trigger
						class="flex h-28 w-72 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground"
					>
						Right-click the plinth
					</ContextMenu.Trigger>
					<ContextMenu.Content class="w-56">
						<ContextMenu.Group>
							<ContextMenu.Item>
								Rotate a quarter turn
								<ContextMenu.Shortcut>R</ContextMenu.Shortcut>
							</ContextMenu.Item>
							<ContextMenu.Item>
								Raise one step
								<ContextMenu.Shortcut>Shift Up</ContextMenu.Shortcut>
							</ContextMenu.Item>
							<ContextMenu.Item inset>Reset camera</ContextMenu.Item>
							<ContextMenu.Sub>
								<ContextMenu.SubTrigger inset>Move to city</ContextMenu.SubTrigger>
								<ContextMenu.SubContent class="w-44">
									<ContextMenu.Group>
										{#each cities as city (city.name)}
											<ContextMenu.Item>{city.name}</ContextMenu.Item>
										{/each}
									</ContextMenu.Group>
								</ContextMenu.SubContent>
							</ContextMenu.Sub>
						</ContextMenu.Group>
						<ContextMenu.Separator />
						<ContextMenu.Group>
							<ContextMenu.CheckboxItem bind:checked={showShadows}>Cast shadows</ContextMenu.CheckboxItem>
						</ContextMenu.Group>
						<ContextMenu.Separator />
						<ContextMenu.RadioGroup bind:value={contextPalette}>
							<ContextMenu.GroupHeading>Palette</ContextMenu.GroupHeading>
							<ContextMenu.RadioItem value="lagoon">lagoon</ContextMenu.RadioItem>
							<ContextMenu.RadioItem value="moss">moss</ContextMenu.RadioItem>
							<ContextMenu.RadioItem value="coral" disabled>coral (locked)</ContextMenu.RadioItem>
						</ContextMenu.RadioGroup>
						<ContextMenu.Separator />
						<ContextMenu.Group>
							<ContextMenu.Item variant="destructive">Remove from scene</ContextMenu.Item>
						</ContextMenu.Group>
					</ContextMenu.Content>
				</ContextMenu.Root>
			</div>

			<Menubar.Root class="w-fit">
				<Menubar.Menu>
					<Menubar.Trigger>File</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Group>
							<Menubar.Item>New monument <Menubar.Shortcut>Ctrl N</Menubar.Shortcut></Menubar.Item>
							<Menubar.Item>Open atlas <Menubar.Shortcut>Ctrl O</Menubar.Shortcut></Menubar.Item>
							<Menubar.Sub>
								<Menubar.SubTrigger>Recent</Menubar.SubTrigger>
								<Menubar.SubContent>
									<Menubar.Group>
										<Menubar.Item>Lisbon, 12 March</Menubar.Item>
										<Menubar.Item>Kyoto, 3 April</Menubar.Item>
										<Menubar.Item>Reykjavík, 21 June</Menubar.Item>
									</Menubar.Group>
								</Menubar.SubContent>
							</Menubar.Sub>
						</Menubar.Group>
						<Menubar.Separator />
						<Menubar.Group>
							<Menubar.Item disabled>Print plan</Menubar.Item>
							<Menubar.Item variant="destructive">Close without saving</Menubar.Item>
						</Menubar.Group>
					</Menubar.Content>
				</Menubar.Menu>
				<Menubar.Menu>
					<Menubar.Trigger>View</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Group>
							<Menubar.CheckboxItem bind:checked={menubarRulers}>Rulers</Menubar.CheckboxItem>
							<Menubar.CheckboxItem>Guides</Menubar.CheckboxItem>
						</Menubar.Group>
						<Menubar.Separator />
						<Menubar.RadioGroup bind:value={menubarView}>
							<Menubar.GroupHeading>Projection</Menubar.GroupHeading>
							<Menubar.RadioItem value="isometric">Isometric</Menubar.RadioItem>
							<Menubar.RadioItem value="dimetric">Dimetric</Menubar.RadioItem>
							<Menubar.RadioItem value="plan">Plan</Menubar.RadioItem>
						</Menubar.RadioGroup>
					</Menubar.Content>
				</Menubar.Menu>
				<Menubar.Menu>
					<Menubar.Trigger>Type</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Group>
							<Menubar.Label>Voices</Menubar.Label>
							<Menubar.Item>Josefin Sans</Menubar.Item>
							<Menubar.Item>Cabin</Menubar.Item>
							<Menubar.Item>IBM Plex Mono</Menubar.Item>
						</Menubar.Group>
					</Menubar.Content>
				</Menubar.Menu>
			</Menubar.Root>
		</section>

		<!-- ============================================================ navigation -->
		<section class="flex flex-col gap-8">
			<h2 class="type-label text-muted-foreground">Navigation menu, breadcrumb, pagination</h2>

			<div class="flex flex-col gap-6">
				<NavigationMenu.Root>
					<NavigationMenu.List>
						<NavigationMenu.Item>
							<NavigationMenu.Trigger>Cities</NavigationMenu.Trigger>
							<NavigationMenu.Content>
								<ul class="grid w-[30rem] grid-cols-2 gap-1">
									{#each cities as city (city.name)}
										<li>
											<NavigationMenu.Link href="#{city.name}" class="flex-col items-start gap-1">
												<span class="font-medium">{city.name}</span>
												<span class="text-muted-foreground">{city.note}</span>
											</NavigationMenu.Link>
										</li>
									{/each}
								</ul>
							</NavigationMenu.Content>
						</NavigationMenu.Item>
						<NavigationMenu.Item>
							<NavigationMenu.Trigger>Typefaces</NavigationMenu.Trigger>
							<NavigationMenu.Content>
								<ul class="grid w-60 gap-1">
									<li><NavigationMenu.Link href="#josefin"><TypeIcon />Josefin Sans</NavigationMenu.Link></li>
									<li><NavigationMenu.Link href="#cabin"><TypeIcon />Cabin</NavigationMenu.Link></li>
									<li><NavigationMenu.Link href="#plex"><TypeIcon />IBM Plex Mono</NavigationMenu.Link></li>
								</ul>
							</NavigationMenu.Content>
						</NavigationMenu.Item>
						<NavigationMenu.Item>
							<NavigationMenu.Link href="#journal" active>Journal</NavigationMenu.Link>
						</NavigationMenu.Item>
						<NavigationMenu.Item>
							<NavigationMenu.Link href="#about">About</NavigationMenu.Link>
						</NavigationMenu.Item>
					</NavigationMenu.List>
				</NavigationMenu.Root>

				<NavigationMenu.Root viewport={false}>
					<NavigationMenu.List>
						<NavigationMenu.Item>
							<NavigationMenu.Trigger>Palettes (no viewport)</NavigationMenu.Trigger>
							<NavigationMenu.Content>
								<ul class="grid w-48 gap-1">
									{#each palettes as name (name)}
										<li><NavigationMenu.Link href="#{name}">{name}</NavigationMenu.Link></li>
									{/each}
								</ul>
							</NavigationMenu.Content>
						</NavigationMenu.Item>
					</NavigationMenu.List>
				</NavigationMenu.Root>
			</div>

			<div class="flex flex-col gap-3">
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item><Breadcrumb.Link href="#atlas">Atlas</Breadcrumb.Link></Breadcrumb.Item>
						<Breadcrumb.Separator />
						<Breadcrumb.Item><Breadcrumb.Link href="#europe">Europe</Breadcrumb.Link></Breadcrumb.Item>
						<Breadcrumb.Separator />
						<Breadcrumb.Item><Breadcrumb.Ellipsis /></Breadcrumb.Item>
						<Breadcrumb.Separator />
						<Breadcrumb.Item><Breadcrumb.Page>Lisbon</Breadcrumb.Page></Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item><Breadcrumb.Link href="#type">Type</Breadcrumb.Link></Breadcrumb.Item>
						<Breadcrumb.Separator>/</Breadcrumb.Separator>
						<Breadcrumb.Item><Breadcrumb.Link href="#display">Display</Breadcrumb.Link></Breadcrumb.Item>
						<Breadcrumb.Separator>/</Breadcrumb.Separator>
						<Breadcrumb.Item><Breadcrumb.Page>Josefin Sans</Breadcrumb.Page></Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>

			<Pagination.Root count={120} perPage={10} bind:page class="justify-start">
				{#snippet children({ pages, currentPage })}
					<Pagination.Content>
						<Pagination.Item><Pagination.Previous /></Pagination.Item>
						{#each pages as p (p.key)}
							{#if p.type === 'ellipsis'}
								<Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link page={p} isActive={currentPage === p.value}>{p.value}</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item><Pagination.Next /></Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
		</section>

		<!-- ============================================================ tabs -->
		<section class="flex flex-col gap-8">
			<h2 class="type-label text-muted-foreground">Tabs</h2>

			<Tabs.Root value="overview">
				<Tabs.List>
					<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
					<Tabs.Trigger value="typefaces">Typefaces</Tabs.Trigger>
					<Tabs.Trigger value="palettes">Palettes</Tabs.Trigger>
					<Tabs.Trigger value="archive" disabled>Archive</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="overview" class="text-muted-foreground">
					Lisbon sits on seven hills; the monument sits on one plinth.
				</Tabs.Content>
				<Tabs.Content value="typefaces" class="text-muted-foreground">
					Josefin Sans for titles, Cabin for text, IBM Plex Mono for code.
				</Tabs.Content>
				<Tabs.Content value="palettes" class="text-muted-foreground">
					Sun, ember, lagoon, dusk, moss and coral.
				</Tabs.Content>
			</Tabs.Root>

			<div class="flex flex-wrap items-start gap-10">
				<Tabs.Root value="week">
					<Tabs.List variant="segment">
						<Tabs.Trigger value="day">Day</Tabs.Trigger>
						<Tabs.Trigger value="week">Week</Tabs.Trigger>
						<Tabs.Trigger value="month">Month</Tabs.Trigger>
						<Tabs.Trigger value="year" disabled>Year</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>

				<Tabs.Root value="map">
					<Tabs.List variant="segment">
						<Tabs.Trigger value="map"><MapIcon data-icon="inline-start" />Map</Tabs.Trigger>
						<Tabs.Trigger value="list"><FolderIcon data-icon="inline-start" />List</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>

				<Tabs.Root value="kyoto" orientation="vertical">
					<Tabs.List>
						{#each cities as city (city.name)}
							<Tabs.Trigger value={city.name.toLowerCase()}>{city.name}</Tabs.Trigger>
						{/each}
					</Tabs.List>
					<Tabs.Content value="kyoto" class="max-w-60 text-muted-foreground">{cities[1].note}</Tabs.Content>
				</Tabs.Root>

				<Tabs.Root value="cabin" orientation="vertical">
					<Tabs.List variant="segment">
						<Tabs.Trigger value="josefin">Josefin Sans</Tabs.Trigger>
						<Tabs.Trigger value="cabin">Cabin</Tabs.Trigger>
						<Tabs.Trigger value="plex">IBM Plex Mono</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
			</div>
		</section>

		<!-- ============================================================ sidebar -->
		<section class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Sidebar</h2>
			<!-- the transform makes this box the containing block for the sidebar's fixed panel -->
			<div class="relative h-[32rem] overflow-hidden rounded-lg border border-border [transform:translateZ(0)]">
				<Sidebar.Provider class="h-full min-h-0">
					<Sidebar.Root collapsible="icon" class="h-full">
						<Sidebar.Header>
							<Sidebar.Menu>
								<Sidebar.MenuItem>
									<Sidebar.MenuButton size="lg">
										<span
											class="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-face-top text-foreground shadow-face-sm"
										>
											<LandmarkIcon />
										</span>
										<span class="flex flex-col leading-tight">
											<span class="font-medium text-foreground">Isometric atlas</span>
											<span class="text-xs">Four cities</span>
										</span>
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							</Sidebar.Menu>
						</Sidebar.Header>
						<Sidebar.Content>
							<Sidebar.Group>
								<Sidebar.GroupLabel>Cities</Sidebar.GroupLabel>
								<Sidebar.GroupAction title="Add a city"><PlusIcon /></Sidebar.GroupAction>
								<Sidebar.GroupContent>
									<Sidebar.Menu>
										<Sidebar.MenuItem>
											<Sidebar.MenuButton isActive tooltipContent="Lisbon">
												<MapPinIcon />
												<span>Lisbon</span>
											</Sidebar.MenuButton>
											<Sidebar.MenuBadge>12</Sidebar.MenuBadge>
										</Sidebar.MenuItem>
										<Sidebar.MenuItem>
											<Sidebar.MenuButton tooltipContent="Kyoto">
												<MapPinIcon />
												<span>Kyoto</span>
											</Sidebar.MenuButton>
											<Sidebar.MenuAction showOnHover title="More for Kyoto"><MoreHorizontalIcon /></Sidebar.MenuAction>
										</Sidebar.MenuItem>
										<Sidebar.MenuItem>
											<Sidebar.MenuButton tooltipContent="Reykjavík">
												<MapPinIcon />
												<span>Reykjavík</span>
											</Sidebar.MenuButton>
											<Sidebar.MenuSub>
												<Sidebar.MenuSubItem>
													<Sidebar.MenuSubButton href="#hallgrimskirkja">Hallgrímskirkja</Sidebar.MenuSubButton>
												</Sidebar.MenuSubItem>
												<Sidebar.MenuSubItem>
													<Sidebar.MenuSubButton href="#harpa" isActive>Harpa</Sidebar.MenuSubButton>
												</Sidebar.MenuSubItem>
												<Sidebar.MenuSubItem>
													<Sidebar.MenuSubButton href="#sun-voyager">Sun Voyager</Sidebar.MenuSubButton>
												</Sidebar.MenuSubItem>
											</Sidebar.MenuSub>
										</Sidebar.MenuItem>
										<Sidebar.MenuItem>
											<Sidebar.MenuButton aria-disabled="true" tooltipContent="Marrakesh">
												<MapPinIcon />
												<span>Marrakesh (soon)</span>
											</Sidebar.MenuButton>
										</Sidebar.MenuItem>
									</Sidebar.Menu>
								</Sidebar.GroupContent>
							</Sidebar.Group>
							<Sidebar.Separator />
							<Sidebar.Group>
								<Sidebar.GroupLabel>Loading</Sidebar.GroupLabel>
								<Sidebar.GroupContent>
									<Sidebar.Menu>
										<Sidebar.MenuItem><Sidebar.MenuSkeleton showIcon /></Sidebar.MenuItem>
										<Sidebar.MenuItem><Sidebar.MenuSkeleton showIcon /></Sidebar.MenuItem>
									</Sidebar.Menu>
								</Sidebar.GroupContent>
							</Sidebar.Group>
						</Sidebar.Content>
						<Sidebar.Footer>
							<Sidebar.Menu>
								<Sidebar.MenuItem>
									<Sidebar.MenuButton variant="outline" tooltipContent="Settings">
										<SettingsIcon />
										<span>Settings</span>
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							</Sidebar.Menu>
						</Sidebar.Footer>
						<Sidebar.Rail />
					</Sidebar.Root>
					<Sidebar.Inset>
						<div class="flex h-12 items-center gap-2 border-b border-border px-3">
							<Sidebar.Trigger />
							<Breadcrumb.Root>
								<Breadcrumb.List>
									<Breadcrumb.Item><Breadcrumb.Link href="#reykjavik">Reykjavík</Breadcrumb.Link></Breadcrumb.Item>
									<Breadcrumb.Separator />
									<Breadcrumb.Item><Breadcrumb.Page>Harpa</Breadcrumb.Page></Breadcrumb.Item>
								</Breadcrumb.List>
							</Breadcrumb.Root>
						</div>
						<div class="p-6 text-muted-foreground">
							Press Ctrl B or the trigger to collapse to icons; hover the rail to see its hairline.
						</div>
					</Sidebar.Inset>
				</Sidebar.Provider>
			</div>
		</section>

		<!-- ============================================================ command -->
		<section class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Command</h2>
			<div class="flex flex-wrap items-start gap-6">
				<Command.Root class="max-w-sm">
					<Command.Input placeholder="Search cities and typefaces" />
					<Command.List>
						<Command.Empty>Nothing matches that search.</Command.Empty>
						<Command.Group heading="Cities">
							{#each cities as city (city.name)}
								<Command.Item value={city.name}>
									<MapPinIcon />
									{city.name}
								</Command.Item>
							{/each}
						</Command.Group>
						<Command.Separator />
						<Command.Group heading="Typefaces">
							<Command.Item><TypeIcon />Josefin Sans<Command.Shortcut>Ctrl 1</Command.Shortcut></Command.Item>
							<Command.Item><TypeIcon />Cabin<Command.Shortcut>Ctrl 2</Command.Shortcut></Command.Item>
							<Command.Item disabled><TypeIcon />IBM Plex Mono (disabled)</Command.Item>
						</Command.Group>
					</Command.List>
				</Command.Root>

				<Button variant="outline" onclick={() => (commandOpen = true)}>
					<SearchIcon data-icon="inline-start" />
					Open command palette
					<span class="text-muted-foreground">Ctrl K</span>
				</Button>
				<Command.Dialog bind:open={commandOpen}>
					<Command.Input placeholder="Type a command or a city" />
					<Command.List>
						<Command.Empty>Nothing matches that search.</Command.Empty>
						<Command.Group heading="Go to">
							{#each cities as city (city.name)}
								<Command.Item value={city.name} onSelect={() => (commandOpen = false)}>
									<MapPinIcon />
									{city.name}
								</Command.Item>
							{/each}
						</Command.Group>
						<Command.Separator />
						<Command.Group heading="Palette">
							{#each palettes as name (name)}
								<Command.Item value={name}>
									<PaletteIcon />
									Switch to {name}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Dialog>
			</div>
		</section>

		<!-- ============================================================ overlays -->
		<section class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Dialog, alert dialog, sheet, drawer</h2>
			<div class="flex flex-wrap gap-3">
				<Dialog.Root>
					<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Open dialog</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Rename the monument</Dialog.Title>
							<Dialog.Description>
								The name appears on the plinth and in the atlas. Use the city and the year.
							</Dialog.Description>
						</Dialog.Header>
						<p class="text-muted-foreground">Current name: <span class="text-foreground">Lisbon, 1755</span></p>
						<Dialog.Footer showCloseButton>
							<Button>Save name</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>

				<AlertDialog.Root>
					<AlertDialog.Trigger class={buttonVariants({ variant: 'outline' })}>Delete city</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Delete Kyoto from the atlas?</AlertDialog.Title>
							<AlertDialog.Description>
								The monument, its palette and its four camera stops will be removed. This cannot be undone.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Keep Kyoto</AlertDialog.Cancel>
							<AlertDialog.Action variant="destructive">Delete Kyoto</AlertDialog.Action>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>

				<AlertDialog.Root>
					<AlertDialog.Trigger class={buttonVariants({ variant: 'outline' })}>Small with media</AlertDialog.Trigger>
					<AlertDialog.Content size="sm">
						<AlertDialog.Header>
							<AlertDialog.Media><BellIcon /></AlertDialog.Media>
							<AlertDialog.Title>Allow alerts?</AlertDialog.Title>
							<AlertDialog.Description>We will tell you when Reykjavík finishes rendering.</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Not now</AlertDialog.Cancel>
							<AlertDialog.Action>Allow</AlertDialog.Action>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>

				{#each sheetSides as side (side)}
					<Sheet.Root>
						<Sheet.Trigger class={buttonVariants({ variant: 'outline' })}>Sheet from {side}</Sheet.Trigger>
						<Sheet.Content {side}>
							<Sheet.Header>
								<Sheet.Title>Marrakesh details</Sheet.Title>
								<Sheet.Description>Ochre walls, zellige, and courtyards open to the sky.</Sheet.Description>
							</Sheet.Header>
							<div class="px-5 text-muted-foreground">Founded 1070. Elevation 466 m.</div>
							<Sheet.Footer>
								<Sheet.Close class={buttonVariants({ variant: 'outline' })}>Done</Sheet.Close>
							</Sheet.Footer>
						</Sheet.Content>
					</Sheet.Root>
				{/each}

				<Drawer.Root>
					<Drawer.Trigger class={buttonVariants({ variant: 'outline' })}>Open drawer</Drawer.Trigger>
					<Drawer.Content>
						<div class="mx-auto w-full max-w-sm">
							<Drawer.Header>
								<Drawer.Title>Camera stops</Drawer.Title>
								<Drawer.Description>Four quarter turns around the Lisbon monument.</Drawer.Description>
							</Drawer.Header>
							<div class="flex flex-col gap-2 px-5 text-muted-foreground">
								<p>North, east, south, west. Each turn takes 700 ms.</p>
							</div>
							<Drawer.Footer>
								<Button>Save stops</Button>
								<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Drawer.Close>
							</Drawer.Footer>
						</div>
					</Drawer.Content>
				</Drawer.Root>
			</div>
		</section>

		<section class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Popover, hover card, tooltip</h2>
			<div class="flex flex-wrap items-center gap-3">
				<Popover.Root>
					<Popover.Trigger class={buttonVariants({ variant: 'outline' })}>Monument info</Popover.Trigger>
					<Popover.Content>
						<Popover.Header>
							<Popover.Title>Lisbon, 1755</Popover.Title>
							<Popover.Description>Seven tiers, one plinth, four camera stops.</Popover.Description>
						</Popover.Header>
						<dl class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
							<dt class="text-muted-foreground">Palette</dt>
							<dd>sun</dd>
							<dt class="text-muted-foreground">Typeface</dt>
							<dd>Josefin Sans</dd>
						</dl>
					</Popover.Content>
				</Popover.Root>

				<Popover.Root>
					<Popover.Trigger class={buttonVariants({ variant: 'outline' })}>Pick a city (combobox)</Popover.Trigger>
					<Popover.Content class="w-56 p-0">
						<Command.Root>
							<Command.Input placeholder="Search cities" />
							<Command.List>
								<Command.Empty>No city found.</Command.Empty>
								<Command.Group>
									{#each cities as city (city.name)}
										<Command.Item value={city.name}>{city.name}</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>

				<HoverCard.Root>
					<HoverCard.Trigger href="#cabin" class="text-sm underline underline-offset-4">Cabin</HoverCard.Trigger>
					<HoverCard.Content>
						<div class="flex flex-col gap-1">
							<p class="font-medium">Cabin</p>
							<p class="text-muted-foreground">A humanist sans with a width axis, used for all running text.</p>
							<p class="pt-1 text-xs text-muted-foreground">Released 2011</p>
						</div>
					</HoverCard.Content>
				</HoverCard.Root>

				{#each ['top', 'right', 'bottom', 'left'] as const as side (side)}
					<Tooltip.Root>
						<Tooltip.Trigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>Tooltip {side}</Tooltip.Trigger>
						<Tooltip.Content {side}>Rotate a quarter turn</Tooltip.Content>
					</Tooltip.Root>
				{/each}
			</div>
		</section>

		<!-- ============================================================ feedback -->
		<section class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Alert</h2>
			<div class="grid gap-3 md:grid-cols-2">
				<Alert.Root>
					<InfoIcon />
					<Alert.Title>Lisbon renders in sun by default</Alert.Title>
					<Alert.Description>Switch palettes from the toolbar; the monument keeps its faces.</Alert.Description>
				</Alert.Root>
				<Alert.Root variant="destructive">
					<CircleAlertIcon />
					<Alert.Title>Kyoto failed to render</Alert.Title>
					<Alert.Description>The plinth mesh has 3 open edges. Close them and try again.</Alert.Description>
				</Alert.Root>
				<Alert.Root variant="success">
					<CircleCheckIcon />
					<Alert.Title>Reykjavík saved</Alert.Title>
					<Alert.Description>Saved 21 June at 14:05.</Alert.Description>
				</Alert.Root>
				<Alert.Root variant="warning">
					<TriangleAlertIcon />
					<Alert.Title>Marrakesh is over budget</Alert.Title>
					<Alert.Description>The scene has 84,000 faces; aim for under 60,000.</Alert.Description>
				</Alert.Root>
				<Alert.Root variant="info">
					<BookOpenIcon />
					<Alert.Title>New in the journal</Alert.Title>
					<Alert.Description>How the ember palette was tuned for dark mode.</Alert.Description>
					<Alert.Action><Button size="sm" variant="outline">Read</Button></Alert.Action>
				</Alert.Root>
				<Alert.Root>
					<Alert.Title>No icon, title only</Alert.Title>
				</Alert.Root>
			</div>
		</section>

		<section class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Toast</h2>
			<div class="flex flex-wrap gap-3">
				<Button variant="outline" onclick={() => toast('Monument duplicated', { description: 'Lisbon, 1755 (copy)' })}>Default</Button>
				<Button variant="outline" onclick={() => toast.success('Reykjavík saved', { description: '21 June at 14:05' })}>Success</Button>
				<Button variant="outline" onclick={() => toast.error('Kyoto failed to render', { description: '3 open edges on the plinth' })}>Error</Button>
				<Button variant="outline" onclick={() => toast.warning('Marrakesh is over budget')}>Warning</Button>
				<Button variant="outline" onclick={() => toast.info('Ember palette updated for dark mode')}>Info</Button>
				<Button variant="outline" onclick={promiseToast}>Loading then success</Button>
				<Button
					variant="outline"
					onclick={() =>
						toast('Kyoto moved to the archive', {
							action: { label: 'Undo', onClick: () => toast.success('Kyoto restored') },
							cancel: { label: 'Dismiss', onClick: () => {} }
						})}>With action</Button
				>
			</div>
		</section>

		<section class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Progress, spinner, skeleton</h2>
			<div class="grid max-w-md gap-4">
				<Progress value={0} />
				<Progress value={progressValue} />
				<Progress value={100} />
				<Progress value={null} />
				<Button variant="outline" size="sm" class="w-fit" onclick={advanceProgress}>
					Advance to {progressValue >= 100 ? 0 : Math.min(100, progressValue + 20)}%
				</Button>
			</div>
			<div class="flex flex-wrap items-center gap-6">
				<Spinner class="size-3" />
				<Spinner />
				<Spinner class="size-6" />
				<Spinner class="size-8" />
				<Spinner class="size-8 text-muted-foreground" />
				<Button disabled><Spinner data-icon="inline-start" />Rendering</Button>
				<Button variant="outline" disabled><Spinner data-icon="inline-start" />Saving</Button>
			</div>
			<div class="flex max-w-md items-center gap-4">
				<Skeleton class="size-12 rounded-full" />
				<div class="flex flex-1 flex-col gap-2">
					<Skeleton class="h-4 w-3/4" />
					<Skeleton class="h-4 w-1/2" />
				</div>
			</div>
			<div class="grid max-w-md gap-3">
				<Skeleton class="h-32 w-full rounded-lg" />
			</div>
		</section>

		<section class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Empty</h2>
			<div class="grid gap-6 md:grid-cols-3">
				<Empty.Root class="border border-dashed border-border">
					<Empty.Header>
						<Empty.Media />
						<Empty.Title>No monuments yet</Empty.Title>
						<Empty.Description>Pick a city to place the first one.</Empty.Description>
					</Empty.Header>
					<Empty.Content>
						<Button>Place a monument</Button>
					</Empty.Content>
				</Empty.Root>
				<Empty.Root class="border border-dashed border-border">
					<Empty.Header>
						<Empty.Media><MapPinIcon /></Empty.Media>
						<Empty.Title>No cities match</Empty.Title>
						<Empty.Description>Try Lisbon, Kyoto, Reykjavík or Marrakesh.</Empty.Description>
					</Empty.Header>
				</Empty.Root>
				<Empty.Root class="border border-dashed border-border">
					<Empty.Header>
						<Empty.Media variant="icon"><FolderIcon /></Empty.Media>
						<Empty.Title>The archive is empty</Empty.Title>
						<Empty.Description>Archived monuments appear here. <a href="#archive">Learn how</a>.</Empty.Description>
					</Empty.Header>
				</Empty.Root>
			</div>
		</section>
	</main>
</Tooltip.Provider>
