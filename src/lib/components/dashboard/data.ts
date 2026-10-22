/**
 * Data for the Observatory console. Everything is generated from a fixed seed, so the numbers
 * look measured, stay the same between server and client, and change with the date range.
 * The last full day of data is 21 October 2026.
 */

export type RangeId = '7d' | '30d' | '90d';

export const RANGES: { value: RangeId; label: string; days: number }[] = [
	{ value: '7d', label: 'Last 7 days', days: 7 },
	{ value: '30d', label: 'Last 30 days', days: 30 },
	{ value: '90d', label: 'Last 90 days', days: 90 }
];

export function rangeDays(range: RangeId) {
	return RANGES.find((r) => r.value === range)?.days ?? 30;
}

export interface Day {
	date: Date;
	requests: number;
	/** Bytes served after compression. */
	bytes: number;
	builds: number;
	buildSeconds: number;
	/** Responses with a 5xx status. */
	errors: number;
}

function mulberry32(seed: number) {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const HISTORY = 180;
const LAST_DAY = new Date(2026, 9, 21);

const sameDay = (d: Date, month: number, day: number) => d.getMonth() === month && d.getDate() === day;

/** 180 days, oldest first: enough for a 90-day range and the 90 days before it. */
export const DAYS: Day[] = (() => {
	const rand = mulberry32(0x0b5e7a);
	const days: Day[] = [];
	for (let i = 0; i < HISTORY; i++) {
		const date = new Date(LAST_DAY);
		date.setDate(LAST_DAY.getDate() - (HISTORY - 1 - i));
		const dow = date.getDay();
		const weekend = dow === 0 || dow === 6;

		const trend = 33800 + i * 51;
		const weekly = weekend ? 0.77 : dow === 2 || dow === 3 ? 1.06 : 1;
		const noise = 0.93 + rand() * 0.14;
		// the landing page went out on 14 October; traffic stayed up for a day after
		const launch = sameDay(date, 9, 14) ? 1.43 : sameDay(date, 9, 15) ? 1.17 : 1;
		const requests = Math.round(trend * weekly * noise * launch);

		const kb = 29.1 + rand() * 1.7;
		const builds = weekend ? Math.floor(rand() * 2) : 2 + Math.floor(rand() * 4);
		let buildSeconds = 0;
		for (let b = 0; b < builds; b++) buildSeconds += 96 + Math.round(rand() * 41);

		// a misconfigured redirect on 9 October doubled the error rate for a day
		const incident = sameDay(date, 9, 9) ? 0.0024 : 0;
		const errRate = 0.0016 + rand() * 0.0009 + incident;

		days.push({
			date,
			requests,
			bytes: Math.round(requests * kb * 1024),
			builds,
			buildSeconds,
			errors: Math.round(requests * errRate)
		});
	}
	return days;
})();

export function daysFor(range: RangeId) {
	return DAYS.slice(-rangeDays(range));
}

function previousFor(range: RangeId) {
	const n = rangeDays(range);
	return DAYS.slice(-2 * n, -n);
}

const sum = (list: Day[], key: 'requests' | 'bytes' | 'builds' | 'buildSeconds' | 'errors') =>
	list.reduce((n, d) => n + d[key], 0);

/* ---- formatting ------------------------------------------------------------------------------ */

const MINUS = '−';

export const formatInt = (n: number) => n.toLocaleString('en-US');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const formatDay = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;

export const formatLongDay = (d: Date) => `${WEEKDAYS[d.getDay()]} ${formatDay(d)}`;

export const formatCompact = (n: number) =>
	n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`;

export function formatDuration(seconds: number) {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}m ${String(s).padStart(2, '0')}s`;
}

/* ---- stat tiles ------------------------------------------------------------------------------ */

export type Tone = 'success' | 'destructive' | 'muted';

export interface Stat {
	id: 'requests' | 'bandwidth' | 'build-minutes' | 'error-rate';
	label: string;
	value: string;
	unit?: string;
	caption: string;
	spark: number[];
	delta: { text: string; tone: Tone };
}

