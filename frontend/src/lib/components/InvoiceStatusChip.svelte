<script lang="ts">
	import { t } from '../stores/settings'
	import type { ListInvoice } from '../trpcClient'
	import Chip from './basics/Chip.svelte'

	export let invoice: ListInvoice

	$: remaining = invoice.amountWithTax - invoice.amountPaid
	$: dueInDays = Math.ceil((invoice.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

	let statusText = ''
	$: {
		if (invoice.draft) statusText = $t('invoiceStatus.draft')
		else if (remaining == 0) statusText = $t('invoiceStatus.paid')
		else if (dueInDays < 0) statusText = $t('invoiceStatus.overdue')
		else if (dueInDays == 0) statusText = $t('invoiceStatus.dueToday')
		else if (dueInDays == 1) statusText = $t('invoiceStatus.dueTomorrow')
		else statusText = $t('invoiceStatus.dueInDays', { days: dueInDays })
	}

	let chipColor = ''
	$: {
		if (invoice.draft) chipColor = 'gray-700'
		else if (remaining == 0) chipColor = 'green-500'
		else if (dueInDays < 0) chipColor = 'red-500'
		else if (dueInDays == 0) chipColor = 'yellow-500'
		else if (dueInDays == 1) chipColor = 'yellow-500'
		else chipColor = 'blue-500'
	}

	let className = ''

	export { className as class }
</script>

<Chip class={className} color={chipColor}>
	{statusText}
</Chip>
