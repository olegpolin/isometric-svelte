/**
 * Content for Atlas, the guide to Velden Sculpture Park shown in the mobile showcase. Every work,
 * artist, talk and transit line here is invented. Each work carries its own voxel figure
 * (`cells`, drawn by IsoGlyph) in place of a photograph.
 */

export type Material = 'stone' | 'steel' | 'light' | 'water';

export type Cell = [number, number, number];

export interface Work {
	id: string;
	title: string;
	artist: string;
	year: number;
	material: Material;
	medium: string;
	outdoors: boolean;
	location: string;
	/** Walking time from the north gate, in minutes. */
	walk: number;
	note: string;
	cells: Cell[];
}

export const MATERIALS: { value: Material | 'all'; label: string }[] = [
	{ value: 'all', label: 'All' },
	{ value: 'stone', label: 'Stone' },
	{ value: 'steel', label: 'Steel' },
	{ value: 'light', label: 'Light' },
	{ value: 'water', label: 'Water' }
];

/** The longest walk in the park, used to scale the walking-distance line. */
export const LONGEST_WALK = 30;

export const WORKS: Work[] = [
	{
		id: 'threshold',
		title: 'Threshold for a slow river',
		artist: 'Ilse Vandermeer',
		year: 2019,
		material: 'steel',
		medium: 'Weathering steel, nine tonnes',
		outdoors: true,
		location: 'Meadow walk',
		walk: 12,
		note: 'An open gate set across the old riverbed. Walk through it in the morning and your shadow lands exactly on the far post.',
		cells: [
			[0, 0, 0],
			[0, 1, 0],
			[0, 2, 0],
			[1, 2, 0],
			[2, 2, 0],
			[2, 1, 0],
			[2, 0, 0]
		]
	},
	{
		id: 'seven-stones',
		title: 'Seven quiet stones',
		artist: 'Tomasz Wierzba',
		year: 2004,
		material: 'stone',
		medium: 'Local gritstone',
		outdoors: true,
		location: 'Long lawn',
		walk: 6,
		note: 'Seven blocks quarried a mile from where they now sit, spaced so that no two can be seen from the same bench.',
		cells: [
			[0, 0, 0],
			[2, 0, 0],
			[4, 0, 1],
			[1, 0, 2],
			[3, 0, 3],
			[0, 0, 4],
			[2, 0, 5]
		]
	},
	{
		id: 'lantern-field',
		title: 'Lantern field',
		artist: 'Aiko Harland',
		year: 2021,
		material: 'light',
		medium: 'Glass, LED, timer',
		outdoors: true,
		location: 'East slope',
		walk: 18,
		note: 'Forty glass posts that brighten one by one from dusk. The last one lights at the moment the park closes.',
		cells: [
			[0, 0, 0],
			[0, 1, 0],
			[2, 0, 0],
			[2, 1, 0],
			[2, 2, 0],
			[0, 0, 2],
			[2, 0, 2],
			[2, 1, 2]
		]
	},
	{
		id: 'cistern',
		title: 'Cistern',
		artist: 'Rafael Okonjo-Brandt',
		year: 2016,
		material: 'water',
		medium: 'Concrete, rainwater',
		outdoors: true,
		location: 'Orchard',
		walk: 9,
		note: 'A square well that fills only from the sky. Its level is the park’s rain gauge, noted in the guide each week.',
		cells: [
			[0, 0, 0],
			[1, 0, 0],
			[2, 0, 0],
			[0, 0, 1],
			[2, 0, 1],
			[0, 0, 2],
			[1, 0, 2],
			[2, 0, 2]
		]
	},
	{
		id: 'patient-column',
		title: 'The patient column',
		artist: 'Greta Solheim',
		year: 1998,
		material: 'stone',
		medium: 'Limestone drums',
		outdoors: false,
		location: 'Stone hall',
		walk: 4,
		note: 'Five drums stacked by hand over five summers, one a year. The joints were left dry so the column can be taken down again.',
		cells: [
			[0, 0, 0],
			[0, 1, 0],
			[0, 2, 0],
			[0, 3, 0],
			[0, 4, 0]
		]
	},
	{
		id: 'weathervane',
		title: 'Weathervane for no wind',
		artist: 'Odile Marchetti',
		year: 2012,
		material: 'steel',
		medium: 'Stainless steel',
		outdoors: true,
		location: 'Hilltop',
		walk: 24,
		note: 'A vane fixed in place, pointing at the town the artist grew up in. On still days it is the only thing on the hill that looks right.',
		cells: [
			[1, 0, 1],
			[1, 1, 1],
			[1, 2, 1],
			[0, 3, 1],
			[1, 3, 1],
			[2, 3, 1]
		]
	},
	{
		id: 'afterglow-room',
		title: 'Afterglow room',
		artist: 'Jun Takeda-Moss',
		year: 2023,
		material: 'light',
		medium: 'Phosphorescent plaster',
		outdoors: false,
		location: 'Glass pavilion',
		walk: 5,
		note: 'A white room that holds the daylight for a few minutes after the doors close behind you.',
		cells: [
			[0, 0, 0],
			[1, 0, 0],
			[0, 0, 1],
			[1, 0, 1],
			[0, 1, 0],
			[1, 1, 0],
			[0, 1, 1],
			[1, 1, 1]
		]
	},
	{
		id: 'reflecting-basin',
		title: 'Reflecting basin',
		artist: 'Hester Vaal',
		year: 2009,
		material: 'water',
		medium: 'Granite, still water',
		outdoors: true,
		location: 'Water garden',
		walk: 8,
		note: 'A shallow granite tray, level to a millimetre, that turns the sky into the floor.',
		cells: [
			[0, 0, 0],
			[1, 0, 0],
			[2, 0, 0],
			[0, 0, 1],
			[1, 0, 1],
			[2, 0, 1]
		]
	},
	{
		id: 'bridge-without-banks',
		title: 'Bridge without banks',
		artist: 'Ilse Vandermeer',
		year: 2014,
		material: 'steel',
		medium: 'Painted steel',
		outdoors: true,
		location: 'Meadow walk',
		walk: 14,
		note: 'A footbridge over dry grass. Children cross it; adults tend to walk round.',
		cells: [
			[0, 0, 0],
			[3, 0, 0],
			[0, 1, 0],
			[1, 1, 0],
			[2, 1, 0],
			[3, 1, 0]
		]
	},
	{
		id: 'cairn',
		title: 'Cairn for a cartographer',
		artist: 'Bruno Kessel',
		year: 2001,
		material: 'stone',
		medium: 'Field stone',
		outdoors: true,
		location: 'North gate',
		walk: 1,
		note: 'Built from stones carried in by visitors, one each. The pile is surveyed every spring and the new height is cut into the gate.',
		cells: [
			[0, 0, 0],
			[1, 0, 0],
			[0, 0, 1],
			[1, 0, 1],
			[0, 1, 0],
			[0, 2, 0]
		]
	},
	{
		id: 'tide-clock',
		title: 'Tide clock',
		artist: 'Nadia Ferrante',
		year: 2018,
		material: 'water',
		medium: 'Bronze, pumped water',
		outdoors: false,
		location: 'Water garden pavilion',
		walk: 10,
		note: 'Three bronze steps that fill and empty on the timetable of a harbour sixty miles away.',
		cells: [
			[0, 0, 0],
			[1, 0, 0],
			[1, 1, 0],
			[2, 0, 0],
			[2, 1, 0],
			[2, 2, 0]
		]
	},
	{
		id: 'signal-tower',
		title: 'Signal tower',
		artist: 'Priya Castellan',
		year: 2020,
		material: 'light',
		medium: 'Steel frame, lamp',
		outdoors: true,
		location: 'Hilltop',
		walk: 26,
		note: 'A lamp that answers the lighthouse on the coast. On a clear night you can see both at once from the car park.',
		cells: [
			[0, 0, 0],
			[1, 0, 0],
			[0, 0, 1],
			[0, 1, 0],
			[0, 2, 0],
			[0, 3, 0]
		]
	}
];

