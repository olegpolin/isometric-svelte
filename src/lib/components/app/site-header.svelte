<script lang="ts">
	import { page } from '$app/state';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import { cn } from '#lib/utils.js';
	import ThemeMenu from './theme-menu.svelte';
	import Wordmark from './wordmark.svelte';
	import { heroState } from '#lib/theme/hero-state.svelte.js';

	/**
	 * Site header. It sticks to the top of the viewport. `overlay` lays it over a colour field (the
	 * landing page) with no background and no hairline, pulling the page up underneath it. The current destination is marked by a small
	 * primary dot under its label, the brightest thing in the bar.
	 */
	let { overlay: overlayProp = false }: { overlay?: boolean } = $props();

	/** Over the hero's flat view the field is paper, so the header reads as if it were not overlaid. */
	let overlay = $derived(overlayProp && !heroState.flat);
	/** The landing header always pulls the page up underneath it, so the layout never shifts. */
	let floating = $derived(overlayProp);
	/** It gains its background and hairline once the reader has scrolled through the hero. */
	let solid = $derived(!overlayProp || heroState.done);

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
		'sticky top-0 z-40 w-full transition-[background-color,border-color] duration-(--dur-2) ease-out',
		floating && '-mb-14',
		solid ? 'bg-background/95 border-border border-b' : 'border-b border-transparent',
		overlay ? 'text-field-foreground' : 'text-foreground'
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
			<a
				href="https://github.com/olegpolin/isometric-svelte"
				target="_blank"
				rel="noopener"
				class={cn(
					'type-label focus-visible:focus-halo hidden rounded-sm px-3 py-2 outline-none transition-colors duration-(--dur-1) ease-out sm:inline-flex',
					overlay ? 'text-field-foreground/80 hover:text-field-foreground' : 'text-muted-foreground hover:text-foreground'
				)}
			>
				Source
			</a>
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
