<script lang="ts">
	import { createTaxRateListQuery } from '../../../controller/tax-rate'
	import { t, translateIfFound } from '../../../stores/settings'
	import FloatingCardTrigger from '../../basics/FloatingCardTrigger.svelte'
	import TaxRateSelector from '../../TaxRateSelector.svelte'

	export let taxRateId: string | null

	const taxRates = createTaxRateListQuery()
	$: selectedTaxRate = $taxRates.data?.find((taxRate) => taxRate.id === taxRateId) ?? null
</script>

<FloatingCardTrigger preferTop>
	<svelte:fragment slot="trigger">
		{#if selectedTaxRate?.rate}
			<div class="flex justify-between">
				<div>
					<span
						class="underline decoration-dashed underline-offset-4 decoration-gray-400 decoration-1"
					>
						{$translateIfFound(selectedTaxRate.displayText, 'taxRate')} ({selectedTaxRate?.rate ??
							''}%)
					</span>
				</div>
				<div>
					<slot />
				</div>
			</div>
		{:else}
			<span class="text-sm">
				{selectedTaxRate
					? $translateIfFound(selectedTaxRate.displayText, 'taxRate')
					: $t('taxRates.select')}
				<span class="-mb-2 text-sm opacity-30 material-icons">edit</span>
			</span>
		{/if}
	</svelte:fragment>

	<TaxRateSelector bind:selectedId={taxRateId} />
</FloatingCardTrigger>
