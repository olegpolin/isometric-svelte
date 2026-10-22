/**
 * Data and code strings for the navigation chapter (`/components/navigation`). Each code string is
 * the markup of the demo it sits under, kept identical to the live markup in the page.
 */

export const PLATFORM_LINKS = [
	{ title: 'Static hosting', note: 'Every push to main is live in four regions in under a minute.', href: '#navigation-menu' },
	{ title: 'Preview branches', note: 'Each branch gets its own address, such as rotor-snap.observatory.example.', href: '#navigation-menu' },
	{ title: 'Edge redirects', note: 'Rewrite and redirect rules evaluated at the nearest region.', href: '#navigation-menu' },
	{ title: 'Analytics', note: 'Requests, bandwidth and errors without a tracking script.', href: '#navigation-menu' }
];

export const REGION_LINKS = [
	{ name: 'Frankfurt', latency: '18 ms', href: '#navigation-menu' },
	{ name: 'San Francisco', latency: '24 ms', href: '#navigation-menu' },
	{ name: 'Singapore', latency: '31 ms', href: '#navigation-menu' },
	{ name: 'São Paulo', latency: '42 ms', href: '#navigation-menu' }
];

export const CODE = {
	tabsLine: `<Tabs.Root bind:value={projectTab}>
	<Tabs.List>
		<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
		<Tabs.Trigger value="builds">Builds</Tabs.Trigger>
		<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="overview">Observatory is live in four regions. The last deploy finished 6 minutes ago.</Tabs.Content>
	<Tabs.Content value="builds">214 builds this month, 9 of them promoted to production.</Tabs.Content>
	<Tabs.Content value="analytics">1,284,903 requests and 38.4 GB served in the last 30 days.</Tabs.Content>
</Tabs.Root>`,

	tabsSegment: `<Tabs.Root value="preview" class="w-full max-w-md">
	<Tabs.List variant="segment">
		<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
		<Tabs.Trigger value="log">Build log</Tabs.Trigger>
		<Tabs.Trigger value="source">Source</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="preview">rotor-snap.observatory.example, built from rotor/snap at 4f2a91c.</Tabs.Content>
	<Tabs.Content value="log">Compiled 412 modules in 18.2 s. No warnings.</Tabs.Content>
	<Tabs.Content value="source">The commit 4f2a91c changed 14 files: 212 additions, 37 deletions.</Tabs.Content>
</Tabs.Root>`,

	tabsIcons: `<Tabs.Root value="map">
	<Tabs.List variant="segment">
		<Tabs.Trigger value="map"><MapIcon data-icon="inline-start" />Map</Tabs.Trigger>
		<Tabs.Trigger value="list"><ListIcon data-icon="inline-start" />List</Tabs.Trigger>
		<Tabs.Trigger value="tours"><RouteIcon data-icon="inline-start" />Tours</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>
<Tabs.Root value="map">
	<Tabs.List>
		<Tabs.Trigger value="map"><MapIcon />Map</Tabs.Trigger>
		<Tabs.Trigger value="list"><ListIcon />List</Tabs.Trigger>
		<Tabs.Trigger value="tours"><RouteIcon />Tours</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>`,

	tabsVertical: `<Tabs.Root value="general" orientation="vertical">
	<Tabs.List>
		<Tabs.Trigger value="general">General</Tabs.Trigger>
		<Tabs.Trigger value="domains">Domains</Tabs.Trigger>
		<Tabs.Trigger value="environment">Environment</Tabs.Trigger>
		<Tabs.Trigger value="members">Members</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="general">Project name, framework preset and the production branch, main.</Tabs.Content>
	<Tabs.Content value="domains">observatory.example and three preview domains.</Tabs.Content>
	<Tabs.Content value="environment">12 variables, 3 of them secret.</Tabs.Content>
	<Tabs.Content value="members">Ines Marlowe, Tomasz Wierzba and 4 others.</Tabs.Content>
</Tabs.Root>`,

	tabsDisabled: `<Tabs.Root value="production">
	<Tabs.List variant="segment">
		<Tabs.Trigger value="production">Production</Tabs.Trigger>
		<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
		<Tabs.Trigger value="staging" disabled>Staging</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>`,

	breadcrumbPlain: `<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item><Breadcrumb.Link href="#breadcrumb">Observatory</Breadcrumb.Link></Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item><Breadcrumb.Link href="#breadcrumb">Deployments</Breadcrumb.Link></Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item><Breadcrumb.Page>dpl_8f3k2q</Breadcrumb.Page></Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>`,

	breadcrumbDropdown: `<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item><Breadcrumb.Link href="#breadcrumb">Observatory</Breadcrumb.Link></Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class="focus-visible:focus-halo flex items-center rounded-sm outline-none" aria-label="Show hidden levels">
					<Breadcrumb.Ellipsis />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="start">
					<DropdownMenu.Group>
						<DropdownMenu.Item>Deployments</DropdownMenu.Item>
						<DropdownMenu.Item>Production</DropdownMenu.Item>
						<DropdownMenu.Item>Frankfurt</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item><Breadcrumb.Page>Build log</Breadcrumb.Page></Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>`,

	breadcrumbSeparator: `<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item><Breadcrumb.Link href="#breadcrumb">atlas-guide</Breadcrumb.Link></Breadcrumb.Item>
		<Breadcrumb.Separator><SlashIcon /></Breadcrumb.Separator>
		<Breadcrumb.Item><Breadcrumb.Link href="#breadcrumb">src</Breadcrumb.Link></Breadcrumb.Item>
		<Breadcrumb.Separator><SlashIcon /></Breadcrumb.Separator>
		<Breadcrumb.Item><Breadcrumb.Page>sculptures.json</Breadcrumb.Page></Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>`,

	breadcrumbResponsive: `<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item><Breadcrumb.Link href="#breadcrumb">Observatory</Breadcrumb.Link></Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item class="sm:hidden">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class="focus-visible:focus-halo flex items-center rounded-sm outline-none" aria-label="Show hidden levels">
					<Breadcrumb.Ellipsis />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="start">
					<DropdownMenu.Group>
						<DropdownMenu.Item>Deployments</DropdownMenu.Item>
						<DropdownMenu.Item>Preview branches</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Breadcrumb.Item>
		<Breadcrumb.Separator class="sm:hidden" />
		<Breadcrumb.Item class="hidden sm:inline-flex"><Breadcrumb.Link href="#breadcrumb">Deployments</Breadcrumb.Link></Breadcrumb.Item>
		<Breadcrumb.Separator class="hidden sm:block" />
		<Breadcrumb.Item class="hidden sm:inline-flex"><Breadcrumb.Link href="#breadcrumb">Preview branches</Breadcrumb.Link></Breadcrumb.Item>
		<Breadcrumb.Separator class="hidden sm:block" />
		<Breadcrumb.Item class="min-w-0">
			<Breadcrumb.Page class="max-w-40 truncate sm:max-w-none">stairs/landing · dpl_2b7c0e</Breadcrumb.Page>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>`,

	paginationPlain: `<Pagination.Root count={50} perPage={10} bind:page={plainPage}>
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item><Pagination.Previous /></Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'page'}
					<Pagination.Item>
						<Pagination.Link {page} isActive={currentPage === page.value}>{page.value}</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item><Pagination.Next /></Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>`,

	paginationMany: `<Pagination.Root count={1284} perPage={20} siblingCount={1} bind:page={manyPage}>
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item><Pagination.Previous /></Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link {page} isActive={currentPage === page.value}>{page.value}</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item><Pagination.Next /></Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>`,

	paginationCompact: `<Pagination.Root count={1284} perPage={20} bind:page={compactPage}>
	{#snippet children({ currentPage })}
		<Pagination.Content>
			<Pagination.Item><Pagination.Previous /></Pagination.Item>
			<Pagination.Item>
				<span class="text-muted-foreground px-2 text-sm tabular-nums">Page {currentPage} of 65</span>
			</Pagination.Item>
			<Pagination.Item><Pagination.Next /></Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>`,

	navSite: `<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Platform</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<ul class="grid w-72 gap-1 sm:w-[32rem] sm:grid-cols-2">
					{#each PLATFORM_LINKS as link (link.title)}
						<li>
							<NavigationMenu.Link href={link.href} class="flex-col items-start gap-1">
								<span class="font-medium">{link.title}</span>
								<span class="text-muted-foreground">{link.note}</span>
							</NavigationMenu.Link>
						</li>
					{/each}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Guides</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<ul class="flex w-60 flex-col gap-1">
					<li><NavigationMenu.Link href="#navigation-menu"><BookOpenIcon />Deploy your first site</NavigationMenu.Link></li>
					<li><NavigationMenu.Link href="#navigation-menu"><GlobeIcon />Connect a domain</NavigationMenu.Link></li>
					<li><NavigationMenu.Link href="#navigation-menu"><GitBranchIcon />Preview every branch</NavigationMenu.Link></li>
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link href="#navigation-menu">Pricing</NavigationMenu.Link>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>`,

	navIndicator: `<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item class="static">
			<NavigationMenu.Trigger>Regions</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<ul class="flex w-64 flex-col gap-1">
					{#each REGION_LINKS as region (region.name)}
						<li>
							<NavigationMenu.Link href={region.href}>
								<MapPinIcon />
								<span class="flex-1">{region.name}</span>
								<span class="text-muted-foreground text-xs tabular-nums">{region.latency}</span>
							</NavigationMenu.Link>
						</li>
					{/each}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item class="static">
			<NavigationMenu.Trigger>Atlas</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<ul class="flex w-56 flex-col gap-1">
					<li><NavigationMenu.Link href="#navigation-menu"><MapIcon />Park map</NavigationMenu.Link></li>
					<li><NavigationMenu.Link href="#navigation-menu"><RouteIcon />Guided tours</NavigationMenu.Link></li>
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Indicator />
	</NavigationMenu.List>
</NavigationMenu.Root>`,

	navNoViewport: `<NavigationMenu.Root viewport={false}>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Account</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<ul class="flex w-48 flex-col gap-1">
					<li><NavigationMenu.Link href="#navigation-menu">Profile</NavigationMenu.Link></li>
					<li><NavigationMenu.Link href="#navigation-menu">Billing</NavigationMenu.Link></li>
					<li><NavigationMenu.Link href="#navigation-menu">Access tokens</NavigationMenu.Link></li>
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link href="#navigation-menu" active>Status</NavigationMenu.Link>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>`,

	sidebar: `{#snippet menu(items: NavItem[])}
	<Sidebar.Menu>
		{#each items as item (item.id)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					isActive={current === item.id}
					tooltipContent={item.label}
					onclick={() => (current = item.id)}
				>
					<item.icon />
					<span>{item.label}</span>
				</Sidebar.MenuButton>
				{#if item.badge}
					<Sidebar.MenuBadge>{item.badge}</Sidebar.MenuBadge>
				{/if}
				{#if item.sub}
					<Sidebar.MenuSub>
						{#each item.sub as sub (sub.id)}
							<Sidebar.MenuSubItem>
								<Sidebar.MenuSubButton isActive={current === sub.id}>
									{#snippet child({ props })}
										<button type="button" {...props} onclick={() => (current = sub.id)}>
											<span>{sub.label}</span>
										</button>
									{/snippet}
								</Sidebar.MenuSubButton>
							</Sidebar.MenuSubItem>
						{/each}
					</Sidebar.MenuSub>
				{/if}
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
{/snippet}

<div class="border-border relative h-[480px] overflow-hidden rounded-lg border [transform:translateZ(0)]">
	<Sidebar.Provider class="relative h-full min-h-0">
		<Sidebar.Root collapsible="icon" class="h-full">
			<Sidebar.Header>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton size="lg" tooltipContent="Observatory">
							<svg width="18" height="20" viewBox="0 0 22 24" aria-hidden="true" class="shrink-0">
								<path d="M11 1 21 6.75v11.5L11 24 1 18.25V6.75Z" fill="var(--face-shadow)" />
								<path d="M11 1 21 6.75 11 12.5 1 6.75Z" fill="var(--face-top)" />
								<path d="M11 12.5 21 6.75v11.5L11 24Z" fill="var(--face-side)" />
							</svg>
							<span class="flex min-w-0 flex-col leading-tight">
								<span class="text-foreground truncate font-medium">Observatory</span>
								<span class="truncate text-xs">observatory.example</span>
							</span>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Header>
			<Sidebar.Content>
				<Sidebar.Group>
					<Sidebar.GroupLabel>Project</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						{@render menu(PROJECT)}
					</Sidebar.GroupContent>
				</Sidebar.Group>
				<Sidebar.Group>
					<Sidebar.GroupLabel>Organisation</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						{@render menu(ORGANISATION)}
					</Sidebar.GroupContent>
				</Sidebar.Group>
			</Sidebar.Content>
			<Sidebar.Footer>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton size="lg" tooltipContent="Ines Marlowe">
							<Avatar.Root>
								<Avatar.Fallback>IM</Avatar.Fallback>
							</Avatar.Root>
							<span class="flex min-w-0 flex-col leading-tight">
								<span class="text-foreground truncate font-medium">Ines Marlowe</span>
								<span class="truncate text-xs">ines@observatory.example</span>
							</span>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Footer>
			<Sidebar.Rail />
		</Sidebar.Root>
		<Sidebar.Inset class="min-w-0">
			<header class="border-border flex h-12 shrink-0 items-center gap-2 border-b px-3">
				<Sidebar.Trigger />
				<Separator orientation="vertical" class="my-3.5" />
				<Breadcrumb.Root class="min-w-0">
					<Breadcrumb.List class="flex-nowrap">
						<Breadcrumb.Item>Observatory</Breadcrumb.Item>
						<Breadcrumb.Separator />
						<Breadcrumb.Item class="min-w-0">
							<Breadcrumb.Page class="truncate">{LABELS[current]}</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</header>
			<div class="flex flex-col gap-2 p-6">
				<h3 class="text-foreground text-lg font-medium">{LABELS[current]}</h3>
				<p class="text-muted-foreground max-w-prose text-sm">{BLURBS[current]}</p>
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
</div>`,

	commandInline: `<Command.Root class="max-w-md">
	<Command.Input placeholder="Search commands" />
	<Command.List>
		<Command.Empty>Nothing matches that search.</Command.Empty>
		<Command.Group heading="Deploy">
			<Command.Item><RocketIcon />Deploy main<Command.Shortcut>⌘D</Command.Shortcut></Command.Item>
			<Command.Item><GitBranchIcon />Deploy a preview branch</Command.Item>
			<Command.Item><RotateCcwIcon />Roll back production<Command.Shortcut>⇧⌘R</Command.Shortcut></Command.Item>
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Settings">
			<Command.Item><GlobeIcon />Domains<Command.Shortcut>⌘,</Command.Shortcut></Command.Item>
			<Command.Item><KeyRoundIcon />Environment variables</Command.Item>
			<Command.Item disabled><CreditCardIcon />Billing</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Root>`,

	commandDialog: `<svelte:window onkeydown={onPaletteKey} />

<Button variant="outline" onclick={() => (paletteOpen = true)}>
	<SearchIcon data-icon="inline-start" />
	Search Observatory
	<Kbd.Group><Kbd.Root>Ctrl</Kbd.Root><Kbd.Root>K</Kbd.Root></Kbd.Group>
</Button>
<Command.Dialog bind:open={paletteOpen} title="Search Observatory" description="Find a page, a deployment or a command">
	<Command.Input placeholder="Search pages, deployments and commands" />
	<Command.List>
		<Command.Empty>Nothing matches that search.</Command.Empty>
		<Command.Group heading="Pages">
			{#each PAGES as page (page.label)}
				<Command.Item onSelect={() => choose(page.label)}><page.icon />{page.label}</Command.Item>
			{/each}
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Recent deployments">
			{#each DEPLOYS as deploy (deploy.id)}
				<Command.Item value={deploy.id + ' ' + deploy.branch} onSelect={() => choose(deploy.id)}>
					<RocketIcon />
					<span class="font-mono">{deploy.id}</span>
					<span class="text-muted-foreground">{deploy.branch}</span>
				</Command.Item>
			{/each}
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Commands">
			<Command.Item onSelect={() => choose('Deploy main')}><RocketIcon />Deploy main<Command.Shortcut>⌘D</Command.Shortcut></Command.Item>
			<Command.Item onSelect={() => choose('Copy install command')}><CopyIcon />Copy install command</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>`
};
