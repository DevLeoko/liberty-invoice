<script lang="ts">
	import { createProductUpdateMutation } from '../../../controller/product'
	import { logSuccess, t } from '../../../stores/settings'
	import type { CreateInvoiceItem, ListProduct } from '../../../trpcClient'
	import Button from '../../basics/Button.svelte'
	import FloatingCardTrigger from '../../basics/FloatingCardTrigger.svelte'

	export let product: ListProduct
	export let item: CreateInvoiceItem
	export let productId: string | null

	$: isSynced =
		product.name === item.name &&
		product.unit === item.unit &&
		product.unitPrice === item.unitPrice &&
		product.description === item.description

	let differProperties: string[] = []
	$: {
		differProperties = []
		if (product.name !== item.name) differProperties.push('name')
		if (product.unit !== item.unit) differProperties.push('unit')
		if (product.unitPrice !== item.unitPrice) differProperties.push('unitPrice')
		if (product.description !== item.description) differProperties.push('description')
	}

	let loadingUpdate = false
	const updateProductMutation = createProductUpdateMutation()

	async function updateProduct() {
		loadingUpdate = true
		await updateProductMutation({
			id: product.id,
			product: {
				name: item.name,
				unitPrice: item.unitPrice,
				unit: item.unit,
				description: item.description,
			},
		}).finally(() => {
			loadingUpdate = false
		})

		$logSuccess('productEditorModal.updated')
	}
</script>

<FloatingCardTrigger>
	<svelte:fragment slot="trigger">
		<span
			class="text-sm transform translate-y-[2px] cursor-pointer material-icons"
			class:text-gray-600={isSynced}
			class:text-orange-400={!isSynced}>inventory_2</span
		>
	</svelte:fragment>

	<div class="flex flex-col">
		<div>
			{$t('invoiceEditor.product.linkedTo')} <b>{product.name}</b>
		</div>
		{#if product.stockedUnits != null}
			<div>
				{$t('invoiceEditor.product.remainingUnits')}
				{product.stockedUnits}
				{product.unit}
			</div>
		{/if}
		<Button
			gray
			snug
			class="mt-1"
			on:click={() => {
				productId = null
			}}>{$t('invoiceEditor.product.unlink')}</Button
		>

		{#if !isSynced}
			<hr class="my-2" />
			<div class="mb-2 leading-snug">
				<div class="">{$t('invoiceEditor.product.itemDiffers')}</div>
				<div class="flex flex-col italic text-orange-500">
					{#each differProperties as prop}
						{#if prop === 'name'}
							<div>{$t('invoiceEditor.product.nameDiffers')}</div>
						{:else if prop === 'unit'}
							<div>{$t('invoiceEditor.product.unitDiffers')}</div>
						{:else if prop === 'unitPrice'}
							<div>{$t('invoiceEditor.product.unitPriceDiffers')}</div>
						{:else if prop === 'description'}
							<div>{$t('invoiceEditor.product.descriptionDiffers')}</div>
						{/if}
					{/each}
				</div>
			</div>

			<Button snug on:click={updateProduct} loading={loadingUpdate}
				>{$t('invoiceEditor.product.updateProduct')}</Button
			>
		{/if}
	</div>
</FloatingCardTrigger>
