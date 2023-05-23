<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getClientDisplayLines } from '../../../../shared/address-formatter';
	import { getCurrency } from '../../../../shared/currencies';
	import type { ReadInvoice } from '../trpcClient';
	import Button from './basics/Button.svelte';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	export let invoice: ReadInvoice;

	const dispatchEvent = createEventDispatcher();

	$: remainingDays = Math.round((invoice.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
	$: currency = getCurrency(invoice.currency, 'de');
</script>

<div class="w-full">
	<div class="flex justify-between mb-2 text-2xl">
		<b class="flex items-center mr-6"
			><span
				class="mr-1 -mb-0.5 text-2xl text-gray-400 material-icons cursor-pointer"
				on:click={() => dispatchEvent('exit')}>arrow_back</span
			> Invoice</b
		>
		<span class="text-lg">{invoice.invoiceNumber}</span>
	</div>
</div>

<!-- TODO: w-full row of action buttons (Edit - Change status - Un-draft - Log payment - Download - Send) -->
<div class="flex mb-4 space-x-2">
	<Button class="flex-1" href="{PUBLIC_BACKEND_URL}/invoice/{invoice.id}/download" target="_blank"
		>Download</Button
	>
	<Button class="flex-1" href="/invoices/{invoice.id}/edit" target="_blank">Edit</Button>
	<Button class="flex-1">Sent</Button>
</div>

<div class="flex items-start justify-between mt-4">
	<div class="flex flex-col">
		<b class="text-base">Billed to</b>
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
		<b>Invoice date</b> <span>{invoice.date.toDateString()}</span>
		<b>Due date</b> <span>{invoice.dueDate.toDateString()}</span>
	</div>
</div>

{#if invoice.note}
	<p>{invoice.note}</p>
{/if}

<h3 class="mt-8 text-xl font-medium text-center">
	{currency.format(invoice.amountWithTax)} due in {remainingDays} days
</h3>

<div class="grid w-full mt-8 gap-x-2 grid-table-4">
	<b>Item</b>
	<b>Qty</b>
	<b>Unit price</b>
	<b class="text-right">Total</b>

	{#each invoice.items as item}
		<div>{item.name}</div>
		<div>{item.quantity}{item.unit}</div>
		<div>{currency.format(item.unitPrice)}</div>
		<div class="text-right">{currency.format(item.unitPrice * item.quantity)}</div>
		{#if item.description}
			<div class="col-span-4">
				<div class="mb-2 text-sm text-gray-500">{item.description}</div>
			</div>
		{/if}
	{/each}

	<div class="col-span-4 mt-4 font-semibold">
		<!-- <div class="flex justify-between">
			<div>Subtotal</div>
			<div>{currency.format(invoice.amountWithTax)}</div>
		</div>
		<div class="flex justify-between">
			<div>Tax ({invoice.taxRate}%)</div>
			<div>{currency.format(invoice.tax)}</div>
		</div> -->
		<div class="flex justify-between">
			<div>Total</div>
			<div>{currency.format(invoice.amountWithTax)}</div>
		</div>
	</div>
</div>

<style>
	b {
		font-weight: 600;
	}
</style>
