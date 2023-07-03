<script lang="ts">
	import InvoicePreview from '../../../lib/components/InvoicePreview.svelte'
	import InvoiceRow from '../../../lib/components/InvoiceRow.svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import SidePopup from '../../../lib/components/basics/SidePopup.svelte'
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte'
	import { createInvoiceQuery } from '../../../lib/controller/invoice'
	import { t } from '../../../lib/stores/settings'
	import { trpc, type ListInvoice, type ReadInvoice } from '../../../lib/trpcClient'

	const invoices = createInvoiceQuery()

	let previewInvoice: ReadInvoice | null = null
	let loadingPreview = false

	async function openPreview(invoice: ListInvoice) {
		loadingPreview = true
		// TODO: maybe replace with tan query in the future
		previewInvoice = await trpc.invoice.read.query(invoice.id).finally(() => {
			loadingPreview = false
		})
	}

	function closePreview() {
		previewInvoice = null
		loadingPreview = false
	}

	$: sortedInvoices = [...($invoices.data || [])].sort((a, b) =>
		b.invoiceNumber.localeCompare(a.invoiceNumber),
	)
</script>

<div class="flex items-center justify-between mb-4">
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
	<div class="error">{$t('invoiceList.noneFound')}</div>
{:else}
	<div class="py-2 overflow-x-auto md:overflow-x-visible">
		<table class="w-full">
			<tr class="text-left font-medium contents [&>*]:px-2">
				<th>{$t('invoice.invoiceNumber')}</th>
				<th>{$t('general.client')}</th>
				<th>{$t('invoice.amount')}</th>
				<th>{$t('invoice.dueDate')}</th>
				<th>{$t('general.status')}</th>
				<th />
			</tr>
			{#each sortedInvoices as invoice (invoice.id)}
				<InvoiceRow {invoice} on:click={() => openPreview(invoice)} />
			{/each}
		</table>
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
