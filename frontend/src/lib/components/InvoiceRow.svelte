<script lang="ts">
	import { formatDate, getCurrency } from '../stores/settings'
	import type { ListInvoice } from '../trpcClient'
	import InvoiceActionCard from './InvoiceActionCard.svelte'
	import InvoiceStatusChip from './InvoiceStatusChip.svelte'
	import FloatingCardTrigger from './basics/FloatingCardTrigger.svelte'

	export let invoice: ListInvoice

	$: currency = $getCurrency(invoice.currency)

	let className = ''

	export { className as class }
</script>

<tr
	class="my-row [&>*]:px-2 [&>*]:py-1 cursor-pointer border-b last:border-b-0 hover:bg-slate-100 {className}"
	on:click
>
	<td class="rounded-l-sm">{invoice.invoiceNumber}</td>
	<td>{invoice.client.name}</td>
	<td>{currency.format(invoice.amountWithTax)}</td>
	<td>{$formatDate(invoice.dueDate)}</td>
	<td class="rounded-r-sm">
		<InvoiceStatusChip {invoice} />
	</td>
	<td class="relative text-right">
		<div on:click|stopPropagation={() => {}}>
			<FloatingCardTrigger>
				<svelte:fragment slot="trigger">
					<span class="p-2 -m-2 text-base material-icons hover:text-blue-500">more_vert</span>
				</svelte:fragment>
				<InvoiceActionCard {invoice} />
			</FloatingCardTrigger>
		</div>
	</td>
</tr>

<style lang="scss">
	// .my-row:nth-child(even) {
	// 	& > * {
	// 		@apply bg-slate-200;
	// 	}
	// }
</style>
