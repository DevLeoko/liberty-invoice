<script lang="ts">
	import { getDueDate, getTotal, type Invoice } from '../../utils/Invoice'
	import LightPulse from '../LightPulse.svelte'
	import { getInvoiceContext } from './Invoice.svelte'

	const { showHints, it, formatFloat } = getInvoiceContext()

	$: dueDateLong = getDueDate(invoice).toLocaleDateString(invoice.language, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})

	export let invoice: Invoice
</script>

<h2 class="text-2xl font-medium mt-10">
	{$it('invoice.dueText', {
		amount: `${invoice.currency.shorthand} ${$formatFloat(getTotal(invoice))}`,
		date: dueDateLong
	})}
</h2>
{#if $showHints}
	<div class="absolute -ml-2">
		<LightPulse />
	</div>
{/if}
<p class="mt-1">{invoice.description || ' '}</p>
