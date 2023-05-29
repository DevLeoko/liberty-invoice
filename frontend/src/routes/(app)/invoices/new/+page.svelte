<script lang="ts">
	import { onMount } from 'svelte'
	import Button from '../../../../lib/components/basics/Button.svelte'
	import InvoiceEditor from '../../../../lib/components/editors/InvoiceEditor.svelte'
	import { trpc, type CreateInvoice, type ReadInvoice } from '../../../../lib/trpcClient'
	import { parseInvoiceIdFormat } from '../../../../../../shared/invoice-ids'
	import type { NullableProp } from '../../../../types/utilities'
	import { INVOICE_KEYS, queryUserSettings } from '../../../../lib/tanQuery'
	import Skeleton from '../../../../lib/components/basics/Skeleton.svelte'
	import { logError, logSuccess } from '../../../../lib/stores/alerts'
	import { useQueryClient } from '@tanstack/svelte-query'
	import { t } from '../../../../lib/stores/settings'
	import { page } from '$app/stores'

	let invoice: null | NullableProp<CreateInvoice, 'clientId'> = null
	let partialId: null | number = null

	let loadingSave = false

	const queryClient = useQueryClient()

	const userSettingsPromise = queryUserSettings()

	onMount(async () => {
		const duplicateId = $page.url.searchParams.get('duplicate')
		const duplicationDataFetch =
			duplicateId != null ? trpc.invoice.read.query(Number.parseInt(duplicateId)) : null

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
	})

	async function createInvoice() {
		if (!invoice || invoice.clientId == null) {
			logError('You need to select a client')
			return
		}

		loadingSave = true

		await trpc.invoice.create
			.mutate({
				invoice: invoice as CreateInvoice,
				partialId: partialId!,
			})
			.finally(() => {
				loadingSave = false
			})

		queryClient.invalidateQueries(INVOICE_KEYS.list())
		logSuccess('Invoice created')
	}
</script>

<div class="flex justify-between mb-4">
	<h1 class="pageTitle">{$t('invoiceList.newInvoice')}</h1>
	<Button loading={loadingSave} on:click={createInvoice}
		><span class="mr-1 material-icons">check</span> {$t('general.save')}</Button
	>
</div>

{#if invoice != null}
	<InvoiceEditor bind:invoice />
{:else}
	<Skeleton class="h-16" />
{/if}
