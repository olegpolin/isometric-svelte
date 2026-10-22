/**
 * Colours used by the hero scene. Every value is a hex string (`#rrggbb`),
 * because three.js cannot parse modern CSS colour syntaxes such as `oklch()`.
 */
export interface ScenePalette {
	/** Top faces of the stone blocks (the lightest tone). */
	top: string;
	/** Right-facing sides (mid tone). */
	light: string;
	/** Left-facing sides (darkest tone). */
	shadow: string;
	/** The key tile and the light stair stripes. */
	tile: string;
	/** Rivet holes, the figure's head, fine dark details. */
	ink: string;
	/** Optional background disc. */
	sun: string;
	/** Porthole lamps on the corner caps. */
	lamp: string;
	/** The emblem above the pillar. */
	emblem: string;
	/** The small figure on the key tile. */
	accentWarm: string;
	/** Upper half of the long poster bar (flat view only). */
	accentRed: string;
	/** Lower half of the long poster bar (flat view only). */
	accentRedDark: string;
	/** Poster disc (flat view only). */
	accentBlue: string;
	/** Poster stripes (flat view only). */
	accentOrange: string;
	/** Poster stripes (flat view only). */
	accentYellow: string;
}

export const DEFAULT_SCENE_PALETTE: ScenePalette = {
	top: '#bbbbbb',
	light: '#9b9b9b',
	shadow: '#484a49',
	tile: '#ffffff',
	ink: '#1f2328',
	sun: '#fece00',
	lamp: '#ffd23c',
	emblem: '#fff3a8',
	accentWarm: '#ff6a3d',
	accentRed: '#e24647',
	accentRedDark: '#aa3233',
	accentBlue: '#245bb6',
	accentOrange: '#ff793c',
	accentYellow: '#ffd54d'
};

/** CSS custom property read for each palette key by `readScenePalette`. */
export const SCENE_PALETTE_CSS_VARS: Record<keyof ScenePalette, string> = {
	top: '--scene-top',
	light: '--scene-light',
	shadow: '--scene-shadow',
	tile: '--scene-tile',
	ink: '--scene-ink',
	sun: '--scene-sun',
	lamp: '--scene-lamp',
	emblem: '--scene-emblem',
	accentWarm: '--scene-accent-warm',
	accentRed: '--scene-accent-red',
	accentRedDark: '--scene-accent-red-dark',
	accentBlue: '--scene-accent-blue',
	accentOrange: '--scene-accent-orange',
	accentYellow: '--scene-accent-yellow'
};

let scratch: CanvasRenderingContext2D | null | undefined;

function toHexByte(n: number) {
	return n.toString(16).padStart(2, '0');
}

/**
 * Converts any CSS colour string the browser understands (hex, rgb(), hsl(),
 * oklch(), named colours, ...) to `#rrggbb` by painting one pixel on a 2D
 * canvas. Transparency is dropped. Browser only; returns the input unchanged
 * when no canvas is available.
 */
export function cssColorToHex(value: string): string {
	if (typeof document === 'undefined') return value;
	if (scratch === undefined) {
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = 1;
		scratch = canvas.getContext('2d', { willReadFrequently: true });
	}
	if (!scratch) return value;

	scratch.clearRect(0, 0, 1, 1);
	// Reset first so an unparsable value does not inherit the previous colour.
	scratch.fillStyle = '#000000';
	scratch.fillStyle = value.trim();
	scratch.fillRect(0, 0, 1, 1);
	const [r, g, b] = scratch.getImageData(0, 0, 1, 1).data;
	return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}

/**
 * Reads the scene palette from CSS custom properties (`--scene-top`,
 * `--scene-light`, ...) on `el`, falling back to `DEFAULT_SCENE_PALETTE` for
 * any property that is not set. Browser only.
 */
export function readScenePalette(el: Element = document.documentElement): ScenePalette {
	const style = getComputedStyle(el);
	const palette = { ...DEFAULT_SCENE_PALETTE };
	for (const key of Object.keys(SCENE_PALETTE_CSS_VARS) as (keyof ScenePalette)[]) {
		const raw = style.getPropertyValue(SCENE_PALETTE_CSS_VARS[key]).trim();
		if (raw) palette[key] = cssColorToHex(raw);
	}
	return palette;
}
