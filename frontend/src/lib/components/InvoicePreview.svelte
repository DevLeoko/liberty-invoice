<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { createEventDispatcher } from 'svelte'
	import { getClientDisplayLines } from '../../../../shared/address-formatter'
	import { createTaxRateListQuery } from '../controller/tax-rate'
	import {
		formatDate,
		formatFloat,
		getCurrency,
		logInfo,
		t,
		translateIfFound,
	} from '../stores/settings'
	import type { ReadInvoice } from '../trpcClient'
	import InvoiceStatusChip from './InvoiceStatusChip.svelte'
	import Button from './basics/Button.svelte'

	export let invoice: ReadInvoice

	const dispatchEvent = createEventDispatcher()

	$: remainingDays = Math.round((invoice.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
	$: currency = $getCurrency(invoice.currency)

	let dueText = ''
	$: {
		let amount = `${currency.shorthand} ${$formatFloat(invoice.amountWithTax)}`

		if (remainingDays > 1) {
			dueText = $t('invoiceList.dueInDays', { amount, days: remainingDays })
		} else if (remainingDays == 1) {
			dueText = $t('invoiceList.dueTomorrow', { amount })
		} else if (remainingDays == 0) {
			dueText = $t('invoiceList.dueToday', { amount })
		} else if (remainingDays == -1) {
			dueText = $t('invoiceList.dueYesterday', { amount })
		} else {
			dueText = $t('invoiceList.dueInDaysOverdue', { amount, days: -remainingDays })
		}
	}

	const taxRates = createTaxRateListQuery()
	$: selectedTaxRate =
		$taxRates.data?.find((taxRate) => taxRate.id === invoice.taxRates[0]?.id) ?? null

	function sendInvoice() {
		// TODO: implement
		$logInfo('general.inDevelopment')
	}
</script>

<div class="w-full">
	<div class="flex items-center justify-between mb-2 text-2xl">
		<b class="flex items-center mr-6">
			<span class="back-nav material-icons" on:click={() => dispatchEvent('exit')}>close</span>
			{$t('invoice.invoice')}
		</b>
		<InvoiceStatusChip {invoice} class="ml-auto mr-2" />
		<span class="text-lg">{invoice.invoiceNumber}</span>
	</div>
</div>

<!-- TODO: w-full row of action buttons (Edit - Change status - Un-draft - Log payment - Download - Send) -->
<div class="flex mb-4 space-x-2">
	<Button class="flex-1" href="{PUBLIC_BACKEND_URL}/invoices/{invoice.id}/download" target="_blank"
		>{$t('general.download')}</Button
	>
	<Button class="flex-1" href="/invoices/{invoice.id}/edit">{$t('general.edit')}</Button>
	<Button class="flex-1" on:click={sendInvoice}>{$t('general.send')}</Button>
</div>

<div class="flex items-start justify-between mt-4">
	<div class="flex flex-col">
		<b class="text-base">{$t('invoice.billedTo')}</b>
		<div class="leading-tight">
			{#each getClientDisplayLines(invoice.client, (str) => str) as line}
				{#if line}
					<div>{line}</div>
				{:else}
					<div class="h-0.5" />
				{/if}
			{/each}
		</div>
	</div>

	<div class="grid gap-x-4 grid-table-2">
		<b>{$t('invoice.invoiceDate')}</b> <span>{$formatDate(invoice.date)}</span>
		<b>{$t('invoice.dueDate')}</b> <span>{$formatDate(invoice.dueDate)}</span>
	</div>
</div>

{#if invoice.note}
	<p>{invoice.note}</p>
{/if}

<h3 class="mt-8 text-xl font-medium text-center {remainingDays < 0 ? 'text-orange-600' : ''}">
	{dueText}
</h3>

<div class="grid w-full p-2 px-3 mt-8 shadow-md bg-neutral-50 gap-x-2 grid-table-4">
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

	<div class="col-span-4 pt-2 mt-4 font-semibold border-t">
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

<style>
	b {
		font-weight: 600;
	}
</style>
