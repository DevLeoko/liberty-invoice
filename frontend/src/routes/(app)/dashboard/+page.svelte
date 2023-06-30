<script lang="ts">
	import QuickStatsRow from '../../../lib/components/dashboard/QuickStatsRow.svelte'
	import RevenueChart from '../../../lib/components/dashboard/RevenueChart.svelte'
	import GettingStartedSection from '../../../lib/components/getting-started/GettingStartedSection.svelte'

	const gettingStatedHidden = localStorage.getItem('gettingStartedHidden') == 'true'
</script>

<h1 class="pageTitle">Dashboard</h1>

<div class="flex flex-col min-w-0">
	{#if !gettingStatedHidden}
		<GettingStartedSection />

		<hr class="my-4" />
	{/if}

	<QuickStatsRow />
	<hr class="my-4" />
	<RevenueChart />
</div>
