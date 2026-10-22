<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { Toaster } from '#lib/components/ui/sonner/index.js';
	import {
		AtlasPrefs,
		PhoneFrame,
		SCREENS,
		ShowcasePanel,
		TabBar,
		isCurrentScreen,
		setAtlasPrefs
	} from '#lib/components/mobile/index.js';
	import type { LayoutProps } from './$types';

	/**
	 * The mobile showcase. It sits outside the `(app)` group, so there is no site header or footer:
	 * on wide screens a phone stands on the page field beside a small panel; on phones the app is
	 * the whole viewport. Screens cross-fade inside the phone, keyed on the pathname.
	 */
	let { children }: LayoutProps = $props();

	const prefs = setAtlasPrefs(new AtlasPrefs());

	let scroller = $state<HTMLElement | null>(null);

	let pathname = $derived(page.url.pathname);
	let screen = $derived(SCREENS.find((s) => isCurrentScreen(pathname, s.href)));
	let duration = $derived(prefersReducedMotion.current || prefs.reduceMotion ? 0 : 200);

	afterNavigate(({ type }) => {
		if (type !== 'enter') scroller?.scrollTo({ top: 0 });
	});
</script>

<svelte:head>
	<title>{screen ? `${screen.label} · Atlas` : 'Atlas'} · Isometric</title>
</svelte:head>

<div
	class="bg-background dark:field-pool flex min-h-dvh flex-col items-center min-[640px]:gap-8 min-[640px]:px-6 min-[640px]:py-10 min-[1100px]:flex-row min-[1100px]:justify-center min-[1100px]:gap-20 min-[1100px]:py-3"
>
	<ShowcasePanel />

	<PhoneFrame bind:scroller label="Atlas, a sculpture park guide">
		<div class="grid grid-cols-1">
			{#key pathname}
				<div
					class="col-start-1 row-start-1 min-w-0"
					in:fade={{ duration, easing: cubicOut }}
					out:fade={{ duration, easing: cubicOut }}
				>
					{@render children()}
				</div>
			{/key}
		</div>

		{#snippet chrome()}
			<TabBar />
			<Toaster position="top-center" offset={{ top: 56 }} mobileOffset={{ top: 16 }} />
		{/snippet}
	</PhoneFrame>
</div>
