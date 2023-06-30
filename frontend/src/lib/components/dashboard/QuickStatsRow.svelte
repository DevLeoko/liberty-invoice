<script lang="ts">
	import { createAggregationStatsQuery } from '../../controller/stats'
	import { queryUserSettings } from '../../controller/user-settings'
	import { formatInt, getCurrency, t } from '../../stores/settings'
	import Skeleton from '../basics/Skeleton.svelte'
	import QuickStatsBox from './QuickStatsBox.svelte'

	let baseCurrency: null | string = null
	$: currency = baseCurrency ? $getCurrency(baseCurrency) : null
	$: statsQuery = baseCurrency ? createAggregationStatsQuery(baseCurrency) : null

	queryUserSettings().then((data) => {
		baseCurrency = data.defaultCurrency
	})
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
	{#if !$statsQuery?.data || !currency}
		<Skeleton class="w-full h-16" />
	{:else}
		<!-- Revenue this month -->
		<QuickStatsBox
			icon="payments"
			title={$t('dashboard.revenueThisMonth')}
			value={currency.format($statsQuery.data.revenueThisMonth)}
		/>

		<div class="bg-gray-300 w-[1px] self-stretch hidden xl:block">&nbsp;</div>

		<!-- Invoices this month -->
		<QuickStatsBox
			icon="receipt_long"
			title={$t('dashboard.invoicesThisMonth')}
			value={$formatInt($statsQuery.data.invoicesThisMonth)}
		/>

		<div class="bg-gray-300 w-[1px] self-stretch hidden xl:block">&nbsp;</div>

		<!-- Outstanding invoices -->
		<QuickStatsBox
			icon="pending_actions"
			title={$t('dashboard.outstandingInvoices')}
			value={$formatInt($statsQuery.data.outstandingInvoices)}
		/>

		<div class="bg-gray-300 w-[1px] self-stretch hidden xl:block">&nbsp;</div>

		<!-- Overdue invoices -->
		<QuickStatsBox
			icon="assignment_late"
			title={$t('dashboard.overdueInvoices')}
			value={$formatInt($statsQuery.data.overdueInvoices)}
		/>
	{/if}
</div>
