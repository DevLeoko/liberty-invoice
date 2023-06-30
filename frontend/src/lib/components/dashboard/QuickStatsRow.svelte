<script lang="ts">
	import { createAggregationStatsQuery } from '../../controller/stats'
	import { queryUserSettings } from '../../controller/user-settings'
	import { formatInt, getCurrency } from '../../stores/settings'
	import Skeleton from '../basics/Skeleton.svelte'
	import QuickStatsBox from './QuickStatsBox.svelte'

	let baseCurrency: null | string = null
	$: currency = baseCurrency ? $getCurrency(baseCurrency) : null
	$: statsQuery = baseCurrency ? createAggregationStatsQuery(baseCurrency) : null

	queryUserSettings().then((data) => {
		baseCurrency = data.defaultCurrency
	})
</script>

<div class="flex items-center justify-between">
	{#if !$statsQuery?.data || !currency}
		<Skeleton class="w-full h-16" />
	{:else}
		<!-- Revenue this month -->
		<QuickStatsBox
			icon="payments"
			title="Revenue this month"
			value={currency.format($statsQuery.data.revenueThisMonth)}
		/>

		<div class="bg-gray-300 w-[1px] self-stretch">&nbsp;</div>

		<!-- Invoices this month -->
		<QuickStatsBox
			icon="receipt_long"
			title="Invoices this month"
			value={$formatInt($statsQuery.data.invoicesThisMonth)}
		/>

		<div class="bg-gray-300 w-[1px] self-stretch">&nbsp;</div>

		<!-- Outstanding invoices -->
		<QuickStatsBox
			icon="pending_actions"
			title="Outstanding invoices"
			value={$formatInt($statsQuery.data.outstandingInvoices)}
		/>

		<div class="bg-gray-300 w-[1px] self-stretch">&nbsp;</div>

		<!-- Overdue invoices -->
		<QuickStatsBox
			icon="assignment_late"
			title="Overdue invoices"
			value={$formatInt($statsQuery.data.overdueInvoices)}
		/>
	{/if}
</div>