/**
 * A change, in words. `goodWhenUp` decides the colour; the sign and the words carry the meaning
 * on their own.
 */
function delta(current: number, previous: number, goodWhenUp: boolean, span: string, points = false) {
	const change = points ? current - previous : ((current - previous) / previous) * 100;
	const rounded = points ? Math.round(change * 100) / 100 : Math.round(change * 10) / 10;
	if (rounded === 0) return { text: `No change vs previous ${span}`, tone: 'muted' as Tone };
	const sign = rounded > 0 ? '+' : MINUS;
	const abs = Math.abs(rounded).toFixed(points ? 2 : 1);
	const good = rounded > 0 === goodWhenUp;
	return {
		text: `${sign}${abs}${points ? ' pts' : '%'} vs previous ${span}`,
		tone: (good ? 'success' : 'destructive') as Tone
	};
}

export function statsFor(range: RangeId): Stat[] {
	const cur = daysFor(range);
	const prev = previousFor(range);
	const span = `${rangeDays(range)} days`;

	const requests = sum(cur, 'requests');
	const prevRequests = sum(prev, 'requests');
	const peak = cur.reduce((a, b) => (b.requests > a.requests ? b : a));

	const bytes = sum(cur, 'bytes');
	const prevBytes = sum(prev, 'bytes');

	const builds = sum(cur, 'builds');
	const buildSeconds = sum(cur, 'buildSeconds');
	const prevBuildSeconds = sum(prev, 'buildSeconds');
	const buildMinutes = Math.ceil(buildSeconds / 60);

	const errors = sum(cur, 'errors');
	const rate = (errors / requests) * 100;
	const prevRate = (sum(prev, 'errors') / prevRequests) * 100;

	return [
		{
			id: 'requests',
			label: 'Requests',
			value: formatInt(requests),
			caption: `Peak ${formatInt(peak.requests)} on ${formatDay(peak.date)}`,
			spark: cur.map((d) => d.requests),
			delta: delta(requests, prevRequests, true, span)
		},
		{
			id: 'bandwidth',
			label: 'Bandwidth',
			value: (bytes / 1e9).toFixed(1),
			unit: 'GB',
			caption: `${(bytes / requests / 1024).toFixed(1)} KB per request, compressed`,
			spark: cur.map((d) => d.bytes),
			delta: delta(bytes, prevBytes, true, span)
		},
		{
			id: 'build-minutes',
			label: 'Build minutes',
			value: formatInt(buildMinutes),
			unit: 'min',
			caption: `${builds} builds, ${formatDuration(Math.round(buildSeconds / Math.max(builds, 1)))} on average`,
			spark: cur.map((d) => d.buildSeconds),
			delta: delta(buildSeconds, prevBuildSeconds, false, span)
		},
		{
			id: 'error-rate',
			label: 'Error rate',
			value: rate.toFixed(2),
			unit: '%',
			caption: `${formatInt(errors)} responses with a 5xx status`,
			spark: cur.map((d) => d.errors / d.requests),
			delta: delta(rate, prevRate, false, span, true)
		}
	];
}

/** The billing cycle runs from the 9th; build minutes used so far and the allowance. */
export const CYCLE = (() => {
	const since = DAYS.filter((d) => d.date >= new Date(2026, 9, 9));
	return {
		used: Math.ceil(sum(since, 'buildSeconds') / 60),
		included: 400,
		daysLeft: 17
	};
})();

/* ---- regions --------------------------------------------------------------------------------- */

export interface Region {
	id: 'fra' | 'sfo' | 'sin' | 'gru';
	name: string;
	/** The chart token this region is drawn in; it follows the region, never its rank. */
	color: string;
	swatch: string;
	/** 75th percentile time to first byte, in milliseconds. */
	p75: number;
}

