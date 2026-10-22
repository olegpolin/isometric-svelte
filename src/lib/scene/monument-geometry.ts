/**
 * Geometry and layout of the monument, in world units (U = 1 tower plan
 * edge). Right-handed, Y up; the iso camera sits on the (+1, +1, +1)
 * diagonal, so +x faces read as right-facing, +z faces as left-facing.
 */
import { BoxGeometry, CircleGeometry, ConeGeometry, Matrix4, Shape, SphereGeometry } from 'three';
import {
	applyGrainUVs,
	boxGeometry,
	extrudeProfile,
	GeometryBuilder,
	plateGeometry,
	washerGeometries,
	type PaintedGeometry,
	type Vec3
} from './materials.js';

/** Height of the tower tops. */
export const TOP = 1;
/** Towers run far below the frame so they always bleed off the bottom. */
export const BASE = -30;

/* Towers: left on the +z side, right on the -z side of the slot. */
const LEFT = { x0: -1.05, x1: -0.05, z0: 0.05, z1: 1.05 };
const RIGHT = { x0: 0.05, x1: 1.05, z0: -1.05, z1: -0.05 };

/** Cradle pocket on the left tower, along x. */
const CRADLE_R = 0.43;
const CRADLE_X: [number, number] = [-0.74, -0.36];
/** Socket pocket on the right tower, along z. */
const SOCKET_R = 0.45;
const SOCKET_Z: [number, number] = [-0.72, -0.38];

export const LEFT_ROTOR = { position: [-0.55, TOP, 0.55] as Vec3, radius: 0.41, thickness: 0.3 };
export const RIGHT_ROTOR = { position: [0.55, TOP, -0.55] as Vec3, radius: 0.42, thickness: 0.25 };

const KEY = { x0: -0.05, x1: 0.17, z0: -0.05, z1: 0.17 };
export const KEY_TOP: Vec3 = [(KEY.x0 + KEY.x1) / 2, TOP, (KEY.z0 + KEY.z1) / 2];

const PILLAR = { x0: 0.3, x1: 0.65, z0: -1.425, z1: -1.075, top: TOP + 2.2 };
export const PILLAR_TOP: Vec3 = [(PILLAR.x0 + PILLAR.x1) / 2, PILLAR.top, (PILLAR.z0 + PILLAR.z1) / 2];
const PEDESTAL_H = 0.05;
export const EMBLEM_CENTER: Vec3 = [PILLAR_TOP[0], PILLAR.top + PEDESTAL_H + 0.47, PILLAR_TOP[2]];
export const EMBLEM_RADII = [0.12, 0.2, 0.38] as const;

const CAP = { size: 0.3, rise: 0.5, slab: 0.36, slabH: 0.08 };
/** Corner cap columns: [x, z] of the pilaster centre and the lamp's outward face. */
export const CAPS = [
	{ x: -0.9, z: 0.9, face: 'z' as const },
	{ x: 0.9, z: -0.9, face: 'x' as const }
];
export const LAMP_RADIUS = 0.06;
export const LAMP_Y = TOP + 0.24;

const STAIRS = { count: 24, run: 0.07, rise: 0.07, z0: -0.74, x0: 0.04, x1: 0.29 };
const RIGHT_BLOCK = { x0: 0.78, x1: 1.2, z0: -1.85, z1: -1.45, top: TOP + 0.55 };
const LEFT_POST = { x0: -1.0, x1: -0.6, z0: -0.45, z1: -0.05, top: TOP + 0.4 };

/** Top of the right rotor, where the optional sun disc is centred. */
export const SUN_ANCHOR: Vec3 = [RIGHT_ROTOR.position[0], TOP + RIGHT_ROTOR.radius, RIGHT_ROTOR.position[2]];
export const SUN_RADIUS = 1.6;

