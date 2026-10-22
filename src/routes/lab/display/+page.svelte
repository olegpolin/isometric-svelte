<script lang="ts">
	import { AreaChart, BarChart } from "layerchart";
	import ArrowUpRightIcon from "@lucide/svelte/icons/arrow-up-right";
	import BookOpenIcon from "@lucide/svelte/icons/book-open";
	import CheckIcon from "@lucide/svelte/icons/check";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import CircleAlertIcon from "@lucide/svelte/icons/circle-alert";
	import FileCodeIcon from "@lucide/svelte/icons/file-code";
	import FileTextIcon from "@lucide/svelte/icons/file-text";
	import FlagIcon from "@lucide/svelte/icons/flag";
	import ImageIcon from "@lucide/svelte/icons/image";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import PaletteIcon from "@lucide/svelte/icons/palette";
	import SearchIcon from "@lucide/svelte/icons/search";
	import SunIcon from "@lucide/svelte/icons/sun";
	import TerminalIcon from "@lucide/svelte/icons/terminal";
	import TypeIcon from "@lucide/svelte/icons/type";
	import XIcon from "@lucide/svelte/icons/x";
	import favicon from "#lib/assets/favicon.svg";
	import { useHighlightedCode } from "#lib/hooks/use-highlighted-code.svelte.js";
	import * as Accordion from "#lib/components/ui/accordion/index.js";
	import { AspectRatio } from "#lib/components/ui/aspect-ratio/index.js";
	import * as Attachment from "#lib/components/ui/attachment/index.js";
	import * as Avatar from "#lib/components/ui/avatar/index.js";
	import { Badge, type BadgeVariant } from "#lib/components/ui/badge/index.js";
	import * as Bubble from "#lib/components/ui/bubble/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import * as Card from "#lib/components/ui/card/index.js";
	import * as Carousel from "#lib/components/ui/carousel/index.js";
	import * as Chart from "#lib/components/ui/chart/index.js";
	import * as CodeBlock from "#lib/components/ui/code-block/index.js";
	import * as Collapsible from "#lib/components/ui/collapsible/index.js";
	import * as Item from "#lib/components/ui/item/index.js";
	import * as Marker from "#lib/components/ui/marker/index.js";
	import * as Message from "#lib/components/ui/message/index.js";
	import * as MessageScroller from "#lib/components/ui/message-scroller/index.js";
	import * as Questionnaire from "#lib/components/ui/questionnaire/index.js";
	import * as Resizable from "#lib/components/ui/resizable/index.js";
	import { ScrollArea } from "#lib/components/ui/scroll-area/index.js";
	import { Separator } from "#lib/components/ui/separator/index.js";
	import * as Table from "#lib/components/ui/table/index.js";
	import * as Trace from "#lib/components/ui/trace/index.js";

	// ---- toolbar: mode and palette, applied to <html> directly so nothing is persisted
	const palettes = ["sun", "ember", "lagoon", "dusk", "moss", "coral"] as const;
	let dark = $state(false);
	let palette = $state<string>("sun");

	function readRoot(node: HTMLElement) {
		const root = node.ownerDocument.documentElement;
		dark = root.classList.contains("dark");
		palette = root.dataset.theme || "sun";
	}

	function toggleDark() {
		dark = document.documentElement.classList.toggle("dark");
	}

	function nextPalette() {
		const index = palettes.indexOf(palette as (typeof palettes)[number]);
		palette = palettes[(index + 1) % palettes.length];
		document.documentElement.dataset.theme = palette;
	}

	// ---- badge
	const badgeVariants: NonNullable<BadgeVariant>[] = [
		"default",
		"secondary",
		"outline",
		"destructive",
		"signal",
		"success",
		"warning",
		"ghost",
		"link",
	];

	// ---- table
	const typefaces = [
		{ family: "Josefin Sans", role: "Display", weights: "200–600", size: 48.2, selected: false },
		{ family: "Cabin", role: "Text", weights: "400–700", size: 112.6, selected: true },
		{ family: "IBM Plex Mono", role: "Code", weights: "400, 500", size: 36.9, selected: false },
		{ family: "Gill Sans", role: "Fallback", weights: "300–700", size: 0, selected: false },
	];
	const totalSize = typefaces.reduce((sum, row) => sum + row.size, 0);

	// ---- charts
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const bergen = [190, 152, 170, 114, 106, 132, 148, 190, 283, 271, 259, 235];
	const seattle = [142, 95, 96, 70, 47, 38, 17, 22, 38, 88, 153, 137];
	const lisbon = [100, 90, 57, 65, 49, 16, 5, 6, 32, 92, 126, 128];
	const rainfall = months.map((_, index) => ({
		month: new Date(2025, index, 1),
		bergen: bergen[index],
		seattle: seattle[index],
		lisbon: lisbon[index],
	}));
	const rainfallConfig = {
		bergen: { label: "Bergen", color: "var(--chart-1)" },
		seattle: { label: "Seattle", color: "var(--chart-2)" },
		lisbon: { label: "Lisbon", color: "var(--chart-3)" },
	} satisfies Chart.ChartConfig;

	const builds = [
		{ pkg: "core", cold: 38, cached: 9 },
		{ pkg: "ui", cold: 64, cached: 12 },
		{ pkg: "scene", cold: 91, cached: 22 },
		{ pkg: "docs", cold: 47, cached: 15 },
		{ pkg: "cli", cold: 21, cached: 4 },
	];
	const buildConfig = {
		cold: { label: "Cold build", color: "var(--chart-1)" },
		cached: { label: "Cached build", color: "var(--chart-2)" },
	} satisfies Chart.ChartConfig;

	// ---- code block
	const tokensSource = `:root {
	--background: oklch(0.975 0.012 95);
	--foreground: oklch(0.243 0.026 218);
	--radius: 0.25rem;
	--ease-move: cubic-bezier(0.65, 0, 0.35, 1);
}`;
	const svelteSource = `<script lang="ts">
	let { palette = "sun" } = $props();
	const label = $derived(palette.toUpperCase());
<\/script>

<span data-theme={palette}>{label}</span>`;
	const tokensLines = useHighlightedCode(
		() => tokensSource,
		() => "css"
	);
	const svelteLines = useHighlightedCode(
		() => svelteSource,
		() => "svelte"
	);

	const buildError = "Error: Cannot find module 'three/addons'\n    at scene/monument.ts:4:1";
	const diffLines = [
		{ id: 1, code: ":root[data-theme='lagoon'] {", variant: "default" },
		{ id: 2, code: "	--primary: oklch(0.72 0.12 185);", variant: "removed" },
		{ id: 3, code: "	--primary: oklch(0.729 0.128 185);", variant: "added" },
		{ id: 4, code: "}", variant: "default" },
	] as const;

	// ---- message scroller
	const transcript = [
		{ id: "m1", role: "user", text: "Which palette suits a page about tide tables?" },
		{
			id: "m2",
			role: "assistant",
			text: "Lagoon. Its primary is a sea teal, and the coral signal works for the single high-tide call-out.",
		},
		{ id: "m3", role: "user", text: "And for the dark version?" },
		{
			id: "m4",
			role: "assistant",
			text: "The same palette. Dark mode lifts the primary slightly and keeps the teal-black field, so the tide chart reads as a spotlight.",
		},
		{ id: "m5", role: "user", text: "Show me the chart tokens it uses." },
		{
			id: "m6",
			role: "assistant",
			text: "Series one is the primary teal, series two is the coral signal, series three is a warm sand and series four a deep sea green.",
		},
		{ id: "m7", role: "user", text: "Good. Apply it to the Lisbon page." },
		{ id: "m8", role: "assistant", text: "Applied lagoon to the Lisbon tide page." },
	];

	// ---- questionnaire
	const questions = [
		{
			name: "palette",
			required: true,
			prompt: "Which palette should the Lisbon page use?",
			description: "Pick one, or name another.",
			choices: [
				{ value: "lagoon", label: "Lagoon", description: "Sea teal with a coral signal." },
				{ value: "sun", label: "Sun", description: "Warm yellow with a blue signal." },
				{ value: "dusk", label: "Dusk", description: "Indigo with a coral signal." },
			],
		},
		{
			name: "sections",
			required: false,
			multiple: true,
			prompt: "Which sections should it include?",
			description: "Choose any.",
			choices: [
				{ value: "tides", label: "Tide table" },
				{ value: "rainfall", label: "Monthly rainfall" },
				{ value: "ferries", label: "Ferry times" },
			],
		},
	];

	let collapsibleOpen = $state(false);