export const REGIONS: Region[] = [
	{ id: 'fra', name: 'Frankfurt', color: 'var(--chart-1)', swatch: 'bg-chart-1', p75: 34 },
	{ id: 'sfo', name: 'San Francisco', color: 'var(--chart-2)', swatch: 'bg-chart-2', p75: 41 },
	{ id: 'sin', name: 'Singapore', color: 'var(--chart-3)', swatch: 'bg-chart-3', p75: 57 },
	{ id: 'gru', name: 'São Paulo', color: 'var(--chart-4)', swatch: 'bg-chart-4', p75: 63 }
];

const SHARES: Record<RangeId, number[]> = {
	'7d': [0.398, 0.284, 0.196, 0.122],
	'30d': [0.413, 0.276, 0.192, 0.119],
	'90d': [0.421, 0.271, 0.189, 0.119]
};

export function regionsFor(range: RangeId) {
	const total = sum(daysFor(range), 'requests');
	const shares = SHARES[range];
	let left = total;
	return REGIONS.map((r, i) => {
		const requests = i === REGIONS.length - 1 ? left : Math.round(total * shares[i]);
		left -= requests;
		return { ...r, region: r.name, requests, share: requests / total };
	});
}

/* ---- people ---------------------------------------------------------------------------------- */

export interface Person {
	id: string;
	name: string;
	initials: string;
	role: string;
}

export const PEOPLE: Person[] = [
	{ id: 'ines', name: 'Ines Albrecht', initials: 'IA', role: 'Owner' },
	{ id: 'tomas', name: 'Tomás Ferreira', initials: 'TF', role: 'Developer' },
	{ id: 'meilin', name: 'Mei Lin Goh', initials: 'MG', role: 'Developer' },
	{ id: 'dara', name: 'Dara Okafor', initials: 'DO', role: 'Developer' },
	{ id: 'jonas', name: 'Jonas Weber', initials: 'JW', role: 'Designer' },
	{ id: 'priya', name: 'Priya Raman', initials: 'PR', role: 'Viewer' }
];

export const TEAM_SIZE = 8;
export const PENDING_INVITES = 1;

export const personById = (id: string) => PEOPLE.find((p) => p.id === id) ?? PEOPLE[0];

/* ---- deployments ----------------------------------------------------------------------------- */

export type Environment = 'production' | 'preview';
export type DeploymentStatus = 'ready' | 'queued' | 'failed' | 'cancelled';

export interface Deployment {
	sha: string;
	message: string;
	branch: string;
	env: Environment;
	author: string;
	/** Build time in seconds; null while queued. */
	duration: number | null;
	status: DeploymentStatus;
	age: string;
}

export const BRANCHES = ['main', 'stairs/landing', 'rotor/snap', 'light/sun-path', 'docs/palettes', 'fix/focus-halo'];

