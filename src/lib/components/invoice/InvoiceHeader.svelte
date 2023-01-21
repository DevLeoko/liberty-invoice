<script lang="ts">
	import { getDueDate, type Invoice } from '../../utils/Invoice'
	import { getInvoiceContext } from './Invoice.svelte'
	import LightPulse from '../LightPulse.svelte'

	const { showHints, it } = getInvoiceContext()

	console.log($showHints)

	export let invoice: Invoice

	$: dueDate = getDueDate(invoice)

	$: invoiceDateShort = invoice.date.toLocaleDateString(invoice.language, {
		year: 'numeric',
		month: 'short',
		day: '2-digit'
	})
	$: dueDateShort = dueDate.toLocaleDateString(invoice.language, {
		year: 'numeric',
		month: 'short',
		day: '2-digit'
	})
</script>

<header class="flex justify-between">
	<div>
		<h1 class="text-3xl">{$it('invoice.invoice')}</h1>
		<div class="mt-4">
			<div class="flex">
				<div>
					<p>{$it('invoice.invoiceNumber')}</p>
					<p>{$it('invoice.invoiceDate')}</p>
					<p>{$it('invoice.dueDate')}</p>
				</div>

				<div class="ml-2 font-medium relative">
					<p>
						{invoice.id}
						{#if $showHints} <LightPulse /> {/if}
					</p>
					<p>
						{invoiceDateShort}
						{#if $showHints} <LightPulse /> {/if}
					</p>
					<p>
						{dueDateShort}
						{#if $showHints} <LightPulse /> {/if}
					</p>
				</div>
			</div>
		</div>
	</div>
	{#if invoice.account.logoUrl}
		<img src={invoice.account.logoUrl} class="h-16" alt="" />
	{/if}
</header>
