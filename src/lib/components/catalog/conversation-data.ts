/**
 * Sample content for the conversation chapter: one support thread about a failed preview build of
 * Observatory. Jonas Weber asks why commit 4a6e2d3 on rotor/snap failed; the assistant reads the
 * build log, finds a registry timeout on the São Paulo builder and proposes a retry elsewhere.
 */
import type { Component } from 'svelte';
import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
import FileSearchIcon from '@lucide/svelte/icons/file-search';
import FileTextIcon from '@lucide/svelte/icons/file-text';
import GitBranchIcon from '@lucide/svelte/icons/git-branch';
import PackageIcon from '@lucide/svelte/icons/package';
import UserPlusIcon from '@lucide/svelte/icons/user-plus';
import HammerIcon from '@lucide/svelte/icons/hammer';
import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw';

export const PERSON = { name: 'Jonas Weber', initials: 'JW' };
export const SUPPORT = { name: 'Rosa Lindqvist', initials: 'RL' };

/** The tail of the build log, as the assistant reads it. */
export const BUILD_LOG = `14:01:52  Cloning rotor/snap at 4a6e2d3
14:01:55  Restoring build cache (412 MB)
14:01:58  Running npm ci
14:02:12  npm WARN fetch retry 1 of 3: three-0.186.1.tgz
14:02:22  npm WARN fetch retry 2 of 3: three-0.186.1.tgz
14:02:32  npm WARN fetch retry 3 of 3: three-0.186.1.tgz
14:02:33  npm ERR! code ETIMEDOUT
14:02:33  npm ERR! network request to registry.mirror.gru failed
14:02:33  reason: connect ETIMEDOUT 10.42.7.18:443
14:02:33  Build failed: install step exited with code 1`;

export interface TraceStep {
	icon: Component;
	title: string;
	description?: string;
}

/** The three steps the assistant takes before answering. */
export const DIAGNOSIS: TraceStep[] = [
	{ icon: FileSearchIcon, title: 'Fetched the build log for 4a6e2d3', description: '0.4 s' },
	{ icon: FileTextIcon, title: 'Read build-4a6e2d3.log', description: '412 lines' },
	{ icon: RotateCcwIcon, title: 'Proposed a retry in Frankfurt' }
];

/** Present-tense titles for the same steps while they run, and the plan before they start. */
export const DIAGNOSIS_LIVE = [
	{ running: 'Fetching the build log for 4a6e2d3', pending: 'Fetch the build log for 4a6e2d3' },
	{ running: 'Reading build-4a6e2d3.log', pending: 'Read build-4a6e2d3.log' },
	{ running: 'Proposing a fix', pending: 'Propose a fix' }
];

export const RETRY_STEPS: TraceStep[] = [
	{ icon: GitBranchIcon, title: 'Cloned rotor/snap at 4a6e2d3', description: '3 s' },
	{ icon: PackageIcon, title: 'Installed 1,284 packages', description: '22 s' },
	{ icon: HammerIcon, title: 'Built 37 pages', description: '1 min 9 s' }
];

export const ANSWER =
	'The build never reached your code. npm ci timed out three times fetching three-0.186.1.tgz from the São Paulo registry mirror and gave up at 14:02:33. That mirror has been degraded since 13:40, so a retry in Frankfurt should pass.';

export type AttachmentKind = 'log' | 'image' | 'config';

export interface AttachmentFile {
	name: string;
	meta: string;
	kind: AttachmentKind;
}

export const LOG_FILE: AttachmentFile = { name: 'build-4a6e2d3.log', meta: 'LOG · 18.4 KB', kind: 'log' };
export const SCREENSHOT: AttachmentFile = { name: 'deploy-4a6e2d3.png', meta: 'PNG · 86 KB', kind: 'image' };
export const FILES: AttachmentFile[] = [
	LOG_FILE,
	SCREENSHOT,
	{ name: 'observatory.config.json', meta: 'JSON · 1.2 KB', kind: 'config' },
	{ name: 'package-lock.json', meta: 'JSON · 412 KB', kind: 'config' }
];

