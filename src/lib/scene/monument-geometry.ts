/**
 * Geometry and layout of the monument, in world units (U = 1 tower plan
 * edge). Right-handed, Y up; the iso camera sits on the (+1, +1, +1)
 * diagonal, so +x faces read as right-facing, +z faces as left-facing.
 *
 * The monument is cubes only: two tall towers split by a slot, a key column
 * in the slot, a slim pillar behind, and two stepped blocks. Nothing turns.
 */
import { BoxGeometry, CircleGeometry } from 'three';
import { applyGrainUVs, boxGeometry, GeometryBuilder, type PaintedGeometry, type Vec3 } from './materials.js';

/** Height of the tower tops. */
export const TOP = 1;
/** Towers run far below the frame so they always bleed off the bottom. */
export const BASE = -30;

/* Towers: left on the +z side, right on the -z side of the slot. */
const LEFT = { x0: -1.05, x1: -0.05, z0: 0.05, z1: 1.05 };
const RIGHT = { x0: 0.05, x1: 1.05, z0: -1.05, z1: -0.05 };

/** The key column in the slot, its top a white tile. */
const KEY = { x0: -0.05, x1: 0.17, z0: -0.05, z1: 0.17 };
export const KEY_TOP: Vec3 = [(KEY.x0 + KEY.x1) / 2, TOP, (KEY.z0 + KEY.z1) / 2];

/** The slim pillar behind the right tower, with one cube on top. */
const PILLAR = { x0: 0.3, x1: 0.65, z0: -1.425, z1: -1.075, top: TOP + 1.9 };
const PILLAR_CUBE = 0.22;
export const PILLAR_TOP: Vec3 = [(PILLAR.x0 + PILLAR.x1) / 2, PILLAR.top, (PILLAR.z0 + PILLAR.z1) / 2];

/** A cube resting on the left tower's far corner. */
const LEFT_CUBE = { x0: -0.95, x1: -0.55, z0: 0.65, z1: 1.05, top: TOP + 0.4 };
/** Right block behind the pillar with a stepped top. */
const RIGHT_BLOCK = { x0: 0.78, x1: 1.2, z0: -1.85, z1: -1.45, top: TOP + 0.55 };
/** Short post behind the left tower with an L-shaped raised top. */
const LEFT_POST = { x0: -1.0, x1: -0.6, z0: -0.45, z1: -0.05, top: TOP + 0.4 };

/** Where the optional sun disc is centred: just above the right tower. */
export const SUN_ANCHOR: Vec3 = [0.55, TOP + 0.45, -0.55];
export const SUN_RADIUS = 1.6;

/** World-space boxes that bound the visible upper part, used for framing. */
export const ISO_BOUNDS: [Vec3, Vec3][] = [
	[[LEFT.x0, TOP - 0.6, LEFT.z0], [LEFT.x1, TOP, LEFT.z1]],
	[[RIGHT.x0, TOP - 0.6, RIGHT.z0], [RIGHT.x1, TOP, RIGHT.z1]],
	[[LEFT_CUBE.x0, TOP, LEFT_CUBE.z0], [LEFT_CUBE.x1, LEFT_CUBE.top, LEFT_CUBE.z1]],
	[[RIGHT_BLOCK.x0, TOP, RIGHT_BLOCK.z0], [RIGHT_BLOCK.x1, RIGHT_BLOCK.top + 0.3, RIGHT_BLOCK.z1]],
	[
		[PILLAR.x0, TOP, PILLAR.z0],
		[PILLAR.x1, PILLAR.top + PILLAR_CUBE + 0.3, PILLAR.z1]
	]
];

/* ------------------------------------------------------------ poster shapes */

/** Shapes that only line up as a composition in the flat (side) view. */
export const POSTER = {
	/** A long bar crossing behind the towers, high enough to clear the page's title. */
	bar: { x: -1.7, y: 1.45, h: 0.25, length: 14 },
	disc: { x: -2.6, y: 2.75, z: 1.75, r: 0.5 },
	block: { x: 1.9, y0: -1.55, z0: -2.55, z1: -1.65, depth: 0.2, bands: [2, 1, 2, 6], h: 1.1 }
};

export const FLAT_BOUNDS: [Vec3, Vec3][] = [
	...ISO_BOUNDS,
	[[POSTER.disc.x, POSTER.disc.y - POSTER.disc.r, POSTER.disc.z - POSTER.disc.r], [POSTER.disc.x, POSTER.disc.y + POSTER.disc.r, POSTER.disc.z + POSTER.disc.r]],
	[[POSTER.block.x, POSTER.block.y0, POSTER.block.z0], [POSTER.block.x, POSTER.block.y0 + POSTER.block.h, POSTER.block.z1]]
];

/* ------------------------------------------------------------------ builders */

