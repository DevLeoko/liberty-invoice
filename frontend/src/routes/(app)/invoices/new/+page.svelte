<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { parseInvoiceIdFormat } from '../../../../../../shared/invoice-ids'
	import Button from '../../../../lib/components/basics/Button.svelte'
	import Skeleton from '../../../../lib/components/basics/Skeleton.svelte'
	import InvoiceEditor from '../../../../lib/components/editors/InvoiceEditor.svelte'
	import { createInvoiceCreateMutation, queryInvoiceRead } from '../../../../lib/controller/invoice'
	import { queryUserSettings } from '../../../../lib/controller/user-settings'
	import { logError, logSuccess, t } from '../../../../lib/stores/settings'
	import { trpc, type CreateInvoice } from '../../../../lib/trpcClient'
	import type { NullableProp } from '../../../../types/utilities'

	let invoice: null | NullableProp<CreateInvoice, 'clientId'> = null
	let partialId: null | number = null

	let loadingSave = false

	const userSettingsPromise = queryUserSettings()

	async function init() {
		const duplicateId = $page.url.searchParams.get('duplicate')
		const duplicationDataFetch =
			duplicateId != null ? queryInvoiceRead(Number.parseInt(duplicateId)) : null

		const [partialIdData, userSettings, duplicationData] = await Promise.all([
			trpc.invoice.getNextAvailablePartialInvoiceId.query(),
			userSettingsPromise,
			duplicationDataFetch,
		])

		const { idFormat, partialId: nextPartialId } = partialIdData

		partialId = nextPartialId

		const { format } = parseInvoiceIdFormat(idFormat)

		const dueDate = new Date()
		dueDate.setDate(dueDate.getDate() + userSettings.defaultDueDays)

		invoice = {
			note: '',
			clientId: null,
			items: [],
			taxRateIds: userSettings.defaultTaxRateId != null ? [userSettings.defaultTaxRateId] : [],
			language: userSettings.defaultLanguage,
			currency: userSettings.defaultCurrency,
			...duplicationData,

			// Don't overwrite this data when duplicating:
			invoiceNumber: format(partialId),
			date: new Date(),
			dueDate,
		}
	}

	init()

	const invoiceCreateMutation = createInvoiceCreateMutation()

	async function createInvoice() {
		if (!invoice || invoice.clientId == null) {
			$logError('invoiceEditor.clientRequired')
			return
		}

		loadingSave = true

		const res = await invoiceCreateMutation({
			invoice: invoice as CreateInvoice,
			partialId: partialId!,
		}).finally(() => {
			loadingSave = false
		})

		$logSuccess('invoiceEditor.created')

		goto(`/invoices/${res.id}/edit`)
	}
</script>

<div class="flex items-center justify-between mb-4">
	<h1 class="pageTitle">
		<span class="material-icons back-nav" on:click={() => goto('/invoices')}>arrow_back</span>
		{$t('invoiceList.newInvoice')}
	</h1>
	<Button loading={loadingSave} on:click={createInvoice}
		><span class="mr-1 material-icons">check</span> {$t('general.create')}</Button
	>
</div>

{#if invoice != null}
	<InvoiceEditor bind:invoice createMode />
{:else}
	<Skeleton class="h-16" />
{/if}
