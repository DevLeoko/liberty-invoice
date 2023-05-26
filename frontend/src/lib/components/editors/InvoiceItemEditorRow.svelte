<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte'
	import type { CreateInvoiceItem } from '../../trpcClient'
	import ConfirmationCard from '../basics/ConfirmationCard.svelte'
	import type { FullCurrency } from '../../../../../shared/currencies'
	import { t } from '../../stores/settings'

	export let item: CreateInvoiceItem
	export let dummy = false

	export let currency: FullCurrency

	const dispatch = createEventDispatcher<{ remove: void }>()

	let showDescription = false
	let descriptionInput: HTMLTextAreaElement

	let showDeleteConfirmation = false

	function addDescription() {
		showDescription = true
		tick().then(() => {
			descriptionInput.focus()
		})
	}

	function removeDescription() {
		item.description = ''
		showDescription = false
	}

	function onRemove() {
		showDeleteConfirmation = false
		dispatch('remove')
	}

	let className = ''

	export { className as class }
</script>

<tr class="align-top {className}">
	<td class="pr-2" on:focusin>
		<div class="-ml-2 input-style">
			<input type="text" class="w-full plain" bind:value={item.name} />
			{#if showDescription}
				<div class="relative flex pt-1 border-t">
					<textarea
						bind:this={descriptionInput}
						class="w-full text-sm text-gray-500 plain border-t-1 border-t-gray-400"
						bind:value={item.description}
					/>

					<span
						class="material-icons self-start -ml-4 text-sm !border-l-0 !text-red-500 cursor-pointer show-on-hover"
						on:click={removeDescription}>close</span
					>
				</div>
			{/if}
		</div>
		{#if !showDescription}
			<div
				class="absolute z-10 -mt-1 text-sm text-gray-500 cursor-pointer show-on-focus"
				on:click={addDescription}
			>
				<b>+</b>
				{$t('invoiceEditor.addDescription')}
			</div>
		{/if}
	</td>
	<td class="pr-2" on:focusin>
		<div class="flex w-full -ml-2">
			<input
				type="number"
				class="!rounded-r-none -mr-[1px] text-right"
				bind:value={item.quantity}
			/>
			<input type="text" class="!rounded-l-none !bg-opacity-20" bind:value={item.unit} />
		</div>
	</td>
	<td on:focusin>
		<input type="number" class="-ml-2" bind:value={item.unitPrice} />
	</td>
	<td class="py-1.5 text-right">
		{currency.format(item.quantity * item.unitPrice)}
	</td>
	<td class="pt-1.5">
		{#if !dummy}
			<div class="relative flex justify-end">
				<span class="text-base align-middle cursor-pointer material-icons show-on-hover"
					>more_vert</span
				>
				<span
					class="text-base text-red-500 align-middle cursor-pointer material-icons show-on-hover"
					on:click|stopPropagation={() => {
						showDeleteConfirmation = true
					}}>close</span
				>
				{#if showDeleteConfirmation}
					<ConfirmationCard
						on:confirm={onRemove}
						on:cancel={() => {
							showDeleteConfirmation = false
						}}
					/>
				{/if}
			</div>
		{/if}
	</td>
</tr>

<style lang="scss">
	input:not(.plain),
	.input-style {
		background-color: transparent;
		@apply ring-0 transition-all;
	}

	.show-on-hover {
		@apply opacity-0;
	}

	.show-on-focus {
		@apply opacity-0;
	}

	tr:hover {
		input:not(.plain),
		.input-style {
			@apply ring-1 bg-white bg-opacity-40 ring-opacity-70;
		}

		.show-on-hover {
			@apply opacity-50;
		}
	}

	tr:focus-within {
		input:not(.plain),
		.input-style {
			@apply ring-1  bg-white bg-opacity-70;
		}

		.show-on-hover {
			@apply opacity-100;
		}

		.show-on-focus {
			@apply opacity-100;
		}
	}
</style>
