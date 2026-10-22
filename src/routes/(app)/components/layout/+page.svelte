<script lang="ts">
	import CopyIcon from '@lucide/svelte/icons/copy';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import FileCodeIcon from '@lucide/svelte/icons/file-code';
	import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw';
	import TerminalIcon from '@lucide/svelte/icons/terminal';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { Page, Section, Demo } from '#lib/components/showcase/index.js';
	import { IsoGlyph } from '#lib/components/app/index.js';
	import { AspectRatio } from '#lib/components/ui/aspect-ratio/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as CodeBlock from '#lib/components/ui/code-block/index.js';
	import * as Resizable from '#lib/components/ui/resizable/index.js';
	import { ScrollArea } from '#lib/components/ui/scroll-area/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import { useHighlightedCode } from '#lib/hooks/use-highlighted-code.svelte.js';
	import { CHAPTERS, CHAPTER_GLYPHS, chapterBySlug } from '#lib/catalog.js';

	const chapter = chapterBySlug('layout')!;

	// ---- aspect ratio

	const MONUMENT: [number, number, number][] = [
		[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 0, 1], [1, 0, 1], [2, 0, 1],
		[0, 1, 0], [0, 2, 0], [0, 3, 0], [2, 1, 1], [2, 2, 1]
	];
	const CUBE: [number, number, number][] = [
		[0, 0, 0], [1, 0, 0], [0, 0, 1], [1, 0, 1], [0, 1, 0], [1, 1, 0], [0, 1, 1], [1, 1, 1]
	];

	// ---- resizable

	let sizes = $state({ files: 28, editor: 72, preview: 60, console: 40 });

	// ---- scroll area

	const CITIES = [
		'Amsterdam', 'Athens', 'Auckland', 'Bangalore', 'Barcelona', 'Bogotá', 'Brussels', 'Buenos Aires',
		'Cape Town', 'Chicago', 'Copenhagen', 'Dallas', 'Dublin', 'Frankfurt', 'Helsinki', 'Hong Kong',
		'Istanbul', 'Jakarta', 'Johannesburg', 'Lagos', 'Lima', 'Lisbon', 'London', 'Madrid',
		'Manila', 'Melbourne', 'Mexico City', 'Milan', 'Montreal', 'Mumbai', 'Nairobi', 'Osaka',
		'Oslo', 'Paris', 'San Francisco', 'Santiago', 'São Paulo', 'Seoul', 'Singapore', 'Warsaw'
	];

	// ---- code block

	const svelteSource = `<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';

	let { branch, region, ready }: { branch: string; region: string; ready: boolean } = $props();
	let label = $derived(ready ? 'Ready' : 'Building');
<\/script>

<p class="flex items-center gap-2">
	{branch} in {region}
	<Badge variant={ready ? 'success' : 'warning'}>{label}</Badge>
</p>`;
	const svelteLines = useHighlightedCode(
		() => svelteSource,
		() => 'svelte'
	);

	const installCommand = 'npm install --global @observatory/cli';
	const installLines = useHighlightedCode(
		() => installCommand,
		() => 'bash'
	);

	const DIFF = [
		{ code: ":root[data-theme='dusk'] {", variant: 'default' },
		{ code: '	--primary: oklch(0.43 0.15 274);', variant: 'removed' },
		{ code: '	--primary: oklch(0.446 0.157 274);', variant: 'added' },
		{ code: '	--signal: oklch(0.704 0.192 37);', variant: 'default' },
		{ code: '	--field: oklch(0.391 0.101 279);', variant: 'default' },
		{ code: '}', variant: 'default' }
	] as const;
	const diffSource = DIFF.map((l) => l.code).join('\n');
	const diffLines = useHighlightedCode(
		() => diffSource,
		() => 'css'
	);

	const configSource = `export default defineConfig({
	regions: ['frankfurt', 'san-francisco', 'singapore', 'sao-paulo'],
	build: {
		command: 'npm run build',
		output: 'build'
	},
	previews: { keepDays: 30 }
});`;
	const configLines = useHighlightedCode(
		() => configSource,
		() => 'typescript'
	);

	const buildError = `Error: Could not resolve "three/addons/controls/OrbitControls.js" from "src/lib/scene/monument.ts"
    at packages/scene/src/lib/scene/monument.ts:4:1
Build failed in 12.4s on rotor/snap (Singapore)`;
</script>