export const DEPLOYMENTS: Deployment[] = [
	{ sha: '7d20f5b', message: 'Renew certificate for preview subdomain', branch: 'main', env: 'production', author: 'tomas', duration: null, status: 'queued', age: '2 min ago' },
	{ sha: 'c41e9a2', message: 'Tighten cache headers on /assets', branch: 'main', env: 'production', author: 'ines', duration: 108, status: 'ready', age: '18 min ago' },
	{ sha: '51aa3f0', message: 'Move image pipeline to enhanced-img', branch: 'main', env: 'production', author: 'dara', duration: 112, status: 'failed', age: '2 h ago' },
	{ sha: 'a90c3e4', message: 'Lighten display weight above 48px', branch: 'main', env: 'production', author: 'meilin', duration: 111, status: 'ready', age: '3 h ago' },
	{ sha: 'e5b1d70', message: 'Serve the full chain for www', branch: 'hotfix/cert-chain', env: 'production', author: 'jonas', duration: 58, status: 'ready', age: '6 h ago' },
	{ sha: '3f8a2c9', message: 'Bump three to 0.186.1', branch: 'main', env: 'production', author: 'priya', duration: 22, status: 'cancelled', age: '9 h ago' },
	{ sha: 'b62d0e1', message: 'Add São Paulo to the edge list', branch: 'main', env: 'production', author: 'ines', duration: 106, status: 'ready', age: 'Yesterday' },
	{ sha: '0c7e9f4', message: 'Preload Cabin width axis', branch: 'main', env: 'production', author: 'tomas', duration: 109, status: 'ready', age: 'Yesterday' },
	{ sha: 'd14a6b8', message: 'Cut release 2.4', branch: 'release/2.4', env: 'production', author: 'dara', duration: 127, status: 'ready', age: '2 days ago' },
	{ sha: '8e3f15c', message: 'Drop the unused carousel bundle', branch: 'main', env: 'production', author: 'meilin', duration: 104, status: 'ready', age: '2 days ago' },

	{ sha: 'e27c0b8', message: 'Snap rotor to quarter turns', branch: 'rotor/snap', env: 'preview', author: 'jonas', duration: null, status: 'queued', age: '1 min ago' },
	{ sha: '9b0f7d1', message: 'Fade the stairs into the field', branch: 'stairs/landing', env: 'preview', author: 'ines', duration: 123, status: 'ready', age: '25 min ago' },
	{ sha: '4a6e2d3', message: 'Settle easing after drag release', branch: 'rotor/snap', env: 'preview', author: 'jonas', duration: 41, status: 'failed', age: '47 min ago' },
	{ sha: 'f03b7c6', message: 'Crop the hero at 30% width', branch: 'stairs/landing', env: 'preview', author: 'ines', duration: 119, status: 'ready', age: '1 h ago' },
	{ sha: '6c19e0a', message: 'Move the sun along its arc', branch: 'light/sun-path', env: 'preview', author: 'meilin', duration: 131, status: 'ready', age: '4 h ago' },
	{ sha: '2b84d5f', message: 'Describe the dusk field', branch: 'docs/palettes', env: 'preview', author: 'priya', duration: 17, status: 'cancelled', age: '5 h ago' },
	{ sha: '91e7a3b', message: 'Shadow face follows the sun', branch: 'light/sun-path', env: 'preview', author: 'meilin', duration: 128, status: 'ready', age: '7 h ago' },
	{ sha: '5d2f8c1', message: 'Keyboard steps for the rotor', branch: 'rotor/snap', env: 'preview', author: 'tomas', duration: 97, status: 'ready', age: 'Yesterday' },
	{ sha: 'c8a0b4e', message: 'Two rings, not one, on focus', branch: 'fix/focus-halo', env: 'preview', author: 'dara', duration: 93, status: 'ready', age: 'Yesterday' },
	{ sha: '70f6e29', message: 'Landing stairs, first pass', branch: 'stairs/landing', env: 'preview', author: 'ines', duration: 65, status: 'failed', age: '2 days ago' }
];

export const STATUS: Record<DeploymentStatus, { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' }> = {
	ready: { label: 'Ready', variant: 'success' },
	queued: { label: 'Queued', variant: 'warning' },
	failed: { label: 'Failed', variant: 'destructive' },
	cancelled: { label: 'Cancelled', variant: 'secondary' }
};

/* ---- domains --------------------------------------------------------------------------------- */

export interface Domain {
	name: string;
	certificate: { label: string; variant: 'success' | 'warning' };
	note: string;
	redirect: boolean;
}

export const DOMAINS: Domain[] = [
	{ name: 'observatory.example', certificate: { label: 'Valid', variant: 'success' }, note: 'Renews 14 Jan 2027', redirect: true },
	{ name: 'www.observatory.example', certificate: { label: 'Valid', variant: 'success' }, note: 'Renews 14 Jan 2027', redirect: true },
	{ name: 'preview.observatory.example', certificate: { label: 'Pending', variant: 'warning' }, note: 'Waiting for the CNAME record', redirect: false }
];
