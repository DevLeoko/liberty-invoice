<script lang="ts">
	import { tick } from 'svelte'
	import type { FullCurrency } from '../../../../../../shared/currencies'
	import { emptyInvoiceItem } from '../../../controller/invoice'
	import { createTaxRateListQuery } from '../../../controller/tax-rate'
	import { t } from '../../../stores/settings'
	import type { CreateInvoiceItem } from '../../../trpcClient'
	import Button from '../../basics/Button.svelte'
	import InvoiceItemEditorRow from './InvoiceItemEditorRow.svelte'
	import InvoiceTaxRateEditor from './InvoiceTaxRateEditor.svelte'
	import MobileInvoiceItemEditor from './MobileInvoiceItemEditor.svelte'

	export let currency: FullCurrency
	export let items: CreateInvoiceItem[]
	export let taxRateIds: string[]

	function addNewItem() {
		items = [...items, emptyInvoiceItem()]
	}

	function addNewAndFocusLast() {
		addNewItem()
		tick().then(() => {
			const table = document.getElementById('itemEditorTable') as HTMLTableElement
			const mobileTable = document.getElementById('itemEditorMobile') as HTMLDivElement

			// TODO focus for mobile

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

<table class="hidden w-full table-fixed lg:table" id="itemEditorTable">
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
			item={emptyInvoiceItem()}
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

<div class="flex flex-col w-full table-fixed lg:hidden" id="itemEditorMobile">
	<h3 class="mb-0.5 text-sm font-semibold">
		{$t('invoiceEditor.items')}
	</h3>
	<div class="flex flex-col space-y-2">
		{#each items as item, index (index)}
			<MobileInvoiceItemEditor
				class="{index != 0 ? 'border-t-2 border-gray-300' : ''} py-2"
				{currency}
				{index}
				bind:item
				on:remove={() => removeItem(index)}
			/>
		{/each}
	</div>

	<Button class="mt-2" on:click={addNewItem}>+ Add item</Button>

	<div class="flex flex-col mt-2 space-y-2">
		<div class="flex justify-between">
			<span class="font-semibold">{$t('invoice.subtotal')}</span>
			<span>{currency.format(itemSubtotal)}</span>
		</div>
		<InvoiceTaxRateEditor bind:taxRateId={taxRateIds[0]}>
			{currency.format(tax)}
		</InvoiceTaxRateEditor>
		<div class="flex justify-between">
			<span class="font-semibold">{$t('invoice.total')}</span>
			<span class="font-medium">{currency.format(itemSubtotal + tax)}</span>
		</div>
	</div>
</div>
