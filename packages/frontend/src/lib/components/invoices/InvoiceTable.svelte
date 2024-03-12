<script lang="ts">
	import InvoicePreview from '$lib/components/InvoicePreview.svelte'
	import InvoiceRow from '$lib/components/InvoiceRow.svelte'
	import SidePopup from '$lib/components/basics/SidePopup.svelte'
	import Skeleton from '$lib/components/basics/Skeleton.svelte'
	import InvoiceMailModal from '$lib/components/invoices/InvoiceMailModal.svelte'
	import { createInvoiceReadQuery } from '$lib/controller/invoice'
	import { t } from '$lib/stores/settings'
	import type { ListInvoice } from '$lib/trpcClient'

	export let invoices: ListInvoice[]
	export let previewInvoiceId: string | null = null

	$: previewInvoice = previewInvoiceId != null ? createInvoiceReadQuery(previewInvoiceId) : null

	function closePreview() {
		previewInvoiceId = null
	}

	function selectInvoice(id: string) {
		if (previewInvoiceId === id) {
			previewInvoiceId = null
		} else {
			previewInvoiceId = id
		}
	}
</script>

<div class="hidden py-2 overflow-x-auto md:block">
	<table class="w-full">
		<tr class="text-left font-medium contents [&>*]:px-2">
			<th>{$t('invoice.invoiceNumber')}</th>
			<th>{$t('general.date')}</th>
			<th>{$t('general.client')}</th>
			<th class="text-right">{$t('invoice.amount')}</th>
			<th>{$t('invoice.dueDate')}</th>
			<th>{$t('general.status')}</th>
			<th />
		</tr>
		{#each invoices as invoice (invoice.id)}
			<InvoiceRow
				{invoice}
				on:click={() => selectInvoice(invoice.id)}
				class={previewInvoiceId == invoice.id ? 'bg-blue-100 hover:bg-blue-100' : ''}
			/>
		{/each}
	</table>
</div>

<div class="flex flex-col gap-2 md:hidden">
	{#each invoices as invoice, index (invoice.id)}
		<InvoiceRow
			{invoice}
			class="{index != 0 ? 'border-t border-gray-300' : ''} py-2"
			on:click={() => (previewInvoiceId = invoice.id)}
		/>
	{/each}
</div>

{#if previewInvoice != null}
	{#if $previewInvoice?.data}
		<InvoiceMailModal invoice={$previewInvoice.data} on:exit={closePreview} />
	{/if}

	<SidePopup on:exit={closePreview} class="w-[600px]">
		{#if !$previewInvoice?.data}
			<Skeleton class="w-full h-48" />
		{:else}
			<InvoicePreview invoice={$previewInvoice.data} on:exit={closePreview} />
		{/if}
	</SidePopup>
{/if}
