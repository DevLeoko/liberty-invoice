<script lang="ts">
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
	import QuickStatsRow from '../../../lib/components/dashboard/QuickStatsRow.svelte'
	import RevenueChart from '../../../lib/components/dashboard/RevenueChart.svelte'
	import GettingStartedSection from '../../../lib/components/getting-started/GettingStartedSection.svelte'

	const gettingStatedHidden = localStorage.getItem('gettingStartedHidden') == 'true'
</script>

<PageTitle title="Dashboard" />

<div class="flex flex-col min-w-0">
	{#if !gettingStatedHidden}
		<GettingStartedSection />

		<hr class="my-4" />
	{/if}

	<QuickStatsRow />
	<hr class="my-4" />
	<RevenueChart />
</div>
