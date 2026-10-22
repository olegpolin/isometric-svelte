/**
 * Pure three.js building blocks for the flat, unlit, three-tone look:
 * a paper-grain texture, geometry painted by face orientation, extruded
 * profiles with smooth curved-surface ramps, washers and a soft glow sprite.
 * Nothing here touches Svelte; everything returned is disposable.
 */
import {
	BoxGeometry,
	BufferAttribute,
	BufferGeometry,
	CanvasTexture,
	CircleGeometry,
	Color,
	DataTexture,
	ExtrudeGeometry,
	FrontSide,
	LinearFilter,
	LinearMipmapLinearFilter,
	Matrix4,
	MeshBasicMaterial,
	NoColorSpace,
	Quaternion,
	RepeatWrapping,
	RGBAFormat,
	Shape,
	SRGBColorSpace,
	TorusGeometry,
	UnsignedByteType,
	Vector3
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { ScenePalette } from './palette.js';

/* ------------------------------------------------------------------ grain */

/** Mean of the grain texture (linear multiplier). Vertex colours are divided by it. */
export const GRAIN_MEAN = 0.92;
/** Half range of the grain around the mean (linear). */
export const GRAIN_AMPLITUDE = 0.08;
/** Texture repeats per world unit: one texel is about 1.2-1.5 CSS px at hero zoom (~110 px per unit). */
export const GRAIN_UV_SCALE = 0.62;

function mulberry32(seed: number) {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Small tiling monochrome noise used as the `map` of every grained material. */
export function createNoiseTexture(size = 128, seed = 1337): DataTexture {
	const random = mulberry32(seed);
	const data = new Uint8Array(size * size * 4);
	for (let i = 0; i < size * size; i++) {
		const v = GRAIN_MEAN + (random() * 2 - 1) * GRAIN_AMPLITUDE;
		const byte = Math.max(0, Math.min(255, Math.round(v * 255)));
		data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = byte;
		data[i * 4 + 3] = 255;
	}
	const texture = new DataTexture(data, size, size, RGBAFormat, UnsignedByteType);
	texture.wrapS = texture.wrapT = RepeatWrapping;
	texture.magFilter = LinearFilter;
	texture.minFilter = LinearMipmapLinearFilter;
	texture.generateMipmaps = true;
	texture.colorSpace = NoColorSpace;
	texture.needsUpdate = true;
	return texture;
}

/** The one shared material for all vertex-coloured stone geometry. */
export function createStoneMaterial(noise: DataTexture): MeshBasicMaterial {
	return new MeshBasicMaterial({ vertexColors: true, map: noise, side: FrontSide });
}

/**
 * Writes box-mapped UVs (coordinates projected along each triangle's dominant
 * axis) so the grain has the same scale on every face. Returns a non-indexed
 * geometry; an indexed input is disposed.
 */
export function applyGrainUVs(geometry: BufferGeometry, scale = GRAIN_UV_SCALE): BufferGeometry {
	const geo = geometry.index ? geometry.toNonIndexed() : geometry;
	if (geo !== geometry) geometry.dispose();
	const pos = geo.getAttribute('position');
	const uv = new Float32Array(pos.count * 2);
	const a = new Vector3();
	const b = new Vector3();
	const c = new Vector3();
	const n = new Vector3();
	for (let i = 0; i < pos.count; i += 3) {
		a.fromBufferAttribute(pos, i);
		b.fromBufferAttribute(pos, i + 1);
		c.fromBufferAttribute(pos, i + 2);
		n.subVectors(c, b).cross(a.sub(b));
		const ax = Math.abs(n.x);
		const ay = Math.abs(n.y);
		const az = Math.abs(n.z);
		for (let k = 0; k < 3; k++) {
			const x = pos.getX(i + k);
			const y = pos.getY(i + k);
			const z = pos.getZ(i + k);
			let u: number;
			let v: number;
			if (ax >= ay && ax >= az) [u, v] = [z, y];
			else if (ay >= az) [u, v] = [x, z];
			else [u, v] = [x, y];
			uv[(i + k) * 2] = u * scale;
			uv[(i + k) * 2 + 1] = v * scale;
		}
	}
	geo.setAttribute('uv', new BufferAttribute(uv, 2));
	return geo;
}

/* ------------------------------------------------------------------ tones */

export interface ToneSet {
	top: Color;
	light: Color;
	shadow: Color;
}

/** Which three-tone set a part is painted with. */
export type ToneKey = 'stone' | 'warm' | 'ink';

export interface PaintSpec {
	/** Three-tone set used for the orientation ramp. Default `stone`. */
	tones?: ToneKey;
	/** Overrides the colour of faces pointing straight up. */
	top?: keyof ScenePalette;
	/** Paints the whole part one flat colour (no orientation shading). */
	flat?: keyof ScenePalette;
}

const WHITE = new Color(1, 1, 1);

function derivedTones(hex: string): ToneSet {
	const light = new Color(hex);
	return {
		top: light.clone().lerp(WHITE, 0.28),
		light,
		shadow: light.clone().multiplyScalar(0.42)
	};
}

export interface ResolvedPalette {
	tones: Record<ToneKey, ToneSet>;
	colors: Record<keyof ScenePalette, Color>;
}

/** Converts the hex palette to linear three.js colours and derived tone sets. */
export function resolvePalette(palette: ScenePalette): ResolvedPalette {
	const colors = {} as Record<keyof ScenePalette, Color>;
	for (const key of Object.keys(palette) as (keyof ScenePalette)[]) {
		colors[key] = new Color(palette[key]);
	}
	return {
		colors,
		tones: {
			stone: { top: colors.top, light: colors.light, shadow: colors.shadow },
			warm: derivedTones(palette.accentWarm),
			ink: derivedTones(palette.ink)
		}
	};
}

/**
 * Colour for a surface normal. Up is the top tone, right-facing (+x, -z) the
 * light tone, left-facing (+z, -x) and downward the shadow tone; anything in
 * between is a smooth blend, which gives curved surfaces their soft ramp.
 */
export function toneForNormal(n: Vector3, tones: ToneSet, out: Color): Color {
	const wTop = Math.max(n.y, 0);
	const wLight = Math.max(n.x, 0) + Math.max(-n.z, 0);
	const wShadow = Math.max(n.z, 0) + Math.max(-n.x, 0) + Math.max(-n.y, 0);
	const sum = wTop + wLight + wShadow || 1;
	return out.setRGB(
		(tones.top.r * wTop + tones.light.r * wLight + tones.shadow.r * wShadow) / sum,
		(tones.top.g * wTop + tones.light.g * wLight + tones.shadow.g * wShadow) / sum,
		(tones.top.b * wTop + tones.light.b * wLight + tones.shadow.b * wShadow) / sum
	);
}

interface PaintRange {
	start: number;
	count: number;
	spec: PaintSpec;
}

/**
 * A merged, non-indexed geometry whose vertex colours are derived from its
 * normals. `repaint` can be called again for a new palette or for a new
 * orientation, so rotating parts keep their light coming from above.
 */
export class PaintedGeometry {
	readonly geometry: BufferGeometry;
	readonly #ranges: PaintRange[];
	readonly #normal = new Vector3();
	readonly #color = new Color();

	constructor(geometry: BufferGeometry, ranges: PaintRange[]) {
		this.geometry = geometry;
		this.#ranges = ranges;
	}

	repaint(palette: ResolvedPalette, rotation?: Quaternion) {
		const normals = this.geometry.getAttribute('normal');
		const colors = this.geometry.getAttribute('color') as BufferAttribute;
		const gain = 1 / GRAIN_MEAN;
		const n = this.#normal;
		const c = this.#color;
		for (const { start, count, spec } of this.#ranges) {
			const tones = palette.tones[spec.tones ?? 'stone'];
			const flat = spec.flat ? palette.colors[spec.flat] : undefined;
			const top = spec.top ? palette.colors[spec.top] : undefined;
			for (let i = start; i < start + count; i++) {
				if (flat) {
					c.copy(flat);
				} else {
					n.fromBufferAttribute(normals, i);
					if (rotation) n.applyQuaternion(rotation);
					if (top && n.y > 0.999) c.copy(top);
					else toneForNormal(n, tones, c);
				}
				colors.setXYZ(i, c.r * gain, c.g * gain, c.b * gain);
			}
		}
		colors.needsUpdate = true;
	}

	dispose() {
		this.geometry.dispose();
	}
}

/** Collects parts, then merges them into one `PaintedGeometry`. */
export class GeometryBuilder {
	#parts: { geometry: BufferGeometry; spec: PaintSpec }[] = [];

	add(geometry: BufferGeometry, spec: PaintSpec = {}): this {
		this.#parts.push({ geometry, spec });
		return this;
	}

	build(): PaintedGeometry {
		const ranges: PaintRange[] = [];
		const prepared: BufferGeometry[] = [];
		let start = 0;
		for (const { geometry, spec } of this.#parts) {
			const geo = applyGrainUVs(geometry);
			for (const name of Object.keys(geo.attributes)) {
				if (name !== 'position' && name !== 'normal' && name !== 'uv') geo.deleteAttribute(name);
			}
			geo.clearGroups();
			const count = geo.getAttribute('position').count;
			geo.setAttribute('color', new BufferAttribute(new Float32Array(count * 3), 3));
			prepared.push(geo);
			ranges.push({ start, count, spec });
			start += count;
		}
		const merged = mergeGeometries(prepared, false);
		for (const geo of prepared) geo.dispose();
		if (!merged) throw new Error('Scene geometry could not be merged');
		this.#parts = [];
		merged.computeBoundingSphere();
		return new PaintedGeometry(merged, ranges);
	}
}

/* -------------------------------------------------------------- factories */

export type Vec3 = [number, number, number];

/** Axis-aligned box from its min and max corners. */
export function boxGeometry(min: Vec3, max: Vec3): BufferGeometry {
	const geo = new BoxGeometry(max[0] - min[0], max[1] - min[1], max[2] - min[2]);
	geo.translate((min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2);
	return geo;
}

/** Thin square plate whose base sits at `base`, turned `angle` radians about the vertical. */
export function plateGeometry(base: Vec3, size: number, height: number, angle = 0): BufferGeometry {
	const geo = new BoxGeometry(size, height, size);
	geo.rotateY(angle);
	geo.translate(base[0], base[1] + height / 2, base[2]);
	return geo;
}

export interface ArcSpec {
	/** Arc centre in shape coordinates. */
	cx: number;
	cy: number;
	r: number;
	/** Concave arcs (sockets, cradles) get normals pointing at the centre. */
	concave: boolean;
}

/**
 * Extrudes a 2D profile (no bevel) along +z from 0 to `depth`, then gives the
 * walls generated by `arcs` smooth radial normals so they paint as a ramp
 * instead of facets.
 */
export function extrudeProfile(
	shape: Shape,
	depth: number,
	arcs: ArcSpec[] = [],
	curveSegments = 56
): BufferGeometry {
	const extruded = new ExtrudeGeometry(shape, {
		depth,
		bevelEnabled: false,
		curveSegments,
		steps: 1
	});
	const geo = extruded.index ? extruded.toNonIndexed() : extruded;
	if (geo !== extruded) extruded.dispose();
	geo.computeVertexNormals();
	if (arcs.length === 0) return geo;

	const pos = geo.getAttribute('position');
	const normal = geo.getAttribute('normal');
	const fn = new Vector3();
	for (let i = 0; i < pos.count; i += 3) {
		fn.fromBufferAttribute(normal, i);
		if (Math.abs(fn.z) > 0.5) continue; // caps keep their flat normal
		for (let k = 0; k < 3; k++) {
			const x = pos.getX(i + k);
			const y = pos.getY(i + k);
			for (const arc of arcs) {
				const dx = x - arc.cx;
				const dy = y - arc.cy;
				const d = Math.hypot(dx, dy);
				if (d === 0 || Math.abs(d - arc.r) > 1e-3) continue;
				const sign = arc.concave ? -1 : 1;
				const nx = (dx / d) * sign;
				const ny = (dy / d) * sign;
				// A straight wall that merely touches the arc keeps its flat normal.
				if (fn.x * nx + fn.y * ny < 0.5) continue;
				normal.setXYZ(i + k, nx, ny, 0);
				break;
			}
		}
	}
	normal.needsUpdate = true;
	return geo;
}

/** A washer rivet facing +z (torus ring plus dark hole), transformed by `matrix`. */
export function washerGeometries(matrix: Matrix4, radius = 0.05) {
	const tube = radius * 0.34;
	const ring = new TorusGeometry(radius, tube, 10, 28);
	const hole = new CircleGeometry(radius - tube * 0.35, 20);
	hole.translate(0, 0, 0.003);
	ring.applyMatrix4(matrix);
	hole.applyMatrix4(matrix);
	return { ring, hole };
}

/** White radial falloff for additive glow sprites (tinted by the material colour). */
export function createGlowTexture(size = 128): CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = size;
	const ctx = canvas.getContext('2d');
	if (ctx) {
		const half = size / 2;
		const g = ctx.createRadialGradient(half, half, 0, half, half, half);
		g.addColorStop(0, 'rgba(255,255,255,1)');
		g.addColorStop(0.2, 'rgba(255,255,255,0.6)');
		g.addColorStop(0.5, 'rgba(255,255,255,0.16)');
		g.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, size, size);
	}
	const texture = new CanvasTexture(canvas);
	texture.colorSpace = SRGBColorSpace;
	return texture;
}
