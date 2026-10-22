<script lang="ts">
	import { page } from '$app/state';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import GithubIcon from '@lucide/svelte/icons/github';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import { cn } from '#lib/utils.js';
	import ThemeMenu from './theme-menu.svelte';
	import Wordmark from './wordmark.svelte';

	/**
	 * Site header. `overlay` lays it over a colour field (the landing page): no background, no
	 * hairline, text in the field's foreground. The current destination is marked by a small
	 * primary dot under its label, the brightest thing in the bar.
	 */
	let { overlay = false }: { overlay?: boolean } = $props();

	const destinations = [
		{ href: '/components', label: 'Components' },
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/mobile', label: 'Mobile' }
	];

	let pathname = $derived(page.url.pathname.replace(/\/+$/, '') || '/');
	const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

	let menuOpen = $state(false);
</script>

<header
	data-slot="site-header"
	class={cn(
		'z-40 w-full',
		overlay
			? 'text-field-foreground absolute inset-x-0 top-0'
			: 'bg-background/95 text-foreground border-border sticky top-0 border-b'
	)}
>
	<div class="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
		<a href="/" class="focus-visible:focus-halo rounded-sm outline-none" aria-label="Isometric, home">
			<Wordmark class={overlay ? 'text-field-foreground [&_span]:text-field-foreground' : ''} />
		</a>

		<nav aria-label="Primary" class="hidden items-center gap-1 md:flex">
			{#each destinations as d (d.href)}
				<a
					href={d.href}
					aria-current={isCurrent(d.href) ? 'page' : undefined}
					class={cn(
						'type-label focus-visible:focus-halo relative rounded-sm px-3 py-2 outline-none transition-colors duration-(--dur-1) ease-out',
						overlay
							? 'text-field-foreground/80 hover:text-field-foreground aria-[current=page]:text-field-foreground'
							: 'text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground'
					)}
				>
					{d.label}
					<span
						aria-hidden="true"
						class={cn(
							'absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full transition-transform duration-(--dur-2) ease-settle',
							overlay ? 'bg-field-foreground' : 'bg-primary',
							isCurrent(d.href) ? 'scale-100' : 'scale-0'
						)}
					></span>
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-1">
			<Button
				href="https://github.com/olegpolin/isometric-svelte"
				variant="ghost"
				size="icon-round"
				aria-label="Source on GitHub"
				class={overlay ? 'text-field-foreground hover:bg-field-foreground/10' : ''}
			>
				<GithubIcon />
			</Button>
			<ThemeMenu class={overlay ? 'text-field-foreground hover:bg-field-foreground/10' : ''} />
			<Sheet.Root bind:open={menuOpen}>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="ghost"
							size="icon-round"
							class={cn('md:hidden', overlay && 'text-field-foreground hover:bg-field-foreground/10')}
							aria-label="Open navigation"
						>
							<MenuIcon />
						</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content side="right" class="w-72">
					<Sheet.Header>
						<Sheet.Title><Wordmark /></Sheet.Title>
						<Sheet.Description class="sr-only">Site navigation</Sheet.Description>
					</Sheet.Header>
					<nav aria-label="Primary" class="flex flex-col px-2">
						{#each destinations as d (d.href)}
							<a
								href={d.href}
								aria-current={isCurrent(d.href) ? 'page' : undefined}
								onclick={() => (menuOpen = false)}
								class="type-label text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground focus-visible:focus-halo flex h-11 items-center gap-3 rounded-md px-3 outline-none"
							>
								<span
									aria-hidden="true"
									class={cn('bg-primary size-1.5 rounded-full', !isCurrent(d.href) && 'opacity-0')}
								></span>
								{d.label}
							</a>
						{/each}
					</nav>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>
</header>
