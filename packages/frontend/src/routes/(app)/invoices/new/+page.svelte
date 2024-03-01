<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { parseInvoiceIdFormat } from '../../../../../../shared/invoice-ids'
	import Button from '../../../../lib/components/basics/Button.svelte'
	import PageTitle from '../../../../lib/components/basics/PageTitle.svelte'
	import Skeleton from '../../../../lib/components/basics/Skeleton.svelte'
	import InvoiceEditor from '../../../../lib/components/editors/invoice-editor/InvoiceEditor.svelte'
	import {
		createInvoiceCreateMutation,
		emptyInvoiceItem,
		previewInvoice,
		queryInvoiceRead,
	} from '../../../../lib/controller/invoice'
	import { queryUserSettings } from '../../../../lib/controller/user-settings'
	import { logError, logSuccess, t } from '../../../../lib/stores/settings'
	import { trpc, type CreateInvoice } from '../../../../lib/trpcClient'
	import { isLgOrLarger } from '../../../../lib/utils/screenSize'
	import type { NullableProp } from '../../../../types/utilities'

	let invoice: null | NullableProp<CreateInvoice, 'clientId'> = null
	let partialId: null | number = null
	let systemInvoiceNumber: null | string = null

	let loadingSave = false

	const userSettingsPromise = queryUserSettings()

	async function init() {
		const duplicateId = $page.url.searchParams.get('duplicate')
		const duplicationDataFetch = duplicateId != null ? queryInvoiceRead(duplicateId) : null

		const [partialIdData, userSettings, duplicationData] = await Promise.all([
			trpc.invoice.getNextAvailablePartialInvoiceId.query(),
			userSettingsPromise,
			duplicationDataFetch,
		])

		const { idFormat, partialId: nextPartialId } = partialIdData

		partialId = nextPartialId

		const { format } = parseInvoiceIdFormat(idFormat)

		const dueDate = new Date()

		let dueDays = userSettings.defaultDueDays
		if (duplicationData) {
			dueDays = Math.round(
				(duplicationData.dueDate.getTime() - duplicationData.date.getTime()) / (1000 * 60 * 60 * 24)
			)
		}

		dueDate.setDate(dueDate.getDate() + dueDays)

		const invoiceNumber = format(partialId)

		invoice = {
			note: '',
			clientId: null,
			items: isLgOrLarger() ? [] : [emptyInvoiceItem()],
			taxRateIds: userSettings.defaultTaxRateId != null ? [userSettings.defaultTaxRateId] : [],
			language: userSettings.defaultLanguage,
			currency: userSettings.defaultCurrency,
			...duplicationData,

			// Don't overwrite this data when duplicating:
			invoiceNumber,
			date: new Date(),
			dueDate,
		}

		systemInvoiceNumber = invoiceNumber
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
			partialId: systemInvoiceNumber == invoice.invoiceNumber ? partialId! : undefined,
		}).finally(() => {
			loadingSave = false
		})

		$logSuccess('invoiceEditor.created')

		goto(`/invoices?preview=${res.id}`)
	}

	function openPdfPreview() {
		if (!invoice || invoice.clientId == null) {
			$logError('invoiceEditor.clientRequired')
			return
		}

		previewInvoice(invoice as CreateInvoice)
	}
</script>

<PageTitle title={$t('invoiceList.newInvoice')} backLink="/invoices">
	<Button gray on:click={openPdfPreview} class="">{$t('invoiceEditor.previewPdf')}</Button>
	<Button loading={loadingSave} on:click={createInvoice}
		><span class="mr-1 material-icons">check</span> {$t('general.create')}</Button
	>
</PageTitle>

{#if invoice != null}
	<InvoiceEditor bind:invoice createMode />
{:else}
	<Skeleton class="h-16" />
{/if}
