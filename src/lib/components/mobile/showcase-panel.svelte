<script lang="ts">
	import { page } from '$app/state';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { ThemeMenu, Wordmark } from '#lib/components/app/index.js';
	import { cn } from '#lib/utils.js';
	import { SCREENS, isCurrentScreen } from './atlas.svelte.js';

	/**
	 * The small panel beside the phone: what this is, the four screens as links, the theme menu
	 * and the way back to the site. Left of the phone from 1100px, above it from 640px.
	 */
	let { class: className }: { class?: string } = $props();
</script>

<aside
	aria-label="About this showcase"
	data-slot="showcase-panel"
	class={cn(
		'hidden w-full max-w-[560px] grid-cols-2 gap-x-10 gap-y-5 min-[640px]:grid min-[1100px]:flex min-[1100px]:w-60 min-[1100px]:flex-col min-[1100px]:gap-10',
		className
	)}
>
	<div class="flex flex-col gap-4">
		<a href="/" class="focus-visible:focus-halo w-fit rounded-sm outline-none" aria-label="Isometric, home">
			<Wordmark />
		</a>
		<p class="text-muted-foreground text-sm">
			Atlas, a guide to an invented sculpture park, built only from the components in this library.
		</p>
	</div>

	<nav aria-label="Atlas screens" class="row-span-2 flex flex-col gap-2">
		<span class="type-label text-muted-foreground">Screens</span>
		<ul class="flex flex-col">
			{#each SCREENS as screen (screen.href)}
				{@const current = isCurrentScreen(page.url.pathname, screen.href)}
				<li>
					<a
						href={screen.href}
						aria-current={current ? 'page' : undefined}
						class="type-label text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground focus-visible:focus-halo -mx-2 flex h-11 items-center gap-3 rounded-md px-2 outline-none transition-colors duration-(--dur-1) ease-out"
					>
						<span
							aria-hidden="true"
							class={cn(
								'bg-primary size-1.5 rounded-full transition-transform duration-(--dur-2) ease-settle',
								current ? 'scale-100' : 'scale-0'
							)}
						></span>
						{screen.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="flex items-center gap-2 self-end min-[1100px]:self-auto">
		<ThemeMenu />
		<a
			href="/"
			class="type-label text-muted-foreground hover:text-foreground focus-visible:focus-halo flex h-11 items-center gap-2 rounded-md px-2 outline-none transition-colors duration-(--dur-1) ease-out"
		>
			<ArrowLeftIcon class="size-4" aria-hidden="true" />
			Back to the site
		</a>
	</div>
</aside>