/** World-space boxes that bound the visible upper part, used for framing. */
export const ISO_BOUNDS: [Vec3, Vec3][] = [
	[[LEFT.x0, TOP - 0.6, LEFT.z0], [LEFT.x1, TOP, LEFT.z1]],
	[[RIGHT.x0, TOP - 0.6, RIGHT.z0], [RIGHT.x1, TOP, RIGHT.z1]],
	[[-1.08, TOP, 0.72], [-0.72, TOP + CAP.rise + CAP.slabH, 1.08]],
	[[0.72, TOP, -1.08], [1.08, TOP + CAP.rise + CAP.slabH, -0.72]],
	[[RIGHT_BLOCK.x0, TOP, RIGHT_BLOCK.z0], [RIGHT_BLOCK.x1, RIGHT_BLOCK.top + 0.3, RIGHT_BLOCK.z1]],
	[
		[STAIRS.x0, TOP, STAIRS.z0 - STAIRS.run * STAIRS.count],
		[STAIRS.x1, TOP + STAIRS.rise * STAIRS.count, STAIRS.z0]
	],
	[
		[EMBLEM_CENTER[0] - 0.4, EMBLEM_CENTER[1] - 0.4, EMBLEM_CENTER[2] - 0.4],
		[EMBLEM_CENTER[0] + 0.4, EMBLEM_CENTER[1] + 0.4, EMBLEM_CENTER[2] + 0.4]
	]
];

/* ------------------------------------------------------------ poster shapes */

/** Shapes that only line up as a composition in the flat (side) view. */
export const POSTER = {
	bar: { x: -1.7, y: 0.45, h: 0.25, length: 14 },
	disc: { x: -2.6, y: 2.75, z: 1.75, r: 0.5 },
	block: { x: 1.9, y0: -1.55, z0: -2.55, z1: -1.65, depth: 0.2, bands: [2, 1, 2, 6], h: 1.1 }
};

export const FLAT_BOUNDS: [Vec3, Vec3][] = [
	...ISO_BOUNDS,
	[[POSTER.disc.x, POSTER.disc.y - POSTER.disc.r, POSTER.disc.z - POSTER.disc.r], [POSTER.disc.x, POSTER.disc.y + POSTER.disc.r, POSTER.disc.z + POSTER.disc.r]],
	[[POSTER.block.x, POSTER.block.y0, POSTER.block.z0], [POSTER.block.x, POSTER.block.y0 + POSTER.block.h, POSTER.block.z1]]
];

/* ------------------------------------------------------------------ builders */

function cradleProfile(cx: number, r: number, x0: number, x1: number) {
	const shape = new Shape();
	shape.moveTo(x0, BASE);
	shape.lineTo(x1, BASE);
	shape.lineTo(x1, TOP);
	shape.lineTo(cx + r, TOP);
	shape.absarc(cx, TOP, r, 0, Math.PI, true);
	shape.lineTo(x0, TOP);
	shape.lineTo(x0, BASE);
	return shape;
}

function washers(builder: GeometryBuilder, matrices: Matrix4[], radius = 0.05) {
	for (const m of matrices) {
		const { ring, hole } = washerGeometries(m, radius);
		builder.add(ring).add(hole, { flat: 'ink' });
	}
}

