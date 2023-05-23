<script lang="ts">
	import { tick } from 'svelte';
	import type { CreateInvoiceItem } from '../../trpcClient';
	import InvoiceItemEditorRow from './InvoiceItemEditorRow.svelte';

	export let items: CreateInvoiceItem[];

	function getEmptyItem() {
		return { description: '', quantity: 0, discount: 0, name: '', unit: '', unitPrice: 0 };
	}

	function addNewItem() {
		items = [...items, getEmptyItem()];
	}

	function addNewAndFocusLast() {
		addNewItem();
		tick().then(() => {
			const table = document.getElementById('itemEditorTable') as HTMLTableElement;
			const lastRow = table.rows[items.length];

			const input = lastRow.querySelector('input') as HTMLInputElement;
			input.focus();
		});
	}

	function removeItem(index: number) {
		items = items.filter((_, i) => i != index);

		if (items.length == 0) {
			addNewItem();
		}
	}

	$: itemSubtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
</script>

<table class="w-full table-fixed" id="itemEditorTable">
	<tr class="text-sm">
		<th class="w-1/2 font-semibold text-left">Item</th>
		<th class="font-semibold text-left">Qty</th>
		<th class="font-semibold text-left">Unit price</th>
		<th class="font-semibold text-right">Amount</th>
		<th class="w-12" />
	</tr>
	{#each items as item, i (i)}
		<InvoiceItemEditorRow bind:item on:remove={() => removeItem(i)} />
	{/each}
	{#key items.length}
		<InvoiceItemEditorRow
			class="opacity-50"
			item={getEmptyItem()}
			on:focusin={() => addNewAndFocusLast()}
			dummy
		/>
	{/key}
	<tr>
		<td colspan="2" />
		<td class="border-t border-gray-300">Subtotal</td>
		<td class="text-right border-t border-gray-300">{itemSubtotal}</td>
		<td />
	</tr>
	<tr>
		<td colspan="2" />
		<td colspan="2" class="text-sm">Tax be paid on reverse change basis</td>
		<td />
	</tr>
	<tr class="font-medium">
		<td colspan="2" />
		<td> Total </td>
		<td class="text-right">{itemSubtotal}</td>
		<td />
	</tr>
</table>
