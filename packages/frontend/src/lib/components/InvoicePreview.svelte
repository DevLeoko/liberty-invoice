<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { createEventDispatcher } from 'svelte'
	import { getClientDisplayLines } from '../../../../shared/address-formatter'
	import { formatDate, formatFloat, getCurrency, logInfo, t } from '../stores/settings'
	import type { ReadInvoice } from '../trpcClient'
	import InvoiceActionCard from './InvoiceActionCard.svelte'
	import InvoicePreviewItemList from './InvoicePreviewItemList.svelte'
	import InvoiceStatusChip from './InvoiceStatusChip.svelte'
	import Button from './basics/Button.svelte'
	import FloatingCardTrigger from './basics/FloatingCardTrigger.svelte'

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

	<FloatingCardTrigger let:close>
		<svelte:fragment slot="trigger">
			<Button class="flex-1">{$t('general.more')}</Button>
		</svelte:fragment>
		<InvoiceActionCard {invoice} on:close={close} />
	</FloatingCardTrigger>
</div>

<div class="flex flex-col items-start justify-between gap-4 mt-4 xs:flex-row">
	<div class="flex flex-col">
		<b class="text-base">{$t('invoice.billedTo')}</b>
		<div class="leading-tight">
			{#each getClientDisplayLines(invoice.client, $t) as line}
				{#if line}
					<div>{line}</div>
				{:else}
					<div class="h-0.5" />
				{/if}
			{/each}
		</div>
	</div>

	<div class="grid w-full gap-x-4 grid-table-2 xs:w-auto">
		<b>{$t('invoice.invoiceDate')}</b> <span class="text-right">{$formatDate(invoice.date)}</span>
		<b>{$t('invoice.dueDate')}</b> <span class="text-right">{$formatDate(invoice.dueDate)}</span>
	</div>
</div>

{#if invoice.note}
	<p>{invoice.note}</p>
{/if}

{#if invoice.amountPaid < invoice.amountWithTax}
	<h3 class="mt-8 text-xl font-medium text-center {remainingDays < 0 ? 'text-orange-600' : ''}">
		{dueText}
	</h3>
{/if}

<InvoicePreviewItemList {invoice} />

<style>
	b {
		font-weight: 600;
	}
</style>
