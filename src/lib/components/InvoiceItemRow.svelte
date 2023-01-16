<script lang="ts">
	import type { InvoiceItem } from '../utils/InvoiceItem'
	import NumberInput from './NumberInput.svelte'

	export let item: InvoiceItem
	export let editable: boolean = true
</script>

{#if !editable}
	<td>{item.name}</td>
	<td>{item.quantity}{item.unit ?? ''}</td>
	<td>${item.unitPrice.toFixed(2)}</td>
	<td class="text-right">${(item.quantity * item.unitPrice).toFixed(2)}</td>
{:else}
	<td class="relative">
		<span class="invisible whitespace-nowrap">{item.name}</span>
		<input type="text" class="absolute inset-0" bind:value={item.name} />
	</td>
	<td class="relative">
		<span class="invisible whitespace-nowrap">{item.quantity}</span>
		<input type="number" class="absolute inset-0" bind:value={item.quantity} />
	</td>
	<td><NumberInput prefix="$" bind:value={item.unitPrice} /> </td>
	<td class="text-right">${(item.quantity * item.unitPrice).toFixed(2)}</td>
{/if}

<style>
</style>
