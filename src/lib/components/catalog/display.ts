/**
 * Sample data for the display chapter (`/components/display`): Observatory deployments, regions,
 * pages, build minutes and rainfall in the cities the edge regions sit in.
 */
import type { BadgeVariant } from '#lib/components/ui/badge/index.js';

export type DeployStatus = 'Ready' | 'Building' | 'Queued' | 'Failed';

export const STATUS_VARIANT: Record<DeployStatus, BadgeVariant> = {
	Ready: 'success',
	Building: 'warning',
	Queued: 'secondary',
	Failed: 'destructive'
};

export interface Deployment {
	id: string;
	branch: string;
	region: string;
	status: DeployStatus;
	duration: string;
	size: string;
}

export const DEPLOYMENTS: Deployment[] = [
	{ id: 'dpl_8f2a', branch: 'main', region: 'Frankfurt', status: 'Ready', duration: '48s', size: '38.4 MB' },
	{ id: 'dpl_8f19', branch: 'stairs/landing', region: 'San Francisco', status: 'Building', duration: '31s', size: '36.9 MB' },
	{ id: 'dpl_8e77', branch: 'rotor/snap', region: 'Singapore', status: 'Failed', duration: '12s', size: '0 MB' },
	{ id: 'dpl_8e40', branch: 'atlas/stops', region: 'São Paulo', status: 'Queued', duration: '0s', size: '0 MB' },
	{ id: 'dpl_8d93', branch: 'main', region: 'Singapore', status: 'Ready', duration: '52s', size: '38.1 MB' }
];

export interface RegionUsage {
	region: string;
	requests: number;
	gigabytes: number;
	cost: number;
}

export const REGION_USAGE: RegionUsage[] = [
	{ region: 'Frankfurt', requests: 1_284_903, gigabytes: 38.4, cost: 4.61 },
	{ region: 'San Francisco', requests: 902_117, gigabytes: 27.9, cost: 3.35 },
	{ region: 'Singapore', requests: 488_260, gigabytes: 16.2, cost: 2.27 },
	{ region: 'São Paulo', requests: 213_845, gigabytes: 7.1, cost: 1.14 }
];

export interface Preview {
	id: string;
	branch: string;
	author: string;
	age: string;
}

export const PREVIEWS: Preview[] = [
	{ id: 'pv_1', branch: 'stairs/landing', author: 'Mira Okafor', age: '2 hours ago' },
	{ id: 'pv_2', branch: 'rotor/snap', author: 'Tomás Reyes', age: 'yesterday' },
	{ id: 'pv_3', branch: 'atlas/stops', author: 'Ines Halloran', age: '3 days ago' },
	{ id: 'pv_4', branch: 'atlas/offline-map', author: 'Jun Watanabe', age: '6 days ago' }
];

export interface PageStat {
	path: string;
	requests: number;
	p75: number;
	errorRate: number;
}

export const PAGE_STATS: PageStat[] = [
	{ path: '/', requests: 412_906, p75: 84, errorRate: 0.02 },
	{ path: '/atlas', requests: 198_330, p75: 121, errorRate: 0.11 },
	{ path: '/atlas/stops/the-rotor', requests: 64_018, p75: 143, errorRate: 0.21 },
	{ path: '/docs/deploys', requests: 51_472, p75: 97, errorRate: 0.04 },
	{ path: '/pricing', requests: 38_655, p75: 76, errorRate: 0 },
	{ path: '/atlas/map', requests: 27_109, p75: 188, errorRate: 0.38 }
];

// ---- charts

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Average monthly rainfall in millimetres, 1991 to 2020 normals. */
const SINGAPORE = [222, 115, 170, 166, 171, 130, 158, 176, 169, 194, 257, 288];
const SAO_PAULO = [292, 258, 229, 77, 73, 56, 44, 32, 84, 127, 143, 200];
const FRANKFURT = [51, 41, 45, 40, 59, 60, 65, 54, 49, 52, 51, 57];

export const RAINFALL = MONTHS.map((_, i) => ({
	month: new Date(2026, i, 1),
	singapore: SINGAPORE[i],
	saoPaulo: SAO_PAULO[i],
	frankfurt: FRANKFURT[i]
}));

/** Build minutes per package in the Observatory monorepo, this month and last. */
export const BUILD_MINUTES = [
	{ pkg: 'core', september: 142, october: 118 },
	{ pkg: 'ui', september: 236, october: 251 },
	{ pkg: 'scene', september: 318, october: 274 },
	{ pkg: 'atlas', september: 207, october: 263 },
	{ pkg: 'docs', september: 96, october: 88 },
	{ pkg: 'cli', september: 61, october: 57 }
];

/** Time to first byte, 75th percentile, in milliseconds, one point per week. */
const TTFB_FRANKFURT = [91, 88, 90, 86, 87, 84, 85, 83, 84, 82, 83, 81];
const TTFB_SINGAPORE = [138, 141, 136, 133, 135, 129, 127, 128, 124, 122, 121, 119];
const TTFB_SAO_PAULO = [182, 179, 184, 176, 171, 168, 152, 149, 147, 151, 146, 144];

export const TTFB = TTFB_FRANKFURT.map((_, i) => ({
	week: new Date(2026, 6, 27 + i * 7),
	frankfurt: TTFB_FRANKFURT[i],
	singapore: TTFB_SINGAPORE[i],
	saoPaulo: TTFB_SAO_PAULO[i]
}));

/** Bandwidth served per region this month, in gigabytes. */
export const BANDWIDTH = [
	{ id: 'frankfurt', region: 'Frankfurt', gigabytes: 38.4, color: 'var(--chart-1)' },
	{ id: 'sanFrancisco', region: 'San Francisco', gigabytes: 27.9, color: 'var(--chart-2)' },
	{ id: 'singapore', region: 'Singapore', gigabytes: 16.2, color: 'var(--chart-3)' },
	{ id: 'saoPaulo', region: 'São Paulo', gigabytes: 7.1, color: 'var(--chart-4)' }
];

// ---- atlas

/** Stops on the Atlas sculpture-park guide, each drawn as a small voxel figure. */
export const ATLAS_STOPS: { id: string; name: string; note: string; cells: [number, number, number][] }[] = [
	{
		id: 'stair',
		name: 'The long stair',
		note: 'Stop 1 · north lawn',
		cells: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [1, 1, 0], [2, 1, 0], [2, 2, 0]]
	},
	{
		id: 'rotor',
		name: 'The rotor',
		note: 'Stop 2 · lower terrace',
		cells: [[1, 0, 1], [1, 1, 1], [0, 2, 1], [1, 2, 1], [2, 2, 1], [1, 2, 0], [1, 2, 2]]
	},
	{
		id: 'gate',
		name: 'Gate for one',
		note: 'Stop 3 · the birch walk',
		cells: [[0, 0, 0], [0, 1, 0], [0, 2, 0], [1, 2, 0], [2, 2, 0], [2, 1, 0], [2, 0, 0]]
	},
	{
		id: 'well',
		name: 'Dry well',
		note: 'Stop 4 · the hollow',
		cells: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 0, 1], [2, 0, 1], [0, 0, 2], [1, 0, 2], [2, 0, 2]]
	},
	{
		id: 'tower',
		name: 'Watch tower',
		note: 'Stop 5 · ridge path',
		cells: [[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0], [1, 0, 0], [0, 0, 1]]
	}
];

export function formatInt(n: number) {
	return n.toLocaleString('en-GB');
}
