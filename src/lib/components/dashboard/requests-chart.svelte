<script lang="ts">
	import { AreaChart } from 'layerchart';
	import * as Chart from '#lib/components/ui/chart/index.js';
	import { daysFor, formatCompact, formatDay, formatLongDay, type RangeId } from './data.js';

	/** Requests per day over the chosen range: one series, an area in chart-1, a hairline grid. */
	let { range }: { range: RangeId } = $props();

	const config = {
		requests: { label: 'Requests', color: 'var(--chart-1)' }
	} satisfies Chart.ChartConfig;

	let data = $derived(daysFor(range).map((d) => ({ date: d.date, requests: d.requests })));
	let ticks = $derived(range === '7d' ? 7 : range === '30d' ? 6 : 7);
</script>

<Chart.Container {config} class="aspect-auto h-60 w-full sm:h-64">
	<AreaChart
		{data}
		x="date"
		y="requests"
		series={[{ key: 'requests', label: config.requests.label, color: config.requests.color }]}
		grid={{ x: false, y: true }}
		padding={{ left: 36, bottom: 24, top: 8, right: 8 }}
		props={{
			area: { fillOpacity: 0.16, line: { strokeWidth: 1.5 } },
			xAxis: { format: (d: Date) => formatDay(d), ticks },
			yAxis: { format: (v: number) => formatCompact(v), ticks: 4 }
		}}
	>
		{#snippet tooltip()}
			<Chart.Tooltip indicator="line" labelFormatter={(d: Date) => formatLongDay(d)} />
		{/snippet}
	</AreaChart>
</Chart.Container>
