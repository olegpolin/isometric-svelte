/**
 * Geometry and layout of the monument, in world units (U = 1 bar thickness).
 * Right-handed, Y up; the iso camera sits on the (+1, +1, +1) diagonal, so
 * +x faces read as right-facing, +z faces as left-facing.
 *
 * The monument is an impossible triangle built from real boxes. Two towers
 * stand a distance apart along z. A lintel joins their tops along z, and a
 * beam leaves the far tower's top along x. The beam's last unit sits at
 * (L-1, L-1, L-1), which the isometric camera projects onto the near tower
 * one unit above its "base" at (0, 0, 0): on screen the beam plunges into
 * the tower it never reaches. From any other angle, the scroll's flat
 * elevation included, the figure comes apart into a plain gate.
 */
import { CircleGeometry } from 'three';
import { applyGrainUVs, boxGeometry, GeometryBuilder, type PaintedGeometry, type Vec3 } from './materials.js';

/** Side of the triangle, in bar thicknesses. */
export const L = 4.6;
/** Height of the tower tops. */
export const TOP = L;
/** Towers run far below the frame so they always bleed off the bottom. */
export const BASE = -30;

/** The near tower (screen right in the iso view) and the far tower (screen left). */
const NEAR = { x0: 0, x1: 1, z0: 0, z1: 1 };
const FAR = { x0: 0, x1: 1, z0: L - 1, z1: L };

/** Where the optional sun disc is centred: inside the triangle, and inside the gate when flat. */
export const SUN_ANCHOR: Vec3 = [0.5, L * 0.56, L / 2];
export const SUN_RADIUS = 1.6;

/** World-space boxes that bound the visible upper part, used for framing. */
export const ISO_BOUNDS: [Vec3, Vec3][] = [
	[[NEAR.x0, -0.6, NEAR.z0], [NEAR.x1, TOP, NEAR.z1]],
	[[FAR.x0, -0.6, FAR.z0], [FAR.x1, TOP, FAR.z1]],
	[[0, L - 1, 0], [1, L, L]],
	[[0, L - 1, L - 1], [L, L, L]]
];

/* ------------------------------------------------------------ poster shapes */

/** Shapes that only line up as a composition in the flat (side) view. */
export const POSTER = {
	/** A long bar crossing behind the gate in its upper third, above the page's title. */
	bar: { x: -1.7, y: L * 0.66, h: 0.25, length: 14 },
	/** A disc beyond the far tower, just below the lintel's height. */
	disc: { x: -2.6, y: L - 0.9, z: L + 1.4, r: 0.5 }
};

export const FLAT_BOUNDS: [Vec3, Vec3][] = [
	...ISO_BOUNDS,
	[[POSTER.disc.x, POSTER.disc.y - POSTER.disc.r, POSTER.disc.z - POSTER.disc.r], [POSTER.disc.x, POSTER.disc.y + POSTER.disc.r, POSTER.disc.z + POSTER.disc.r]]
];

/* ------------------------------------------------------------------ builders */

function buildStatic(): PaintedGeometry {
	const b = new GeometryBuilder();

	// The towers stop one unit short of the top; the lintel and the beam supply the top units.
	b.add(boxGeometry([NEAR.x0, BASE, NEAR.z0], [NEAR.x1, L - 1, NEAR.z1]));
	b.add(boxGeometry([FAR.x0, BASE, FAR.z0], [FAR.x1, L - 1, FAR.z1]));

	// Lintel along z from the near tower to the far tower (its last unit belongs to the beam).
	b.add(boxGeometry([0, L - 1, 0], [1, L, L - 1]));

	// Beam along x from the far tower's top. Its end lands, on screen, on the near tower.
	b.add(boxGeometry([0, L - 1, L - 1], [L, L, L]));

	return b.build();
}

export interface PosterGeometries {
	barTop: ReturnType<typeof applyGrainUVs>;
	barBottom: ReturnType<typeof applyGrainUVs>;
	disc: ReturnType<typeof applyGrainUVs>;
}

function buildPosters(): PosterGeometries {
	const { bar, disc } = POSTER;
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
	return { barTop, barBottom, disc: applyGrainUVs(circle) };
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
		}
	};
}
