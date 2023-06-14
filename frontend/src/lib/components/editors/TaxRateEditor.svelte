<script lang="ts">
	import { t } from '../../stores/settings'
	import type { CreateTaxRate } from '../../trpcClient'
	import Labeled from '../basics/Labeled.svelte'

	export let entity: CreateTaxRate

	export let inputError: string | null = null

	$: {
		if (entity.rate < 0 || entity.rate > 100) {
			inputError = $t('taxRates.rateOutOfRange')
		} else if (!entity.name || !entity.displayText) {
			inputError = $t('taxRates.nameAndDisplayTextRequired')
		} else {
			inputError = null
		}
	}
</script>

<div class="grid grid-cols-2 gap-2">
	<Labeled label={$t('taxRates.name')}>
		<input type="text" bind:value={entity.name} />
	</Labeled>
	<Labeled label={$t('taxRates.displayText')}>
		<input type="text" bind:value={entity.displayText} />
	</Labeled>

	<div class="flex items-end">
		<Labeled label={$t('taxRates.rate')} class="flex-grow">
			<input type="number" bind:value={entity.rate} />
		</Labeled>
		<span class="z-10 w-6 mb-2 -ml-6">%</span>
	</div>
</div>
