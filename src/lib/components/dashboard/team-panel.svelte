<script lang="ts">
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import { toast } from 'svelte-sonner';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { PENDING_INVITES, PEOPLE, TEAM_SIZE } from './data.js';

	/** Who works on the project: an avatar group, the head count and an invite. */
	let { id = 'team' }: { id?: string } = $props();

	const shown = PEOPLE.slice(0, 5);
	const rest = TEAM_SIZE - shown.length;

	async function invite() {
		const link = 'https://observatory.example/join/7KQ2-M4XD';
		try {
			await navigator.clipboard.writeText(link);
			toast.success('Invite link copied', { description: 'It lets one person join as a developer for 7 days.' });
		} catch {
			toast.info('Invite link ready', { description: link });
		}
	}
</script>

<section {id} aria-labelledby="{id}-title" class="flex scroll-mt-20 flex-col gap-3">
	<h2 id="{id}-title" class="text-foreground text-[15px] font-medium">Team</h2>
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div class="flex items-center gap-3">
			<Avatar.Group>
				{#each shown as p (p.id)}
					<Avatar.Root size="lg" title="{p.name}, {p.role.toLowerCase()}">
						<Avatar.Fallback>{p.initials}</Avatar.Fallback>
					</Avatar.Root>
				{/each}
				<Avatar.GroupCount>+{rest}</Avatar.GroupCount>
			</Avatar.Group>
			<p class="text-muted-foreground text-sm">
				<span class="text-foreground tabular-nums">{TEAM_SIZE}</span> members,
				<span class="tabular-nums">{PENDING_INVITES}</span> invite pending
			</p>
		</div>
		<Button variant="outline" size="sm" onclick={invite}>
			<UserPlusIcon data-icon="inline-start" />
			Invite
		</Button>
	</div>
</section>
