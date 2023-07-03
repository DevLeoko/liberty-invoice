<script lang="ts">
	import { readable } from 'svelte/store'
	import type { NullableProp } from '../../../types/utilities'
	import {
		createFinalTextFragmentQuery,
		parseInvoiceTextFragment,
	} from '../../controller/text-fragment'
	import { t } from '../../stores/settings'
	import type { CreateInvoice } from '../../trpcClient'

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
		note = parseInvoiceTextFragment(rawNote, $t('langCode'), {
			dueDate,
			invoiceDate,
		})

		// TODO: this overrides the initial value of the note, when duplicating an invoice
	}

	$: {
		if ($defaultNoteQuery != null) {
			updateInvoiceNote($defaultNoteQuery, new Date(invoiceDate), new Date(invoiceDueDate))
		}
	}
</script>

<textarea class="w-full" rows="2" bind:value={note} />
