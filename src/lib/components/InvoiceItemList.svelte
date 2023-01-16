<script lang="ts">
	import { dndzone, SOURCES, TRIGGERS } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'
	import type { InvoiceItem } from '../utils/InvoiceItem'
	import InvoiceItemRow from './InvoiceItemRow.svelte'

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
				<div
					class="absolute opacity-0 group-hover:opacity-100 top-0 right-0 tablePadding !pr-1 select-none"
					class:cursor-grab={dragDisabled}
					class:cursor-grabbing={!dragDisabled}
					on:mousedown={startDrag}
					on:touchstart={startDrag}
				>
					<span class="material-icons text-blue-400 font-medium text-lg">drag_indicator</span>
				</div>
			</td>
			<InvoiceItemRow bind:item editable={true} />
			<td class="relative del-column">
				<div
					class="absolute opacity-0 cursor-pointer group-hover:opacity-100 top-0 tablePadding !pl-1 select-none"
					on:click={() => deleteItem(i)}
				>
					<span class="material-icons text-red-400 text-base">close</span>
				</div>
			</td>
		</tr>
	{/each}
</tbody>

<style>
	:global(#dnd-action-dragged-el) {
		outline: none;
		/* @apply !bg-blue-100; */
	}

	:global(#dnd-action-dragged-el) .del-column {
		visibility: hidden;
	}
</style>
