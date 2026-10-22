import { prefersReducedMotion, Tween } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

/** CSS-style `cubic-bezier(x1, y1, x2, y2)` easing. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
	const cx = 3 * x1;
	const bx = 3 * (x2 - x1) - cx;
	const ax = 1 - cx - bx;
	const cy = 3 * y1;
	const by = 3 * (y2 - y1) - cy;
	const ay = 1 - cy - by;
	const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
	const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
	const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

	return (x: number) => {
		if (x <= 0) return 0;
		if (x >= 1) return 1;
		let t = x;
		for (let i = 0; i < 8; i++) {
			const err = sampleX(t) - x;
			if (Math.abs(err) < 1e-6) return sampleY(t);
			const d = slopeX(t);
			if (Math.abs(d) < 1e-6) break;
			t -= err / d;
		}
		// Bisection fallback for flat slopes.
		let lo = 0;
		let hi = 1;
		t = x;
		for (let i = 0; i < 24; i++) {
			const v = sampleX(t);
			if (Math.abs(v - x) < 1e-6) break;
			if (v < x) lo = t;
			else hi = t;
			t = (lo + hi) / 2;
		}
		return sampleY(t);
	};
}

const QUARTER = Math.PI / 2;
/** Heavy start, heavy stop: a stone block being turned. */
const STEP_EASE = cubicBezier(0.65, 0, 0.35, 1);
/** Quick settle after letting go of a drag, no overshoot. */
const SNAP_EASE = cubicBezier(0.22, 1, 0.36, 1);
const STEP_MS = 700;
const HALF_TURN_MS = 1000;
const SNAP_MS = 320;

/**
 * Shared state of the two rotors: committed quarter turns, the animated
 * angle (radians, positive turns the top edge to the viewer's right), drag
 * tracking and the emblem pulse that follows each full revolution.
 */
export class RotorControl {
	/** Committed quarter turns (may be negative). */
	turns = $state(0);
	/** True while a pointer drag is steering the rotors. */
	dragging = $state(false);
	/** 0 → 1 → 0 after every completed full revolution. */
	readonly pulse = new Tween(0);

	readonly #angle = new Tween(0);
	#dragBase = 0;
	readonly #onturn: () => ((quarterTurns: number) => void) | undefined;

	constructor(onturn: () => ((quarterTurns: number) => void) | undefined = () => undefined) {
		this.#onturn = onturn;
	}

	/** Current rotor angle in radians. */
	get angle() {
		return this.#angle.current;
	}

	/** Turn by `quarters` 90° steps (click, keyboard). */
	step(quarters = 1) {
		if (this.dragging) return;
		this.turns += quarters;
		const target = this.turns * QUARTER;
		const distance = Math.abs(target - this.#angle.current) / QUARTER;
		const duration = Math.min(
			STEP_MS + (HALF_TURN_MS - STEP_MS) * Math.max(0, distance - 1),
			HALF_TURN_MS * 2
		);
		this.#angle.set(target, {
			duration: prefersReducedMotion.current ? 0 : duration,
			easing: STEP_EASE
		});
		this.#commit();
	}

	beginDrag() {
		this.dragging = true;
		this.#dragBase = this.#angle.current;
	}

	/** Follow the pointer 1:1; `offset` is the rotation in radians since `beginDrag`. */
	drag(offset: number) {
		if (!this.dragging) return;
		this.#angle.set(this.#dragBase + offset, { duration: 0 });
	}

	/** Release: snap to the nearest quarter turn. */
	endDrag() {
		if (!this.dragging) return;
		this.dragging = false;
		const nearest = Math.round(this.#angle.current / QUARTER);
		const changed = nearest !== this.turns;
		this.turns = nearest;
		this.#angle.set(nearest * QUARTER, {
			duration: prefersReducedMotion.current ? 0 : SNAP_MS,
			easing: SNAP_EASE
		});
		if (changed) this.#commit();
	}

	#commit() {
		this.#onturn()?.(this.turns);
		if (this.turns !== 0 && this.turns % 4 === 0) {
			this.pulse.set(1, { duration: 300, easing: cubicOut }).then(() => {
				this.pulse.set(0, { duration: 600, easing: cubicOut });
			});
		}
	}
}
