<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { FullCurrency } from '../../../../../../shared/currencies'
	import { createProductListFetcher, createProductListQuery } from '../../../controller/product'
	import { t } from '../../../stores/settings'
	import type { CreateInvoiceItem } from '../../../trpcClient'
	import ProductSelector from '../../ProductSelector.svelte'
	import ConfirmationCard from '../../basics/ConfirmationCard.svelte'
	import Labeled from '../../basics/Labeled.svelte'
	import NumberInput from '../../basics/NumberInput.svelte'
	import InvoiceItemProductIndicator from './InvoiceItemProductIndicator.svelte'
	import ItemDescriptionInput from './ItemDescriptionInput.svelte'
	import ItemQuantityInput from './ItemQuantityInput.svelte'

	export let item: CreateInvoiceItem
	export let dummy = false
	export let index: number

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

<div
	class="flex flex-col {className}"
	on:focusin={() => (isFocused = true)}
	on:focusout={() => (isFocused = false)}
>
	{#if isFocused}
		<ProductSelector bind:productId={item.productId} {item} {currency} on:select={useProductData} />
	{/if}

	<div class="relative flex items-end justify-between text-sm">
		<span>
			#{index + 1}
		</span>

		<span
			class="pb-1 text-xs font-medium text-red-500 underline cursor-pointer"
			on:click|stopPropagation={() => {
				showDeleteConfirmation = true
			}}>{$t('invoiceEditor.remove')}</span
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

	<ItemDescriptionInput bind:name={item.name} bind:description={item.description}>
		<svelte:fragment slot="icon">
			{#if product != null}
				<div class="pr-1 mr-1 show-on-hover-border-r">
					<InvoiceItemProductIndicator {item} {product} bind:productId={item.productId} />
				</div>
			{/if}
		</svelte:fragment>
	</ItemDescriptionInput>

	<div class="grid grid-cols-3 gap-4 mt-2">
		<Labeled label={$t('invoice.quantity')}>
			<ItemQuantityInput bind:quantity={item.quantity} bind:unit={item.unit} />
		</Labeled>
		<Labeled label={$t('invoice.unitPrice')}>
			<NumberInput bind:value={item.unitPrice} />
		</Labeled>

		<Labeled label={$t('invoice.total')} rightAlign>
			<div class="flex items-center justify-end">
				{currency.format(item.quantity * item.unitPrice)}
			</div>
		</Labeled>
	</div>
</div>

<style lang="scss">
</style>