<svelte:head>
	<title>{chapter.title} · Isometric</title>
	<meta
		name="description"
		content="Separators, aspect ratios, resizable panes, scroll areas and code blocks in the Isometric design system, with live demos and their source."
	/>
</svelte:head>

<Page
	title={chapter.title}
	description={chapter.subtitle}
	chapter={{ numeral: chapter.numeral, connective: chapter.connective }}
>
	<!-- Separator -->
	<Section
		title="Separator"
		description="A 1px rule between groups. Use space first; reach for a rule only when space alone does not show where one group ends."
	>
		<Demo
			label="Horizontal"
			spec="default orientation · full width"
			code={`<div class="flex w-full max-w-sm flex-col gap-3">
	<div class="flex flex-col gap-1">
		<p class="text-sm font-medium">Observatory</p>
		<p class="text-muted-foreground text-sm">Static site · four regions</p>
	</div>
	<Separator />
	<p class="text-muted-foreground text-sm">Last deployed from main 48s ago.</p>
</div>`}
		>
			<div class="flex w-full max-w-sm flex-col gap-3">
				<div class="flex flex-col gap-1">
					<p class="text-sm font-medium">Observatory</p>
					<p class="text-muted-foreground text-sm">Static site · four regions</p>
				</div>
				<Separator />
				<p class="text-muted-foreground text-sm">Last deployed from main 48s ago.</p>
			</div>
		</Demo>

		<Demo
			label="Vertical in a toolbar"
			spec='orientation="vertical" · between groups'
			code={`<div role="toolbar" aria-label="Deployment" class="flex h-8 items-center gap-1">
	<Button variant="ghost" size="icon" aria-label="Redeploy"><RotateCcwIcon /></Button>
	<Button variant="ghost" size="icon" aria-label="Open preview"><ExternalLinkIcon /></Button>
	<Button variant="ghost" size="icon" aria-label="Copy deploy URL"><CopyIcon /></Button>
	<Separator orientation="vertical" class="mx-1 h-4 self-center" />
	<Button variant="ghost" size="icon" aria-label="Delete deployment"><Trash2Icon /></Button>
</div>`}
		>
			<div role="toolbar" aria-label="Deployment" class="flex h-8 items-center gap-1">
				<Button variant="ghost" size="icon" aria-label="Redeploy"><RotateCcwIcon /></Button>
				<Button variant="ghost" size="icon" aria-label="Open preview"><ExternalLinkIcon /></Button>
				<Button variant="ghost" size="icon" aria-label="Copy deploy URL"><CopyIcon /></Button>
				<Separator orientation="vertical" class="mx-1 h-4 self-center" />
				<Button variant="ghost" size="icon" aria-label="Delete deployment"><Trash2Icon /></Button>
			</div>
			<div class="flex h-5 items-center gap-3 text-sm">
				<span>Frankfurt</span>
				<Separator orientation="vertical" />
				<span>San Francisco</span>
				<Separator orientation="vertical" />
				<span>Singapore</span>
			</div>
		</Demo>

		<Demo
			label="Hairline with a word"
			spec="hairline utility · currentColor at 60%"
			code={`<div class="flex w-full max-w-xs flex-col gap-4">
	<Button variant="outline">Deploy from a Git branch</Button>
	<div class="flex items-center gap-3" aria-hidden="true">
		<span class="hairline flex-1"></span>
		<span class="text-sm lowercase">or</span>
		<span class="hairline flex-1"></span>
	</div>
	<Button variant="outline">Upload a build folder</Button>
</div>`}
		>
			<div class="flex w-full max-w-xs flex-col gap-4">
				<Button variant="outline">Deploy from a Git branch</Button>
				<div class="flex items-center gap-3" aria-hidden="true">
					<span class="hairline flex-1"></span>
					<span class="text-sm lowercase">or</span>
					<span class="hairline flex-1"></span>
				</div>
				<Button variant="outline">Upload a build folder</Button>
			</div>
		</Demo>

		<Demo
			label="Hairline on the field"
			spec="follows the field foreground"
			canvas="field"
			code={`<div class="flex w-full max-w-xs flex-col items-center gap-3">
	<span class="hairline w-20" aria-hidden="true"></span>
	<p class="text-sm">Four regions, one build</p>
	<span class="hairline w-20" aria-hidden="true"></span>
</div>`}
		>
			<div class="flex w-full max-w-xs flex-col items-center gap-3">
				<span class="hairline w-20" aria-hidden="true"></span>
				<p class="text-sm">Four regions, one build</p>
				<span class="hairline w-20" aria-hidden="true"></span>
			</div>
		</Demo>
	</Section>

	<!-- Aspect ratio -->
	<Section
		title="Aspect ratio"
		description="Keeps a box at a fixed proportion as its width changes, so figures and embeds do not jump while they load."
	>
		<Demo
			label="16:9"
			spec="16 / 9 · bg-field · IsoGlyph"
			code={`<div class="w-full max-w-md">
	<AspectRatio ratio={16 / 9} class="bg-field flex items-center justify-center rounded-lg">
		<IsoGlyph cells={MONUMENT} size={120} />
	</AspectRatio>
</div>`}
		>
			<div class="w-full max-w-md">
				<AspectRatio ratio={16 / 9} class="bg-field flex items-center justify-center rounded-lg">
					<IsoGlyph cells={MONUMENT} size={120} />
				</AspectRatio>
			</div>
		</Demo>

		<Demo
			label="1:1"
			spec="1 / 1 · bg-field · IsoGlyph"
			code={`<div class="w-full max-w-48">
	<AspectRatio ratio={1} class="bg-field flex items-center justify-center rounded-lg">
		<IsoGlyph cells={CUBE} size={72} />
	</AspectRatio>
</div>`}
		>
			<div class="w-full max-w-48">
				<AspectRatio ratio={1} class="bg-field flex items-center justify-center rounded-lg">
					<IsoGlyph cells={CUBE} size={72} />
				</AspectRatio>
			</div>
		</Demo>

		<Demo
			label="Ratios side by side"
			spec="4:3 · 1:1 · 3:4 at one width"
			align="start"
			code={`<div class="grid w-full max-w-md grid-cols-3 items-start gap-3">
	{#each [4 / 3, 1, 3 / 4] as ratio (ratio)}
		<AspectRatio {ratio} class="bg-field flex items-center justify-center rounded-lg">
			<IsoGlyph cells={CUBE} size={40} />
		</AspectRatio>
	{/each}
</div>`}
		>
			<div class="grid w-full max-w-md grid-cols-3 items-start gap-3">
				{#each [4 / 3, 1, 3 / 4] as ratio (ratio)}
					<AspectRatio {ratio} class="bg-field flex items-center justify-center rounded-lg">
						<IsoGlyph cells={CUBE} size={40} />
					</AspectRatio>
				{/each}
			</div>
		</Demo>
	</Section>

	<!-- Resizable -->
	<Section
		title="Resizable"
		description="Panes the reader can resize by dragging, or with the arrow keys once a handle has focus. Sizes are percentages of the group."
	>
		<Demo
			label="Horizontal"
			spec='direction="horizontal" · live size'
			align="stretch"
			code={`<Resizable.PaneGroup direction="horizontal" class="min-h-40 rounded-lg border">
	<Resizable.Pane defaultSize={28} minSize={15} onResize={(size) => (sizes.files = size)}>
		<div class="flex h-full flex-col items-center justify-center gap-1 p-4">
			<span class="text-sm font-medium">Files</span>
			<span class="text-muted-foreground text-xs tabular-nums">{Math.round(sizes.files)}%</span>
		</div>
	</Resizable.Pane>
	<Resizable.Handle />
	<Resizable.Pane defaultSize={72} minSize={30} onResize={(size) => (sizes.editor = size)}>
		<div class="flex h-full flex-col items-center justify-center gap-1 p-4">
			<span class="text-sm font-medium">Editor</span>
			<span class="text-muted-foreground text-xs tabular-nums">{Math.round(sizes.editor)}%</span>
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>`}
		>
			<Resizable.PaneGroup direction="horizontal" class="min-h-40 rounded-lg border">
				<Resizable.Pane defaultSize={28} minSize={15} onResize={(size) => (sizes.files = size)}>
					<div class="flex h-full flex-col items-center justify-center gap-1 p-4">
						<span class="text-sm font-medium">Files</span>
						<span class="text-muted-foreground text-xs tabular-nums">{Math.round(sizes.files)}%</span>
					</div>
				</Resizable.Pane>
				<Resizable.Handle />
				<Resizable.Pane defaultSize={72} minSize={30} onResize={(size) => (sizes.editor = size)}>
					<div class="flex h-full flex-col items-center justify-center gap-1 p-4">
						<span class="text-sm font-medium">Editor</span>
						<span class="text-muted-foreground text-xs tabular-nums">{Math.round(sizes.editor)}%</span>
					</div>
				</Resizable.Pane>
			</Resizable.PaneGroup>
		</Demo>

		<Demo
			label="Vertical"
			spec='direction="vertical"'
			align="stretch"
			code={`<Resizable.PaneGroup direction="vertical" class="min-h-64 rounded-lg border">
	<Resizable.Pane defaultSize={60} minSize={20} onResize={(size) => (sizes.preview = size)}>
		<div class="flex h-full flex-col items-center justify-center gap-1 p-4">
			<span class="text-sm font-medium">Preview</span>
			<span class="text-muted-foreground text-xs tabular-nums">{Math.round(sizes.preview)}%</span>
		</div>
	</Resizable.Pane>
	<Resizable.Handle />
	<Resizable.Pane defaultSize={40} minSize={20} onResize={(size) => (sizes.console = size)}>
		<div class="flex h-full flex-col items-center justify-center gap-1 p-4">
			<span class="text-sm font-medium">Console</span>
			<span class="text-muted-foreground text-xs tabular-nums">{Math.round(sizes.console)}%</span>
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>`}
		>
			<Resizable.PaneGroup direction="vertical" class="min-h-64 rounded-lg border">
				<Resizable.Pane defaultSize={60} minSize={20} onResize={(size) => (sizes.preview = size)}>
					<div class="flex h-full flex-col items-center justify-center gap-1 p-4">
						<span class="text-sm font-medium">Preview</span>
						<span class="text-muted-foreground text-xs tabular-nums">{Math.round(sizes.preview)}%</span>
					</div>
				</Resizable.Pane>
				<Resizable.Handle />
				<Resizable.Pane defaultSize={40} minSize={20} onResize={(size) => (sizes.console = size)}>
					<div class="flex h-full flex-col items-center justify-center gap-1 p-4">
						<span class="text-sm font-medium">Console</span>
						<span class="text-muted-foreground text-xs tabular-nums">{Math.round(sizes.console)}%</span>
					</div>
				</Resizable.Pane>
			</Resizable.PaneGroup>
		</Demo>

		<Demo
			label="Nested"
			spec="a vertical group inside a horizontal pane"
			align="stretch"
			code={`<Resizable.PaneGroup direction="horizontal" class="min-h-72 rounded-lg border">
	<Resizable.Pane defaultSize={30} minSize={15}>
		<div class="flex h-full items-center justify-center p-4 text-sm font-medium">Branches</div>
	</Resizable.Pane>
	<Resizable.Handle />
	<Resizable.Pane defaultSize={70}>
		<Resizable.PaneGroup direction="vertical">
			<Resizable.Pane defaultSize={65} minSize={20}>
				<div class="flex h-full items-center justify-center p-4 text-sm font-medium">stairs/landing</div>
			</Resizable.Pane>
			<Resizable.Handle />
			<Resizable.Pane defaultSize={35} minSize={20}>
				<div class="flex h-full items-center justify-center p-4 text-sm font-medium">Build log</div>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</Resizable.Pane>
</Resizable.PaneGroup>`}
		>
			<Resizable.PaneGroup direction="horizontal" class="min-h-72 rounded-lg border">
				<Resizable.Pane defaultSize={30} minSize={15}>
					<div class="flex h-full items-center justify-center p-4 text-sm font-medium">Branches</div>
				</Resizable.Pane>
				<Resizable.Handle />
				<Resizable.Pane defaultSize={70}>
					<Resizable.PaneGroup direction="vertical">
						<Resizable.Pane defaultSize={65} minSize={20}>
							<div class="flex h-full items-center justify-center p-4 text-sm font-medium">stairs/landing</div>
						</Resizable.Pane>
						<Resizable.Handle />
						<Resizable.Pane defaultSize={35} minSize={20}>
							<div class="flex h-full items-center justify-center p-4 text-sm font-medium">Build log</div>
						</Resizable.Pane>
					</Resizable.PaneGroup>
				</Resizable.Pane>
			</Resizable.PaneGroup>
		</Demo>

		<Demo
			label="With handle"
			spec="withHandle · visible grip"
			align="stretch"
			code={`<Resizable.PaneGroup direction="horizontal" class="min-h-40 rounded-lg border">
	<Resizable.Pane defaultSize={50} minSize={20}>
		<div class="flex h-full items-center justify-center p-4 text-sm font-medium">main</div>
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane defaultSize={50} minSize={20}>
		<div class="flex h-full items-center justify-center p-4 text-sm font-medium">rotor/snap</div>
	</Resizable.Pane>
</Resizable.PaneGroup>`}
		>
			<Resizable.PaneGroup direction="horizontal" class="min-h-40 rounded-lg border">
				<Resizable.Pane defaultSize={50} minSize={20}>
					<div class="flex h-full items-center justify-center p-4 text-sm font-medium">main</div>
				</Resizable.Pane>
				<Resizable.Handle withHandle />
				<Resizable.Pane defaultSize={50} minSize={20}>
					<div class="flex h-full items-center justify-center p-4 text-sm font-medium">rotor/snap</div>
				</Resizable.Pane>
			</Resizable.PaneGroup>
		</Demo>
	</Section>

	<!-- Scroll area -->
	<Section
		title="Scroll area"
		description="A fixed box whose content scrolls behind a thin hairline scrollbar. Let the page scroll instead whenever the box has no reason to stay put."
	>
		<Demo
			label="Vertical"
			spec="40 rows · fixed height"
			code={`<ScrollArea class="h-72 w-56 rounded-lg border">
	<div class="flex flex-col p-4">
		<p class="text-muted-foreground pb-3 text-sm">Edge cities</p>
		{#each CITIES as city, i (city)}
			{#if i > 0}<Separator class="my-2" />{/if}
			<span class="text-sm">{city}</span>
		{/each}
	</div>
</ScrollArea>`}
		>
			<ScrollArea class="h-72 w-56 rounded-lg border">
				<div class="flex flex-col p-4">
					<p class="text-muted-foreground pb-3 text-sm">Edge cities</p>
					{#each CITIES as city, i (city)}
						{#if i > 0}<Separator class="my-2" />{/if}
						<span class="text-sm">{city}</span>
					{/each}
				</div>
			</ScrollArea>
		</Demo>

		<Demo
			label="Horizontal"
			spec='orientation="horizontal" · a strip of tiles'
			align="stretch"
			code={`<ScrollArea orientation="horizontal" class="w-full rounded-lg border whitespace-nowrap">
	<div class="flex w-max gap-3 p-4">
		{#each CHAPTERS as c (c.slug)}
			<figure class="flex w-32 shrink-0 flex-col gap-2">
				<div class="bg-field flex aspect-square items-center justify-center rounded-md">
					<IsoGlyph cells={CHAPTER_GLYPHS[c.slug]} size={56} />
				</div>
				<figcaption class="text-sm">{c.numeral} · {c.title}</figcaption>
			</figure>
		{/each}
	</div>
</ScrollArea>`}
		>
			<ScrollArea orientation="horizontal" class="w-full rounded-lg border whitespace-nowrap">
				<div class="flex w-max gap-3 p-4">
					{#each CHAPTERS as c (c.slug)}
						<figure class="flex w-32 shrink-0 flex-col gap-2">
							<div class="bg-field flex aspect-square items-center justify-center rounded-md">
								<IsoGlyph cells={CHAPTER_GLYPHS[c.slug]} size={56} />
							</div>
							<figcaption class="text-sm">{c.numeral} · {c.title}</figcaption>
						</figure>
					{/each}
				</div>
			</ScrollArea>
		</Demo>
	</Section>

	<!-- Code block -->
	<Section
		title="Code block"
		description="Source set in the mono face, highlighted line by line. For a word of code inside a sentence, use an inline code element."
	>
		<Demo
			label="Highlighted"
			spec="useHighlightedCode · CodeBlock.Line · header"
			align="stretch"
			code={`<CodeBlock.Root>
	<CodeBlock.Header>
		<CodeBlock.Title><FileCodeIcon />deploy-status.svelte</CodeBlock.Title>
		<CodeBlock.Actions>
			<CodeBlock.CopyButton value={svelteSource} />
		</CodeBlock.Actions>
	</CodeBlock.Header>
	<CodeBlock.Content>
		{#each svelteLines.current as line, i (i)}
			<CodeBlock.Line code={line} />
		{/each}
	</CodeBlock.Content>
</CodeBlock.Root>`}
		>
			<CodeBlock.Root>
				<CodeBlock.Header>
					<CodeBlock.Title><FileCodeIcon />deploy-status.svelte</CodeBlock.Title>
					<CodeBlock.Actions>
						<CodeBlock.CopyButton value={svelteSource} />
					</CodeBlock.Actions>
				</CodeBlock.Header>
				<CodeBlock.Content>
					{#each svelteLines.current as line, i (i)}
						<CodeBlock.Line code={line} />
					{/each}
				</CodeBlock.Content>
			</CodeBlock.Root>
		</Demo>

		<Demo
			label="Install line with copy button"
			spec='bash · size="sm" · floating actions'
			align="stretch"
			code={`<CodeBlock.Root size="sm">
	<CodeBlock.Content>
		{#each installLines.current as line, i (i)}
			<CodeBlock.Line code={line} />
		{/each}
	</CodeBlock.Content>
	<CodeBlock.Actions>
		<CodeBlock.CopyButton value={installCommand} />
	</CodeBlock.Actions>
</CodeBlock.Root>`}
		>
			<CodeBlock.Root size="sm">
				<CodeBlock.Content>
					{#each installLines.current as line, i (i)}
						<CodeBlock.Line code={line} />
					{/each}
				</CodeBlock.Content>
				<CodeBlock.Actions>
					<CodeBlock.CopyButton value={installCommand} />
				</CodeBlock.Actions>
			</CodeBlock.Root>
		</Demo>

		<Demo
			label="Diff"
			spec="added · removed · footer"
			align="stretch"
			code={`<CodeBlock.Root>
	<CodeBlock.Header>
		<CodeBlock.Title>layout.css</CodeBlock.Title>
	</CodeBlock.Header>
	<CodeBlock.Content lineNumbers>
		{#each diffLines.current as line, i (i)}
			<CodeBlock.Line code={line} variant={DIFF[i].variant} />
		{/each}
	</CodeBlock.Content>
	<CodeBlock.Footer>1 line removed, 1 line added</CodeBlock.Footer>
</CodeBlock.Root>`}
		>
			<CodeBlock.Root>
				<CodeBlock.Header>
					<CodeBlock.Title>layout.css</CodeBlock.Title>
				</CodeBlock.Header>
				<CodeBlock.Content lineNumbers>
					{#each diffLines.current as line, i (i)}
						<CodeBlock.Line code={line} variant={DIFF[i].variant} />
					{/each}
				</CodeBlock.Content>
				<CodeBlock.Footer>1 line removed, 1 line added</CodeBlock.Footer>
			</CodeBlock.Root>
		</Demo>

		<Demo
			label="Line numbers"
			spec="lineNumbers · startLine · highlighted line"
			align="stretch"
			code={`<CodeBlock.Root>
	<CodeBlock.Header>
		<CodeBlock.Title><FileCodeIcon />observatory.config.ts</CodeBlock.Title>
		<CodeBlock.Actions>
			<CodeBlock.CopyButton value={configSource} />
		</CodeBlock.Actions>
	</CodeBlock.Header>
	<CodeBlock.Content lineNumbers startLine={12}>
		{#each configLines.current as line, i (i)}
			<CodeBlock.Line code={line} variant={i === 1 ? 'highlighted' : 'default'} />
		{/each}
	</CodeBlock.Content>
</CodeBlock.Root>`}
		>
			<CodeBlock.Root>
				<CodeBlock.Header>
					<CodeBlock.Title><FileCodeIcon />observatory.config.ts</CodeBlock.Title>
					<CodeBlock.Actions>
						<CodeBlock.CopyButton value={configSource} />
					</CodeBlock.Actions>
				</CodeBlock.Header>
				<CodeBlock.Content lineNumbers startLine={12}>
					{#each configLines.current as line, i (i)}
						<CodeBlock.Line code={line} variant={i === 1 ? 'highlighted' : 'default'} />
					{/each}
				</CodeBlock.Content>
			</CodeBlock.Root>
		</Demo>

		<Demo
			label="Error output"
			spec='variant="destructive" · wrap'
			align="stretch"
			code={`<CodeBlock.Root variant="destructive">
	<CodeBlock.Header>
		<CodeBlock.Title><TerminalIcon />npm run build</CodeBlock.Title>
	</CodeBlock.Header>
	<CodeBlock.Content code={buildError} wrap />
</CodeBlock.Root>`}
		>
			<CodeBlock.Root variant="destructive">
				<CodeBlock.Header>
					<CodeBlock.Title><TerminalIcon />npm run build</CodeBlock.Title>
				</CodeBlock.Header>
				<CodeBlock.Content code={buildError} wrap />
			</CodeBlock.Root>
		</Demo>
	</Section>
</Page>
