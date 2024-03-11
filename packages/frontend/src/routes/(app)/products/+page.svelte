<script lang="ts">
	import type { EditorSelection } from '$lib/utils/EditorSelection'
	import { cloneDeep } from 'lodash'
	import Button from '../../../lib/components/basics/Button.svelte'
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte'
	import ProductEditorModal from '../../../lib/components/editors/ProductEditorModal.svelte'
	import { createProductListQuery } from '../../../lib/controller/product'
	import { createUserSettingsQuery } from '../../../lib/controller/user-settings'
	import { t } from '../../../lib/stores/settings'
	import { trpc, type CreateProduct } from '../../../lib/trpcClient'

	const products = createProductListQuery()
	const userSettings = createUserSettingsQuery()
	let selected: EditorSelection<CreateProduct> = null

	function startCreate() {
		selected = {
			entity: {
				name: '',
				description: '',
				unit: '',
				unitPrice: 0,
				stockedUnits: null,
				currency: $userSettings.data?.defaultCurrency!,
			},
		}
	}

	async function selectProduct(id: string) {
		// TODO: add load indicator
		const product = await trpc.product.read.query({ id })
		selected = {
			id,
			entity: cloneDeep(product),
		}
	}
</script>

<ProductEditorModal bind:selected />

<PageTitle title={$t('menu.products')}>
	{#if $userSettings.isLoading}
		<Skeleton class="h-9 w-36" />
	{:else}
		<Button on:click={startCreate}
			><span class="mr-1 material-icons">add</span> {$t('productEditorModal.create')}</Button
		>
	{/if}
</PageTitle>

{#if $products.isLoading}
	<Skeleton class="w-24 h-12" />
{:else if $products.isError}
	<span>{$t('general.error')}</span>
{:else if $products.data.length === 0}
	<span>{$t('productEditor.noneFound')}</span>
{:else}
	{#each $products.data as product}
		<div
			class="w-full px-4 py-2 mt-2 rounded-sm cursor-pointer xs:w-72 bg-gray-150 hover:bg-gray-200"
			on:click={() => selectProduct(product.id)}
		>
			<h3 class="text-lg font-semibold">
				{product.name}
			</h3>
		</div>
	{/each}
{/if}
