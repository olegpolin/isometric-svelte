/**
 * The six palettes. Each one re-tints `--primary`, `--signal`, `--field` and the scene tones
 * through `[data-theme]` in src/routes/layout.css; mode-watcher persists the choice.
 */
export const PALETTES = [
	{ id: 'sun', name: 'Sun', note: 'Yellow field, blue signal' },
	{ id: 'ember', name: 'Ember', note: 'Signal red, straw signal' },
	{ id: 'lagoon', name: 'Lagoon', note: 'Teal field, coral signal' },
	{ id: 'dusk', name: 'Dusk', note: 'Indigo field, coral signal' },
	{ id: 'moss', name: 'Moss', note: 'Emerald field, blossom signal' },
	{ id: 'coral', name: 'Coral', note: 'Coral field, periwinkle signal' }
] as const;

export type PaletteId = (typeof PALETTES)[number]['id'];

export const DEFAULT_PALETTE: PaletteId = 'sun';

export function isPaletteId(value: unknown): value is PaletteId {
	return PALETTES.some((p) => p.id === value);
}
