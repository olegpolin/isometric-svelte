<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '#lib/utils.js';
	import { SCREENS, isCurrentScreen } from './atlas.svelte.js';

	/**
	 * Atlas's bottom tab bar: four plain links. The current one is marked by the primary dot above
	 * its icon and full-strength ink; the rest stay muted.
	 */
	let { class: className }: { class?: string } = $props();
</script>

<nav
	aria-label="Atlas"
	data-slot="tab-bar"
	class={cn('border-border bg-background shrink-0 border-t pb-[env(safe-area-inset-bottom)] sm:pb-5', className)}
>
	<ul class="grid grid-cols-4 px-2">
		{#each SCREENS as screen (screen.href)}
			{@const current = isCurrentScreen(page.url.pathname, screen.href)}
			<li class="flex">
				<a
					href={screen.href}
					aria-current={current ? 'page' : undefined}
					class="text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground focus-visible:focus-halo flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-md pt-1 pb-1.5 outline-none transition-colors duration-(--dur-1) ease-out"
				>
					<span
						aria-hidden="true"
						class={cn(
							'bg-primary size-1 rounded-full transition-transform duration-(--dur-2) ease-settle',
							current ? 'scale-100' : 'scale-0'
						)}
					></span>
					<screen.icon class="size-5" aria-hidden="true" />
					<span class="type-label text-[0.6875rem]">{screen.label}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
