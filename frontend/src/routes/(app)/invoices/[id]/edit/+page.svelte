<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { cloneDeep } from 'lodash'
	import Button from '../../../../../lib/components/basics/Button.svelte'
	import Skeleton from '../../../../../lib/components/basics/Skeleton.svelte'
	import InvoiceEditor from '../../../../../lib/components/editors/InvoiceEditor.svelte'
	import {
		createInvoiceUpdateMutation,
		previewInvoice,
		queryInvoiceRead,
	} from '../../../../../lib/controller/invoice'
	import { logSuccess, t } from '../../../../../lib/stores/settings'
	import type { CreateInvoice } from '../../../../../lib/trpcClient'

	const id = Number.parseInt($page.params.id)

	let loadingSave = false
	let invoice: null | CreateInvoice = null

	queryInvoiceRead(id).then((invoiceData) => {
		invoice = {
			...cloneDeep(invoiceData),
			taxRateIds: invoiceData.taxRates.map((taxRate) => taxRate.id),
		}
	})

	const invoiceUpdateMutation = createInvoiceUpdateMutation()

	async function saveInvoice() {
		if (!invoice) {
			return
		}

		loadingSave = true

		await invoiceUpdateMutation({
			id,
			invoice,
		}).finally(() => {
			loadingSave = false
		})

		$logSuccess('general.savedChanges')
		goto(`/invoices?preview=${id}`)
	}

	function openPdfPreview() {
		if (!invoice) {
			return
		}

		previewInvoice(invoice)
	}
</script>

<div class="flex items-center justify-between mb-4">
	<h1 class="pageTitle">
		<span class="material-icons back-nav" on:click={() => goto('/invoices')}>arrow_back</span>
		<span class="">{$t('invoice.invoice')}</span>
		{#if invoice != null}
			<span class="font-normal">&nbsp;{invoice.invoiceNumber}</span>
		{/if}
	</h1>

	{#if invoice != null}
		<div class="flex flex-wrap justify-end">
			<Button gray on:click={openPdfPreview} class="mr-2">{$t('invoiceEditor.previewPdf')}</Button>
			<Button loading={loadingSave} on:click={saveInvoice}
				><span class="mr-1 material-icons">check</span> {$t('general.save')}</Button
			>
		</div>
	{/if}
</div>

{#if invoice != null}
	<InvoiceEditor bind:invoice />
{:else}
	<Skeleton class="h-16" />
{/if}
