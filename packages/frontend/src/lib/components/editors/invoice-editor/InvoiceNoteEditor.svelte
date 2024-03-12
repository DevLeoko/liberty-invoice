<script lang="ts">
	import { readable } from 'svelte/store'
	import type { NullableProp } from '../../../../types/utilities'
	import {
		createFinalTextFragmentQuery,
		getTextFragmentInvoiceDateVariables,
		parseTextFragment,
	} from '../../../controller/text-fragment'
	import { t } from '../../../stores/settings'
	import type { CreateInvoice } from '../../../trpcClient'

	export let invoice: NullableProp<CreateInvoice, 'clientId'>
	export let createMode = false

	export let note: string

	$: clientId = invoice.clientId
	$: invoiceLanguage = invoice.language
	$: invoiceDate = invoice.date.getTime()
	$: invoiceDueDate = invoice.dueDate.getTime()

	$: defaultNoteQuery =
		clientId == null || !createMode
			? readable(null)
			: createFinalTextFragmentQuery('invoice.note', invoiceLanguage, clientId)

	function updateInvoiceNote(rawNote: string, invoiceDate: Date, dueDate: Date) {
		note = parseTextFragment(
			rawNote,
			getTextFragmentInvoiceDateVariables(
				{
					dueDate,
					invoiceDate,
				},
				$t('langCode')
			)
		)
	}

	let initialLoad = true
	$: {
		if ($defaultNoteQuery != null && !initialLoad) {
			updateInvoiceNote($defaultNoteQuery, new Date(invoiceDate), new Date(invoiceDueDate))
		}
		initialLoad = false
	}
</script>

<textarea class="w-full" rows="2" bind:value={note} />