function buildStatic(): PaintedGeometry {
	const b = new GeometryBuilder();

	// The two towers and the key column in the slot between them.
	b.add(boxGeometry([LEFT.x0, BASE, LEFT.z0], [LEFT.x1, TOP, LEFT.z1]));
	b.add(boxGeometry([RIGHT.x0, BASE, RIGHT.z0], [RIGHT.x1, TOP, RIGHT.z1]));
	b.add(boxGeometry([KEY.x0, BASE, KEY.z0], [KEY.x1, TOP, KEY.z1]), { top: 'tile' });

	// A cube on the left tower.
	const lc = LEFT_CUBE;
	b.add(boxGeometry([lc.x0, TOP, lc.z0], [lc.x1, lc.top, lc.z1]));

	// The pillar and the cube on its top.
	b.add(boxGeometry([PILLAR.x0, BASE, PILLAR.z0], [PILLAR.x1, PILLAR.top, PILLAR.z1]));
	const h = PILLAR_CUBE / 2;
	b.add(
		boxGeometry(
			[PILLAR_TOP[0] - h, PILLAR.top, PILLAR_TOP[2] - h],
			[PILLAR_TOP[0] + h, PILLAR.top + PILLAR_CUBE, PILLAR_TOP[2] + h]
		),
		{ top: 'tile' }
	);

	// Right block behind the pillar with a stepped top.
	const rb = RIGHT_BLOCK;
	const rbMidX = (rb.x0 + rb.x1) / 2;
	const rbMidZ = (rb.z0 + rb.z1) / 2;
	b.add(boxGeometry([rb.x0, BASE, rb.z0], [rb.x1, rb.top, rb.z1]));
	b.add(boxGeometry([rb.x0, rb.top, rb.z0], [rbMidX, rb.top + 0.28, rbMidZ]));
	b.add(boxGeometry([rbMidX, rb.top, rbMidZ], [rb.x1, rb.top + 0.14, rb.z1]));

	// Short post behind the left tower with an L-shaped raised top.
	const lp = LEFT_POST;
	const lpMidX = (lp.x0 + lp.x1) / 2;
	const lpMidZ = (lp.z0 + lp.z1) / 2;
	b.add(boxGeometry([lp.x0, BASE, lp.z0], [lp.x1, lp.top, lp.z1]));
	b.add(boxGeometry([lp.x0, lp.top, lp.z0], [lpMidX, lp.top + 0.22, lp.z1]));
	b.add(boxGeometry([lpMidX, lp.top, lp.z0], [lp.x1, lp.top + 0.22, lpMidZ]));

	return b.build();
}

export interface PosterGeometries {
	barTop: ReturnType<typeof applyGrainUVs>;
	barBottom: ReturnType<typeof applyGrainUVs>;
	disc: ReturnType<typeof applyGrainUVs>;
	bands: { geometry: ReturnType<typeof applyGrainUVs>; color: 'accentOrange' | 'accentYellow' }[];
}

function buildPosters(): PosterGeometries {
	const { bar, disc, block } = POSTER;
	const half = bar.h / 2;
	const barTop = applyGrainUVs(
		boxGeometry([bar.x - half, bar.y, -bar.length / 2], [bar.x + half, bar.y + half, bar.length / 2])
	);
	const barBottom = applyGrainUVs(
		boxGeometry([bar.x - half, bar.y - half, -bar.length / 2], [bar.x + half, bar.y, bar.length / 2])
	);
	const circle = new CircleGeometry(disc.r, 64);
	circle.rotateY(Math.PI / 2);
	circle.translate(disc.x, disc.y, disc.z);

	const total = block.bands.reduce((s, n) => s + n, 0);
	let y = block.y0 + block.h;
	const bands = block.bands.map((n, i) => {
		const bandH = (n / total) * block.h;
		const geometry = applyGrainUVs(
			new BoxGeometry(block.depth, bandH, block.z1 - block.z0).translate(
				block.x,
				y - bandH / 2,
				(block.z0 + block.z1) / 2
			)
		);
		y -= bandH;
		return { geometry, color: i % 2 === 0 ? ('accentOrange' as const) : ('accentYellow' as const) };
	});
	return { barTop, barBottom, disc: applyGrainUVs(circle), bands };
}

export interface MonumentGeometry {
	stone: PaintedGeometry;
	posters: PosterGeometries;
	dispose(): void;
}

/** Builds every geometry of the monument. Browser or server safe. */
export function buildMonumentGeometry(): MonumentGeometry {
	const stone = buildStatic();
	const posters = buildPosters();
	return {
		stone,
		posters,
		dispose() {
			stone.dispose();
			posters.barTop.dispose();
			posters.barBottom.dispose();
			posters.disc.dispose();
			for (const band of posters.bands) band.geometry.dispose();
		}
	};
}