</script>

<svelte:head>
	<title>Display lab</title>
</svelte:head>

<div
	{@attach readRoot}
	class="bg-popover border-border shadow-float fixed top-3 right-3 z-50 flex items-center gap-1 rounded-lg border p-1"
>
	<Button variant="ghost" size="sm" onclick={toggleDark}>
		{#if dark}
			<SunIcon data-icon="inline-start" />
			Light mode
		{:else}
			<MoonIcon data-icon="inline-start" />
			Dark mode
		{/if}
	</Button>
	<Button variant="ghost" size="sm" onclick={nextPalette}>
		<PaletteIcon data-icon="inline-start" />
		{palette}
	</Button>
</div>

<main class="mx-auto flex max-w-5xl flex-col gap-20 px-6 pt-20 pb-32">
	<header class="flex flex-col gap-3">
		<p class="type-eyebrow text-muted-foreground">Lab</p>
		<h1 class="type-title text-3xl">Display</h1>
		<p class="text-muted-foreground max-w-prose">
			Cards, badges, tables, charts and the conversation pieces, in every variant and state.
		</p>
	</header>

	<!-- Card -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label text-muted-foreground">Card</h2>
		<div class="grid gap-6 md:grid-cols-3">
			<Card.Root>
				<Card.Header>
					<Card.Title>Cabin Variable</Card.Title>
					<Card.Description>Humanist sans for body copy and UI.</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>Weights 400 to 700, with a width axis from 75 to 100.</p>
				</Card.Content>
				<Card.Footer>
					<Button variant="outline" size="sm">Copy font stack</Button>
				</Card.Footer>
			</Card.Root>

			<Card.Root variant="block">
				<Card.Header>
					<Card.Title>Josefin Sans Variable</Card.Title>
					<Card.Description>Display voice, tracked uppercase.</Card.Description>
					<Card.Action>
						<Badge variant="signal">New</Badge>
					</Card.Action>
				</Card.Header>
				<Card.Content>
					<p>Used for titles and labels only, never for running text.</p>
				</Card.Content>
				<Card.Footer>
					<Button size="sm">Use for titles</Button>
				</Card.Footer>
			</Card.Root>

			<Card.Root size="sm">
				<Card.Header>
					<Card.Title>IBM Plex Mono</Card.Title>
					<Card.Description>Small card, empty footer.</Card.Description>
				</Card.Header>
				<Card.Content>
					<p class="font-mono text-[0.8125rem]">const radius = "0.25rem";</p>
				</Card.Content>
				<Card.Footer></Card.Footer>
			</Card.Root>
		</div>
	</section>

	<!-- Badge -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label text-muted-foreground">Badge</h2>
		<div class="flex flex-wrap items-center gap-2">
			{#each badgeVariants as variant (variant)}
				<Badge {variant}>{variant}</Badge>
			{/each}
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="success"><CheckIcon data-icon="inline-start" />Published</Badge>
			<Badge variant="destructive"><CircleAlertIcon data-icon="inline-start" />Failed</Badge>
			<Badge variant="outline">Lisbon<ArrowUpRightIcon data-icon="inline-end" /></Badge>
			<Badge href="#badge" variant="default">Link: sun</Badge>
			<Badge href="#badge" variant="secondary">Link: ember</Badge>
			<Badge href="#badge" variant="outline">Link: lagoon</Badge>
			<Badge variant="outline" aria-invalid="true">Invalid</Badge>
		</div>
	</section>

	<!-- Table -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label text-muted-foreground">Table</h2>
		<Table.Root>
			<Table.Caption>Typefaces bundled with the site. The selected row is Cabin.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Family</Table.Head>
					<Table.Head>Role</Table.Head>
					<Table.Head>Weights</Table.Head>
					<Table.Head class="text-right">Size (kB)</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each typefaces as row (row.family)}
					<Table.Row data-state={row.selected ? "selected" : undefined}>
						<Table.Cell class="font-medium">{row.family}</Table.Cell>
						<Table.Cell>{row.role}</Table.Cell>
						<Table.Cell>{row.weights}</Table.Cell>
						<Table.Cell class="text-right">{row.size.toFixed(1)}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
			<Table.Footer>
				<Table.Row>
					<Table.Cell colspan={3}>Total</Table.Cell>
					<Table.Cell class="text-right">{totalSize.toFixed(1)}</Table.Cell>
				</Table.Row>
			</Table.Footer>
		</Table.Root>
	</section>

	<!-- Avatar -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label text-muted-foreground">Avatar</h2>
		<div class="flex flex-wrap items-center gap-6">
			<Avatar.Root size="sm">
				<Avatar.Fallback>OP</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Fallback>MK</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root size="lg">
				<Avatar.Fallback>LS</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root size="lg">
				<Avatar.Image src={favicon} alt="Isometric" />
				<Avatar.Fallback>IS</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Fallback>AB</Avatar.Fallback>
				<Avatar.Badge />
			</Avatar.Root>
			<Avatar.Root size="lg">
				<Avatar.Fallback>RN</Avatar.Fallback>
				<Avatar.Badge><CheckIcon /></Avatar.Badge>
			</Avatar.Root>
			<Avatar.Group>
				<Avatar.Root><Avatar.Fallback>OP</Avatar.Fallback></Avatar.Root>
				<Avatar.Root><Avatar.Fallback>MK</Avatar.Fallback></Avatar.Root>
				<Avatar.Root><Avatar.Fallback>LS</Avatar.Fallback></Avatar.Root>
				<Avatar.GroupCount>+4</Avatar.GroupCount>
			</Avatar.Group>
		</div>
	</section>

	<!-- Item -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label text-muted-foreground">Item</h2>
		<div class="grid gap-8 md:grid-cols-2">
			<Item.Group>
				<Item.Root variant="outline">
					<Item.Media variant="icon"><TypeIcon /></Item.Media>
					<Item.Content>
						<Item.Title>Cabin Variable</Item.Title>
						<Item.Description>Text voice, 14 to 16 pixels.</Item.Description>
					</Item.Content>
					<Item.Actions>
						<Button variant="outline" size="sm">Preview</Button>
					</Item.Actions>
				</Item.Root>
				<Item.Root variant="muted">
					<Item.Media variant="icon"><BookOpenIcon /></Item.Media>
					<Item.Content>
						<Item.Title>Reading measure</Item.Title>
						<Item.Description>Prose sits at 65 characters per line.</Item.Description>
					</Item.Content>
				</Item.Root>
				<Item.Root>
					{#snippet child({ props })}
						<a href="#item" {...props}>
							<Item.Media variant="image"><img src={favicon} alt="" /></Item.Media>
							<Item.Content>
								<Item.Title>Isometric foundation</Item.Title>
								<Item.Description>A link row: hover and Tab to focus.</Item.Description>
							</Item.Content>
							<Item.Actions><ArrowUpRightIcon class="size-4" /></Item.Actions>
						</a>
					{/snippet}
				</Item.Root>
			</Item.Group>

			<Item.Group class="gap-0">
				{#each ["Sun", "Ember", "Lagoon", "Dusk"] as name, index (name)}
					{#if index > 0}<Item.Separator class="my-0" />{/if}
					<Item.Root size="sm">
						<Item.Content>
							<Item.Title>{name}</Item.Title>
						</Item.Content>
						<Item.Actions>
							<Badge variant="outline">Palette</Badge>
						</Item.Actions>
					</Item.Root>
				{/each}
				<Item.Separator class="my-0" />
				<Item.Root size="xs">
					<Item.Content>
						<Item.Title>Extra small row</Item.Title>
						<Item.Description>Size xs</Item.Description>
					</Item.Content>
				</Item.Root>
			</Item.Group>
		</div>
	</section>

	<!-- Chart -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label text-muted-foreground">Chart</h2>
		<div class="grid gap-6 lg:grid-cols-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>Monthly rainfall</Card.Title>
					<Card.Description>Average millimetres per month, 1991 to 2020.</Card.Description>
				</Card.Header>
				<Card.Content>
					<Chart.Container config={rainfallConfig} class="aspect-auto h-64 w-full">
						<AreaChart
							data={rainfall}
							x="month"
							seriesLayout="overlap"
							legend
							series={[
								{ key: "bergen", label: "Bergen", color: rainfallConfig.bergen.color },
								{ key: "seattle", label: "Seattle", color: rainfallConfig.seattle.color },
								{ key: "lisbon", label: "Lisbon", color: rainfallConfig.lisbon.color },
							]}
							props={{
								area: { fillOpacity: 0.18, line: { strokeWidth: 1.5 } },
								xAxis: { format: (d: Date) => months[d.getMonth()] },
								yAxis: { format: (d: number) => `${d}` },
							}}
						>
							{#snippet tooltip()}
								<Chart.Tooltip
									indicator="line"
									labelFormatter={(d: Date) =>
										d.toLocaleDateString("en-GB", { month: "long" })}
								/>
							{/snippet}
						</AreaChart>
					</Chart.Container>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Build time per package</Card.Title>
					<Card.Description>Seconds, cold and with a warm cache.</Card.Description>
				</Card.Header>
				<Card.Content>
					<Chart.Container config={buildConfig} class="aspect-auto h-64 w-full">
						<BarChart
							data={builds}
							x="pkg"
							seriesLayout="group"
							bandPadding={0.3}
							legend
							series={[
								{ key: "cold", label: "Cold build", color: buildConfig.cold.color },
								{ key: "cached", label: "Cached build", color: buildConfig.cached.color },
							]}
						>
							{#snippet tooltip()}
								<Chart.Tooltip />
							{/snippet}
						</BarChart>
					</Chart.Container>
				</Card.Content>
			</Card.Root>
		</div>
	</section>

	<!-- Carousel -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label text-muted-foreground">Carousel</h2>
		<div class="flex flex-col items-center gap-4 px-14">
			<Carousel.Root class="w-full max-w-md">
				<Carousel.Content>
					{#each palettes as name (name)}
						<Carousel.Item>
							<Card.Root>
								<Card.Content class="flex aspect-[3/2] flex-col items-center justify-center gap-2">
									<span class="type-title text-2xl">{name}</span>
									<span class="text-muted-foreground text-sm">Palette</span>
								</Card.Content>
							</Card.Root>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
				<Carousel.Dots class="mt-3" />
			</Carousel.Root>
		</div>
	</section>

	<!-- Accordion, collapsible -->
	<section class="grid gap-12 md:grid-cols-2">
		<div class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Accordion</h2>
			<Accordion.Root type="single" value="radius">
				<Accordion.Item value="radius">
					<Accordion.Trigger>Why are corners only 4 pixels?</Accordion.Trigger>
					<Accordion.Content>
						Blocks are faces of a solid. A crisp corner keeps the edge readable as a change of
						tone, not as a soft shape.
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="shadow">
					<Accordion.Trigger>Where do shadows come from?</Accordion.Trigger>
					<Accordion.Content>
						Light comes from the upper left. Raised blocks get a flat offset in the shadow tone,
						never a blur.
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="motion">
					<Accordion.Trigger>How fast does a quarter turn take?</Accordion.Trigger>
					<Accordion.Content>700 milliseconds on the move curve.</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="disabled" disabled>
					<Accordion.Trigger>Disabled question</Accordion.Trigger>
					<Accordion.Content>Unreachable.</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</div>

		<div class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Collapsible</h2>
			<Collapsible.Root bind:open={collapsibleOpen} class="flex flex-col gap-2">
				<div class="flex items-center justify-between gap-4">
					<span class="text-sm font-medium">Three palettes starred</span>
					<Collapsible.Trigger>
						{#snippet child({ props })}
							<Button variant="ghost" size="icon-round" {...props}>
								<ChevronsUpDownIcon />
								<span class="sr-only">Toggle</span>
							</Button>
						{/snippet}
					</Collapsible.Trigger>
				</div>
				<div class="border-border rounded-md border px-3 py-2 text-sm">Lagoon</div>
				<Collapsible.Content class="flex flex-col gap-2">
					<div class="border-border rounded-md border px-3 py-2 text-sm">Dusk</div>
					<div class="border-border rounded-md border px-3 py-2 text-sm">Moss</div>
				</Collapsible.Content>
			</Collapsible.Root>
		</div>
	</section>

	<!-- Separator, aspect ratio -->
	<section class="grid gap-12 md:grid-cols-2">
		<div class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Separator</h2>
			<div class="flex flex-col gap-3">
				<p class="text-sm font-medium">Isometric</p>
				<p class="text-muted-foreground text-sm">Design foundation</p>
				<Separator />
				<div class="flex h-5 items-center gap-3 text-sm">
					<span>Tokens</span>
					<Separator orientation="vertical" />
					<span>Palettes</span>
					<Separator orientation="vertical" />
					<span>Motion</span>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Aspect ratio</h2>
			<AspectRatio ratio={16 / 9} class="bg-muted border-border rounded-lg border">
				<div class="text-muted-foreground flex size-full items-center justify-center text-sm">
					16 : 9
				</div>
			</AspectRatio>
		</div>
	</section>

	<!-- Resizable, scroll area -->
	<section class="grid gap-12 md:grid-cols-2">
		<div class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Resizable</h2>
			<Resizable.PaneGroup direction="horizontal" class="border-border min-h-56 rounded-lg border">
				<Resizable.Pane defaultSize={40}>
					<div class="flex h-full items-center justify-center p-4 text-sm">Sidebar</div>
				</Resizable.Pane>
				<Resizable.Handle withHandle />
				<Resizable.Pane defaultSize={60}>
					<Resizable.PaneGroup direction="vertical">
						<Resizable.Pane defaultSize={50}>
							<div class="flex h-full items-center justify-center p-4 text-sm">Editor</div>
						</Resizable.Pane>
						<Resizable.Handle />
						<Resizable.Pane defaultSize={50}>
							<div class="flex h-full items-center justify-center p-4 text-sm">Terminal</div>
						</Resizable.Pane>
					</Resizable.PaneGroup>
				</Resizable.Pane>
			</Resizable.PaneGroup>
		</div>
		<div class="flex flex-col gap-6">
			<h2 class="type-label text-muted-foreground">Scroll area</h2>
			<ScrollArea class="border-border h-56 rounded-lg border">
				<div class="flex flex-col p-4">
					<p class="type-label text-muted-foreground pb-3">Cities</p>
					{#each ["Bergen", "Seattle", "Lisbon", "Porto", "Reykjavík", "Galway", "Hobart", "Valparaíso", "Wellington", "Kyoto", "Tromsø", "Halifax", "Cork", "Brest", "Vigo"] as city, index (city)}
						{#if index > 0}<Separator class="my-2" />{/if}
						<span class="text-sm">{city}</span>
					{/each}
				</div>
			</ScrollArea>
			<ScrollArea orientation="horizontal" class="border-border w-full rounded-lg border whitespace-nowrap">
				<div class="flex w-max gap-3 p-4">
					{#each palettes as name (name)}
						<div class="bg-muted flex h-20 w-36 shrink-0 items-end rounded-md p-2 text-sm">
							{name}
						</div>
					{/each}
					{#each ["Bergen", "Seattle", "Lisbon"] as city (city)}
						<div class="bg-muted flex h-20 w-36 shrink-0 items-end rounded-md p-2 text-sm">
							{city}
						</div>
					{/each}
				</div>
			</ScrollArea>
		</div>
	</section>

	<!-- Code block -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label text-muted-foreground">Code block</h2>
		<div class="grid gap-6 md:grid-cols-2">
			<CodeBlock.Root>
				<CodeBlock.Header>
					<CodeBlock.Title><FileCodeIcon />layout.css</CodeBlock.Title>
					<CodeBlock.Actions>
						<CodeBlock.CopyButton value={tokensSource} />
					</CodeBlock.Actions>
				</CodeBlock.Header>
				<CodeBlock.Content lineNumbers>
					{#each tokensLines.current as line, index (index)}
						<CodeBlock.Line
							code={line}
							variant={index === 3 ? "highlighted" : "default"}
						/>
					{/each}
				</CodeBlock.Content>
			</CodeBlock.Root>

			<CodeBlock.Root>
				<CodeBlock.Content>
					{#each svelteLines.current as line, index (index)}
						<CodeBlock.Line code={line} />
					{/each}
				</CodeBlock.Content>
				<CodeBlock.Actions>
					<CodeBlock.CopyButton value={svelteSource} />
				</CodeBlock.Actions>
			</CodeBlock.Root>

			<CodeBlock.Root size="sm">
				<CodeBlock.Header>
					<CodeBlock.Title>palette.diff</CodeBlock.Title>
				</CodeBlock.Header>
				<CodeBlock.Content lineNumbers>
					{#each diffLines as line (line.id)}
						<CodeBlock.Line code={line.code} variant={line.variant} />
					{/each}
				</CodeBlock.Content>
				<CodeBlock.Footer>2 lines changed</CodeBlock.Footer>
			</CodeBlock.Root>

			<CodeBlock.Root variant="destructive">
				<CodeBlock.Header>
					<CodeBlock.Title><TerminalIcon />npm run build</CodeBlock.Title>
				</CodeBlock.Header>
				<CodeBlock.Content code={buildError} />
			</CodeBlock.Root>
		</div>
	</section>

	<!-- Attachment -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label text-muted-foreground">Attachment</h2>
		<Attachment.Group>
			<Attachment.Root state="done">
				<Attachment.Media><FileTextIcon /></Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>foundation.md</Attachment.Title>
					<Attachment.Description>Markdown, 6.2 kB</Attachment.Description>
				</Attachment.Content>
				<Attachment.Actions>
					<Attachment.Action aria-label="Remove foundation.md"><XIcon /></Attachment.Action>
				</Attachment.Actions>
			</Attachment.Root>
			<Attachment.Root state="uploading">
				<Attachment.Media><FileCodeIcon /></Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>layout.css</Attachment.Title>
					<Attachment.Description>Uploading, 42%</Attachment.Description>
				</Attachment.Content>
			</Attachment.Root>
			<Attachment.Root state="processing" size="sm">
				<Attachment.Media><FileTextIcon /></Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>rainfall.csv</Attachment.Title>
					<Attachment.Description>Reading rows</Attachment.Description>
				</Attachment.Content>
			</Attachment.Root>
			<Attachment.Root state="error">
				<Attachment.Media><CircleAlertIcon /></Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>monument.glb</Attachment.Title>
					<Attachment.Description>Too large, limit is 20 MB</Attachment.Description>
				</Attachment.Content>
			</Attachment.Root>
			<Attachment.Root state="idle" size="xs">
				<Attachment.Media><ImageIcon /></Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>Drop an image</Attachment.Title>
				</Attachment.Content>
			</Attachment.Root>
		</Attachment.Group>
		<div class="flex flex-wrap gap-3">
			<Attachment.Root orientation="vertical">
				<Attachment.Media variant="image"><img src={favicon} alt="" /></Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>favicon.svg</Attachment.Title>
					<Attachment.Description>SVG, 1.1 kB</Attachment.Description>
				</Attachment.Content>
				<Attachment.Trigger aria-label="Open favicon.svg" />
			</Attachment.Root>
			<Attachment.Root orientation="vertical" state="uploading">
				<Attachment.Media variant="image"><img src={favicon} alt="" /></Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>hero.png</Attachment.Title>
					<Attachment.Description>Uploading</Attachment.Description>
				</Attachment.Content>
			</Attachment.Root>
			<Attachment.Root>
				<Attachment.Media><FileTextIcon /></Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>restyle-brief.md</Attachment.Title>
					<Attachment.Description>Clickable: hover and Tab</Attachment.Description>
				</Attachment.Content>
				<Attachment.Trigger aria-label="Open restyle-brief.md" />
			</Attachment.Root>
		</div>
	</section>

	<!-- Message, bubble, marker -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label text-muted-foreground">Message, bubble, marker</h2>
		<div class="grid gap-12 md:grid-cols-2">
			<div class="flex flex-col gap-6">
				<Marker.Root variant="separator">
					<Marker.Content>Tuesday 21 October</Marker.Content>
				</Marker.Root>
				<Message.Root align="end">
					<Message.Content>
						<Bubble.Root align="end">
							<Bubble.Content>Which palette fits a page about Lisbon trams?</Bubble.Content>
						</Bubble.Root>
					</Message.Content>
				</Message.Root>
				<Message.Root>
					<Message.Avatar>
						<Avatar.Root><Avatar.Fallback>IS</Avatar.Fallback></Avatar.Root>
					</Message.Avatar>
					<Message.Content>
						<Message.Header>Isometric</Message.Header>
						<Bubble.Root variant="outline">
							<Bubble.Content>
								Ember. The tram livery is close to its red primary, and the straw signal can mark
								the next departure.
							</Bubble.Content>
							<Bubble.Reactions>Agreed · 2</Bubble.Reactions>
						</Bubble.Root>
						<Message.Footer>09:42</Message.Footer>
					</Message.Content>
				</Message.Root>
				<Marker.Root>
					<Marker.Content>Palette switched to ember</Marker.Content>
				</Marker.Root>
				<Marker.Root>
					<Marker.Icon><FlagIcon /></Marker.Icon>
					<Marker.Content>Marked as the <a href="#marker">final answer</a></Marker.Content>
				</Marker.Root>
				<Marker.Root variant="border">
					<Marker.Content>Border marker</Marker.Content>
				</Marker.Root>
			</div>
			<div class="flex flex-col gap-4">
				<Bubble.Group>
					<Bubble.Root variant="default"><Bubble.Content>Default (user)</Bubble.Content></Bubble.Root>
					<Bubble.Root variant="outline"><Bubble.Content>Outline (assistant)</Bubble.Content></Bubble.Root>
					<Bubble.Root variant="secondary"><Bubble.Content>Secondary</Bubble.Content></Bubble.Root>
					<Bubble.Root variant="muted"><Bubble.Content>Muted</Bubble.Content></Bubble.Root>
					<Bubble.Root variant="tinted"><Bubble.Content>Tinted with the primary</Bubble.Content></Bubble.Root>
					<Bubble.Root variant="ghost"><Bubble.Content>Ghost, no surface</Bubble.Content></Bubble.Root>
					<Bubble.Root variant="destructive">
						<Bubble.Content>Destructive: the upload failed.</Bubble.Content>
					</Bubble.Root>
				</Bubble.Group>
				<Bubble.Group>
					<Bubble.Root variant="outline">
						<Bubble.Content>
							{#snippet child({ props })}
								<button type="button" {...props}>Outline bubble as a button</button>
							{/snippet}
						</Bubble.Content>
					</Bubble.Root>
					<Bubble.Root variant="default" align="end">
						<Bubble.Content>
							{#snippet child({ props })}
								<button type="button" {...props}>Default bubble as a button</button>
							{/snippet}
						</Bubble.Content>
					</Bubble.Root>
				</Bubble.Group>
			</div>
		</div>
	</section>

	<!-- Message scroller -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label text-muted-foreground">Message scroller</h2>
		<div class="border-border h-80 rounded-lg border">
			<MessageScroller.Provider>
				<MessageScroller.Root>
					<MessageScroller.Viewport class="px-4">
						<MessageScroller.Content class="py-4">
							{#each transcript as message (message.id)}
								<MessageScroller.Item messageId={message.id} scrollAnchor={message.role === "user"}>
									<Message.Root align={message.role === "user" ? "end" : "start"}>
										<Message.Content>
											<Bubble.Root
												variant={message.role === "user" ? "default" : "outline"}
												align={message.role === "user" ? "end" : "start"}
											>
												<Bubble.Content>{message.text}</Bubble.Content>
											</Bubble.Root>
										</Message.Content>
									</Message.Root>
								</MessageScroller.Item>
							{/each}
						</MessageScroller.Content>
					</MessageScroller.Viewport>
					<MessageScroller.Button />
					<MessageScroller.Button direction="start" />
				</MessageScroller.Root>
			</MessageScroller.Provider>
		</div>
	</section>

	<!-- Questionnaire -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label text-muted-foreground">Questionnaire</h2>
		<Card.Root class="max-w-xl">
			<Card.Content>
				<Questionnaire.Root
					items={questions}
					shortcuts="letters"
					onSubmit={(event) => event.preventDefault()}
				>
					<Questionnaire.Progress />
					{#each questions as question (question.name)}
						<Questionnaire.Item
							name={question.name}
							required={question.required}
							multiple={question.multiple}
						>
							<Questionnaire.Title>{question.prompt}</Questionnaire.Title>
							<Questionnaire.Description>{question.description}</Questionnaire.Description>
							<Questionnaire.Choices>
								{#each question.choices as choice (choice.value)}
									<Questionnaire.Choice value={choice.value}>
										{choice.label}
										{#if "description" in choice}
											<Questionnaire.ChoiceDescription>{choice.description}</Questionnaire.ChoiceDescription>
										{/if}
									</Questionnaire.Choice>
								{/each}
								<Questionnaire.Input aria-label="Another answer" placeholder="Another answer" />
							</Questionnaire.Choices>
							<Questionnaire.Error>Choose a palette to continue.</Questionnaire.Error>
						</Questionnaire.Item>
					{/each}
					<Questionnaire.Actions>
						<Questionnaire.Previous>Back</Questionnaire.Previous>
						<Questionnaire.Skip>Skip</Questionnaire.Skip>
						<Questionnaire.Next>Next</Questionnaire.Next>
						<Questionnaire.Submit>Save answers</Questionnaire.Submit>
					</Questionnaire.Actions>
				</Questionnaire.Root>
			</Card.Content>
		</Card.Root>
	</section>

	<!-- Trace -->
	<section class="flex flex-col gap-6">
		<h2 class="type-label text-muted-foreground">Trace</h2>
		<Trace.Root>
			<Trace.Line>
				<Trace.Icon><SearchIcon /></Trace.Icon>
				<Trace.Title>Searched for --ease-move</Trace.Title>
				<Trace.Description>4 files</Trace.Description>
			</Trace.Line>
			<Trace.Collapsible>
				<Trace.CollapsibleTrigger>
					<Trace.Line>
						<Trace.Icon><TerminalIcon /></Trace.Icon>
						<Trace.Title>Ran npm run check</Trace.Title>
						<Trace.Description>12.4 s</Trace.Description>
					</Trace.Line>
				</Trace.CollapsibleTrigger>
				<Trace.CollapsibleContent>svelte-check found 0 errors and 0 warnings in 214 files.</Trace.CollapsibleContent>
			</Trace.Collapsible>
			<Trace.Line status="running">
				<Trace.Icon><PaletteIcon /></Trace.Icon>
				<Trace.Title>Applying the lagoon palette</Trace.Title>
			</Trace.Line>
			<Trace.Line status="error">
				<Trace.Icon><CircleAlertIcon /></Trace.Icon>
				<Trace.Title>Failed to load monument.glb</Trace.Title>
			</Trace.Line>
			<Trace.Line status="pending">
				<Trace.Icon><FileTextIcon /></Trace.Icon>
				<Trace.Title>Write the Lisbon page</Trace.Title>
			</Trace.Line>
		</Trace.Root>
	</section>
</main>
