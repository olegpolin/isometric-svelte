import { createContext } from 'svelte';
import SunriseIcon from '@lucide/svelte/icons/sunrise';
import ShapesIcon from '@lucide/svelte/icons/shapes';
import TicketIcon from '@lucide/svelte/icons/ticket';
import CircleUserIcon from '@lucide/svelte/icons/circle-user';

/** The four screens of Atlas, shared by the tab bar and the showcase panel. */
export const SCREENS = [
	{ href: '/mobile', label: 'Today', icon: SunriseIcon },
	{ href: '/mobile/collection', label: 'Collection', icon: ShapesIcon },
	{ href: '/mobile/visit', label: 'Visit', icon: TicketIcon },
	{ href: '/mobile/you', label: 'You', icon: CircleUserIcon }
] as const;

/** `/mobile` matches only itself; the others also match their sub-paths. */
export function isCurrentScreen(pathname: string, href: string) {
	const path = pathname.replace(/\/+$/, '') || '/';
	return href === '/mobile' ? path === href : path === href || path.startsWith(`${href}/`);
}

/**
 * The visitor's settings on the You screen. They live for the session in the mobile layout, so
 * switching screens keeps them, and "Reduce motion" also turns off the screen cross-fade.
 */
export class AtlasPrefs {
	notifications = $state(true);
	audioGuide = $state(false);
	reduceMotion = $state(false);
	language = $state('en');
}

export const [getAtlasPrefs, setAtlasPrefs] = createContext<AtlasPrefs>();
