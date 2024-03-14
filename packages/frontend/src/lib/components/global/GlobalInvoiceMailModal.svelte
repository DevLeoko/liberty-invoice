<script lang="ts" context="module">
	export const openInvoiceMailModal = {
		mutate: Promise.resolve as (invoiceId: string, finalize: boolean) => Promise<void>,
	}
</script>

<script lang="ts">
	import InvoiceMailModal from '$lib/components/invoices/InvoiceMailModal.svelte'
	import type { ReadInvoice } from '$lib/trpcClient'

	import { createInvoiceReadFetcher } from '$lib/controller/invoice'
	import { writable } from 'svelte/store'

	const invoice = writable<ReadInvoice | null>(null)
	const finalizeBeforeSend = writable(false)

	const fetchInvoice = createInvoiceReadFetcher()

	export async function openInvoiceMailModalFunc(invoiceId: string, finalize: boolean) {
		const invoiceRes = await fetchInvoice(invoiceId)

		invoice.set(invoiceRes)
		finalizeBeforeSend.set(finalize)
	}

	openInvoiceMailModal.mutate = openInvoiceMailModalFunc
</script>

{#if $invoice}
	<InvoiceMailModal
		invoice={$invoice}
		finalizeBeforeSend={$finalizeBeforeSend}
		on:exit={() => ($invoice = null)}
	/>
{/if}
