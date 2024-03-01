<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { cloneDeep } from 'lodash'
	import Button from '../../../../../lib/components/basics/Button.svelte'
	import PageTitle from '../../../../../lib/components/basics/PageTitle.svelte'
	import Skeleton from '../../../../../lib/components/basics/Skeleton.svelte'
	import InvoiceEditor from '../../../../../lib/components/editors/invoice-editor/InvoiceEditor.svelte'
	import {
		createInvoiceUpdateMutation,
		previewInvoice,
		queryInvoiceRead,
	} from '../../../../../lib/controller/invoice'
	import { logSuccess, t } from '../../../../../lib/stores/settings'
	import type { CreateInvoice } from '../../../../../lib/trpcClient'

	const id = $page.params.id

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

<PageTitle backLink="/invoices">
	<svelte:fragment slot="title">
		<div class="flex flex-wrap gap-x-2">
			<span class="">{$t('invoice.invoice')}</span>
			{#if invoice != null}
				<span class="font-normal">{invoice.invoiceNumber}</span>
			{/if}
		</div>
	</svelte:fragment>

	{#if invoice != null}
		<Button gray on:click={openPdfPreview}>{$t('invoiceEditor.previewPdf')}</Button>
		<Button loading={loadingSave} on:click={saveInvoice}
			><span class="mr-1 material-icons">check</span> {$t('general.save')}</Button
		>
	{/if}
</PageTitle>

{#if invoice != null}
	<InvoiceEditor bind:invoice />
{:else}
	<Skeleton class="h-16" />
{/if}