export const FEATURED_WORK_ID = 'threshold';

export interface Place {
	id: string;
	name: string;
	hours: string;
	cells: Cell[];
}

export const OPEN_NOW: Place[] = [
	{
		id: 'glass-pavilion',
		name: 'Glass pavilion',
		hours: 'Until 18:00',
		cells: [
			[0, 0, 0],
			[1, 0, 0],
			[2, 0, 0],
			[0, 1, 0],
			[2, 1, 0]
		]
	},
	{
		id: 'stone-hall',
		name: 'Stone hall',
		hours: 'Until 17:00',
		cells: [
			[0, 0, 0],
			[1, 0, 0],
			[0, 0, 1],
			[1, 0, 1],
			[0, 1, 0],
			[1, 1, 0]
		]
	},
	{
		id: 'orchard-cafe',
		name: 'Orchard café',
		hours: 'Until 19:00',
		cells: [
			[0, 0, 0],
			[1, 0, 0],
			[1, 1, 0],
			[1, 0, 1]
		]
	}
];

export interface Talk {
	id: string;
	time: string;
	title: string;
	speaker: string;
	place: string;
	length: string;
	summary: string;
}

export const TALKS: Talk[] = [
	{
		id: 'rust',
		time: '11:00',
		title: 'Rust as a material, not a flaw',
		speaker: 'Odile Marchetti',
		place: 'Meadow walk, by the threshold',
		length: '40 min',
		summary:
			'Why weathering steel is left to oxidise, how the colour settles over ten years, and what the conservators do when it does not.'
	},
	{
		id: 'basin',
		time: '13:30',
		title: 'Keeping the basin level',
		speaker: 'Hester Vaal',
		place: 'Water garden',
		length: '30 min',
		summary:
			'The artist walks round the basin with the park’s engineer and explains the pumps, the overflow and the one day a year it is drained.'
	},
	{
		id: 'lanterns',
		time: '16:00',
		title: 'How the lantern field is lit',
		speaker: 'Aiko Harland',
		place: 'Glass pavilion',
		length: '45 min',
		summary:
			'A look at the timer that wakes the forty posts in order, with a walk to the east slope to watch the first ones come on.'
	}
];

export interface TimeSlot {
	value: string;
	label: string;
	note: string;
}

export const TIME_SLOTS: TimeSlot[] = [
	{ value: '10:00', label: '10:00 to 12:00', note: 'Quietest on the meadow walk' },
	{ value: '12:00', label: '12:00 to 14:00', note: 'Café and talks nearby' },
	{ value: '14:00', label: '14:00 to 16:00', note: 'Best light on the hilltop' },
	{ value: '16:00', label: '16:00 to 18:00', note: 'Stay for the lantern field' }
];

export interface TransitLine {
	line: string;
	from: string;
	every: string;
}

export const TRANSIT: TransitLine[] = [
	{ line: 'Tram 7', from: 'Harbour Square', every: '12 min' },
	{ line: 'Bus 41', from: 'Central station', every: '20 min' },
	{ line: 'Ferry F2', from: 'Old pier', every: '35 min' }
];

export const LANGUAGES = [
	{ value: 'en', label: 'English' },
	{ value: 'nl', label: 'Nederlands' },
	{ value: 'de', label: 'Deutsch' },
	{ value: 'fr', label: 'Français' },
	{ value: 'sv', label: 'Svenska' }
];
