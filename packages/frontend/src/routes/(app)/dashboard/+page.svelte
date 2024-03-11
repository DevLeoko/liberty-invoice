<script lang="ts">
	import FetchingInvoiceTable from '$lib/components/invoices/FetchingInvoiceTable.svelte'
	import { t } from '$lib/stores/settings'
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
	<hr class="my-4" />
	<h2 class="pageSubTitle">
		{$t('invoiceList.outstandingInvoices')}
	</h2>
	<FetchingInvoiceTable filterStatus={['outstanding']}>
		<svelte:fragment slot="empty">
			<div class="flex justify-center">
				<div
					class="flex items-center gap-2 px-4 py-2 mx-auto my-4 text-blue-500 bg-blue-500 border border-blue-500 opacity-80 bg-opacity-10"
				>
					<span class="material-icons">done_all</span>
					<span>{$t('invoiceList.noOutstanding')}</span>
				</div>
			</div>
		</svelte:fragment>
	</FetchingInvoiceTable>
</div>
