<script lang="ts">
	import Button from '$lib/components/basics/Button.svelte'
	import Skeleton from '$lib/components/basics/Skeleton.svelte'
	import InvoiceTable from '$lib/components/invoices/InvoiceTable.svelte'
	import { createInvoiceQuery } from '$lib/controller/invoice'
	import { t } from '$lib/stores/settings'
	import type { InvoiceListQuery } from '$lib/trpcClient'

	export let search = ''
	export let filterStatus: InvoiceListQuery['status'] = []
	export let issuedBefore: Date | null = null

	export let previewInvoiceId: string | null = null

	export let pageSize = 10

	$: invoices = createInvoiceQuery(
		{
			search,
			status: filterStatus,
			issuedBefore: issuedBefore ?? undefined,
		},
		pageSize
	)

	$: allInvoices = $invoices.data?.pages.flatMap((page) => page.results)
</script>

{#if $invoices.isLoading}
	<div class="p-2">
		<Skeleton class="w-full h-8" />
	</div>
{:else if $invoices.isError}
	<div class="p-2">{$t('general.error')}</div>
{:else if allInvoices?.length === 0}
	<slot name="empty">
		<div class="p-2">{$t('invoiceList.noneFound')}</div>
	</slot>
{:else}
	<InvoiceTable invoices={allInvoices || []} bind:previewInvoiceId />

	{#if $invoices.isFetchingNextPage}
		<Skeleton class="w-full h-6" />
	{:else if $invoices.hasNextPage}
		<!-- TODO: translate -->
		<Button on:click={() => $invoices.fetchNextPage()} text>{$t('general.loadMore')}</Button>
	{/if}
{/if}
