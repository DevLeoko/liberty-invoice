<script lang="ts">
	import { createRevenueStatsQuery } from '../../controller/stats'
	import { createUserSettingsQuery } from '../../controller/user-settings'
	import { formatFloat, t } from '../../stores/settings'
	import Chart from './Chart.svelte'

	let view: 'year' | 'month' = 'year'

	$: labels =
		view === 'year'
			? new Array(12).fill(0).map((_, i) =>
					new Date(new Date().getFullYear(), i, 1).toLocaleString($t('langCode'), {
						month: 'short',
					}),
			  )
			: new Array(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate())
					.fill(0)
					.map((_, i) => (i + 1).toString())

	const userSettings = createUserSettingsQuery()

	let from: Date
	let to: Date

	let previousFrom: Date
	let previousTo: Date

	$: {
		if (view === 'year') {
			from = new Date(new Date().getFullYear(), 0, 1)
			to = new Date(new Date().getFullYear(), 11, 31)
			previousFrom = new Date(new Date().getFullYear() - 1, 0, 1)
			previousTo = new Date(new Date().getFullYear() - 1, 11, 31)
		} else {
			from = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
			to = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
			previousFrom = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
			previousTo = new Date(new Date().getFullYear(), new Date().getMonth(), 0)
		}
	}

	$: revenueData = !$userSettings.data
		? null
		: createRevenueStatsQuery({
				baseCurrency: $userSettings.data.defaultCurrency,
				from,
				to,
				interval: view === 'year' ? 'month' : 'day',
		  })

	$: previousIntervalRevenueData = !$userSettings.data
		? null
		: createRevenueStatsQuery({
				baseCurrency: $userSettings.data.defaultCurrency,
				from: previousFrom,
				to: previousTo,
				interval: view === 'year' ? 'month' : 'day',
		  })

	function mapToNumberArray(data: { sum: number; date: Date }[], view: 'year' | 'month' = 'year') {
		const array = new Array(labels.length).fill(0)

		for (const { sum, date } of data) {
			if (view === 'year') {
				array[date.getMonth()] = sum
			} else {
				array[date.getDate() - 1] = sum
			}
		}

		return array
	}

	$: data = [
		{
			color: '#3b82f6',
			name:
				view === 'year'
					? $t('dashboard.revenueChart.thisYear')
					: $t('dashboard.revenueChart.thisMonth'),
			values: mapToNumberArray($revenueData?.data ?? []),
		},
		{
			color: '#b8bec6',
			name:
				view === 'year'
					? $t('dashboard.revenueChart.lastYear')
					: $t('dashboard.revenueChart.lastMonth'),
			values: mapToNumberArray($previousIntervalRevenueData?.data ?? []),
		},
	]
</script>

<div class="flex items-center justify-between">
	<h2 class="pageSubTitle">
		{$t('dashboard.revenueChart.title')} ({$userSettings.data?.defaultCurrency})
	</h2>

	<div class="flex items-center text-sm uppercase">
		<div
			class="cursor-pointer"
			class:font-semibold={view === 'year'}
			on:click={() => (view = 'year')}
		>
			{$t('dashboard.revenueChart.thisYear')}
		</div>
		<div class="mx-2 h-4 w-[1px] bg-gray-400" />
		<div
			class="cursor-pointer"
			class:font-semibold={view === 'month'}
			on:click={() => (view = 'month')}
		>
			{$t('dashboard.revenueChart.thisMonth')}
		</div>
	</div>
</div>

<Chart {data} {labels} height={300}>
	<svelte:fragment slot="tooltip" let:values let:index>
		<div class="min-w-max">
			<div class="mb-1 text-sm font-semibold">
				{new Date(0, index).toLocaleString($t('langCode'), { month: 'long' })}
			</div>
			{#each values as value, i}
				<div class="flex items-center">
					<div class="w-2 h-2 mr-1 rounded-full" style="background: {data[i].color}" />
					<div class="mr-auto">
						{data[i].name}
					</div>
					<div class="ml-2">{$formatFloat(value)}</div>
				</div>
			{/each}
		</div>
	</svelte:fragment>
</Chart>
