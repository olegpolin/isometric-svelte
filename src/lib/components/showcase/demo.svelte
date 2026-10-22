<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import CodeIcon from '@lucide/svelte/icons/code';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as CodeBlock from '#lib/components/ui/code-block/index.js';
	import { cn } from '#lib/utils.js';

	/**
	 * One demo: a canvas holding live components, a label and optional spec note underneath, and an
	 * optional code toggle. `align="start"` left-aligns the canvas content (forms, tables); the
	 * default centres it.
	 */
	let {
		label,
		spec,
		code,
		lang = 'svelte',
		align = 'center',
		canvas = 'paper',
		class: className,
		children
	}: {
		label: string;
		spec?: string;
		code?: string;
		lang?: string;
		align?: 'center' | 'start' | 'stretch';
		canvas?: 'paper' | 'field' | 'plain';
		class?: string;
		children: Snippet;
	} = $props();

	let showCode = $state(false);
	const uid = $props.id();
</script>

<figure class="flex min-w-0 flex-col gap-2" data-slot="demo">
	<div
		class={cn(
			'border-border relative flex min-h-28 flex-wrap gap-4 rounded-lg border p-6',
			canvas === 'paper' && 'bg-muted/50',
			canvas === 'field' && 'bg-field text-field-foreground',
			canvas === 'plain' && 'bg-card',
			align === 'center' && 'items-center justify-center',
			align === 'start' && 'items-start justify-start',
			align === 'stretch' && 'flex-col items-stretch',
			className
		)}
	>
		{@render children()}
	</div>
	{#if code && showCode}
		<div id="demo-code-{uid}" transition:slide={{ duration: 200 }}>
			<CodeBlock.Root size="sm">
				<CodeBlock.Header>
					<CodeBlock.Title>{lang}</CodeBlock.Title>
					<CodeBlock.Actions>
						<CodeBlock.CopyButton value={code} />
					</CodeBlock.Actions>
				</CodeBlock.Header>
				<CodeBlock.Content {code} />
			</CodeBlock.Root>
		</div>
	{/if}
	<figcaption class="flex min-h-7 flex-wrap items-center justify-between gap-x-4 gap-y-1 px-1">
		<span class="text-foreground text-[13px] font-medium">{label}</span>
		<span class="flex items-center gap-3">
			{#if spec}
				<span class="text-muted-foreground text-xs">{spec}</span>
			{/if}
			{#if code}
				<Button
					variant="ghost"
					size="xs"
					aria-expanded={showCode}
					aria-controls="demo-code-{uid}"
					onclick={() => (showCode = !showCode)}
				>
					<CodeIcon data-icon="inline-start" />
					{showCode ? 'Hide code' : 'Code'}
				</Button>
			{/if}
		</span>
	</figcaption>
</figure>
