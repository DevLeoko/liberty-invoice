<script lang="ts">
	import type { InvoiceItem } from '../../utils/Invoice'
	import NumberInput from '../NumberInput.svelte'
	import StealthyInput from '../StealthyInput.svelte'
	import { getInvoiceContext } from './Invoice.svelte'

	const { preview, formatCurrency } = getInvoiceContext()

	export let item: InvoiceItem
</script>

{#if $preview}
	<td>{item.name}</td>
	<td>{item.quantity}{item.unit ?? ''}</td>
	<td>{$formatCurrency(item.unitPrice)}</td>
	<td class="text-right">{$formatCurrency(item.quantity * item.unitPrice)}</td>
{:else}
	<td>
		<StealthyInput bind:value={item.name} />
	</td>
	<td class="relative">
		<span class="invisible whitespace-nowrap">{item.quantity}</span>
		<input type="number" class="absolute inset-0" bind:value={item.quantity} />
	</td>
	<td><NumberInput formatted={$formatCurrency(item.unitPrice)} bind:value={item.unitPrice} /> </td>
	<td class="text-right">{$formatCurrency(item.quantity * item.unitPrice)}</td>
{/if}

<style>
</style>
