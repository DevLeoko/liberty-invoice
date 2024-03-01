<script lang="ts">
	import { page } from '$app/stores'
	import InvoicePreview from '../../../lib/components/InvoicePreview.svelte'
	import InvoiceRow from '../../../lib/components/InvoiceRow.svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
	import SidePopup from '../../../lib/components/basics/SidePopup.svelte'
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte'
	import { createInvoiceQuery, createInvoiceReadQuery } from '../../../lib/controller/invoice'
	import { t } from '../../../lib/stores/settings'

	const invoices = createInvoiceQuery()

	let previewInvoiceId: string | null = null
	$: previewInvoice = previewInvoiceId != null ? createInvoiceReadQuery(previewInvoiceId) : null

	if ($page.url.searchParams.has('preview')) {
		previewInvoiceId = $page.url.searchParams.get('preview')!
	}

	function closePreview() {
		previewInvoiceId = null
	}

	$: sortedInvoices = [...($invoices.data || [])].sort((a, b) =>
		b.invoiceNumber.localeCompare(a.invoiceNumber),
	)
</script>

<PageTitle title={$t('menu.invoices')}>
	<Button href="/invoices/new">
		<span class="mr-1 material-icons">add</span>
		{$t('invoiceList.newInvoice')}
	</Button>
</PageTitle>

{#if $invoices.isLoading}
	<Skeleton class="w-24 h-12" />
{:else if $invoices.isError}
	<span>{$t('general.error')}</span>
{:else if $invoices.data.length === 0}
	<div class="error">{$t('invoiceList.noneFound')}</div>
{:else}
	<div class="hidden py-2 overflow-x-auto md:block">
		<table class="w-full">
			<tr class="text-left font-medium contents [&>*]:px-2">
				<th>{$t('invoice.invoiceNumber')}</th>
				<th>{$t('general.date')}</th>
				<th>{$t('general.client')}</th>
				<th>{$t('invoice.amount')}</th>
				<th>{$t('invoice.dueDate')}</th>
				<th>{$t('general.status')}</th>
				<th />
			</tr>
			{#each sortedInvoices as invoice (invoice.id)}
				<InvoiceRow
					{invoice}
					on:click={() => (previewInvoiceId = invoice.id)}
					class={previewInvoiceId == invoice.id ? 'bg-blue-100 hover:bg-blue-100' : ''}
				/>
			{/each}
		</table>
	</div>

	<div class="flex flex-col gap-2 md:hidden">
		{#each sortedInvoices as invoice, index (invoice.id)}
			<InvoiceRow
				{invoice}
				class="{index != 0 ? 'border-t border-gray-300' : ''} py-2"
				on:click={() => (previewInvoiceId = invoice.id)}
			/>
		{/each}
	</div>

	{#if previewInvoice != null}
		<SidePopup on:exit={closePreview} class="w-[600px]">
			{#if !$previewInvoice?.data}
				<Skeleton class="w-full h-48" />
			{:else}
				<InvoicePreview invoice={$previewInvoice.data} on:exit={closePreview} />
			{/if}
		</SidePopup>
	{/if}
{/if}
