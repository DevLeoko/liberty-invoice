<script lang="ts">
	import { createTaxRateListQuery } from '../controller/tax-rate'
	import { t } from '../stores/settings'
	export let selectedId: number | null

	const taxRates = createTaxRateListQuery()
</script>

<div class="flex flex-col space-y-1">
	{#if $taxRates.data}
		{#each $taxRates.data as taxRate}
			<div
				class="floating-action flex items-center cursor-pointer {selectedId == taxRate.id
					? 'font-medium text-blue-500'
					: ''}"
				on:click={() => (selectedId = taxRate.id)}
			>
				<div class="w-12 font-medium text-center">{taxRate.rate}%</div>
				<div class="w-[2px] h-3 bg-gray-300 rounded-sm mr-2" />
				{taxRate.name}
			</div>
		{/each}
		<span class="pt-2 text-sm text-gray-500">
			{$t('taxRates.manageInSettingsPre')}<a href="/settings/tax-rates" class="text-blue-500"
				>{$t('taxRates.manageInSettingsLink')}</a
			>{$t('taxRates.manageInSettingsPost')}
		</span>
	{/if}
</div>
