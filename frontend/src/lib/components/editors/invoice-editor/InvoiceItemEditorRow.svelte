<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte'
	import type { FullCurrency } from '../../../../../../shared/currencies'
	import { createProductListFetcher, createProductListQuery } from '../../../controller/product'
	import { t } from '../../../stores/settings'
	import type { CreateInvoiceItem } from '../../../trpcClient'
	import { sleep } from '../../../utils/sleep'
	import ProductSelector from '../../ProductSelector.svelte'
	import ConfirmationCard from '../../basics/ConfirmationCard.svelte'
	import NumberInput from '../../basics/NumberInput.svelte'
	import InvoiceItemProductIndicator from './InvoiceItemProductIndicator.svelte'

	export let item: CreateInvoiceItem
	export let dummy = false

	export let currency: FullCurrency

	const dispatch = createEventDispatcher<{ remove: void }>()

	const products = createProductListQuery()
	const fetchProducts = createProductListFetcher()
	$: product = $products.data?.find((p) => p.id === item.productId)

	let isFocused = false

	let showDescription = !!item.description
	let descriptionInput: HTMLTextAreaElement

	let showDeleteConfirmation = false

	function addDescription() {
		showDescription = true
		tick().then(async () => {
			// We are using mosedown to add the description but the click event will unfocus the input if we don't wait
			await sleep(100)
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

	$: {
		if (item.description) {
			showDescription = true
		}
	}

	async function useProductData() {
		const products = await fetchProducts()
		const product = products.find((p) => p.id === item.productId)
		if (!product) return

		item.name = product.name
		item.unit = product.unit
		item.unitPrice = product.unitPrice
		item.description = product.description
	}

	let className = ''

	export { className as class }
</script>

<tr
	class="align-top invoice-item-editor-row {className}"
	on:focusin={() => (isFocused = true)}
	on:focusout={() => (isFocused = false)}
>
	<td class="pr-2" on:focusin>
		<div class="-ml-2 input-style">
			{#if isFocused}
				<ProductSelector
					bind:productId={item.productId}
					{item}
					{currency}
					on:select={useProductData}
				/>
			{/if}
			<div class="flex items-center">
				{#if product != null}
					<div class="pr-1 mr-1 show-on-hover-border-r">
						<InvoiceItemProductIndicator {item} {product} bind:productId={item.productId} />
					</div>
				{/if}
				<input type="text" class="w-full plain" bind:value={item.name} />
			</div>
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
				class="absolute z-10 -mt-1 text-sm text-gray-500 cursor-pointer show-on-focus show-on-focus-mobile"
				on:mousedown={addDescription}
			>
				<b>+</b>
				{$t('invoiceEditor.addDescription')}
			</div>
		{/if}
	</td>
	<td class="pr-2" on:focusin>
		<div class="flex w-full -ml-2">
			<NumberInput class="!rounded-r-none -mr-[1px] text-right" bind:value={item.quantity} />
			<input type="text" class="!rounded-l-none !bg-opacity-20" bind:value={item.unit} />
		</div>
	</td>
	<td on:focusin>
		<NumberInput class="-ml-2" bind:value={item.unitPrice} />
	</td>
	<td class="py-1.5 text-right">
		{currency.format(item.quantity * item.unitPrice)}
	</td>
	<td class="pt-1.5">
		{#if !dummy}
			<div class="relative flex justify-end">
				<!-- <span class="text-base align-middle cursor-pointer material-icons show-on-hover"
					>more_vert</span
				> -->
				<span
					class="text-base text-red-500 align-middle cursor-pointer material-icons show-on-hover"
					on:click|stopPropagation={() => {
						showDeleteConfirmation = true
					}}>close</span
				>
				{#if showDeleteConfirmation}
					<ConfirmationCard
						on:confirm={onRemove}
						preferLeft
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
	:global(.invoice-item-editor-row input:not(.plain)),
	.input-style {
		@apply bg-transparent transition-all ring-0 #{!important};
	}

	.show-on-hover {
		@apply opacity-0 pointer-events-none;
	}

	.show-on-focus {
		@apply opacity-0 pointer-events-none;
	}

	.show-on-hover-border-r {
		@apply border-r border-r-transparent;
	}

	// Style for sceens small then md
	@media (max-width: 767px) {
		:global(.invoice-item-editor-row input:not(.plain)),
		.input-style {
			@apply ring-1 bg-white bg-opacity-40 ring-opacity-70 #{!important};
		}

		.show-on-hover {
			@apply opacity-100 pointer-events-auto;
		}

		.show-on-hover-border-r {
			@apply border-r-gray-300;
		}

		.show-on-focus {
			@apply opacity-100 pointer-events-auto;
		}

		.show-on-focus-mobile {
			@apply opacity-0 pointer-events-none;
		}
	}

	.invoice-item-editor-row:hover {
		:global(input:not(.plain)),
		.input-style {
			@apply ring-1 bg-white bg-opacity-40 ring-opacity-70 #{!important};
		}

		.show-on-hover {
			@apply opacity-50 pointer-events-auto;
		}

		.show-on-hover-border-r {
			@apply border-r-gray-300;
		}
	}

	.invoice-item-editor-row:focus-within {
		:global(input:not(.plain)),
		.input-style {
			@apply ring-1  bg-white bg-opacity-70 #{!important};
		}

		.show-on-hover {
			@apply opacity-100 pointer-events-auto;
		}

		.show-on-focus {
			@apply opacity-100 pointer-events-auto;
		}

		.show-on-hover-border-r {
			@apply border-r-gray-300;
		}
	}
</style>
