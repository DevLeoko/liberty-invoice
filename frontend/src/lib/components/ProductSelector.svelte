<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { FullCurrency } from '../../../../shared/currencies'
	import { createProductCreateMutation, createProductListQuery } from '../controller/product'
	import { logSuccess } from '../stores/settings'
	import type { CreateInvoiceItem } from '../trpcClient'
	import { htmlHighlight } from '../utils/htmlHighlight'
	import FloatingCard from './basics/FloatingCard.svelte'
	import Skeleton from './basics/Skeleton.svelte'

	const dispatch = createEventDispatcher<{ select: void }>()

	export let productId: number | null
	export let item: CreateInvoiceItem
	export let currency: FullCurrency

	const products = createProductListQuery()
	const createProduct = createProductCreateMutation()

	$: matchingProducts = $products.data
		? $products.data.filter(
				(p) =>
					p.name.toLowerCase().includes(item.name.toLowerCase()) &&
					p.currency === currency.shorthand,
		  )
		: []

	function selectProduct(id: number) {
		productId = id
		dispatch('select')
	}

	let loadingCreate = false
	async function saveAsProduct() {
		const prod = await createProduct({
			name: item.name,
			unitPrice: item.unitPrice,
			unit: item.unit,
			currency: currency.shorthand,
			description: item.description,
			stockedUnits: null,
		}).finally(() => {
			loadingCreate = false
		})

		selectProduct(prod.id)
		$logSuccess('productEditorModal.created')
	}
</script>

{#if productId == null}
	<FloatingCard preferTop>
		<div class="flex flex-col w-48">
			<b>Products:</b>
			{#if matchingProducts.length == 0}
				<span class="text-sm text-gray-500">No matching products found</span>
			{:else}
				{#each matchingProducts.slice(0, 7) as product}
					<div
						class="justify-between floating-action"
						on:mousedown={() => selectProduct(product.id)}
					>
						<div>
							{@html htmlHighlight(product.name, item.name)}
						</div>
						<div>
							{currency.format(product.unitPrice)} /{product.unit || 'unit'}
						</div>
					</div>
				{/each}
			{/if}
			{#if item.name}
				<hr class="my-2" />
				<b>Add as new product:</b>
				{#if loadingCreate}
					<Skeleton class="w-full h-4" />
				{:else}
					<div class="justify-between floating-action" on:mousedown|preventDefault={saveAsProduct}>
						<div>
							<span class="font-bold text-green-500">+</span>
							{item.name}
						</div>
						<div>
							{currency.format(item.unitPrice)} /{item.unit || 'unit'}
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</FloatingCard>
{/if}
