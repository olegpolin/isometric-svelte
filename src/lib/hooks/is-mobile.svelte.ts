import { MediaQuery } from "svelte/reactivity";

const DEFAULT_MOBILE_BREAKPOINT = 768;

/**
 * Whether the viewport is narrower than `breakpoint`. On the server, and during the hydration
 * render, this is always `false` so the client renders the same markup the server sent. The real
 * media query takes over once the component has mounted.
 */
export class IsMobile {
	#query: MediaQuery;
	#mounted = $state(false);

	constructor(breakpoint: number = DEFAULT_MOBILE_BREAKPOINT) {
		this.#query = new MediaQuery(`max-width: ${breakpoint - 1}px`);
		$effect(() => {
			this.#mounted = true;
		});
	}

	get current(): boolean {
		return this.#mounted && this.#query.current;
	}
}
