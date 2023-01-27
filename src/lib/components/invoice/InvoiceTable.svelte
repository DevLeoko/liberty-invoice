<script lang="ts">
	import { getTotal, type Invoice } from '../../utils/Invoice'
	import { getInvoiceContext } from './Invoice.svelte'
	import InvoiceItemList from './InvoiceItemList.svelte'
	import LightPulse from '../LightPulse.svelte'

	const { showHints, formatCurrency, it } = getInvoiceContext()

	export let invoice: Invoice

	$: subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
</script>

<table class="w-full my-5 invoiceTable table-auto">
	<tr class="borderline">
		<th class="w-0" />
		<th>{$it('invoice.item')}</th>
		<th class="w-28">{$it('invoice.quantity')}</th>
		<th class="w-36">{$it('invoice.unitPrice')}</th>
		<th class="w-36 !text-right">{$it('invoice.amount')}</th>
		<th class="w-0" />
	</tr>
	<InvoiceItemList bind:items={invoice.items} />
	<tbody>
		{#if invoice.items.length % 2 == 1}
			<tr class="h-0" />
		{/if}
		<tr>
			<td colspan="3" class="bg-white" />
			<td>{$it('invoice.subtotal')}</td>
			<td class="text-right">{$formatCurrency(subtotal)}</td>
			<td />
		</tr>
		<tr>
			<td colspan="3" class="bg-white" />
			<td colspan="3" class="!text-left"
				>{@html $it('invoice.taxReverseCharge')}
				{#if showHints} <LightPulse /> {/if}</td
			>
			<td />
		</tr>
		<tr class="!bg-slate-200 font-semibold">
			<td colspan="3" class="bg-white" />
			<td class="border-t border-slate-300">{$it('invoice.total')}</td>
			<td class="border-t  border-slate-300 text-right">{$formatCurrency(getTotal(invoice))}</td>
			<td />
		</tr>
	</tbody>
</table>
