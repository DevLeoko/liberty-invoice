<script lang="ts">
	import { page } from '$app/stores'
	import Chip from '$lib/components/basics/Chip.svelte'
	import DateInput from '$lib/components/basics/DateInput.svelte'
	import Filter from '$lib/components/basics/Filter.svelte'
	import SearchInput from '$lib/components/basics/SearchInput.svelte'
	import FetchingInvoiceTable from '$lib/components/invoices/FetchingInvoiceTable.svelte'
	import type { InvoiceListQuery } from '$lib/trpcClient'
	import { persisted } from 'svelte-persisted-store'
	import Button from '../../../lib/components/basics/Button.svelte'
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
	import { t } from '../../../lib/stores/settings'

	let showOutstanding = persisted('invoice-list-show-outstanding', true)
	let search = ''
	let filterStatus: InvoiceListQuery['status'] = []
	let issuedBefore: Date | null = null

	const STATUS_COLORS = {
		draft: 'gray-700',
		outstanding: 'yellow-500',
		paid: 'green-500',
	}

	const STATUS_OPTIONS = ['draft', 'outstanding', 'paid'] as const

	let previewInvoiceId: string | null = null
	let previewInvoiceIdOutstanding: string | null = null
	if ($page.url.searchParams.has('preview')) {
		previewInvoiceId = $page.url.searchParams.get('preview')!
	}

	function onPreviewInvoiceIdChange(id: string | null) {
		if (id) previewInvoiceIdOutstanding = null
	}

	function onPreviewInvoiceIdOutstandingChange(id: string | null) {
		if (id) previewInvoiceId = null
	}

	$: onPreviewInvoiceIdChange(previewInvoiceId)
	$: onPreviewInvoiceIdOutstandingChange(previewInvoiceIdOutstanding)
</script>

<PageTitle title={$t('menu.invoices')} />

<div class="mb-8 border border-gray-200">
	<div
		class="flex items-center px-2 py-1 text-lg font-medium cursor-pointer bg-gray-150 hover:bg-gray-200"
		on:click={() => ($showOutstanding = !$showOutstanding)}
	>
		<span class="text-gray-500 material-icons">
			{$showOutstanding ? 'expand_less' : 'expand_more'}
		</span>
		{$t('invoiceList.outstandingInvoices')}
	</div>
	{#if $showOutstanding}
		<FetchingInvoiceTable
			bind:previewInvoiceId={previewInvoiceIdOutstanding}
			filterStatus={['outstanding']}
		>
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
	{/if}
</div>

<div class="flex flex-wrap items-center justify-between gap-4 mb-2">
	<h2 class="px-2 py-1 text-xl font-medium">
		{$t('invoiceList.allInvoices')}
	</h2>
	<Button href="/invoices/new">
		<span class="mr-1 material-icons">add</span>
		{$t('invoiceList.newInvoice')}
	</Button>
</div>

<div class="grid items-end grid-cols-2 gap-2 xl:grid-cols-4">
	<SearchInput bind:value={search} placeholder="invoiceList.searchPlaceholder" class="col-span-2" />

	<Filter
		title={$t('general.status')}
		class="overflow-hidden"
		bind:selected={filterStatus}
		options={STATUS_OPTIONS.map((value) => ({ value }))}
	>
		<svelte:fragment slot="selected" let:value>
			<Chip snug color={STATUS_COLORS[value]}>
				{value}
			</Chip>
		</svelte:fragment>
		<svelte:fragment slot="option" let:option>
			<Chip snug class="my-1" color={STATUS_COLORS[option.value]}>
				{option.value}
			</Chip>
		</svelte:fragment>
	</Filter>

	<DateInput bind:date={issuedBefore} />
</div>
<FetchingInvoiceTable
	bind:previewInvoiceId
	bind:search
	bind:filterStatus
	bind:issuedBefore
	pageSize={20}
/>
