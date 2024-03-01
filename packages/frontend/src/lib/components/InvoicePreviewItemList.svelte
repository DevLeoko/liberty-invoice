<script lang="ts">
	import { createTaxRateListQuery } from '../controller/tax-rate'
	import { getCurrency, t, translateIfFound } from '../stores/settings'
	import type { ReadInvoice } from '../trpcClient'

	export let invoice: ReadInvoice

	$: currency = $getCurrency(invoice.currency)
	const taxRates = createTaxRateListQuery()
	$: selectedTaxRate =
		$taxRates.data?.find((taxRate) => taxRate.id === invoice.taxRates[0]?.id) ?? null
</script>

<div
	class="flex flex-col w-full p-2 px-3 mt-8 shadow-md md:grid bg-neutral-50 gap-x-2 grid-table-4"
>
	<div class="hidden md:contents">
		<b>{$t('invoice.item')}</b>
		<b>{$t('invoice.quantity')}</b>
		<b>{$t('invoice.unitPrice')}</b>
		<b class="text-right">{$t('invoice.amount')}</b>

		{#each invoice.items as item}
			<div>{item.name}</div>
			<div>{item.quantity}{item.unit}</div>
			<div>{currency.format(item.unitPrice)}</div>
			<div class="text-right">{currency.format(item.unitPrice * item.quantity)}</div>
			{#if item.description}
				<div class="col-span-4">
					<div class="mb-2 text-sm text-gray-500 whitespace-pre-wrap">{item.description}</div>
				</div>
			{/if}
		{/each}
	</div>

	<div class="md:hidden">
		<b>{$t('invoice.item')}</b>
		<div class="flex flex-col gap-2">
			{#each invoice.items as item}
				<div class="leading-snug">
					<div class="flex justify-between">
						<div>{item.name}</div>
						<div>{currency.format(item.unitPrice * item.quantity)}</div>
					</div>
					<div class="text-sm">
						{currency.format(item.unitPrice)} /{item.unit || $t('invoiceEditor.product.unit')}
					</div>
					{#if item.description}
						<div class="text-sm text-gray-500 whitespace-pre-wrap">{item.description}</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div class="flex flex-col col-span-4 pt-2 mt-4 font-semibold border-t">
		{#if selectedTaxRate}
			<div class="flex justify-between">
				<div>{$t('invoice.subtotal')}</div>
				<div>{currency.format(invoice.amountWithoutTax)}</div>
			</div>
			<div class="flex justify-between">
				{#if selectedTaxRate.rate > 0}
					<div>
						{$translateIfFound(selectedTaxRate.displayText, 'taxRate')} ({selectedTaxRate.rate}%)
					</div>
					<div>{currency.format(invoice.amountWithTax - invoice.amountWithoutTax)}</div>
				{:else}
					<div class="text-xs">{$translateIfFound(selectedTaxRate.displayText, 'taxRate')}</div>
				{/if}
			</div>
		{/if}
		<div class="flex justify-between">
			<div>{$t('invoice.total')}</div>
			<div>{currency.format(invoice.amountWithTax)}</div>
		</div>
	</div>
</div>
