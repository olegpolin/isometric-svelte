<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { SiteHeader, SiteFooter } from '#lib/components/app/index.js';
	import { Toaster } from '#lib/components/ui/sonner/index.js';
	import type { LayoutProps } from './$types';

	/**
	 * The showcase shell: header, page, footer. On the landing page the header lays over the hero's
	 * colour field. Route changes cross-fade through the View Transitions API, to the page field
	 * rather than to black; the header and footer stay put.
	 */
	let { children }: LayoutProps = $props();

	let landing = $derived(page.url.pathname === '/');

	onNavigate((navigation) => {
		if (!document.startViewTransition || navigation.shallow) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete.catch(() => {});
			});
		});
	});
</script>

<div class="flex min-h-dvh flex-col">
	<SiteHeader overlay={landing} />
	<main id="main" class="page flex flex-1 flex-col">
		{@render children()}
	</main>
	<SiteFooter />
</div>

<Toaster />

<style>
	.page {
		view-transition-name: page;
	}
	:global(::view-transition-old(page)) {
		animation: var(--dur-3) var(--ease-exit) both page-out;
	}
	:global(::view-transition-new(page)) {
		animation: var(--dur-3) var(--ease-enter) both page-in;
	}
	@keyframes page-out {
		to {
			opacity: 0;
		}
	}
	@keyframes page-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
</style>
