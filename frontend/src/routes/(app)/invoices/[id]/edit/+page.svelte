<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import Button from '../../../../../lib/components/basics/Button.svelte'
	import Skeleton from '../../../../../lib/components/basics/Skeleton.svelte'
	import InvoiceEditor from '../../../../../lib/components/editors/InvoiceEditor.svelte'
	import { createInvoiceUpdateMutation } from '../../../../../lib/controller/invoice'
	import { logSuccess, t } from '../../../../../lib/stores/settings'
	import { trpc, type CreateInvoice } from '../../../../../lib/trpcClient'

	const id = Number.parseInt($page.params.id)

	let loadingSave = false
	let invoice: null | CreateInvoice = null

	onMount(async () => {
		const invoiceData = await trpc.invoice.read.query(id)

		invoice = {
			...invoiceData,
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
		goto('/invoices')
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
	<Button loading={loadingSave} on:click={saveInvoice}
		><span class="mr-1 material-icons">check</span> {$t('general.save')}</Button
	>
</div>

{#if invoice != null}
	<InvoiceEditor bind:invoice />
{:else}
	<Skeleton class="h-16" />
{/if}
