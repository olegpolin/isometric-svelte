<script lang="ts">
	import { onDestroy } from 'svelte';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import CircleIcon from '@lucide/svelte/icons/circle';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import FileBracesIcon from '@lucide/svelte/icons/file-braces';
	import FileSearchIcon from '@lucide/svelte/icons/file-search';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import FileWarningIcon from '@lucide/svelte/icons/file-warning';
	import GitBranchIcon from '@lucide/svelte/icons/git-branch';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw';
	import TerminalIcon from '@lucide/svelte/icons/terminal';
	import ThumbsUpIcon from '@lucide/svelte/icons/thumbs-up';
	import XIcon from '@lucide/svelte/icons/x';
	import { Page, Section, Demo } from '#lib/components/showcase/index.js';
	import * as Attachment from '#lib/components/ui/attachment/index.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import * as Bubble from '#lib/components/ui/bubble/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as CodeBlock from '#lib/components/ui/code-block/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import * as Marker from '#lib/components/ui/marker/index.js';
	import * as Message from '#lib/components/ui/message/index.js';
	import * as MessageScroller from '#lib/components/ui/message-scroller/index.js';
	import * as Questionnaire from '#lib/components/ui/questionnaire/index.js';
	import { Spinner } from '#lib/components/ui/spinner/index.js';
	import { Toggle } from '#lib/components/ui/toggle/index.js';
	import * as Trace from '#lib/components/ui/trace/index.js';
	import { chapterBySlug } from '#lib/catalog.js';
	import screenshot from '#lib/assets/conversation/deploy-4a6e2d3.png?enhanced';
	import {
		ANSWER,
		BUILD_LOG,
		DIAGNOSIS,
		DIAGNOSIS_LIVE,
		FILES,
		FOLLOW_UPS,
		LOG_FILE,
		PERSON,
		REGIONS,
		SCREENSHOT,
		SUPPORT,
		THREAD,
		type AttachmentFile,
		type ThreadEntry
	} from '#lib/components/catalog/conversation-data.js';

	const chapter = chapterBySlug('conversation')!;

	/* ---- timers: every simulated stream registers here so leaving the page stops it ---------- */

	let destroyed = false;
	let lastTimer: ReturnType<typeof setTimeout> | undefined;
	function after(ms: number, fn: () => void) {
		lastTimer = setTimeout(() => {
			if (!destroyed) fn();
		}, ms);
	}
	onDestroy(() => {
		destroyed = true;
		clearTimeout(lastTimer);
	});

	const regionName = (value: FormDataEntryValue | null) =>
		REGIONS.find((r) => r.value === value)?.name ?? 'the default region';

	/* ---- message ------------------------------------------------------------------------------ */

	let copied = $state(false);
	let helpful = $state(false);
	async function copyAnswer() {
		try {
			await navigator.clipboard.writeText(ANSWER);
			copied = true;
			after(1600, () => (copied = false));
		} catch {
			// the clipboard is unavailable in this context; the button stays as it was
		}
	}

	/* ---- bubble ------------------------------------------------------------------------------- */

	const SUGGESTIONS = ['Retry in Frankfurt', 'Show the full build log', 'Talk to someone in support'];
	let picked = $state<string | null>(null);

	const answerWords = ANSWER.split(' ');
	let streamed = $state(0);
	let streaming = $state(false);
	function streamAnswer() {
		streamed = 0;
		streaming = true;
		after(900, function next() {
			streamed += 1;
			if (streamed < answerWords.length) after(45, next);
			else streaming = false;
		});
	}

	let retry = $state<'error' | 'retrying' | 'done'>('error');
	function retryStatus() {
		retry = 'retrying';
		after(1400, () => (retry = 'done'));
	}

	/* ---- attachment --------------------------------------------------------------------------- */

	let logAttached = $state(true);
	let upload = $state<{ state: Attachment.AttachmentState; pct: number }>({ state: 'idle', pct: 0 });
	function startUpload() {
		upload = { state: 'uploading', pct: 0 };
		after(120, function step() {
			upload.pct = Math.min(100, upload.pct + 9);
			if (upload.pct < 100) after(120, step);
			else {
				upload.state = 'processing';
				after(1300, () => (upload.state = 'done'));
			}
		});
	}
	let logCopied = $state(false);
	async function copyLog() {
		try {
			await navigator.clipboard.writeText(BUILD_LOG);
			logCopied = true;
			after(1600, () => (logCopied = false));
		} catch {
			// the clipboard is unavailable in this context
		}
	}

	/* ---- questionnaire ------------------------------------------------------------------------ */

	const regionItems = [
		{ name: 'region', required: true, choices: REGIONS.map((r) => ({ value: r.value, disabled: r.disabled })) }
	];
	let retryRegion = $state<string | null>(null);

	const stepItems = [
		{ name: 'retry-region', required: true },
		{ name: 'retry-commit', required: true },
		{ name: 'retry-pin' }
	];
	let stepSummary = $state<string | null>(null);

	const checkItems = [
		{
			name: 'checks',
			required: true,
			choices: [{ value: 'lighthouse' }, { value: 'links' }, { value: 'diff' }]
		}
	];
	let checks = $state<string[] | null>(null);

	const nextItems = [{ name: 'next-check', required: true }];
	let nextCheck = $state<string | null>(null);

	const replyItems = [
		{ name: 'reply-region', required: true, choices: REGIONS.map((r) => ({ value: r.value, disabled: r.disabled })) }
	];
	let replyRegion = $state<string | null>(null);

	/* ---- trace -------------------------------------------------------------------------------- */

	let traceStep = $state(1);
	let traceRunning = $state(false);
	function runTrace() {
		traceStep = 0;
		traceRunning = true;
		after(1300, function next() {
			traceStep += 1;
			if (traceStep < DIAGNOSIS.length) after(1300, next);
			else traceRunning = false;
		});
	}
	let logOpen = $state(false);
	let turnOpen = $state(true);

	/* ---- marker ------------------------------------------------------------------------------- */

	let earlierShown = $state(false);

	/* ---- message scroller --------------------------------------------------------------------- */

	type LiveEntry = { id: string; role: 'person' | 'assistant'; text: string; pending?: boolean };
	const LIVE_START: LiveEntry[] = [
		{ id: 'l1', role: 'person', text: 'Is the Frankfurt retry of 4a6e2d3 done?' },
		{ id: 'l2', role: 'assistant', text: 'Yes. It passed in 1 min 34 s and the preview is live.' }
	];
	let live = $state<LiveEntry[]>([...LIVE_START]);
	let followUp = $state(0);
	let replying = $state(false);
	function sendFollowUp() {
		const turn = FOLLOW_UPS[followUp];
		if (!turn) return;
		followUp += 1;
		replying = true;
		const n = live.length;
		live.push({ id: `p${n}`, role: 'person', text: turn.person });
		after(500, () => {
			live.push({ id: `a${n}`, role: 'assistant', text: '', pending: true });
			after(1400, () => {
				const entry = live.find((e) => e.id === `a${n}`);
				if (entry) {
					entry.text = turn.reply;
					entry.pending = false;
				}
				replying = false;
			});
		});
	}
	function resetLive() {
		live = [...LIVE_START];
		followUp = 0;
	}

	/* ---- code shown under each demo: the first thing in its canvas ---------------------------- */

	const CODE = {
		message: `<Message.Root>
	<Message.Avatar>
		<Avatar.Root>
			<Avatar.Fallback>RL</Avatar.Fallback>
		</Avatar.Root>
	</Message.Avatar>
	<Message.Content>
		<Bubble.Root variant="muted">
			<Bubble.Content>Both builds ran on gru-2 during the mirror outage.</Bubble.Content>
		</Bubble.Root>
	</Message.Content>
</Message.Root>`,
		sides: `<Message.Root align="end">
	<Message.Avatar>
		<Avatar.Root>
			<Avatar.Fallback>JW</Avatar.Fallback>
		</Avatar.Root>
	</Message.Avatar>
	<Message.Content>
		<Bubble.Root>
			<Bubble.Content>Why did the preview for rotor/snap fail?</Bubble.Content>
		</Bubble.Root>
	</Message.Content>
</Message.Root>`,
		headerFooter: `<Message.Root>
	<Message.Content>
		<Message.Header>Assistant</Message.Header>
		<Bubble.Root variant="ghost">
			<Bubble.Content>The retry passed in 1 min 34 s.</Bubble.Content>
		</Bubble.Root>
	</Message.Content>
</Message.Root>`,
		group: `<Message.Group>
	<Message.Root>
		<Message.Avatar />
		<Message.Content>
			<Bubble.Root variant="muted">
				<Bubble.Content>I found both builds from last week.</Bubble.Content>
			</Bubble.Root>
		</Message.Content>
	</Message.Root>
	<Message.Root>
		<Message.Avatar>
			<Avatar.Root>
				<Avatar.Fallback>RL</Avatar.Fallback>
			</Avatar.Root>
		</Message.Avatar>
		<Message.Content>
			<Bubble.Root variant="muted">
				<Bubble.Content>They failed on the same mirror.</Bubble.Content>
			</Bubble.Root>
		</Message.Content>
	</Message.Root>
</Message.Group>`,
		actions: `<Message.Root>
	<Message.Content>
		<Bubble.Root variant="ghost">
			<Bubble.Content>{ANSWER}</Bubble.Content>
		</Bubble.Root>
		<Message.Footer class="gap-1">
			<Button variant="ghost" size="icon-xs" aria-label="Copy reply" onclick={copyAnswer}>
				{#if copied}<CheckIcon />{:else}<CopyIcon />{/if}
			</Button>
			<Toggle size="sm" aria-label="Mark as helpful" bind:pressed={helpful}>
				<ThumbsUpIcon />
			</Toggle>
		</Message.Footer>
	</Message.Content>
</Message.Root>`,
		withAttachments: `<Message.Root align="end">
	<Message.Content>
		<Attachment.Group>
			<Attachment.Root>
				<Attachment.Media>
					<FileTextIcon />
				</Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>build-4a6e2d3.log</Attachment.Title>
					<Attachment.Description>LOG · 18.4 KB</Attachment.Description>
				</Attachment.Content>
			</Attachment.Root>
		</Attachment.Group>
		<Bubble.Root>
			<Bubble.Content>Here is the log and what the page showed.</Bubble.Content>
		</Bubble.Root>
	</Message.Content>
</Message.Root>`,
		variants: `<Bubble.Root align="end">
	<Bubble.Content>Why did the preview fail?</Bubble.Content>
</Bubble.Root>`,
		align: `<Bubble.Root variant="muted">
	<Bubble.Content>Which commit was it?</Bubble.Content>
</Bubble.Root>`,
		bubbleGroup: `<Bubble.Group>
	<Bubble.Root align="end">
		<Bubble.Content>Same commit as before.</Bubble.Content>
	</Bubble.Root>
	<Bubble.Root align="end">
		<Bubble.Content>4a6e2d3, on rotor/snap.</Bubble.Content>
	</Bubble.Root>
</Bubble.Group>`,
		reactions: `<Bubble.Root variant="muted">
	<Bubble.Content>The retry passed in 1 min 34 s.</Bubble.Content>
	<Bubble.Reactions role="img" aria-label="2 people marked this helpful">
		<ThumbsUpIcon />
		<span>2</span>
	</Bubble.Reactions>
</Bubble.Root>`,
		suggestions: `<Bubble.Root variant="tinted" align="end">
	<Bubble.Content>
		{#snippet child({ props })}
			<button {...props} onclick={() => (picked = suggestion)}>{suggestion}</button>
		{/snippet}
	</Bubble.Content>
</Bubble.Root>`,
		streaming: `<Bubble.Root variant="muted">
	<Bubble.Content class="flex items-center gap-2" aria-busy="true">
		<Spinner aria-label="Writing a reply" />
		Reading build-4a6e2d3.log
	</Bubble.Content>
</Bubble.Root>`,
		error: `<Bubble.Root variant="destructive">
	<Bubble.Content>
		The status of the São Paulo mirror could not be loaded. The status service closed the
		connection after 30 s.
	</Bubble.Content>
	<Bubble.Reactions>
		<Button variant="ghost" size="xs" onclick={retryStatus}>
			<RefreshCwIcon data-icon="inline-start" />
			Load the status again
		</Button>
	</Bubble.Reactions>
</Bubble.Root>`,
		long: `<Bubble.Root variant="outline">
	<Bubble.Content>
		https://rotor-snap-4a6e2d3-jonas-weber.preview.observatory.example/assets/three-0.186.1.module.min.js
	</Bubble.Content>
</Bubble.Root>`,
		attachment: `<Attachment.Root>
	<Attachment.Media>
		<FileTextIcon />
	</Attachment.Media>
	<Attachment.Content>
		<Attachment.Title>build-4a6e2d3.log</Attachment.Title>
		<Attachment.Description>LOG · 18.4 KB</Attachment.Description>
	</Attachment.Content>
	<Attachment.Actions>
		<Attachment.Action aria-label="Remove build-4a6e2d3.log" onclick={() => (logAttached = false)}>
			<XIcon />
		</Attachment.Action>
	</Attachment.Actions>
</Attachment.Root>`,
		image: `<Attachment.Root orientation="vertical">
	<Attachment.Media variant="image">
		<enhanced:img
			src={screenshot}
			sizes="8rem"
			alt="The deployment page for 4a6e2d3, failed after 41 s with a registry timeout"
			class="absolute inset-0 size-full object-cover object-left-top"
		/>
	</Attachment.Media>
	<Attachment.Content>
		<Attachment.Title>deploy-4a6e2d3.png</Attachment.Title>
		<Attachment.Description>PNG · 86 KB</Attachment.Description>
	</Attachment.Content>
</Attachment.Root>`,
		states: `<Attachment.Root state="idle" class="w-full">
	<Attachment.Media>
		<ClockIcon />
	</Attachment.Media>
	<Attachment.Content>
		<Attachment.Title>observatory.config.json</Attachment.Title>
		<Attachment.Description>Ready to upload</Attachment.Description>
	</Attachment.Content>
</Attachment.Root>`,
		upload: `<Attachment.Root state={upload.state} class="w-full">
	<Attachment.Media>
		{#if upload.state === 'uploading'}<Spinner />{:else if upload.state === 'done'}<CircleCheckIcon />{:else if upload.state === 'idle'}<ClockIcon />{:else}<FileTextIcon />{/if}
	</Attachment.Media>
	<Attachment.Content>
		<Attachment.Title>build-4a6e2d3.log</Attachment.Title>
		<Attachment.Description>
			{#if upload.state === 'idle'}
				Ready to upload · 18.4 KB
			{:else if upload.state === 'uploading'}
				Uploading · {upload.pct}%
			{:else if upload.state === 'processing'}
				Reading 412 lines
			{:else}
				Uploaded · 18.4 KB
			{/if}
		</Attachment.Description>
	</Attachment.Content>
</Attachment.Root>`,
		sizes: `<Attachment.Root size="default">
	<Attachment.Media>
		<FileTextIcon />
	</Attachment.Media>
	<Attachment.Content>
		<Attachment.Title>build-4a6e2d3.log</Attachment.Title>
		<Attachment.Description>LOG · 18.4 KB</Attachment.Description>
	</Attachment.Content>
</Attachment.Root>`,
		attachmentGroup: `<Attachment.Group>
	{#each FILES as file (file.name)}
		<Attachment.Root class="w-60">
			<Attachment.Media>
				<FileTextIcon />
			</Attachment.Media>
			<Attachment.Content>
				<Attachment.Title>{file.name}</Attachment.Title>
				<Attachment.Description>{file.meta}</Attachment.Description>
			</Attachment.Content>
		</Attachment.Root>
	{/each}
</Attachment.Group>`,
		trigger: `<Dialog.Root>
	<Attachment.Root>
		<Attachment.Media>
			<FileTextIcon />
		</Attachment.Media>
		<Attachment.Content>
			<Attachment.Title>build-4a6e2d3.log</Attachment.Title>
			<Attachment.Description>Open the last ten lines</Attachment.Description>
		</Attachment.Content>
		<Attachment.Actions>
			<Attachment.Action aria-label="Copy build-4a6e2d3.log" onclick={copyLog}>
				<CopyIcon />
			</Attachment.Action>
		</Attachment.Actions>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Attachment.Trigger {...props} aria-label="Preview build-4a6e2d3.log" />
			{/snippet}
		</Dialog.Trigger>
	</Attachment.Root>
	<Dialog.Content class="sm:max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>build-4a6e2d3.log</Dialog.Title>
			<Dialog.Description>Lines 403 to 412.</Dialog.Description>
		</Dialog.Header>
		<CodeBlock.Root size="sm">
			<CodeBlock.Content code={BUILD_LOG} lineNumbers startLine={403} />
		</CodeBlock.Root>
	</Dialog.Content>
</Dialog.Root>`,
		question: `<Questionnaire.Root items={regionItems} shortcuts="letters" onSubmit={submitRegion}>
	<Questionnaire.Item name="region" required>
		<Questionnaire.Title>Where should the retry build?</Questionnaire.Title>
		<Questionnaire.Description>São Paulo is out until its registry mirror recovers.</Questionnaire.Description>
		<Questionnaire.Choices>
			{#each REGIONS as region (region.value)}
				<Questionnaire.Choice value={region.value} disabled={region.disabled}>
					{region.name}
					<Questionnaire.ChoiceDescription>{region.note}</Questionnaire.ChoiceDescription>
				</Questionnaire.Choice>
			{/each}
		</Questionnaire.Choices>
		<Questionnaire.Error />
	</Questionnaire.Item>
	<Questionnaire.Actions>
		<Questionnaire.Submit>Retry the build</Questionnaire.Submit>
	</Questionnaire.Actions>
</Questionnaire.Root>`,
		steps: `<Questionnaire.Root items={stepItems} onSubmit={submitSteps}>
	<Questionnaire.Progress />
	<Questionnaire.Item name="retry-region" required>...</Questionnaire.Item>
	<Questionnaire.Item name="retry-commit" required>...</Questionnaire.Item>
	<Questionnaire.Item name="retry-pin">...</Questionnaire.Item>
	<Questionnaire.Actions>
		<Questionnaire.Previous>Back</Questionnaire.Previous>
		<Questionnaire.Skip>Skip</Questionnaire.Skip>
		<Questionnaire.Next>Continue</Questionnaire.Next>
		<Questionnaire.Submit>Retry the build</Questionnaire.Submit>
	</Questionnaire.Actions>
</Questionnaire.Root>`,
		multiple: `<Questionnaire.Item name="checks" multiple required>
	<Questionnaire.Title>What should run once the preview is up?</Questionnaire.Title>
	<Questionnaire.Choices>
		<Questionnaire.Choice value="lighthouse">Lighthouse on the landing page</Questionnaire.Choice>
		<Questionnaire.Choice value="links">Link check across 37 pages</Questionnaire.Choice>
		<Questionnaire.Choice value="diff">Visual diff against main</Questionnaire.Choice>
	</Questionnaire.Choices>
	<Questionnaire.Error />
</Questionnaire.Item>`,
		freeform: `<Questionnaire.Choices>
	<Questionnaire.Choice value="last-week">The two failed builds from last week</Questionnaire.Choice>
	<Questionnaire.Choice value="cache">Cache hit rate on rotor/snap</Questionnaire.Choice>
	<Questionnaire.Input aria-label="Something else to check" placeholder="Something else" />
</Questionnaire.Choices>`,
		inReply: `<Message.Root>
	<Message.Content>
		<Message.Header>Assistant</Message.Header>
		<Bubble.Root variant="ghost">
			<Bubble.Content>I can retry 4a6e2d3 now. Pick a region.</Bubble.Content>
		</Bubble.Root>
		<Questionnaire.Root items={replyItems} shortcuts="numbers" onSubmit={submitReply}>
			...
		</Questionnaire.Root>
	</Message.Content>
</Message.Root>`,
		trace: `<Trace.Root>
	<Trace.Line>
		<Trace.Icon>
			<FileSearchIcon />
		</Trace.Icon>
		<Trace.Title>Fetched the build log for 4a6e2d3</Trace.Title>
		<Trace.Description>0.4 s</Trace.Description>
	</Trace.Line>
</Trace.Root>`,
		status: `<Trace.Line status="error">
	<Trace.Icon>
		<CircleAlertIcon />
	</Trace.Icon>
	<Trace.Title>Failed to load the São Paulo mirror status</Trace.Title>
</Trace.Line>`,
		collapsible: `<Trace.Collapsible bind:open={logOpen}>
	<Trace.CollapsibleTrigger>
		<Trace.Line>
			<Trace.Icon>
				<FileTextIcon />
			</Trace.Icon>
			<Trace.Title>Read build-4a6e2d3.log</Trace.Title>
			<Trace.Description>412 lines</Trace.Description>
		</Trace.Line>
	</Trace.CollapsibleTrigger>
	<Trace.CollapsibleContent>
		<CodeBlock.Root size="sm">
			<CodeBlock.Content wrap code={BUILD_LOG} />
		</CodeBlock.Root>
	</Trace.CollapsibleContent>
</Trace.Collapsible>`,
		progress: `<Trace.Line status="running">
	<Trace.Icon>
		<Spinner />
	</Trace.Icon>
	<Trace.Title>Reading build-4a6e2d3.log</Trace.Title>
</Trace.Line>`,
		turn: `<Trace.Collapsible bind:open={turnOpen}>
	<Trace.CollapsibleTrigger>
		<Trace.Line status="error">
			<Trace.Title>Worked for 6 s, 1 step failed</Trace.Title>
		</Trace.Line>
	</Trace.CollapsibleTrigger>
	<Trace.CollapsibleContent class="flex flex-col gap-2">
		<Trace.Root>...</Trace.Root>
		<p>The install step timed out. Opening the deployment.</p>
		<Trace.Root>
			<a href="/dashboard">...</a>
		</Trace.Root>
	</Trace.CollapsibleContent>
</Trace.Collapsible>`,
		markers: `<Marker.Root>
	<Marker.Content>Build 4a6e2d3 failed after 41 s</Marker.Content>
</Marker.Root>`,
		liveMarker: `<Marker.Root role="status">
	<Marker.Icon>
		<Spinner />
	</Marker.Icon>
	<Marker.Content>Fetching the build log</Marker.Content>
</Marker.Root>`,
		typing: `<Marker.Root role="status">
	<Marker.Content class="shimmer">Jonas is typing</Marker.Content>
</Marker.Root>`,
		separators: `<Marker.Root variant="separator">
	<Marker.Content>Today</Marker.Content>
</Marker.Root>`,
		icons: `<Marker.Root>
	<Marker.Icon>
		<RotateCcwIcon />
	</Marker.Icon>
	<Marker.Content>Retry of 4a6e2d3 started in Frankfurt</Marker.Content>
</Marker.Root>`,
		link: `<Marker.Root>
	{#snippet child({ props })}
		<a href="/dashboard" {...props}>
			<Marker.Icon>
				<ExternalLinkIcon />
			</Marker.Icon>
			<Marker.Content>Open deployment 4a6e2d3</Marker.Content>
		</a>
	{/snippet}
</Marker.Root>`,
		scroller: `<MessageScroller.Provider defaultScrollPosition="last-anchor">
	<MessageScroller.Root>
		<MessageScroller.Viewport>
			<MessageScroller.Content class="p-4">
				{#each THREAD as entry (entry.id)}
					<MessageScroller.Item messageId={entry.id} scrollAnchor={entry.kind === 'person'}>
						{@render threadEntry(entry)}
					</MessageScroller.Item>
				{/each}
			</MessageScroller.Content>
		</MessageScroller.Viewport>
		<MessageScroller.Button />
	</MessageScroller.Root>
</MessageScroller.Provider>`,
		following: `<MessageScroller.Provider autoScroll>
	<MessageScroller.Root>
		<MessageScroller.Viewport>
			<MessageScroller.Content class="p-4">
				{#each live as entry (entry.id)}
					<MessageScroller.Item messageId={entry.id} scrollAnchor={entry.role === 'person'}>
						{@render liveEntry(entry)}
					</MessageScroller.Item>
				{/each}
			</MessageScroller.Content>
		</MessageScroller.Viewport>
		<MessageScroller.Button />
	</MessageScroller.Root>
</MessageScroller.Provider>`,
		directions: `<MessageScroller.Provider defaultScrollPosition="start">
	<MessageScroller.Root>
		<MessageScroller.Viewport>
			<MessageScroller.Content class="p-4">...</MessageScroller.Content>
		</MessageScroller.Viewport>
		<MessageScroller.Button direction="start" />
		<MessageScroller.Button />
	</MessageScroller.Root>
</MessageScroller.Provider>`
	};
