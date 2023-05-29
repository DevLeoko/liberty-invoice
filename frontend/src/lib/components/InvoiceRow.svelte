<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { createEventDispatcher } from 'svelte'
	import { formatDate, getCurrency, t } from '../stores/settings'
	import type { ListInvoice } from '../trpcClient'
	import FloatingCardTrigger from './basics/FloatingCardTrigger.svelte'
	import { goto } from '$app/navigation'
	import ConfirmationCardTrigger from './basics/ConfirmationCardTrigger.svelte'

	export let invoice: ListInvoice

	$: currency = $getCurrency(invoice.currency)

	const dispatchEvent = createEventDispatcher()
</script>

<tr class="my-row [&>*]:px-2 [&>*]:py-1 cursor-pointer" on:click>
	<td class="rounded-l-sm">{invoice.invoiceNumber}</td>
	<td>{invoice.client.name}</td>
	<td>{currency.format(invoice.amountWithTax)}</td>
	<td>{$formatDate(invoice.dueDate)}</td>
	<td class="rounded-r-sm">
		{invoice.amountPaid === invoice.amountWithTax ? 'Paid' : 'Unpaid'}
	</td>
	<td class="relative text-right">
		<div on:click|stopPropagation={() => {}}>
			<FloatingCardTrigger>
				<svelte:fragment slot="trigger">
					<span class="p-2 -m-2 text-base material-icons hover:text-blue-500">more_vert</span>
				</svelte:fragment>
				<div class="flex flex-col items-start space-y-1 text-sm floating-actions">
					<b>{$t('general.actions')}</b>
					<div on:click={() => goto(`/invoices/new?duplicate=${invoice.id}`)}>
						<span class="mr-1 text-sm material-icons">content_copy</span>
						{$t('general.duplicate')}
					</div>
					<div on:click={() => goto(`/invoices/${invoice.id}/edit`)}>
						<span class="mr-1 text-sm material-icons">edit</span>
						{$t('general.edit')}
					</div>
					<a href={`${PUBLIC_BACKEND_URL}/invoices/${invoice.id}/download`} target="_blank">
						<span class="mr-1 text-sm material-icons">download</span>
						{$t('general.download')}
					</a>
					<ConfirmationCardTrigger on:confirm={() => dispatchEvent('delete')}>
						<div on:click={() => dispatchEvent('delete')}>
							<span class="mr-1 text-sm material-icons">delete</span>
							{$t('general.delete')}
						</div>
					</ConfirmationCardTrigger>
				</div>
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
