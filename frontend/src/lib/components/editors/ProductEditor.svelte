<script lang="ts">
	import { t } from '../../stores/settings'
	import type { CreateProduct } from '../../trpcClient'
	import CurrencyInput from '../CurrencyInput.svelte'
	import Labeled from '../basics/Labeled.svelte'

	export let entity: CreateProduct

	export let inputError: string | null = null

	function toggleManageStock() {
		if (entity.stockedUnits === null) {
			entity.stockedUnits = 0
		} else {
			entity.stockedUnits = null
		}
	}

	$: {
		// if (entity.rate < 0 || entity.rate > 100) {
		// 	inputError = $t('taxRates.rateOutOfRange')
		// } else if (!entity.name || !entity.displayText) {
		// 	inputError = $t('taxRates.nameAndDisplayTextRequired')
		// } else {
		// 	inputError = null
		// }
	}
</script>

<div class="grid grid-cols-1 gap-2 xs:grid-cols-3">
	<Labeled label={$t('productEditor.name')} class="xs:col-span-3">
		<input type="text" bind:value={entity.name} />
	</Labeled>
	<Labeled label={$t('productEditor.description')} class="xs:col-span-3">
		<textarea bind:value={entity.description} />
	</Labeled>
	<Labeled label={$t('productEditor.unitPrice')}>
		<input type="text" bind:value={entity.unitPrice} />
	</Labeled>
	<Labeled label={$t('productEditor.unit')}>
		<input type="text" bind:value={entity.unit} />
	</Labeled>
	<Labeled label={$t('productEditor.currency')}>
		<CurrencyInput bind:value={entity.currency} />
	</Labeled>

	<div class="flex items-center mt-2 xs:col-span-3">
		<!-- Checkbox -->
		<input
			type="checkbox"
			id="manageStock"
			on:change={toggleManageStock}
			checked={entity.stockedUnits !== null}
		/>
		<label for="manageStock" class="ml-1 text-sm font-medium"
			>{$t('productEditor.trackStock')}</label
		>
	</div>

	{#if entity.stockedUnits !== null}
		<Labeled label={$t('productEditor.stockedQuantity')}>
			<input type="number" bind:value={entity.stockedUnits} />
		</Labeled>

		<p class="text-sm text-gray-500 xs:col-span-3">
			{$t('productEditor.trackStockExplain')}
		</p>
	{/if}
</div>
