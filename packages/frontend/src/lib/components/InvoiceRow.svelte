<script lang="ts">
	import { formatClientName } from '../../../../shared/client-formatter'
	import { isMdOrLarger } from '../stores/screen-size'
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

{#if $isMdOrLarger}
	<tr
		class="my-row [&>*]:px-2 [&>*]:py-1 cursor-pointer border-b last:border-b-0 hover:bg-slate-100 {className}"
		on:click
	>
		<td class="rounded-l-sm">{invoice.invoiceNumber}</td>
		<td>{$formatDate(invoice.date)}</td>
		<td>{formatClientName(invoice.client)}</td>
		<td class="text-right">{currency.format(invoice.amountWithTax)}</td>
		<td>{$formatDate(invoice.dueDate)}</td>
		<td class="rounded-r-sm">
			<InvoiceStatusChip {invoice} />
		</td>
		<td class="relative text-right">
			<div on:click|stopPropagation={() => {}}>
				<FloatingCardTrigger let:close>
					<svelte:fragment slot="trigger">
						<span class="p-2 -m-2 text-base material-icons hover:text-blue-500">more_vert</span>
					</svelte:fragment>
					<InvoiceActionCard {invoice} on:close={close} />
				</FloatingCardTrigger>
			</div>
		</td>
	</tr>
{:else}
	<div class="flex items-end justify-between {className} leading-snug" on:click>
		<div class="flex flex-col">
			<b class="font-medium">
				{invoice.invoiceNumber}
			</b>
			<span class="text-sm">
				{formatClientName(invoice.client)}
			</span>
			<span class="text-sm">
				{$formatDate(invoice.date)}
			</span>
		</div>

		<div class="flex flex-col items-end self-stretch justify-between">
			<span class="block font-medium">
				{currency.format(invoice.amountWithTax)}
			</span>
			<InvoiceStatusChip class="mt-auto" showOverdueDays {invoice} />
		</div>
	</div>
{/if}

<style lang="scss">
	// .my-row:nth-child(even) {
	// 	& > * {
	// 		@apply bg-slate-200;
	// 	}
	// }
</style>
