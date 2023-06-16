<script lang="ts">
	import { createTaxRateListQuery } from '../../controller/tax-rate'
	import FloatingCardTrigger from '../basics/FloatingCardTrigger.svelte'
	import TaxRateSelector from '../TaxRateSelector.svelte'

	export let taxRateId: number | null

	const taxRates = createTaxRateListQuery()
	$: selectedTaxRate = $taxRates.data?.find((taxRate) => taxRate.id === taxRateId) ?? null
</script>

<FloatingCardTrigger>
	<svelte:fragment slot="trigger">
		{#if selectedTaxRate?.rate}
			<div class="flex justify-between">
				<div>
					<span
						class="underline decoration-dashed underline-offset-4 decoration-gray-400 decoration-1"
					>
						{selectedTaxRate?.displayText ?? ''} ({selectedTaxRate?.rate ?? ''}%)
					</span>
				</div>
				<div>
					<slot />
				</div>
			</div>
		{:else}
			<span class="text-sm">
				{selectedTaxRate?.displayText ?? 'Select tax rate'}
				<span class="-mb-2 text-sm opacity-30 material-icons">edit</span>
			</span>
		{/if}
	</svelte:fragment>

	<TaxRateSelector bind:selectedId={taxRateId} />
</FloatingCardTrigger>
