<script lang="ts">
	import { dndzone, SOURCES, TRIGGERS } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'
	import type { InvoiceItem } from '../../utils/Invoice'
	import { getInvoiceContext } from './Invoice.svelte'
	import InvoiceItemRow from './InvoiceItemRow.svelte'

	const { preview } = getInvoiceContext()

	const flipDurationMs = 150
	let dragDisabled = true
	const dropTargetStyle = {}

	function handleConsider(e: any) {
		const {
			items: newItems,
			info: { source, trigger }
		} = e.detail
		items = newItems
		// Ensure dragging is stopped on drag finish via keyboard
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			dragDisabled = true
		}
	}
	function handleFinalize(e: any) {
		const {
			items: newItems,
			info: { source }
		} = e.detail
		items = newItems
		// Ensure dragging is stopped on drag finish via pointer (mouse, touch)
		if (source === SOURCES.POINTER) {
			dragDisabled = true
		}
	}
	function startDrag(e: any) {
		// preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
		e.preventDefault()
		dragDisabled = false
	}

	export let items: InvoiceItem[]

	function deleteItem(index: number) {
		items = items.filter((_, i) => i !== index)
	}

	function addNewItem() {
		const nextId = items.reduce((max, item) => Math.max(max, item.id), 0) + 1
		items = [...items, { id: nextId, name: '', quantity: 1, unitPrice: 0 }]
	}
</script>

<tbody
	use:dndzone={{ items, dragDisabled, flipDurationMs, dropTargetStyle }}
	on:consider={handleConsider}
	on:finalize={handleFinalize}
>
	{#each items as item, i (item.id)}
		{@const last = i === items.length - 1}
		<tr class="group relative" class:borderline={last} animate:flip={{ duration: flipDurationMs }}>
			<td class="relative">
				{#if !$preview}
					<div
						class="absolute opacity-0 group-hover:opacity-100 top-0 right-0 tablePadding !pr-1 select-none"
						class:cursor-grab={dragDisabled}
						class:cursor-grabbing={!dragDisabled}
						on:mousedown={startDrag}
						on:touchstart={startDrag}
					>
						<span class="material-icons text-blue-400 font-medium text-lg">drag_indicator</span>
					</div>
				{/if}
			</td>
			<InvoiceItemRow bind:item />
			<td class="relative del-column">
				{#if !$preview}
					<div
						class="absolute opacity-0 cursor-pointer group-hover:opacity-100 top-0 tablePadding !pl-1 select-none"
						on:click={() => deleteItem(i)}
						on:keydown|preventDefault
					>
						<span class="material-icons text-red-400 text-base">close</span>
					</div>
				{/if}
			</td>
		</tr>
	{/each}
</tbody>
{#if !$preview}
	<tbody>
		<tr>
			<td colspan="6" class="text-center">
				<!-- Add item button -->
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 my-2"
					on:click={addNewItem}
				>
					Add item
				</button>
			</td>
		</tr>
	</tbody>
{/if}

<style>
	:global(#dnd-action-dragged-el) {
		outline: none;
		/* @apply !bg-blue-100; */
	}

	:global(#dnd-action-dragged-el) .del-column {
		visibility: hidden;
	}
</style>
