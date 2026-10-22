/**
 * The catalog, as ten chapters. Read by the landing page, the components index and each chapter
 * page, so numerals, titles and subtitles stay in one place.
 */
export interface Chapter {
	slug: string;
	numeral: string;
	title: string;
	/** The small word in the split hairline before the subtitle. */
	connective: string;
	/** One line, lowercase, finishing the sentence the connective starts. */
	subtitle: string;
	items: string[];
}

export const CHAPTERS: Chapter[] = [
	{
		slug: 'foundations',
		numeral: 'I',
		title: 'Foundations',
		connective: 'in which',
		subtitle: 'the faces, the colours, the type and the motion are laid out',
		items: ['Colour', 'Faces', 'Palettes', 'Type', 'Shape', 'Motion', 'Icons']
	},
	{
		slug: 'actions',
		numeral: 'II',
		title: 'Actions',
		connective: 'in which',
		subtitle: 'things are pressed, toggled and chosen from menus',
		items: ['Button', 'Button group', 'Toggle', 'Toggle group', 'Dropdown menu', 'Context menu', 'Menubar']
	},
	{
		slug: 'inputs',
		numeral: 'III',
		title: 'Inputs',
		connective: 'in which',
		subtitle: 'text is entered and forms are filled',
		items: ['Input', 'Input group', 'One-time code', 'Textarea', 'Label', 'Field', 'Native select']
	},
	{
		slug: 'selection',
		numeral: 'IV',
		title: 'Selection',
		connective: 'in which',
		subtitle: 'one option, or several, is picked',
		items: ['Checkbox', 'Radio group', 'Switch', 'Slider', 'Select', 'Combobox', 'Calendar', 'Date picker']
	},
	{
		slug: 'navigation',
		numeral: 'V',
		title: 'Navigation',
		connective: 'in which',
		subtitle: 'the reader finds the way from one place to another',
		items: ['Tabs', 'Breadcrumb', 'Pagination', 'Navigation menu', 'Sidebar', 'Command']
	},
	{
		slug: 'feedback',
		numeral: 'VI',
		title: 'Feedback',
		connective: 'in which',
		subtitle: 'the system says what it is doing',
		items: ['Alert', 'Toast', 'Progress', 'Spinner', 'Skeleton', 'Empty']
	},
	{
		slug: 'overlays',
		numeral: 'VII',
		title: 'Overlays',
		connective: 'in which',
		subtitle: 'a second layer rises over the first',
		items: ['Dialog', 'Alert dialog', 'Sheet', 'Drawer', 'Popover', 'Hover card', 'Tooltip']
	},
	{
		slug: 'display',
		numeral: 'VIII',
		title: 'Display',
		connective: 'in which',
		subtitle: 'data is set out to be read',
		items: ['Table', 'Card', 'Avatar', 'Badge', 'Kbd', 'Item', 'Chart', 'Carousel', 'Accordion', 'Collapsible']
	},
	{
		slug: 'layout',
		numeral: 'IX',
		title: 'Layout',
		connective: 'in which',
		subtitle: 'space is divided and kept',
		items: ['Separator', 'Aspect ratio', 'Resizable', 'Scroll area', 'Code block']
	},
	{
		slug: 'conversation',
		numeral: 'X',
		title: 'Conversation',
		connective: 'in which',
		subtitle: 'messages pass between a person and a machine',
		items: ['Message', 'Bubble', 'Attachment', 'Questionnaire', 'Trace', 'Marker', 'Message scroller']
	}
];

export const COMPONENT_COUNT = CHAPTERS.filter((c) => c.slug !== 'foundations').reduce(
	(n, c) => n + c.items.length,
	0
);

export function chapterBySlug(slug: string) {
	return CHAPTERS.find((c) => c.slug === slug);
}

/** A small voxel figure per chapter for the iso glyphs: [x, y, z] cells, y up. */
export const CHAPTER_GLYPHS: Record<string, [number, number, number][]> = {
	foundations: [[0, 0, 0]],
	actions: [[0, 0, 0], [1, 0, 0], [0, 0, 1], [1, 0, 1], [0, 1, 0]],
	inputs: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 0, 1], [1, 0, 1], [2, 0, 1]],
	selection: [[0, 0, 0], [2, 0, 0], [0, 0, 2], [2, 0, 2], [1, 0, 1], [1, 1, 1]],
	navigation: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 1, 0], [2, 2, 0], [2, 2, 1], [2, 2, 2]],
	feedback: [[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0]],
	overlays: [[0, 0, 0], [1, 0, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [2, 1, 1], [1, 1, 2], [2, 1, 2]],
	display: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 0, 1], [1, 0, 1], [2, 0, 1], [0, 0, 2], [1, 0, 2], [2, 0, 2]],
	layout: [[0, 0, 0], [0, 1, 0], [0, 2, 0], [1, 0, 0], [2, 0, 0], [0, 0, 1], [0, 0, 2]],
	conversation: [[0, 0, 0], [0, 1, 0], [2, 0, 2], [2, 1, 2], [2, 2, 2]]
};
