<script lang="ts">
	import { crossfade } from 'svelte/transition'
	import { formatCurrency } from '../../utils/Currency'
	import { locale } from '../../utils/i18n'
	import { activeInvoiceId, getTotal, invoices } from '../../utils/Invoice'
	import { backOut } from 'svelte/easing'

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 500),
		easing: backOut
	})

	const barKey = Symbol()

	$: formatDate = (date: Date) =>
		date.toLocaleDateString($locale, { year: 'numeric', month: 'short', day: 'numeric' })

	$: latestInvoices = [...$invoices].sort((a, b) => b.date.getTime() - a.date.getTime())

	$: console.log(latestInvoices)
</script>

<div class="flex flex-col w-full overflow-x-visible">
	{#each latestInvoices as invoice, i (invoice.internalId)}
		{#if i != 0}
			<div class="bg-gray-400 w-3/4 mx-auto my-1" style="height: 1px">&nbsp;</div>
		{/if}

		{@const isActive = $activeInvoiceId === invoice.internalId}

		<article
			class="flex flex-col hover:bg-white hover:bg-opacity-50 cursor-pointer px-1 -mx-1 relative overflow-x-visible"
			class:pl-2={isActive}
			on:click={() => ($activeInvoiceId = invoice.internalId)}
		>
			{#if isActive}
				<div
					class="w-1 h-full left-0 absolute bg-blue-500"
					in:send={{ key: barKey }}
					out:receive={{ key: barKey }}
				>
					&nbsp;
				</div>
			{/if}
			<div class="flex justify-between ">
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

<style lang="scss">
</style>