export interface Region {
	value: string;
	name: string;
	note: string;
	disabled?: boolean;
}

export const REGIONS: Region[] = [
	{ value: 'fra', name: 'Frankfurt', note: '34 ms to the registry · 2 builds queued' },
	{ value: 'sfo', name: 'San Francisco', note: '41 ms to the registry · idle' },
	{ value: 'sin', name: 'Singapore', note: '57 ms to the registry · 5 builds queued' },
	{ value: 'gru', name: 'São Paulo', note: 'Mirror degraded since 13:40', disabled: true }
];

/* ---- the long thread ------------------------------------------------------------------------- */

export type ThreadEntry =
	| { id: string; kind: 'marker'; text: string; icon?: Component; variant?: 'default' | 'separator' }
	| { id: string; kind: 'person'; text?: string; attachments?: AttachmentFile[]; footer?: string }
	| { id: string; kind: 'assistant'; text?: string; steps?: TraceStep[]; error?: boolean }
	| { id: string; kind: 'support'; text: string };

export const THREAD: ThreadEntry[] = [
	{ id: 't1', kind: 'marker', variant: 'separator', text: 'Today' },
	{
		id: 't2',
		kind: 'person',
		text: 'The preview for rotor/snap failed again. Commit 4a6e2d3, about forty minutes ago. Nothing in that diff touches dependencies.'
	},
	{ id: 't3', kind: 'person', attachments: [LOG_FILE, SCREENSHOT] },
	{ id: 't4', kind: 'assistant', steps: DIAGNOSIS, text: ANSWER },
	{ id: 't5', kind: 'person', text: 'Is the mirror back yet?' },
	{
		id: 't6',
		kind: 'assistant',
		error: true,
		text: 'The status of the São Paulo mirror could not be loaded. The status service closed the connection after 30 s.'
	},
	{ id: 't7', kind: 'person', text: 'Never mind. Retry in Frankfurt, same commit.' },
	{ id: 't8', kind: 'marker', icon: RotateCcwIcon, text: 'Retry of 4a6e2d3 started in Frankfurt' },
	{ id: 't9', kind: 'assistant', steps: RETRY_STEPS, text: 'The retry passed in 1 min 34 s.' },
	{ id: 't10', kind: 'marker', icon: CircleCheckIcon, text: 'Deployment 4a6e2d3 is ready' },
	{
		id: 't11',
		kind: 'assistant',
		text: 'The preview is live at rotor-snap.preview.observatory.example. To keep rotor/snap off São Paulo until the mirror recovers, set build.region to "fra" in observatory.config.json.'
	},
	{ id: 't12', kind: 'person', text: 'Thanks. Two of my builds failed the same way last week. Can someone check those too?' },
	{ id: 't13', kind: 'marker', icon: UserPlusIcon, text: 'Rosa Lindqvist joined from support' },
	{
		id: 't14',
		kind: 'support',
		text: 'Both were on gru-2 during the same mirror outage. I have refunded the 3.2 build minutes and added your project to the incident.'
	},
	{ id: 't15', kind: 'person', text: 'Appreciated.', footer: 'Read 14:31' }
];

/** Turns appended one at a time in the "following" demo. */
export const FOLLOW_UPS: { person: string; reply: string }[] = [
	{
		person: 'Can you watch the next build on stairs/landing too?',
		reply: 'Watching stairs/landing. Commit 9b0f7d1 is building in Frankfurt and has finished installing.'
	},
	{
		person: 'How long did it take?',
		reply: '2 min 3 s, about 6 s slower than the last ten builds on that branch. The difference is in image optimisation.'
	},
	{
		person: 'Good enough. Close this one out.',
		reply: 'Closed. The incident note for São Paulo stays linked to this thread until the mirror recovers.'
	}
];
