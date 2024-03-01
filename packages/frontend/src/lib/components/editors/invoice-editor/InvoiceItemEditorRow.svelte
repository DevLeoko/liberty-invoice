<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { FullCurrency } from '../../../../../../shared/currencies'
	import { createProductListFetcher, createProductListQuery } from '../../../controller/product'
	import type { CreateInvoiceItem } from '../../../trpcClient'
	import ProductSelector from '../../ProductSelector.svelte'
	import ConfirmationCard from '../../basics/ConfirmationCard.svelte'
	import NumberInput from '../../basics/NumberInput.svelte'
	import InvoiceItemProductIndicator from './InvoiceItemProductIndicator.svelte'
	import ItemDescriptionInput from './ItemDescriptionInput.svelte'
	import ItemQuantityInput from './ItemQuantityInput.svelte'

	export let item: CreateInvoiceItem
	export let dummy = false

	export let currency: FullCurrency

	const dispatch = createEventDispatcher<{ remove: void }>()

	const products = createProductListQuery()
	const fetchProducts = createProductListFetcher()
	$: product = $products.data?.find((p) => p.id === item.productId)

	let isFocused = false

	let showDeleteConfirmation = false

	function onRemove() {
		showDeleteConfirmation = false
		dispatch('remove')
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
	<td class="relative" on:focusin>
		{#if isFocused}
			<ProductSelector
				bind:productId={item.productId}
				{item}
				{currency}
				on:select={useProductData}
			/>
		{/if}
		<ItemDescriptionInput
			class="pr-4 -ml-2"
			bind:name={item.name}
			bind:description={item.description}
		>
			<svelte:fragment slot="icon">
				{#if product != null}
					<div class="pr-1 mr-1 show-on-hover-border-r">
						<InvoiceItemProductIndicator {item} {product} bind:productId={item.productId} />
					</div>
				{/if}
			</svelte:fragment>
		</ItemDescriptionInput>
	</td>
	<td class="pr-2" on:focusin>
		<ItemQuantityInput class="-ml-2" bind:quantity={item.quantity} bind:unit={item.unit} />
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
</style>
