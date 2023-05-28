<script lang="ts">
	import { goto } from '$app/navigation'
	import InvoicePreview from '../../../lib/components/InvoicePreview.svelte'
	import InvoiceRow from '../../../lib/components/InvoiceRow.svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import SidePopup from '../../../lib/components/basics/SidePopup.svelte'
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte'
	import { t } from '../../../lib/stores/settings'
	import { createInvoiceQuery } from '../../../lib/tanQuery'
	import { trpc, type ReadInvoice, type ListInvoice } from '../../../lib/trpcClient'

	const invoices = createInvoiceQuery()

	let previewInvoice: ReadInvoice | null = null
	let loadingPreview = false

	async function openPreview(invoice: ListInvoice) {
		loadingPreview = true
		previewInvoice = await trpc.invoice.read.query(invoice.id).finally(() => {
			loadingPreview = false
		})
	}

	function closePreview() {
		previewInvoice = null
		loadingPreview = false
	}
</script>

<div class="flex justify-between mb-4">
	<h1 class="pageTitle">{$t('menu.invoices')}</h1>
	<Button href="/invoices/new"
		><span class="mr-1 material-icons">add</span> {$t('invoiceList.newInvoice')}</Button
	>
</div>

{#if $invoices.isLoading}
	<Skeleton class="w-24 h-12" />
{:else if $invoices.isError}
	<span>{$t('general.error')}</span>
{:else if $invoices.data.length === 0}
	<div class="error">{$t('invoiceList.noneFound')}}</div>
{:else}
	<div class="grid w-full grid-table-6">
		<div class="text-left font-medium contents [&>*]:px-2">
			<div>{$t('invoice.invoiceNumber')}</div>
			<div>{$t('general.client')}</div>
			<div>{$t('invoice.amount')}</div>
			<div>{$t('invoice.dueDate')}</div>
			<div>{$t('general.status')}</div>
			<div />
		</div>
		{#each $invoices.data as invoice}
			<InvoiceRow {invoice} on:click={() => openPreview(invoice)} />
		{/each}
	</div>

	{#if loadingPreview || previewInvoice}
		<SidePopup on:exit={closePreview} class="w-[600px]">
			{#if !previewInvoice}
				<Skeleton class="w-full h-48" />
			{:else}
				<InvoicePreview invoice={previewInvoice} on:exit={closePreview} />
			{/if}
		</SidePopup>
	{/if}
{/if}