function buildStatic(): PaintedGeometry {
	const b = new GeometryBuilder();

	// Left tower: solid ends with a half-pipe cradle pocket (axis along x) between them.
	const cz = (LEFT.z0 + LEFT.z1) / 2;
	b.add(boxGeometry([CRADLE_X[1], BASE, LEFT.z0], [LEFT.x1, TOP, LEFT.z1]));
	b.add(boxGeometry([LEFT.x0, BASE, LEFT.z0], [CRADLE_X[0], TOP, LEFT.z1]));
	const cradle = extrudeProfile(cradleProfile(cz, CRADLE_R, LEFT.z0, LEFT.z1), CRADLE_X[1] - CRADLE_X[0], [
		{ cx: cz, cy: TOP, r: CRADLE_R, concave: true }
	]);
	cradle.applyMatrix4(new Matrix4().makeRotationY(-Math.PI / 2));
	cradle.translate(CRADLE_X[1], 0, 0);
	b.add(cradle);

	// Right tower: solid front and back, a socket pocket in between.
	const cx = (RIGHT.x0 + RIGHT.x1) / 2;
	b.add(boxGeometry([RIGHT.x0, BASE, SOCKET_Z[1]], [RIGHT.x1, TOP, RIGHT.z1]));
	b.add(boxGeometry([RIGHT.x0, BASE, RIGHT.z0], [RIGHT.x1, TOP, SOCKET_Z[0]]));
	const socket = extrudeProfile(cradleProfile(cx, SOCKET_R, RIGHT.x0, RIGHT.x1), SOCKET_Z[1] - SOCKET_Z[0], [
		{ cx, cy: TOP, r: SOCKET_R, concave: true }
	]);
	socket.translate(0, 0, SOCKET_Z[0]);
	b.add(socket);

	// Key column in the slot, white tile on top, and the small figure.
	b.add(boxGeometry([KEY.x0, BASE, KEY.z0], [KEY.x1, TOP, KEY.z1]), { top: 'tile' });
	const body = new ConeGeometry(0.055, 0.17, 24, 1);
	body.translate(KEY_TOP[0], TOP + 0.085, KEY_TOP[2]);
	b.add(body, { tones: 'warm' });
	const head = new SphereGeometry(0.042, 18, 12);
	head.translate(KEY_TOP[0], TOP + 0.2, KEY_TOP[2]);
	b.add(head, { tones: 'ink' });

	// Corner caps: pilaster, slab, two-level diamond inlay.
	for (const cap of CAPS) {
		const h = CAP.size / 2;
		b.add(boxGeometry([cap.x - h, TOP - 0.5, cap.z - h], [cap.x + h, TOP + CAP.rise, cap.z + h]));
		const s = CAP.slab / 2;
		const slabTop = TOP + CAP.rise + CAP.slabH;
		b.add(boxGeometry([cap.x - s, TOP + CAP.rise, cap.z - s], [cap.x + s, slabTop, cap.z + s]));
		b.add(plateGeometry([cap.x, slabTop, cap.z], 0.21, 0.012, Math.PI / 4), { top: 'light' });
		b.add(plateGeometry([cap.x, slabTop + 0.012, cap.z], 0.13, 0.012, Math.PI / 4), { top: 'top' });
		b.add(plateGeometry([cap.x, slabTop + 0.024, cap.z], 0.09, 0.012, Math.PI / 4), { top: 'shadow' });
	}

	// Lamp housings: a dark porthole ring around each lamp.
	for (const cap of CAPS) {
		const ring = new CircleGeometry(LAMP_RADIUS * 1.35, 28);
		const m = new Matrix4();
		if (cap.face === 'z') m.makeTranslation(cap.x, LAMP_Y, cap.z + CAP.size / 2 + 0.002);
		else m.makeRotationY(Math.PI / 2).setPosition(cap.x + CAP.size / 2 + 0.002, LAMP_Y, cap.z);
		ring.applyMatrix4(m);
		b.add(ring, { flat: 'ink' });
	}

	// Pillar and its eight-point star pedestal.
	b.add(boxGeometry([PILLAR.x0, BASE, PILLAR.z0], [PILLAR.x1, PILLAR.top, PILLAR.z1]));
	b.add(plateGeometry(PILLAR_TOP, 0.44, PEDESTAL_H, 0));
	b.add(plateGeometry(PILLAR_TOP, 0.44, PEDESTAL_H, Math.PI / 4));
	b.add(plateGeometry([PILLAR_TOP[0], PILLAR.top + PEDESTAL_H, PILLAR_TOP[2]], 0.1, 0.05, Math.PI / 4));

	// Stairs climbing past the pillar towards the back, ending in the air.
	for (let i = 0; i < STAIRS.count; i++) {
		const z1 = STAIRS.z0 - STAIRS.run * i;
		const yTop = TOP + STAIRS.rise * (i + 1);
		b.add(boxGeometry([STAIRS.x0, yTop - STAIRS.rise * 2, z1 - STAIRS.run], [STAIRS.x1, yTop, z1]), {
			top: i % 2 === 0 ? 'tile' : 'light'
		});
	}

	// Right block behind the pillar with a stepped (Z) notch on top.
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

	// Washer rivets: three on the right block's right face, three on the left tower's dark face.
	washers(
		b,
		[0.3, 0.6, 0.9].map((dy) =>
			new Matrix4().makeRotationY(Math.PI / 2).setPosition(rb.x1 + 0.002, TOP + dy, rbMidZ)
		)
	);
	washers(
		b,
		[-0.4, -0.7, -1.0].map((y) => new Matrix4().makeTranslation(-0.55, y, LEFT.z1 + 0.002)),
		0.055
	);

	return b.build();
}

