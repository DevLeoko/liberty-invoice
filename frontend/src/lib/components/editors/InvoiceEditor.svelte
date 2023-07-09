<script lang="ts">
	import type { NullableProp } from '../../../types/utilities'
	import { getCurrency, logInfo, t } from '../../stores/settings'
	import { trpc, type CreateInvoice } from '../../trpcClient'
	import ClientSelector from '../ClientSelector.svelte'
	import DateInput from '../basics/DateInput.svelte'
	import Labeled from '../basics/Labeled.svelte'
	import InvoiceItemsEditor from './InvoiceItemsEditor.svelte'
	import InvoiceNoteEditor from './InvoiceNoteEditor.svelte'

	export let invoice: NullableProp<CreateInvoice, 'clientId'>
	export let createMode = false

	$: currency = $getCurrency(invoice.currency) || $getCurrency('USD')

	$: clientId = invoice.clientId

	function onClientChange(clientId: number) {
		trpc.client.readDefaults.query({ id: clientId }).then((defaults) => {
			invoice.currency = defaults.defaultCurrency
			invoice.language = defaults.defaultLanguage
			invoice.dueDate = new Date(
				invoice.date.getTime() + defaults.defaultDueDays * 24 * 60 * 60 * 1000,
			)
			if (defaults.defaultTaxRateId != null) invoice.taxRateIds = [defaults.defaultTaxRateId]
		})
	}

	$: {
		if (clientId != null) {
			onClientChange(clientId)
		}
	}

	$: dueDays = invoice.dueDate
		? Math.round((invoice.dueDate.getTime() - invoice.date.getTime()) / (1000 * 60 * 60 * 24))
		: 0

	function notImplemented() {
		// TODO: implement
		$logInfo('general.inDevelopment')
	}
</script>

<div class="flex flex-col max-w-2xl space-y-6">
	<div class="flex flex-wrap gap-3">
		<Labeled label={$t('invoice.invoiceNumber')} class="mr-auto">
			<div class="flex items-center">
				<input type="text" bind:value={invoice.invoiceNumber} disabled />
				<span class="cursor-pointer material-icons input-icon" on:click={notImplemented}>edit</span>
			</div>
		</Labeled>
		<Labeled label={$t('invoiceEditor.date')}>
			<DateInput bind:date={invoice.date} />
		</Labeled>
		<Labeled
			label={$t('invoiceEditor.due')}
			actionText={$t('invoiceEditor.dueIn', { days: dueDays })}
			on:action={notImplemented}
		>
			<DateInput bind:date={invoice.dueDate} />
		</Labeled>
	</div>

	<Labeled
		label={$t('general.client')}
		actionText={$t('invoiceEditor.toggleSearch')}
		on:action={notImplemented}
	>
		<ClientSelector bind:clientId={invoice.clientId} />
	</Labeled>

	<Labeled label={$t('invoiceEditor.note')}>
		<InvoiceNoteEditor {invoice} {createMode} bind:note={invoice.note} />
	</Labeled>

	<div class="pl-2 -ml-2 overflow-x-auto md:overflow-x-visible">
		<div class="min-w-[600px]">
			<InvoiceItemsEditor
				{currency}
				bind:items={invoice.items}
				bind:taxRateIds={invoice.taxRateIds}
			/>
		</div>
	</div>
</div>
