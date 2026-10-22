<script lang="ts">
	import { BarChart } from 'layerchart';
	import * as Chart from '#lib/components/ui/chart/index.js';
	import { formatCompact, formatInt, regionsFor, REGIONS, type RangeId } from './data.js';

	/**
	 * Requests by region as horizontal bars, one chart token per region (the colour follows the
	 * region, never its rank), with the exact figures set out underneath.
	 */
	let { range }: { range: RangeId } = $props();

	const config = {
		requests: { label: 'Requests' },
		...Object.fromEntries(REGIONS.map((r) => [r.id, { label: r.name, color: r.color }]))
	} satisfies Chart.ChartConfig;

	let data = $derived(regionsFor(range));
</script>

<div class="flex flex-col gap-4">
	<Chart.Container {config} class="aspect-auto h-44 w-full">
		<BarChart
			{data}
			orientation="horizontal"
			y="region"
			x="requests"
			c="id"
			cDomain={REGIONS.map((r) => r.id)}
			cRange={REGIONS.map((r) => r.color)}
			bandPadding={0.38}
			padding={{ left: 92, right: 8, bottom: 20 }}
			grid={{ x: true, y: false }}
			rule={false}
			props={{
				bars: { stroke: 'none', radius: 2, rounded: 'right' },
				highlight: { area: { fill: 'none' } },
				xAxis: { format: (v: number) => formatCompact(v), ticks: 3 },
				yAxis: { tickLabelProps: { svgProps: { x: -8 } } }
			}}
		>
			{#snippet tooltip()}
				<Chart.Tooltip hideLabel nameKey="region" />
			{/snippet}
		</BarChart>
	</Chart.Container>

	<table class="w-full text-xs">
		<caption class="sr-only">Requests by region</caption>
		<thead>
			<tr class="text-muted-foreground">
				<th scope="col" class="pb-1.5 text-start font-normal">Region</th>
				<th scope="col" class="pb-1.5 text-end font-normal">Share</th>
				<th scope="col" class="pb-1.5 text-end font-normal">Requests</th>
				<th scope="col" class="pb-1.5 text-end font-normal">
					<abbr title="Time to first byte, 75th percentile" class="no-underline">TTFB p75</abbr>
				</th>
			</tr>
		</thead>
		<tbody>
			{#each data as r (r.id)}
				<tr class="border-border border-t">
					<th scope="row" class="py-1.5 pe-2 text-start font-normal">
						<span class="flex items-center gap-2">
							<span aria-hidden="true" class={['size-2 shrink-0 rounded-[1px]', r.swatch]}></span>
							<span class="text-foreground truncate">{r.name}</span>
						</span>
					</th>
					<td class="text-foreground py-1.5 pe-2 text-end tabular-nums">{(r.share * 100).toFixed(1)}%</td>
					<td class="text-muted-foreground py-1.5 pe-2 text-end tabular-nums">{formatInt(r.requests)}</td>
					<td class="text-muted-foreground py-1.5 text-end tabular-nums">{r.p75} ms</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
