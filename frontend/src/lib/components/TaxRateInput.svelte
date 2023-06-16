<script lang="ts">
	import { createTaxRateListQuery } from '../controller/tax-rate'
	import FloatingCardTrigger from './basics/FloatingCardTrigger.svelte'
	import TaxRateSelector from './TaxRateSelector.svelte'

	export let taxRateId: number | null

	const taxRates = createTaxRateListQuery()

	$: selectedTaxRate = $taxRates.data?.find((taxRate) => taxRate.id === taxRateId) ?? null
</script>

<FloatingCardTrigger>
	<svelte:fragment slot="trigger">
		<div class="!flex items-center cursor-pointer input-style">
			<div class="w-12 text-center">{selectedTaxRate?.rate ?? ''}%</div>
			<div class="w-[2px] h-3 bg-gray-300 rounded-sm mr-2" />
			{selectedTaxRate?.name ?? ''}
		</div>
	</svelte:fragment>

	<TaxRateSelector bind:selectedId={taxRateId} />
</FloatingCardTrigger>
