<script lang="ts">
	import { getDueDays, type Invoice } from '../../utils/Invoice'
	import { getInvoiceContext } from './Invoice.svelte'

	const { it, preview } = getInvoiceContext()

	export let invoice: Invoice

	$: accountName =
		invoice.account.firstName && invoice.account.lastName
			? `${invoice.account.firstName} ${invoice.account.lastName}`
			: invoice.account.name || ''
</script>

<footer class="mt-auto border-t-2 border-gray-200 flex justify-between pt-4">
	<div class="text-xs  leading-tight">
		<p class="font-semibold">{$it('invoice.bankingInfo')}</p>
		<p>{accountName}</p>
		<p>Bank: {invoice.account.bankingDetails?.bankName}</p>
		<p>IBAN: {invoice.account.bankingDetails?.Iban}</p>
		<p>BIC: {invoice.account.bankingDetails?.Bic}</p>
	</div>
	<div class="text-xs  leading-tight">
		<p class="font-semibold">{$it('invoice.paymentDetails')}</p>
		<p>{$it('invoice.paymentDetailsLine3')}</p>
		<p>{$it('invoice.paymentDetailsLine1', { days: getDueDays(invoice).toString() })}</p>
		<p>{@html $it('invoice.paymentDetailsLine2')}</p>
	</div>
	<div class="flex flex-col justify-between">
		<p class="text-xs">{$it('invoice.deliveryDateNotice')}</p>
		<p class="text-sm text-right">
			{$it('invoice.page', { page: '1', pages: preview ? '1' : 'X' })}
		</p>
	</div>
</footer>
