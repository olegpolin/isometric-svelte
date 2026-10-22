<script lang="ts">
	import ChartLineIcon from '@lucide/svelte/icons/chart-line';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import LayoutGridIcon from '@lucide/svelte/icons/layout-grid';
	import RocketIcon from '@lucide/svelte/icons/rocket';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import UsersIcon from '@lucide/svelte/icons/users';
	import { Progress } from '#lib/components/ui/progress/index.js';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import { cn } from '#lib/utils.js';
	import { CYCLE } from './data.js';

	/**
	 * The console's own navigation. It sits below the site header and stays in view while the page
	 * scrolls; under md it becomes a sheet, and it collapses to icons on request.
	 */
	let { class: className }: { class?: string } = $props();

	const sidebar = Sidebar.useSidebar();

	const project = [
		{ label: 'Overview', href: '#overview', icon: LayoutGridIcon, active: true },
		{ label: 'Deployments', href: '#deployments', icon: RocketIcon },
		{ label: 'Domains', href: '#domains', icon: GlobeIcon },
		{ label: 'Analytics', href: '#traffic', icon: ChartLineIcon }
	];
	const organisation = [
		{ label: 'Team', href: '#team', icon: UsersIcon },
		{ label: 'Settings', href: '/#in-use-title', icon: SettingsIcon }
	];

	const { used, included, daysLeft } = CYCLE;

	function close() {
		if (sidebar.isMobile) sidebar.setOpenMobile(false);
	}
</script>

{#snippet nav(items: typeof project)}
	<Sidebar.Menu>
		{#each items as item (item.label)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton isActive={item.active} tooltipContent={item.label}>
					{#snippet child({ props })}
						<a href={item.href} aria-current={item.active ? 'page' : undefined} onclick={close} {...props}>
							<item.icon />
							<span>{item.label}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
{/snippet}

<Sidebar.Root
	collapsible="icon"
	class={cn('md:sticky md:top-14 md:bottom-auto md:h-[calc(100svh-3.5rem)]', className)}
>
	<Sidebar.Header class="border-sidebar-border h-14 justify-center border-b px-3 group-data-[collapsible=icon]:px-2">
		<div class="flex min-w-0 items-center gap-2.5">
			<svg width="18" height="20" viewBox="0 0 22 24" aria-hidden="true" class="shrink-0 group-data-[collapsible=icon]:mx-auto">
				<path d="M11 1 21 6.75v11.5L11 24 1 18.25V6.75Z" fill="var(--face-shadow)" />
				<path d="M11 1 21 6.75 11 12.5 1 6.75Z" fill="var(--face-top)" />
				<path d="M11 12.5 21 6.75v11.5L11 24Z" fill="var(--face-side)" />
			</svg>
			<div class="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
				<span class="text-foreground truncate text-sm font-medium">Observatory</span>
				<span class="text-muted-foreground truncate text-xs">observatory.example</span>
			</div>
		</div>
	</Sidebar.Header>

	<Sidebar.Content class="pt-2">
		<Sidebar.Group>
			<Sidebar.GroupLabel>Project</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				{@render nav(project)}
			</Sidebar.GroupContent>
		</Sidebar.Group>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Organisation</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				{@render nav(organisation)}
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer class="border-sidebar-border border-t p-4 group-data-[collapsible=icon]:hidden">
		<div class="flex flex-col gap-2">
			<div class="flex items-baseline justify-between gap-2">
				<span class="type-label text-muted-foreground">Build minutes</span>
				<span class="text-muted-foreground text-xs tabular-nums">{daysLeft} days left</span>
			</div>
			<Progress value={used} max={included} aria-label="Build minutes used this cycle" />
			<p class="text-muted-foreground text-xs">
				<span class="text-foreground tabular-nums">{used}</span> of
				<span class="tabular-nums">{included}</span> included minutes used
			</p>
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