</script>

<svelte:head>
	<title>{chapter.title} · Isometric</title>
	<meta
		name="description"
		content="Message, bubble, attachment, questionnaire, trace, marker and message scroller: the parts of a conversation between a person and an assistant, shown on one support thread."
	/>
</svelte:head>

{#snippet personAvatar()}
	<Message.Avatar>
		<Avatar.Root>
			<Avatar.Fallback>{PERSON.initials}</Avatar.Fallback>
		</Avatar.Root>
	</Message.Avatar>
{/snippet}

{#snippet supportAvatar()}
	<Message.Avatar>
		<Avatar.Root>
			<Avatar.Fallback>{SUPPORT.initials}</Avatar.Fallback>
		</Avatar.Root>
	</Message.Avatar>
{/snippet}

{#snippet fileAttachment(file: AttachmentFile)}
	<Attachment.Root>
		{#if file.kind === 'image'}
			<Attachment.Media variant="image">
				<enhanced:img
					src={screenshot}
					sizes="2.5rem"
					alt=""
					class="absolute inset-0 size-full object-cover"
				/>
			</Attachment.Media>
		{:else}
			<Attachment.Media>
				{#if file.kind === 'log'}<FileTextIcon />{:else}<FileBracesIcon />{/if}
			</Attachment.Media>
		{/if}
		<Attachment.Content>
			<Attachment.Title>{file.name}</Attachment.Title>
			<Attachment.Description>{file.meta}</Attachment.Description>
		</Attachment.Content>
	</Attachment.Root>
{/snippet}

{#snippet steps(list: typeof DIAGNOSIS)}
	<Trace.Root>
		{#each list as step (step.title)}
			<Trace.Line>
				<Trace.Icon>
					<step.icon />
				</Trace.Icon>
				<Trace.Title>{step.title}</Trace.Title>
				{#if step.description}
					<Trace.Description>{step.description}</Trace.Description>
				{/if}
			</Trace.Line>
		{/each}
	</Trace.Root>
{/snippet}

{#snippet threadEntry(entry: ThreadEntry)}
	{#if entry.kind === 'marker'}
		<Marker.Root variant={entry.variant}>
			{#if entry.icon}
				<Marker.Icon>
					<entry.icon />
				</Marker.Icon>
			{/if}
			<Marker.Content>{entry.text}</Marker.Content>
		</Marker.Root>
	{:else if entry.kind === 'person'}
		<Message.Root align="end">
			<Message.Content>
				{#if entry.attachments}
					<Attachment.Group>
						{#each entry.attachments as file (file.name)}
							{@render fileAttachment(file)}
						{/each}
					</Attachment.Group>
				{/if}
				{#if entry.text}
					<Bubble.Root>
						<Bubble.Content>{entry.text}</Bubble.Content>
					</Bubble.Root>
				{/if}
				{#if entry.footer}
					<Message.Footer>{entry.footer}</Message.Footer>
				{/if}
			</Message.Content>
		</Message.Root>
	{:else if entry.kind === 'support'}
		<Message.Root>
			{@render supportAvatar()}
			<Message.Content>
				<Message.Header>{SUPPORT.name}</Message.Header>
				<Bubble.Root variant="muted">
					<Bubble.Content>{entry.text}</Bubble.Content>
				</Bubble.Root>
			</Message.Content>
		</Message.Root>
	{:else}
		<Message.Root>
			<Message.Content>
				{#if entry.steps}
					{@render steps(entry.steps)}
				{/if}
				{#if entry.text}
					<Bubble.Root variant={entry.error ? 'destructive' : 'ghost'}>
						<Bubble.Content>{entry.text}</Bubble.Content>
					</Bubble.Root>
				{/if}
			</Message.Content>
		</Message.Root>
	{/if}
{/snippet}

{#snippet liveEntry(entry: LiveEntry)}
	{#if entry.role === 'person'}
		<Message.Root align="end">
			<Message.Content>
				<Bubble.Root>
					<Bubble.Content>{entry.text}</Bubble.Content>
				</Bubble.Root>
			</Message.Content>
		</Message.Root>
	{:else}
		<Message.Root>
			<Message.Content>
				{#if entry.pending}
					<Bubble.Root variant="muted">
						<Bubble.Content class="flex items-center gap-2" aria-busy="true">
							<Spinner aria-label="Writing a reply" />
							Checking stairs/landing
						</Bubble.Content>
					</Bubble.Root>
				{:else}
					<Bubble.Root variant="ghost">
						<Bubble.Content>{entry.text}</Bubble.Content>
					</Bubble.Root>
				{/if}
			</Message.Content>
		</Message.Root>
	{/if}
{/snippet}

<Page
	title={chapter.title}
	description={chapter.subtitle}
	chapter={{ numeral: chapter.numeral, connective: chapter.connective }}
>
	<!-- ============================================================================== Message -->
	<Section
		title="Message"
		description="One row of a conversation: who sent it, which side it sits on, and the name, status and actions around it. The visible surface inside is a Bubble."
	>
		<Demo label="A single message" spec="avatar · content · bubble" code={CODE.message}>
			<div class="flex w-full max-w-md flex-col">
				<Message.Root>
					<Message.Avatar>
						<Avatar.Root>
							<Avatar.Fallback>RL</Avatar.Fallback>
						</Avatar.Root>
					</Message.Avatar>
					<Message.Content>
						<Bubble.Root variant="muted">
							<Bubble.Content>Both builds ran on gru-2 during the mirror outage.</Bubble.Content>
						</Bubble.Root>
					</Message.Content>
				</Message.Root>
			</div>
		</Demo>

		<Demo label="Both sides" spec="align end for the reader · start for everyone else" code={CODE.sides}>
			<div class="flex w-full max-w-md flex-col gap-6">
				<Message.Root align="end">
					<Message.Avatar>
						<Avatar.Root>
							<Avatar.Fallback>JW</Avatar.Fallback>
						</Avatar.Root>
					</Message.Avatar>
					<Message.Content>
						<Bubble.Root>
							<Bubble.Content>Why did the preview for rotor/snap fail?</Bubble.Content>
						</Bubble.Root>
					</Message.Content>
				</Message.Root>
				<Message.Root>
					{@render supportAvatar()}
					<Message.Content>
						<Bubble.Root variant="muted">
							<Bubble.Content>The install step timed out on the São Paulo builder.</Bubble.Content>
						</Bubble.Root>
					</Message.Content>
				</Message.Root>
			</div>
		</Demo>

		<Demo label="Header and footer" spec="sender name · read status" code={CODE.headerFooter}>
			<div class="flex w-full max-w-md flex-col gap-6">
				<Message.Root>
					<Message.Content>
						<Message.Header>Assistant</Message.Header>
						<Bubble.Root variant="ghost">
							<Bubble.Content>The retry passed in 1 min 34 s.</Bubble.Content>
						</Bubble.Root>
					</Message.Content>
				</Message.Root>
				<Message.Root align="end">
					{@render personAvatar()}
					<Message.Content>
						<Message.Header>{PERSON.name}</Message.Header>
						<Bubble.Root>
							<Bubble.Content>Thanks. Leaving São Paulo on for now.</Bubble.Content>
						</Bubble.Root>
						<Message.Footer>Read 14:31</Message.Footer>
					</Message.Content>
				</Message.Root>
			</div>
		</Demo>

		<Demo label="Consecutive messages" spec="Message.Group · empty avatar on the earlier rows" code={CODE.group}>
			<div class="flex w-full max-w-md flex-col">
				<Message.Group>
					<Message.Root>
						<Message.Avatar />
						<Message.Content>
							<Bubble.Root variant="muted">
								<Bubble.Content>I found both builds from last week.</Bubble.Content>
							</Bubble.Root>
						</Message.Content>
					</Message.Root>
					<Message.Root>
						<Message.Avatar>
							<Avatar.Root>
								<Avatar.Fallback>RL</Avatar.Fallback>
							</Avatar.Root>
						</Message.Avatar>
						<Message.Content>
							<Bubble.Root variant="muted">
								<Bubble.Content>They failed on the same mirror.</Bubble.Content>
							</Bubble.Root>
						</Message.Content>
					</Message.Root>
				</Message.Group>
			</div>
		</Demo>

		<Demo label="With actions" spec="copy · mark as helpful" code={CODE.actions}>
			<div class="flex w-full max-w-md flex-col">
				<Message.Root>
					<Message.Content>
						<Bubble.Root variant="ghost">
							<Bubble.Content>{ANSWER}</Bubble.Content>
						</Bubble.Root>
						<Message.Footer class="gap-1">
							<Button variant="ghost" size="icon-xs" aria-label="Copy reply" onclick={copyAnswer}>
								{#if copied}<CheckIcon />{:else}<CopyIcon />{/if}
							</Button>
							<Toggle size="sm" aria-label="Mark as helpful" bind:pressed={helpful}>
								<ThumbsUpIcon />
							</Toggle>
						</Message.Footer>
					</Message.Content>
				</Message.Root>
			</div>
		</Demo>

		<Demo label="With attachments" spec="files above the bubble" code={CODE.withAttachments}>
			<div class="flex w-full max-w-md flex-col">
				<Message.Root align="end">
					<Message.Content>
						<Attachment.Group>
							<Attachment.Root>
								<Attachment.Media>
									<FileTextIcon />
								</Attachment.Media>
								<Attachment.Content>
									<Attachment.Title>build-4a6e2d3.log</Attachment.Title>
									<Attachment.Description>LOG · 18.4 KB</Attachment.Description>
								</Attachment.Content>
							</Attachment.Root>
							{@render fileAttachment(SCREENSHOT)}
						</Attachment.Group>
						<Bubble.Root>
							<Bubble.Content>Here is the log and what the page showed.</Bubble.Content>
						</Bubble.Root>
					</Message.Content>
				</Message.Root>
			</div>
		</Demo>
	</Section>

	<!-- =============================================================================== Bubble -->
	<Section
		title="Bubble"
		description="The visible surface of a message. Ghost suits long assistant answers that should read as text; keep destructive for something that failed."
	>
		<Demo
			label="Seven variants"
			spec="default · secondary · muted · tinted · outline · ghost · destructive"
			code={CODE.variants}
		>
			<div class="flex w-full max-w-md flex-col gap-4">
				<Bubble.Root align="end">
					<Bubble.Content>Why did the preview fail?</Bubble.Content>
				</Bubble.Root>
				<Bubble.Root variant="secondary">
					<Bubble.Content>Secondary: the neutral surface for conversation.</Bubble.Content>
				</Bubble.Root>
				<Bubble.Root variant="muted">
					<Bubble.Content>Muted: quieter, for supporting replies.</Bubble.Content>
				</Bubble.Root>
				<Bubble.Root variant="tinted" align="end">
					<Bubble.Content>Tinted: the key colour mixed into the card.</Bubble.Content>
				</Bubble.Root>
				<Bubble.Root variant="outline">
					<Bubble.Content>Outline: a card face with a hairline.</Bubble.Content>
				</Bubble.Root>
				<Bubble.Root variant="ghost">
					<Bubble.Content>
						Ghost: no frame and the full width of the row, for an assistant answer that reads as
						running text.
					</Bubble.Content>
				</Bubble.Root>
				<Bubble.Root variant="destructive">
					<Bubble.Content>Destructive: the reply could not be generated.</Bubble.Content>
				</Bubble.Root>
			</div>
		</Demo>

		<Demo label="Start and end" spec="align start · end" code={CODE.align}>
			<div class="flex w-full max-w-md flex-col gap-4">
				<Bubble.Root variant="muted">
					<Bubble.Content>Which commit was it?</Bubble.Content>
				</Bubble.Root>
				<Bubble.Root align="end">
					<Bubble.Content>4a6e2d3, on rotor/snap.</Bubble.Content>
				</Bubble.Root>
			</div>
		</Demo>

		<Demo label="Bubble group" spec="consecutive bubbles from one sender" code={CODE.bubbleGroup}>
			<div class="flex w-full max-w-md flex-col gap-4">
				<Bubble.Group>
					<Bubble.Root align="end">
						<Bubble.Content>Same commit as before.</Bubble.Content>
					</Bubble.Root>
					<Bubble.Root align="end">
						<Bubble.Content>4a6e2d3, on rotor/snap.</Bubble.Content>
					</Bubble.Root>
				</Bubble.Group>
				<Bubble.Root variant="muted">
					<Bubble.Content>Found it. It failed after 41 s.</Bubble.Content>
				</Bubble.Root>
			</div>
		</Demo>

		<Demo label="Reactions" spec="side bottom · top · align end · start" code={CODE.reactions}>
			<div class="flex w-full max-w-md flex-col gap-12 py-4">
				<Bubble.Root variant="muted">
					<Bubble.Content>The retry passed in 1 min 34 s.</Bubble.Content>
					<Bubble.Reactions role="img" aria-label="2 people marked this helpful">
						<ThumbsUpIcon />
						<span>2</span>
					</Bubble.Reactions>
				</Bubble.Root>
				<Bubble.Root align="end">
					<Bubble.Content>Thanks, that was quick.</Bubble.Content>
					<Bubble.Reactions side="top" align="start" role="img" aria-label="Read by the assistant">
						<CheckIcon />
					</Bubble.Reactions>
				</Bubble.Root>
			</div>
		</Demo>

		<Demo label="Suggested replies" spec="Bubble.Content as a button · tinted" code={CODE.suggestions}>
			<div class="flex w-full max-w-md flex-col gap-4">
				<Bubble.Root variant="ghost">
					<Bubble.Content>The São Paulo mirror timed out. What would you like to do?</Bubble.Content>
				</Bubble.Root>
				{#if picked}
					<Bubble.Root align="end">
						<Bubble.Content>{picked}</Bubble.Content>
					</Bubble.Root>
					<Button variant="link" size="sm" class="self-start" onclick={() => (picked = null)}>
						Show the suggestions again
					</Button>
				{:else}
					<Bubble.Group>
						{#each SUGGESTIONS as suggestion (suggestion)}
							<Bubble.Root variant="tinted" align="end">
								<Bubble.Content>
									{#snippet child({ props })}
										<button {...props} onclick={() => (picked = suggestion)}>{suggestion}</button>
									{/snippet}
								</Bubble.Content>
							</Bubble.Root>
						{/each}
					</Bubble.Group>
				{/if}
			</div>
		</Demo>

		<Demo label="Streaming" spec="Spinner while waiting · words arrive one by one" code={CODE.streaming}>
			<div class="flex w-full max-w-md flex-col gap-4">
				{#if streamed === 0}
					<Bubble.Root variant="muted">
						<Bubble.Content class="flex items-center gap-2" aria-busy="true">
							<Spinner aria-label="Writing a reply" />
							Reading build-4a6e2d3.log
						</Bubble.Content>
					</Bubble.Root>
				{:else}
					<Bubble.Root variant="ghost">
						<Bubble.Content aria-busy={streaming}>{answerWords.slice(0, streamed).join(' ')}</Bubble.Content>
					</Bubble.Root>
				{/if}
				<Button variant="outline" size="sm" class="self-start" disabled={streaming} onclick={streamAnswer}>
					{#if streaming}
						<Spinner data-icon="inline-start" />
						Writing
					{:else}
						<RotateCcwIcon data-icon="inline-start" />
						{streamed === 0 ? 'Stream the reply' : 'Stream it again'}
					{/if}
				</Button>
			</div>
		</Demo>

		<Demo label="Error" spec="destructive · a retry in the reactions row" code={CODE.error}>
			<div class="flex w-full max-w-md flex-col gap-4 pb-4">
				{#if retry === 'done'}
					<Bubble.Root variant="muted">
						<Bubble.Content>
							The São Paulo mirror is still degraded. 14 of 60 fetches timed out in the last ten minutes.
						</Bubble.Content>
					</Bubble.Root>
					<Button variant="link" size="sm" class="self-start" onclick={() => (retry = 'error')}>
						Show the error again
					</Button>
				{:else}
					<Bubble.Root variant="destructive">
						<Bubble.Content>
							The status of the São Paulo mirror could not be loaded. The status service closed the
							connection after 30 s.
						</Bubble.Content>
						<Bubble.Reactions>
							<Button variant="ghost" size="xs" disabled={retry === 'retrying'} onclick={retryStatus}>
								{#if retry === 'retrying'}
									<Spinner data-icon="inline-start" />
									Loading the status
								{:else}
									<RefreshCwIcon data-icon="inline-start" />
									Load the status again
								{/if}
							</Button>
						</Bubble.Reactions>
					</Bubble.Root>
				{/if}
			</div>
		</Demo>

		<Demo label="Long unbroken text" spec="wraps at any character" code={CODE.long}>
			<div class="flex w-full max-w-md flex-col">
				<Bubble.Root variant="outline">
					<Bubble.Content>
						https://rotor-snap-4a6e2d3-jonas-weber.preview.observatory.example/assets/three-0.186.1.module.min.js
					</Bubble.Content>
				</Bubble.Root>
			</div>
		</Demo>
	</Section>

	<!-- =========================================================================== Attachment -->
	<Section
		title="Attachment"
		description="A file sent with a message, with its upload state. Add a trigger when the reader should be able to open it in place."
	>
		<Demo label="A file" spec="icon media · title · description · remove" code={CODE.attachment}>
			{#if logAttached}
				<Attachment.Root>
					<Attachment.Media>
						<FileTextIcon />
					</Attachment.Media>
					<Attachment.Content>
						<Attachment.Title>build-4a6e2d3.log</Attachment.Title>
						<Attachment.Description>LOG · 18.4 KB</Attachment.Description>
					</Attachment.Content>
					<Attachment.Actions>
						<Attachment.Action aria-label="Remove build-4a6e2d3.log" onclick={() => (logAttached = false)}>
							<XIcon />
						</Attachment.Action>
					</Attachment.Actions>
				</Attachment.Root>
			{:else}
				<Button variant="outline" onclick={() => (logAttached = true)}>
					<FileTextIcon data-icon="inline-start" />
					Attach build-4a6e2d3.log
				</Button>
			{/if}
		</Demo>

		<Demo label="An image" spec="vertical · image media" code={CODE.image}>
			<Attachment.Root orientation="vertical">
				<Attachment.Media variant="image">
					<enhanced:img
						src={screenshot}
						sizes="8rem"
						alt="The deployment page for 4a6e2d3, failed after 41 s with a registry timeout"
						class="absolute inset-0 size-full object-cover object-left-top"
					/>
				</Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>deploy-4a6e2d3.png</Attachment.Title>
					<Attachment.Description>PNG · 86 KB</Attachment.Description>
				</Attachment.Content>
			</Attachment.Root>
		</Demo>

		<Demo label="Upload states" spec="idle · uploading · processing · error · done" code={CODE.states}>
			<div class="flex w-full max-w-sm flex-col gap-2">
				<Attachment.Root state="idle" class="w-full">
					<Attachment.Media>
						<ClockIcon />
					</Attachment.Media>
					<Attachment.Content>
						<Attachment.Title>observatory.config.json</Attachment.Title>
						<Attachment.Description>Ready to upload</Attachment.Description>
					</Attachment.Content>
				</Attachment.Root>
				<Attachment.Root state="uploading" class="w-full">
					<Attachment.Media>
						<Spinner />
					</Attachment.Media>
					<Attachment.Content>
						<Attachment.Title>build-4a6e2d3.log</Attachment.Title>
						<Attachment.Description>Uploading · 64%</Attachment.Description>
					</Attachment.Content>
				</Attachment.Root>
				<Attachment.Root state="processing" class="w-full">
					<Attachment.Media>
						<FileTextIcon />
					</Attachment.Media>
					<Attachment.Content>
						<Attachment.Title>package-lock.json</Attachment.Title>
						<Attachment.Description>Reading 1,284 packages</Attachment.Description>
					</Attachment.Content>
				</Attachment.Root>
				<Attachment.Root state="error" class="w-full">
					<Attachment.Media>
						<FileWarningIcon />
					</Attachment.Media>
					<Attachment.Content>
						<Attachment.Title>build-cache.tar</Attachment.Title>
						<Attachment.Description>412 MB is over the 25 MB limit</Attachment.Description>
					</Attachment.Content>
				</Attachment.Root>
				<Attachment.Root state="done" class="w-full">
					<Attachment.Media>
						<CircleCheckIcon />
					</Attachment.Media>
					<Attachment.Content>
						<Attachment.Title>deploy-4a6e2d3.png</Attachment.Title>
						<Attachment.Description>Uploaded · 86 KB</Attachment.Description>
					</Attachment.Content>
				</Attachment.Root>
			</div>
		</Demo>

		<Demo label="Uploading a file" spec="uploading · processing · done" code={CODE.upload}>
			<div class="flex w-full max-w-sm flex-col items-start gap-3">
				<Attachment.Root state={upload.state} class="w-full">
					<Attachment.Media>
						{#if upload.state === 'uploading'}<Spinner />{:else if upload.state === 'done'}<CircleCheckIcon />{:else if upload.state === 'idle'}<ClockIcon />{:else}<FileTextIcon />{/if}
					</Attachment.Media>
					<Attachment.Content>
						<Attachment.Title>build-4a6e2d3.log</Attachment.Title>
						<Attachment.Description>
							{#if upload.state === 'idle'}
								Ready to upload · 18.4 KB
							{:else if upload.state === 'uploading'}
								Uploading · {upload.pct}%
							{:else if upload.state === 'processing'}
								Reading 412 lines
							{:else}
								Uploaded · 18.4 KB
							{/if}
						</Attachment.Description>
					</Attachment.Content>
				</Attachment.Root>
				<Button
					variant="outline"
					size="sm"
					disabled={upload.state === 'uploading' || upload.state === 'processing'}
					onclick={startUpload}
				>
					<ArrowUpIcon data-icon="inline-start" />
					{upload.state === 'done' ? 'Upload it again' : 'Upload build log'}
				</Button>
			</div>
		</Demo>

		<Demo label="Sizes" spec="default · sm · xs" code={CODE.sizes}>
			<div class="flex w-full max-w-sm flex-col gap-3">
				<Attachment.Root size="default">
					<Attachment.Media>
						<FileTextIcon />
					</Attachment.Media>
					<Attachment.Content>
						<Attachment.Title>build-4a6e2d3.log</Attachment.Title>
						<Attachment.Description>LOG · 18.4 KB</Attachment.Description>
					</Attachment.Content>
				</Attachment.Root>
				<Attachment.Root size="sm">
					<Attachment.Media>
						<FileTextIcon />
					</Attachment.Media>
					<Attachment.Content>
						<Attachment.Title>build-4a6e2d3.log</Attachment.Title>
						<Attachment.Description>LOG · 18.4 KB</Attachment.Description>
					</Attachment.Content>
				</Attachment.Root>
				<Attachment.Root size="xs">
					<Attachment.Media>
						<FileTextIcon />
					</Attachment.Media>
					<Attachment.Content>
						<Attachment.Title>build-4a6e2d3.log</Attachment.Title>
					</Attachment.Content>
				</Attachment.Root>
			</div>
		</Demo>

		<Demo label="A row of files" spec="Attachment.Group · scrolls and snaps · fades at the edge" code={CODE.attachmentGroup}>
			<div class="w-full max-w-md">
				<Attachment.Group>
					{#each FILES as file (file.name)}
						<Attachment.Root class="w-60">
							{#if file.kind === 'image'}
								<Attachment.Media variant="image">
									<enhanced:img
										src={screenshot}
										sizes="2.5rem"
										alt=""
										class="absolute inset-0 size-full object-cover"
									/>
								</Attachment.Media>
							{:else}
								<Attachment.Media>
									{#if file.kind === 'log'}<FileTextIcon />{:else}<FileBracesIcon />{/if}
								</Attachment.Media>
							{/if}
							<Attachment.Content>
								<Attachment.Title>{file.name}</Attachment.Title>
								<Attachment.Description>{file.meta}</Attachment.Description>
							</Attachment.Content>
						</Attachment.Root>
					{/each}
				</Attachment.Group>
			</div>
		</Demo>

		<Demo label="Opens a preview" spec="Attachment.Trigger · Dialog · actions stay clickable" code={CODE.trigger}>
			<Dialog.Root>
				<Attachment.Root>
					<Attachment.Media>
						<FileTextIcon />
					</Attachment.Media>
					<Attachment.Content>
						<Attachment.Title>build-4a6e2d3.log</Attachment.Title>
						<Attachment.Description>Open the last ten lines</Attachment.Description>
					</Attachment.Content>
					<Attachment.Actions>
						<Attachment.Action aria-label="Copy build-4a6e2d3.log" onclick={copyLog}>
							{#if logCopied}<CheckIcon />{:else}<CopyIcon />{/if}
						</Attachment.Action>
					</Attachment.Actions>
					<Dialog.Trigger>
						{#snippet child({ props })}
							<Attachment.Trigger {...props} aria-label="Preview build-4a6e2d3.log" />
						{/snippet}
					</Dialog.Trigger>
				</Attachment.Root>
				<Dialog.Content class="sm:max-w-2xl">
					<Dialog.Header>
						<Dialog.Title>build-4a6e2d3.log</Dialog.Title>
						<Dialog.Description>Lines 403 to 412.</Dialog.Description>
					</Dialog.Header>
					<CodeBlock.Root size="sm">
						<CodeBlock.Content code={BUILD_LOG} lineNumbers startLine={403} />
					</CodeBlock.Root>
				</Dialog.Content>
			</Dialog.Root>
		</Demo>
	</Section>

	<!-- ======================================================================== Questionnaire -->
	<Section
		title="Questionnaire"
		description="Asks the reader one question at a time when the assistant needs an answer to go on. For a setting in a form, use Radio group."
	>
		<Demo label="One question" spec="single answer · required · letter shortcuts · one choice disabled" code={CODE.question} align="start">
			<div class="flex w-full max-w-md flex-col gap-4">
				<Questionnaire.Root
					items={regionItems}
					shortcuts="letters"
					onSubmit={(e) => {
						e.preventDefault();
						retryRegion = regionName(new FormData(e.currentTarget).get('region'));
					}}
				>
					<Questionnaire.Item name="region" required>
						<Questionnaire.Title>Where should the retry build?</Questionnaire.Title>
						<Questionnaire.Description>São Paulo is out until its registry mirror recovers.</Questionnaire.Description>
						<Questionnaire.Choices>
							{#each REGIONS as region (region.value)}
								<Questionnaire.Choice value={region.value} disabled={region.disabled}>
									{region.name}
									<Questionnaire.ChoiceDescription>{region.note}</Questionnaire.ChoiceDescription>
								</Questionnaire.Choice>
							{/each}
						</Questionnaire.Choices>
						<Questionnaire.Error />
					</Questionnaire.Item>
					<Questionnaire.Actions>
						<Questionnaire.Submit>Retry the build</Questionnaire.Submit>
					</Questionnaire.Actions>
				</Questionnaire.Root>
				{#if retryRegion}
					<Marker.Root role="status">
						<Marker.Icon>
							<RotateCcwIcon />
						</Marker.Icon>
						<Marker.Content>Retry of 4a6e2d3 queued in {retryRegion}</Marker.Content>
					</Marker.Root>
				{/if}
			</div>
		</Demo>

		<Demo label="Several questions" spec="progress · back · skip · continue · submit" code={CODE.steps} align="start">
			<div class="flex w-full max-w-md flex-col gap-4">
				<Questionnaire.Root
					items={stepItems}
					onSubmit={(e) => {
						e.preventDefault();
						const data = new FormData(e.currentTarget);
						const commit = data.get('retry-commit') === 'latest' ? 'e27c0b8' : '4a6e2d3';
						const pin = data.get('retry-pin') === 'pin' ? ', pinned for rotor/snap' : '';
						stepSummary = `Retrying ${commit} in ${regionName(data.get('retry-region'))}${pin}`;
					}}
				>
					<Questionnaire.Progress />
					<Questionnaire.Item name="retry-region" required>
						<Questionnaire.Title>Where should the retry build?</Questionnaire.Title>
						<Questionnaire.Choices>
							{#each REGIONS as region (region.value)}
								<Questionnaire.Choice value={region.value} disabled={region.disabled}>
									{region.name}
								</Questionnaire.Choice>
							{/each}
						</Questionnaire.Choices>
						<Questionnaire.Error />
					</Questionnaire.Item>
					<Questionnaire.Item name="retry-commit" required>
						<Questionnaire.Title>Which commit should it build?</Questionnaire.Title>
						<Questionnaire.Description>A newer commit landed on rotor/snap a minute ago.</Questionnaire.Description>
						<Questionnaire.Choices>
							<Questionnaire.Choice value="same">
								The same commit
								<Questionnaire.ChoiceDescription>4a6e2d3 · Settle easing after drag release</Questionnaire.ChoiceDescription>
							</Questionnaire.Choice>
							<Questionnaire.Choice value="latest">
								The latest commit
								<Questionnaire.ChoiceDescription>e27c0b8 · Snap rotor to quarter turns</Questionnaire.ChoiceDescription>
							</Questionnaire.Choice>
						</Questionnaire.Choices>
						<Questionnaire.Error />
					</Questionnaire.Item>
					<Questionnaire.Item name="retry-pin">
						<Questionnaire.Title>Keep building rotor/snap in that region?</Questionnaire.Title>
						<Questionnaire.Description>Skip to keep São Paulo as the default once the mirror recovers.</Questionnaire.Description>
						<Questionnaire.Choices>
							<Questionnaire.Choice value="pin">Pin the region for this branch</Questionnaire.Choice>
							<Questionnaire.Choice value="once">Only for this retry</Questionnaire.Choice>
						</Questionnaire.Choices>
					</Questionnaire.Item>
					<Questionnaire.Actions>
						<Questionnaire.Previous>Back</Questionnaire.Previous>
						<Questionnaire.Skip>Skip</Questionnaire.Skip>
						<Questionnaire.Next>Continue</Questionnaire.Next>
						<Questionnaire.Submit>Retry the build</Questionnaire.Submit>
					</Questionnaire.Actions>
				</Questionnaire.Root>
				{#if stepSummary}
					<Marker.Root role="status">
						<Marker.Icon>
							<RotateCcwIcon />
						</Marker.Icon>
						<Marker.Content>{stepSummary}</Marker.Content>
					</Marker.Root>
				{/if}
			</div>
		</Demo>

		<Demo label="Several answers" spec="multiple · checkboxes · required" code={CODE.multiple} align="start">
			<div class="flex w-full max-w-md flex-col gap-4">
				<Questionnaire.Root
					items={checkItems}
					shortcuts="letters"
					onSubmit={(e) => {
						e.preventDefault();
						checks = new FormData(e.currentTarget).getAll('checks').map(String);
					}}
				>
					<Questionnaire.Item name="checks" multiple required>
						<Questionnaire.Title>What should run once the preview is up?</Questionnaire.Title>
						<Questionnaire.Choices>
							<Questionnaire.Choice value="lighthouse">Lighthouse on the landing page</Questionnaire.Choice>
							<Questionnaire.Choice value="links">Link check across 37 pages</Questionnaire.Choice>
							<Questionnaire.Choice value="diff">Visual diff against main</Questionnaire.Choice>
						</Questionnaire.Choices>
						<Questionnaire.Error />
					</Questionnaire.Item>
					<Questionnaire.Actions>
						<Questionnaire.Submit>Queue the checks</Questionnaire.Submit>
					</Questionnaire.Actions>
				</Questionnaire.Root>
				{#if checks}
					<Marker.Root role="status">
						<Marker.Content>
							{checks.length === 1 ? '1 check' : `${checks.length} checks`} queued after the retry
						</Marker.Content>
					</Marker.Root>
				{/if}
			</div>
		</Demo>

		<Demo label="Another answer" spec="fixed choices with a freeform input" code={CODE.freeform} align="start">
			<div class="flex w-full max-w-md flex-col gap-4">
				<Questionnaire.Root
					items={nextItems}
					onSubmit={(e) => {
						e.preventDefault();
						const value = new FormData(e.currentTarget).get('next-check');
						nextCheck =
							value === 'last-week'
								? 'The two failed builds from last week'
								: value === 'cache'
									? 'Cache hit rate on rotor/snap'
									: String(value ?? '');
					}}
				>
					<Questionnaire.Item name="next-check" required>
						<Questionnaire.Title>What should the assistant look at next?</Questionnaire.Title>
						<Questionnaire.Choices>
							<Questionnaire.Choice value="last-week">The two failed builds from last week</Questionnaire.Choice>
							<Questionnaire.Choice value="cache">Cache hit rate on rotor/snap</Questionnaire.Choice>
							<Questionnaire.Input aria-label="Something else to check" placeholder="Something else" />
						</Questionnaire.Choices>
						<Questionnaire.Error />
					</Questionnaire.Item>
					<Questionnaire.Actions>
						<Questionnaire.Submit>Send</Questionnaire.Submit>
					</Questionnaire.Actions>
				</Questionnaire.Root>
				{#if nextCheck}
					<Bubble.Root align="end">
						<Bubble.Content>{nextCheck}</Bubble.Content>
					</Bubble.Root>
				{/if}
			</div>
		</Demo>

		<Demo label="Inside a reply" spec="Message · ghost bubble · number shortcuts" code={CODE.inReply} align="start">
			<div class="flex w-full max-w-md flex-col gap-6">
				<Message.Root>
					<Message.Content>
						<Message.Header>Assistant</Message.Header>
						<Bubble.Root variant="ghost">
							<Bubble.Content>I can retry 4a6e2d3 now. Pick a region.</Bubble.Content>
						</Bubble.Root>
						{#if !replyRegion}
							<Questionnaire.Root
								items={replyItems}
								shortcuts="numbers"
								onSubmit={(e) => {
									e.preventDefault();
									replyRegion = regionName(new FormData(e.currentTarget).get('reply-region'));
								}}
							>
								<Questionnaire.Item name="reply-region" required>
									<Questionnaire.Title class="sr-only">Region for the retry</Questionnaire.Title>
									<Questionnaire.Choices>
										{#each REGIONS as region (region.value)}
											<Questionnaire.Choice value={region.value} disabled={region.disabled}>
												{region.name}
											</Questionnaire.Choice>
										{/each}
									</Questionnaire.Choices>
									<Questionnaire.Error />
								</Questionnaire.Item>
								<Questionnaire.Actions>
									<Questionnaire.Submit>Retry here</Questionnaire.Submit>
								</Questionnaire.Actions>
							</Questionnaire.Root>
						{/if}
					</Message.Content>
				</Message.Root>
				{#if replyRegion}
					<Message.Root align="end">
						<Message.Content>
							<Bubble.Root>
								<Bubble.Content>{replyRegion}</Bubble.Content>
							</Bubble.Root>
						</Message.Content>
					</Message.Root>
					<Marker.Root role="status">
						<Marker.Icon>
							<RotateCcwIcon />
						</Marker.Icon>
						<Marker.Content>Retry of 4a6e2d3 started in {replyRegion}</Marker.Content>
					</Marker.Root>
					<Button variant="link" size="sm" class="self-start" onclick={() => (replyRegion = null)}>
						Ask again
					</Button>
				{/if}
			</div>
		</Demo>
	</Section>

	<!-- ================================================================================ Trace -->
	<Section
		title="Trace"
		description="The steps an assistant took to reach an answer: what it fetched, read and changed. Once the work is done, fold it under a one-line summary."
	>
		<Demo label="Steps" spec="icon · title · description" code={CODE.trace} align="start">
			<div class="w-full max-w-md">
				<Trace.Root>
					<Trace.Line>
						<Trace.Icon>
							<FileSearchIcon />
						</Trace.Icon>
						<Trace.Title>Fetched the build log for 4a6e2d3</Trace.Title>
						<Trace.Description>0.4 s</Trace.Description>
					</Trace.Line>
					<Trace.Line>
						<Trace.Icon>
							<FileTextIcon />
						</Trace.Icon>
						<Trace.Title>Read build-4a6e2d3.log</Trace.Title>
						<Trace.Description>412 lines</Trace.Description>
					</Trace.Line>
					<Trace.Line>
						<Trace.Icon>
							<RotateCcwIcon />
						</Trace.Icon>
						<Trace.Title>Proposed a retry in Frankfurt</Trace.Title>
					</Trace.Line>
				</Trace.Root>
			</div>
		</Demo>

		<Demo label="Status" spec="done · error · running · pending" code={CODE.status} align="start">
			<div class="w-full max-w-md">
				<Trace.Root>
					<Trace.Line status="error">
						<Trace.Icon>
							<CircleAlertIcon />
						</Trace.Icon>
						<Trace.Title>Failed to load the São Paulo mirror status</Trace.Title>
					</Trace.Line>
					<Trace.Line>
						<Trace.Icon>
							<CircleCheckIcon />
						</Trace.Icon>
						<Trace.Title>Read build-4a6e2d3.log</Trace.Title>
					</Trace.Line>
					<Trace.Line status="running">
						<Trace.Icon>
							<Spinner />
						</Trace.Icon>
						<Trace.Title>Retrying 4a6e2d3 in Frankfurt</Trace.Title>
					</Trace.Line>
					<Trace.Line status="pending">
						<Trace.Icon>
							<CircleIcon />
						</Trace.Icon>
						<Trace.Title>Open the preview</Trace.Title>
					</Trace.Line>
				</Trace.Root>
			</div>
		</Demo>

		<Demo label="A step with detail" spec="Collapsible · the log underneath" code={CODE.collapsible} align="start">
			<div class="w-full max-w-md">
				<Trace.Collapsible bind:open={logOpen}>
					<Trace.CollapsibleTrigger>
						<Trace.Line>
							<Trace.Icon>
								<FileTextIcon />
							</Trace.Icon>
							<Trace.Title>Read build-4a6e2d3.log</Trace.Title>
							<Trace.Description>412 lines</Trace.Description>
						</Trace.Line>
					</Trace.CollapsibleTrigger>
					<Trace.CollapsibleContent>
						<CodeBlock.Root size="sm">
							<CodeBlock.Content wrap code={BUILD_LOG} />
						</CodeBlock.Root>
					</Trace.CollapsibleContent>
				</Trace.Collapsible>
			</div>
		</Demo>

		<Demo label="In progress" spec="the running step breathes · Spinner as its icon" code={CODE.progress} align="start">
			<div class="flex w-full max-w-md flex-col gap-4">
				<Trace.Root aria-live="polite">
					{#each DIAGNOSIS as step, i (step.title)}
						{@const status = i < traceStep ? undefined : i === traceStep ? 'running' : 'pending'}
						<Trace.Line {status}>
							<Trace.Icon>
								{#if status === 'running'}
									<Spinner />
								{:else if status === 'pending'}
									<CircleIcon />
								{:else}
									<step.icon />
								{/if}
							</Trace.Icon>
							<Trace.Title>
								{status === 'running'
									? DIAGNOSIS_LIVE[i].running
									: status === 'pending'
										? DIAGNOSIS_LIVE[i].pending
										: step.title}
							</Trace.Title>
							{#if !status && step.description}
								<Trace.Description>{step.description}</Trace.Description>
							{/if}
						</Trace.Line>
					{/each}
				</Trace.Root>
				<Button variant="outline" size="sm" class="self-start" disabled={traceRunning} onclick={runTrace}>
					{#if traceRunning}
						<Spinner data-icon="inline-start" />
						Working
					{:else}
						<RotateCcwIcon data-icon="inline-start" />
						Run the steps from the start
					{/if}
				</Button>
			</div>
		</Demo>

		<Demo label="A whole turn" spec="summary · nested steps · text between · a link" code={CODE.turn} align="start">
			<div class="w-full max-w-md">
				<Trace.Collapsible bind:open={turnOpen}>
					<Trace.CollapsibleTrigger>
						<Trace.Line status="error">
							<Trace.Title>Worked for 6 s, 1 step failed</Trace.Title>
						</Trace.Line>
					</Trace.CollapsibleTrigger>
					<Trace.CollapsibleContent class="flex flex-col gap-2">
						<Trace.Root>
							<Trace.Line>
								<Trace.Icon>
									<FileSearchIcon />
								</Trace.Icon>
								<Trace.Title>Fetched the build log for 4a6e2d3</Trace.Title>
								<Trace.Description>0.4 s</Trace.Description>
							</Trace.Line>
							<Trace.Collapsible>
								<Trace.CollapsibleTrigger>
									<Trace.Line status="error">
										<Trace.Icon>
											<TerminalIcon />
										</Trace.Icon>
										<Trace.Title>Failed to run npm ci on gru-2</Trace.Title>
									</Trace.Line>
								</Trace.CollapsibleTrigger>
								<Trace.CollapsibleContent>
									<CodeBlock.Root size="sm" variant="destructive">
										<CodeBlock.Content wrap code="npm ERR! code ETIMEDOUT" />
									</CodeBlock.Root>
								</Trace.CollapsibleContent>
							</Trace.Collapsible>
							<Trace.Line>
								<Trace.Icon>
									<GitBranchIcon />
								</Trace.Icon>
								<Trace.Title>Compared with 5d2f8c1 on rotor/snap</Trace.Title>
								<Trace.Description>no dependency changes</Trace.Description>
							</Trace.Line>
						</Trace.Root>
						<p>The install step timed out before the build began. Opening the deployment.</p>
						<Trace.Root>
							<a href="/dashboard">
								<Trace.Line>
									<Trace.Icon>
										<ExternalLinkIcon />
									</Trace.Icon>
									<Trace.Title>Opened deployment 4a6e2d3</Trace.Title>
									<Trace.Icon>
										<ChevronRightIcon />
									</Trace.Icon>
								</Trace.Line>
							</a>
						</Trace.Root>
					</Trace.CollapsibleContent>
				</Trace.Collapsible>
			</div>
		</Demo>
	</Section>

	<!-- =============================================================================== Marker -->
	<Section
		title="Marker"
		description="A moment in the thread that is not a message: a date, a status, someone joining. For an unlabelled divider use Separator."
	>
		<Demo label="Three variants" spec="default · separator · border" code={CODE.markers} align="start">
			<div class="flex w-full max-w-md flex-col gap-6">
				<Marker.Root>
					<Marker.Content>Build 4a6e2d3 failed after 41 s</Marker.Content>
				</Marker.Root>
				<Marker.Root variant="separator">
					<Marker.Content>Today</Marker.Content>
				</Marker.Root>
				<Marker.Root variant="border">
					<Marker.Content>Retried in Frankfurt</Marker.Content>
				</Marker.Root>
			</div>
		</Demo>

		<Demo label="Live status" spec="role status · Spinner" code={CODE.liveMarker} align="start">
			<div class="flex w-full max-w-md flex-col gap-6">
				<Marker.Root role="status">
					<Marker.Icon>
						<Spinner />
					</Marker.Icon>
					<Marker.Content>Fetching the build log</Marker.Content>
				</Marker.Root>
				<Marker.Root variant="separator" role="status">
					<Marker.Icon>
						<Spinner />
					</Marker.Icon>
					<Marker.Content>Retrying in Frankfurt</Marker.Content>
				</Marker.Root>
			</div>
		</Demo>

		<Demo label="Someone typing" spec="shimmer" code={CODE.typing} align="start">
			<div class="flex w-full max-w-md flex-col gap-6">
				<Marker.Root role="status">
					<Marker.Content class="shimmer">Jonas is typing</Marker.Content>
				</Marker.Root>
			</div>
		</Demo>

		<Demo label="Moments in a thread" spec="separator · a date · a handoff · a duration" code={CODE.separators} align="start">
			<div class="flex w-full max-w-md flex-col gap-6">
				<Marker.Root variant="separator">
					<Marker.Content>Today</Marker.Content>
				</Marker.Root>
				<Marker.Root variant="separator">
					<Marker.Content>Rosa Lindqvist joined from support</Marker.Content>
				</Marker.Root>
				<Marker.Root variant="separator">
					<Marker.Content>Worked for 6 s</Marker.Content>
				</Marker.Root>
			</div>
		</Demo>

		<Demo label="With icons" spec="Marker.Icon in the signal colour" code={CODE.icons} align="start">
			<div class="flex w-full max-w-md flex-col gap-4">
				<Marker.Root>
					<Marker.Icon>
						<RotateCcwIcon />
					</Marker.Icon>
					<Marker.Content>Retry of 4a6e2d3 started in Frankfurt</Marker.Content>
				</Marker.Root>
				<Marker.Root>
					<Marker.Icon>
						<CircleCheckIcon />
					</Marker.Icon>
					<Marker.Content>Deployment 4a6e2d3 is ready</Marker.Content>
				</Marker.Root>
				<Marker.Root variant="border">
					<Marker.Icon>
						<GitBranchIcon />
					</Marker.Icon>
					<Marker.Content>Switched to stairs/landing</Marker.Content>
				</Marker.Root>
			</div>
		</Demo>

		<Demo label="As a link or a button" spec="child snippet · a link · a button" code={CODE.link} align="start">
			<div class="flex w-full max-w-md flex-col gap-4">
				<Marker.Root>
					{#snippet child({ props })}
						<a href="/dashboard" {...props}>
							<Marker.Icon>
								<ExternalLinkIcon />
							</Marker.Icon>
							<Marker.Content>Open deployment 4a6e2d3</Marker.Content>
						</a>
					{/snippet}
				</Marker.Root>
				<Marker.Root variant="separator">
					{#snippet child({ props })}
						<button {...props} type="button" aria-expanded={earlierShown} onclick={() => (earlierShown = !earlierShown)}>
							<Marker.Content>{earlierShown ? 'Hide 3 earlier messages' : 'Show 3 earlier messages'}</Marker.Content>
						</button>
					{/snippet}
				</Marker.Root>
				{#if earlierShown}
					<Bubble.Group>
						<Bubble.Root align="end">
							<Bubble.Content>The landing preview failed two days ago too.</Bubble.Content>
						</Bubble.Root>
						<Bubble.Root variant="ghost">
							<Bubble.Content>That was 70f6e29 on stairs/landing, also on gru-2.</Bubble.Content>
						</Bubble.Root>
						<Bubble.Root align="end">
							<Bubble.Content>So it is the builder, not us.</Bubble.Content>
						</Bubble.Root>
					</Bubble.Group>
				{/if}
				<Bubble.Root variant="ghost">
					<Bubble.Content>Both failures line up with the mirror outage.</Bubble.Content>
				</Bubble.Root>
			</div>
		</Demo>
	</Section>

	<!-- ===================================================================== Message scroller -->
	<Section
		title="Message scroller"
		description="Holds a long thread in a fixed frame, opens at the latest turn and offers a jump back once the reader scrolls away. A short exchange that fits needs no scroller."
	>
		<Demo label="A long thread" spec="opens at the last turn · jump to the end" code={CODE.scroller} align="stretch">
			<div class="mx-auto h-112 w-full max-w-xl">
				<MessageScroller.Provider defaultScrollPosition="last-anchor">
					<MessageScroller.Root>
						<MessageScroller.Viewport aria-label="Support thread about deployment 4a6e2d3">
							<MessageScroller.Content class="p-4">
								{#each THREAD as entry (entry.id)}
									<MessageScroller.Item messageId={entry.id} scrollAnchor={entry.kind === 'person'}>
										{@render threadEntry(entry)}
									</MessageScroller.Item>
								{/each}
							</MessageScroller.Content>
						</MessageScroller.Viewport>
						<MessageScroller.Button />
					</MessageScroller.Root>
				</MessageScroller.Provider>
			</div>
		</Demo>

		<Demo label="Following new messages" spec="autoScroll · a reply streams in" code={CODE.following} align="stretch">
			<div class="mx-auto flex h-96 w-full max-w-xl flex-col gap-3">
				<div class="min-h-0 flex-1">
					<MessageScroller.Provider autoScroll>
						<MessageScroller.Root>
							<MessageScroller.Viewport aria-label="Follow-up messages">
								<MessageScroller.Content class="p-4">
									{#each live as entry (entry.id)}
										<MessageScroller.Item messageId={entry.id} scrollAnchor={entry.role === 'person'}>
											{@render liveEntry(entry)}
										</MessageScroller.Item>
									{/each}
								</MessageScroller.Content>
							</MessageScroller.Viewport>
							<MessageScroller.Button />
						</MessageScroller.Root>
					</MessageScroller.Provider>
				</div>
				<div class="flex items-center justify-between gap-3 px-4">
					{#if FOLLOW_UPS[followUp]}
						<span class="text-muted-foreground min-w-0 truncate text-sm">{FOLLOW_UPS[followUp].person}</span>
						<Button size="sm" disabled={replying} onclick={sendFollowUp}>
							{#if replying}
								<Spinner data-icon="inline-start" />
							{:else}
								<ArrowUpIcon data-icon="inline-start" />
							{/if}
							Send
						</Button>
					{:else}
						<span class="text-muted-foreground text-sm">No more follow-ups.</span>
						<Button variant="outline" size="sm" disabled={replying} onclick={resetLive}>
							<RotateCcwIcon data-icon="inline-start" />
							Start the thread again
						</Button>
					{/if}
				</div>
			</div>
		</Demo>

		<Demo label="Both directions" spec="opens at the start · jump to start · jump to end" code={CODE.directions} align="stretch">
			<div class="mx-auto h-96 w-full max-w-xl">
				<MessageScroller.Provider defaultScrollPosition="start">
					<MessageScroller.Root>
						<MessageScroller.Viewport aria-label="Support thread, from the first message">
							<MessageScroller.Content class="p-4">
								{#each THREAD as entry (entry.id)}
									<MessageScroller.Item messageId={entry.id} scrollAnchor={entry.kind === 'person'}>
										{@render threadEntry(entry)}
									</MessageScroller.Item>
								{/each}
							</MessageScroller.Content>
						</MessageScroller.Viewport>
						<MessageScroller.Button direction="start" />
						<MessageScroller.Button />
					</MessageScroller.Root>
				</MessageScroller.Provider>
			</div>
		</Demo>
	</Section>
</Page>
