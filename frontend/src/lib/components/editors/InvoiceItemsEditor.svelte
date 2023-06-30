<script lang="ts">
	import { tick } from 'svelte'
	import type { FullCurrency } from '../../../../../shared/currencies'
	import { createTaxRateListQuery } from '../../controller/tax-rate'
	import { t } from '../../stores/settings'
	import type { CreateInvoiceItem } from '../../trpcClient'
	import InvoiceItemEditorRow from './InvoiceItemEditorRow.svelte'
	import InvoiceTaxRateEditor from './InvoiceTaxRateEditor.svelte'

	export let currency: FullCurrency
	export let items: CreateInvoiceItem[]
	export let taxRateIds: number[]

	function getEmptyItem() {
		return { description: '', quantity: 0, name: '', unit: '', unitPrice: 0, productId: null }
	}

	function addNewItem() {
		items = [...items, getEmptyItem()]
	}

	function addNewAndFocusLast() {
		addNewItem()
		tick().then(() => {
			const table = document.getElementById('itemEditorTable') as HTMLTableElement
			const lastRow = table.rows[items.length]

			const input = lastRow.querySelector('input') as HTMLInputElement
			input.focus()
		})
	}

	function removeItem(index: number) {
		items = items.filter((_, i) => i != index)

		if (items.length == 0) {
			addNewItem()
		}
	}

	const taxRates = createTaxRateListQuery()
	$: selectedTaxRate = $taxRates.data?.find((taxRate) => taxRate.id === taxRateIds[0]) ?? null

	$: itemSubtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)

	$: taxRate = (selectedTaxRate?.rate ?? 0) / 100
	$: tax = itemSubtotal * taxRate
</script>

<table class="w-full table-fixed" id="itemEditorTable">
	<tr class="text-sm">
		<th class="w-1/2 font-semibold text-left">{$t('invoice.item')}</th>
		<th class="font-semibold text-left">{$t('invoice.quantity')}</th>
		<th class="font-semibold text-left">{$t('invoice.unitPrice')}</th>
		<th class="font-semibold text-right">{$t('invoice.amount')}</th>
		<th class="w-12" />
	</tr>
	{#each items as item, i (i)}
		<InvoiceItemEditorRow {currency} bind:item on:remove={() => removeItem(i)} />
	{/each}
	{#key items.length}
		<InvoiceItemEditorRow
			{currency}
			class="opacity-50"
			item={getEmptyItem()}
			on:focusin={() => addNewAndFocusLast()}
			dummy
		/>
	{/key}
	<tr>
		<td colspan="2" />
		<td class="border-t border-gray-300">{$t('invoice.subtotal')}</td>
		<td class="text-right border-t border-gray-300">{currency.format(itemSubtotal)}</td>
		<td />
	</tr>
	<tr>
		<td colspan="2" />
		<td colspan="2">
			<InvoiceTaxRateEditor bind:taxRateId={taxRateIds[0]}>
				{currency.format(tax)}
			</InvoiceTaxRateEditor>
		</td>
		<td />
	</tr>
	<tr class="font-medium">
		<td colspan="2" />
		<td> {$t('invoice.total')}</td>
		<td class="text-right">{currency.format(itemSubtotal + tax)}</td>
		<td />
	</tr>
</table>
