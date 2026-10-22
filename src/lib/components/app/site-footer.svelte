<script lang="ts">
	import Wordmark from './wordmark.svelte';

	const links = [
		{ href: '/components', label: 'Components' },
		{ href: '/components/foundations', label: 'Foundations' },
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/mobile', label: 'Mobile' },
		{ href: 'https://github.com/olegpolin/isometric-svelte', label: 'Source' }
	];
</script>

<footer data-slot="site-footer" class="border-border text-foreground border-t">
	<div
		class="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-10"
	>
		<div class="flex max-w-sm flex-col gap-3">
			<Wordmark />
			<p class="text-muted-foreground text-sm">
				A component library and showcase for Svelte 5, Tailwind 4 and shadcn-svelte. Every component
				here is source you can copy.
			</p>
		</div>
		<nav aria-label="Footer" class="flex flex-wrap gap-x-6 gap-y-2">
			{#each links as l (l.href)}
				<a
					href={l.href}
					class="type-label text-muted-foreground hover:text-foreground focus-visible:focus-halo rounded-sm py-1 outline-none transition-colors duration-(--dur-1) ease-out"
				>
					{l.label}
				</a>
			{/each}
		</nav>
	</div>
</footer>
