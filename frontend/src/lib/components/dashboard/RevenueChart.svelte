<script lang="ts">
	import Chart from './Chart.svelte'

	const labels = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	]

	const data = [
		{
			color: '#3b82f6',
			name: 'This year',
			values: [100, 2400, 2000, 3200, 500, 4000, 3000],
		},
		{
			color: '#b8bec6',
			name: 'Last year',
			values: labels.map((d) => 2500 * (Math.random() + 0.5)),
		},
	]
</script>

<Chart {data} {labels} height={300}>
	<svelte:fragment slot="tooltip" let:values let:index>
		<div class="mb-1 text-sm font-semibold">
			{new Date(0, index).toLocaleString('default', { month: 'long' })}
		</div>
		{#each values as value, i}
			<div class="flex items-center">
				<div class="w-2 h-2 mr-1 rounded-full" style="background: {data[i].color}" />
				<div class="mr-auto">
					{data[i].name}
				</div>
				<div class="ml-2">{value?.toFixed(2)}</div>
			</div>
		{/each}
	</svelte:fragment>
</Chart>
