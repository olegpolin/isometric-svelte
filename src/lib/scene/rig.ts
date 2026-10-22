/**
 * Camera maths for the hero scene. `progress` blends the true isometric view
 * (0) into a flat side elevation looking down -x (1).
 */
import { Matrix4, Quaternion, Vector3 } from 'three';
import { FLAT_BOUNDS, ISO_BOUNDS } from './monument-geometry.js';
import type { Vec3 } from './materials.js';

const ISO_ELEVATION = Math.asin(1 / Math.sqrt(3));
const ISO_AZIMUTH = Math.PI / 4;
const UP = new Vector3(0, 1, 0);
/** Distance of the orthographic camera from its target (only affects clipping). */
export const CAMERA_DISTANCE = 40;

/** Fraction of the canvas height above the top of the monument. */
const TOP_PAD = 0.15;
/** Scene units from the monument's top to the bottom edge of the canvas. */
const VISIBLE_SPAN = 6.9;
/** Never let the monument be wider than this fraction of the canvas. */
const MAX_WIDTH = { iso: 0.64, flat: 0.86 };

/** Unit vector from the target towards the camera. */
export function viewDirection(progress: number, out = new Vector3()): Vector3 {
	const az = ISO_AZIMUTH * (1 - progress);
	const el = ISO_ELEVATION * (1 - progress);
	return out.set(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az));
}

/** Camera orientation for `progress`; also used to billboard flat props. */
export function viewQuaternion(progress: number, out = new Quaternion()): Quaternion {
	const m = new Matrix4().lookAt(viewDirection(progress), new Vector3(), UP);
	return out.setFromRotationMatrix(m);
}

function screenBasis(dir: Vector3) {
	const right = new Vector3().crossVectors(UP, dir).normalize();
	const up = new Vector3().crossVectors(dir, right).normalize();
	return { right, up };
}

interface Fit {
	zoom: number;
	/** Screen-space (right, up) coordinates of the view centre, in world units. */
	cr: number;
	cu: number;
}

function fit(bounds: [Vec3, Vec3][], progress: number, width: number, height: number, maxWidth: number): Fit {
	const { right, up } = screenBasis(viewDirection(progress));
	let rMin = Infinity;
	let rMax = -Infinity;
	let uMax = -Infinity;
	const p = new Vector3();
	for (const [min, max] of bounds) {
		for (let i = 0; i < 8; i++) {
			p.set(i & 1 ? max[0] : min[0], i & 2 ? max[1] : min[1], i & 4 ? max[2] : min[2]);
			const r = p.dot(right);
			const u = p.dot(up);
			rMin = Math.min(rMin, r);
			rMax = Math.max(rMax, r);
			uMax = Math.max(uMax, u);
		}
	}
	const w = Math.max(width, 1);
	const h = Math.max(height, 1);
	const zoom = Math.min((h * (1 - TOP_PAD)) / VISIBLE_SPAN, (w * maxWidth) / (rMax - rMin));
	// Put the top of the monument TOP_PAD below the canvas top edge.
	const cu = uMax - (h * (0.5 - TOP_PAD)) / zoom;
	return { zoom, cr: (rMin + rMax) / 2, cu };
}

export interface CameraFrame {
	position: Vector3;
	quaternion: Quaternion;
	zoom: number;
}

/** Position, orientation and zoom (CSS px per unit) for a canvas of the given size. */
export function cameraFrame(progress: number, width: number, height: number): CameraFrame {
	const iso = fit(ISO_BOUNDS, 0, width, height, MAX_WIDTH.iso);
	const flat = fit(FLAT_BOUNDS, 1, width, height, MAX_WIDTH.flat);
	const t = progress;
	const zoom = iso.zoom + (flat.zoom - iso.zoom) * t;
	const cr = iso.cr + (flat.cr - iso.cr) * t;
	const cu = iso.cu + (flat.cu - iso.cu) * t;

	const dir = viewDirection(t);
	const { right, up } = screenBasis(dir);
	const target = right.multiplyScalar(cr).add(up.multiplyScalar(cu));
	return {
		position: target.addScaledVector(dir, CAMERA_DISTANCE),
		quaternion: viewQuaternion(t),
		zoom
	};
}
