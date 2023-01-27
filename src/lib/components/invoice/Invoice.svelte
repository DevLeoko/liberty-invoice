<script lang="ts" context="module">
	const { getContext, createContext } = defineContext<{
		it: Readable<(key: TranslationPaths, vars?: Record<string, string>) => string>
		showHints: Readable<boolean>
		preview: Readable<boolean>
		formatCurrency: Readable<(value: number) => string>
		formatFloat: Readable<(value: number) => string>
	}>()

	export const getInvoiceContext = getContext
</script>

<script lang="ts">
	import { derived, writable, type Readable } from 'svelte/store'
	import { defineContext } from '../../utils/context-helpers'
	import { formatCurrencyGeneric } from '../../utils/Currency'
	import { formatFloatGeneric, translate } from '../../utils/i18n'

	import type { Invoice } from '../../utils/Invoice'
	import type { TranslationPaths } from '../../utils/translations'
	import InvoiceClient from './InvoiceClient.svelte'
	import InvoiceDescription from './InvoiceDescription.svelte'
	import InvoiceFooter from './InvoiceFooter.svelte'
	import InvoiceHeader from './InvoiceHeader.svelte'
	import InvoiceIssuer from './InvoiceIssuer.svelte'
	import InvoiceTable from './InvoiceTable.svelte'

	export let invoice: Invoice

	let showHints = writable(false)
	let preview = writable(false)

	let timeout: ReturnType<typeof setTimeout> | null = null
	function movedCursor() {
		$showHints = true
		if (timeout) clearTimeout(timeout)

		timeout = setTimeout(() => {
			$showHints = false
		}, 2500)
	}

	const it = writable((key: TranslationPaths, vars: Record<string, string> = {}) =>
		translate(invoice.language, key, vars)
	)
	$: $it = (key: TranslationPaths, vars: Record<string, string> = {}) =>
		translate(invoice.language, key, vars)

	const formatFloat = writable((v: number) => formatFloatGeneric(invoice.language, v))
	$: $formatFloat = (v: number) => formatFloatGeneric(invoice.language, v)

	const formatCurrency = writable((v: number) =>
		formatCurrencyGeneric(v, $formatFloat, invoice.currency)
	)
	$: $formatCurrency = (v: number) => formatCurrencyGeneric(v, $formatFloat, invoice.currency)

	createContext({
		it: derived(it, ($it) => $it),
		preview: derived(preview, ($preview) => $preview),
		showHints: derived(showHints, ($showHints) => $showHints),
		formatFloat: derived(formatFloat, ($formatFloat) => $formatFloat),
		formatCurrency: derived(formatCurrency, ($formatCurrency) => $formatCurrency)
	})
</script>

<div
	style="width: 210mm; min-height: 297mm; color: #4F5A69; box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.3); font-family: 'Roboto', sans-serif; font-size: 15px;"
	class="p-10 relative flex flex-col"
	on:pointermove={movedCursor}
>
	<InvoiceHeader {invoice} />

	<div class="flex justify-between mt-8 leading-tight">
		<InvoiceClient bind:client={invoice.client} />

		<InvoiceIssuer accountDetails={invoice.account} />
	</div>

	<InvoiceDescription {invoice} />

	<InvoiceTable bind:invoice />

	<InvoiceFooter {invoice} />
</div>
