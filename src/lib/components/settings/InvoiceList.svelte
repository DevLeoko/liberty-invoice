<script lang="ts">
	import { formatCurrency } from '../../utils/Currency'
	import { locale } from '../../utils/i18n'
	import { activeInvoiceId, getTotal, invoices } from '../../utils/Invoice'

	$: formatDate = (date: Date) =>
		date.toLocaleDateString($locale, { year: 'numeric', month: 'short', day: 'numeric' })
</script>

<div class="flex flex-col">
	{#each $invoices as invoice, i (invoice.internalId)}
		{#if i != 0}
			<div class="bg-gray-400 w-3/4 mx-auto my-1" style="height: 1px">&nbsp;</div>
		{/if}

		{@const isActive = $activeInvoiceId === invoice.internalId}

		<article
			class="flex flex-col hover:bg-white hover:bg-opacity-50 transition-colors cursor-pointer px-1 -mx-1"
			class:border-l-4={isActive}
			class:border-blue-500={isActive}
			on:click={() => ($activeInvoiceId = invoice.internalId)}
		>
			<div class="flex justify-between">
				<h4 class="font-medium">
					{invoice.id}
				</h4>
				<span class="text-gray-500">{formatDate(invoice.date)}</span>
			</div>
			<div class="flex justify-between -mt-1">
				<span class="font-medium text-sm"
					>{invoice.client.name || `${invoice.client.firstName} ${invoice.client.lastName}`}</span
				>
				<span class="">{$formatCurrency(getTotal(invoice), invoice.currency)}</span>
			</div>
		</article>
	{/each}
</div>
