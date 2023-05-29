<script lang="ts">
	import { formatDate, getCurrency } from '../stores/settings'
	import type { ListInvoice } from '../trpcClient'
	import InvoiceActionCard from './InvoiceActionCard.svelte'
	import InvoiceStatusChip from './InvoiceStatusChip.svelte'
	import FloatingCardTrigger from './basics/FloatingCardTrigger.svelte'

	export let invoice: ListInvoice

	$: currency = $getCurrency(invoice.currency)
</script>

<tr class="my-row [&>*]:px-2 [&>*]:py-1 cursor-pointer" on:click>
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
	.my-row:nth-child(even) {
		& > * {
			@apply bg-slate-200;
		}
	}
</style>
