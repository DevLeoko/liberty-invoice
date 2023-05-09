<script lang="ts">
	import type { CreateInvoiceItem } from '../../trpcClient';
	import ClientEditorModal from './ClientEditorModal.svelte';
	import InvoiceItemEditorRow from './InvoiceItemEditorRow.svelte';

	let items: CreateInvoiceItem[] = [
		{
			description: '',
			quantity: 0,
			discount: 0,
			name: '',
			unit: '',
			unitPrice: 0
		}
	];
</script>

<table class="w-full table-fixed">
	<tr class="text-sm">
		<th class="w-1/2 font-semibold text-left">Item</th>
		<th class="font-semibold text-left">Qty</th>
		<th class="font-semibold text-left">Unit price</th>
		<th class="font-semibold text-right">Amount</th>
	</tr>
	{#each items as item}
		<InvoiceItemEditorRow bind:item />
	{/each}
</table>
