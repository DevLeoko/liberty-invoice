<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { formatDate, getCurrency, t } from '../stores/settings'
	import type { ListInvoice } from '../trpcClient'
	import FloatingCard from './basics/FloatingCard.svelte'

	export let invoice: ListInvoice

	$: currency = $getCurrency(invoice.currency)
</script>

<a
	class="contents my-row [&>*]:px-2 [&>*]:py-1"
	href="{PUBLIC_BACKEND_URL}/invoice/{invoice.id}/download"
	on:click|preventDefault
	target="_blank"
>
	<div class="rounded-l-sm">{invoice.invoiceNumber}</div>
	<div>{invoice.client.name}</div>
	<div>{currency.format(invoice.amountWithTax)}</div>
	<div>{$formatDate(invoice.dueDate)}</div>
	<div class="rounded-r-sm">
		{invoice.amountPaid === invoice.amountWithTax ? 'Paid' : 'Unpaid'}
	</div>
	<div class="relative w-12 text-right">
		<span class="text-base material-icons">more_vert</span>
		<FloatingCard>
			<div class="flex flex-col items-start space-y-1 text-sm">
				<b>Actions</b>
				<div class="flex flex-row items-center">
					<span class="mr-1 text-sm material-icons">content_copy</span>
					{$t('general.duplicate')}
				</div>
				<div class="flex flex-row items-center">
					<span class="mr-1 text-sm material-icons">edit</span>
					{$t('general.edit')}
				</div>
				<div class="flex flex-row items-center">
					<span class="mr-1 text-sm material-icons">download</span>
					{$t('general.download')}
				</div>
				<div class="flex flex-row items-center">
					<span class="mr-1 text-sm material-icons">delete</span>
					{$t('general.delete')}
				</div>
			</div>
		</FloatingCard>
	</div>
</a>

<style lang="scss">
	.my-row:nth-child(even) {
		& > * {
			@apply bg-slate-200;
		}
	}
</style>