/** Half-disc rotor in local space: axis along x, curved edge up, centred on its axis. */
function buildLeftRotor(): PaintedGeometry {
	const { radius: r, thickness } = LEFT_ROTOR;
	const shape = new Shape();
	shape.moveTo(r, 0);
	shape.absarc(0, 0, r, 0, Math.PI, false);
	shape.lineTo(r, 0);
	const geo = extrudeProfile(shape, thickness, [{ cx: 0, cy: 0, r, concave: false }], 64);
	geo.translate(0, 0, -thickness / 2);
	geo.applyMatrix4(new Matrix4().makeRotationY(-Math.PI / 2));
	return new GeometryBuilder().add(geo).build();
}

/** Disc rotor in local space: axis along z, with three washers across its face. */
function buildRightRotor(): PaintedGeometry {
	const { radius: r, thickness } = RIGHT_ROTOR;
	const shape = new Shape();
	shape.absarc(0, 0, r, 0, Math.PI * 2, false);
	const disc = extrudeProfile(shape, thickness, [{ cx: 0, cy: 0, r, concave: false }], 72);
	disc.translate(0, 0, -thickness / 2);
	const b = new GeometryBuilder().add(disc);
	washers(
		b,
		[
			[-0.21, 0.2],
			[0, 0.09],
			[0.21, -0.02]
		].map(([x, y]) => new Matrix4().makeTranslation(x, y, thickness / 2 + 0.002)),
		0.045
	);
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
		const h = (n / total) * block.h;
		const geometry = applyGrainUVs(
			new BoxGeometry(block.depth, h, block.z1 - block.z0).translate(
				block.x,
				y - h / 2,
				(block.z0 + block.z1) / 2
			)
		);
		y -= h;
		return { geometry, color: i % 2 === 0 ? ('accentOrange' as const) : ('accentYellow' as const) };
	});
	return { barTop, barBottom, disc: applyGrainUVs(circle), bands };
}

export interface MonumentGeometry {
	stone: PaintedGeometry;
	leftRotor: PaintedGeometry;
	rightRotor: PaintedGeometry;
	posters: PosterGeometries;
	dispose(): void;
}

/** Builds every static and rotating geometry of the monument. Browser or server safe. */
export function buildMonumentGeometry(): MonumentGeometry {
	const stone = buildStatic();
	const leftRotor = buildLeftRotor();
	const rightRotor = buildRightRotor();
	const posters = buildPosters();
	return {
		stone,
		leftRotor,
		rightRotor,
		posters,
		dispose() {
			stone.dispose();
			leftRotor.dispose();
			rightRotor.dispose();
			posters.barTop.dispose();
			posters.barBottom.dispose();
			posters.disc.dispose();
			for (const band of posters.bands) band.geometry.dispose();
		}
	};
}
