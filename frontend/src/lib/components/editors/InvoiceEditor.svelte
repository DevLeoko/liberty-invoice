<script lang="ts">
	import { readable } from 'svelte/store'
	import type { NullableProp } from '../../../types/utilities'
	import {
		createFinalTextFragmentQuery,
		parseInvoiceTextFragment,
	} from '../../controller/text-fragment'
	import { getCurrency, t } from '../../stores/settings'
	import { trpc, type CreateInvoice } from '../../trpcClient'
	import ClientSelector from '../ClientSelector.svelte'
	import DateInput from '../basics/DateInput.svelte'
	import Labeled from '../basics/Labeled.svelte'
	import InvoiceItemsEditor from './InvoiceItemsEditor.svelte'

	export let invoice: NullableProp<CreateInvoice, 'clientId'>
	export let createMode = false

	$: currency = $getCurrency(invoice.currency) || $getCurrency('USD')

	$: clientId = invoice.clientId
	$: invoiceLanguage = invoice.language

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

	$: defaultNoteQuery =
		clientId == null || !createMode
			? readable(null)
			: createFinalTextFragmentQuery('invoice.note', invoiceLanguage, clientId)

	function updateInvoiceNote(note: string, invoiceDate: Date, dueDate: Date) {
		invoice.note = parseInvoiceTextFragment(note, $t('langCode'), {
			dueDate,
			invoiceDate,
		})
	}

	$: {
		if ($defaultNoteQuery != null) {
			updateInvoiceNote($defaultNoteQuery, invoice.date, invoice.dueDate)
		}
	}

	$: dueDays = invoice.dueDate
		? Math.round((invoice.dueDate.getTime() - invoice.date.getTime()) / (1000 * 60 * 60 * 24))
		: 0
</script>

<div class="flex flex-col max-w-2xl space-y-6">
	<div class="flex space-x-3">
		<Labeled label={$t('invoice.invoiceNumber')}>
			<div class="flex items-center">
				<input type="text" bind:value={invoice.invoiceNumber} disabled />
				<span class="material-icons input-icon">edit</span>
			</div>
		</Labeled>
		<Labeled label={$t('invoiceEditor.date')} class="!ml-auto">
			<DateInput bind:date={invoice.date} />
		</Labeled>
		<Labeled
			label={$t('invoiceEditor.due')}
			actionText={$t('invoiceEditor.dueIn', { days: dueDays })}
		>
			<DateInput bind:date={invoice.dueDate} />
		</Labeled>
	</div>

	<Labeled label={$t('general.client')} actionText={$t('invoiceEditor.toggleSearch')}>
		<ClientSelector bind:clientId={invoice.clientId} />
	</Labeled>

	<Labeled label={$t('invoiceEditor.note')}>
		<textarea class="w-full" rows="2" bind:value={invoice.note} />
	</Labeled>

	<div>
		<InvoiceItemsEditor {currency} bind:items={invoice.items} />
	</div>
</div>
