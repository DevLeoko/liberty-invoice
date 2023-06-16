<script lang="ts">
	import { t } from '../../stores/settings'
	import type { TranslationPaths } from '../../translations/translations'
	import type { CreateClient } from '../../trpcClient'
	import CurrencyInput from '../CurrencyInput.svelte'
	import LanguageSelector from '../LanguageSelector.svelte'
	import TaxRateInput from '../TaxRateInput.svelte'
	import FloatingCardTrigger from '../basics/FloatingCardTrigger.svelte'
	import Labeled from '../basics/Labeled.svelte'

	export let entity: Pick<
		CreateClient,
		'defaultCurrency' | 'defaultTaxRateId' | 'defaultDueDays' | 'defaultLanguage'
	>

	$: languageName = $t(`language.${entity.defaultLanguage}` as TranslationPaths)
</script>

<Labeled label={$t('clientEditor.defaultLanguage')}>
	<FloatingCardTrigger>
		<svelte:fragment slot="trigger">
			<div class="cursor-pointer input-style">
				{languageName}
			</div>
		</svelte:fragment>

		<LanguageSelector bind:selected={entity.defaultLanguage} />
	</FloatingCardTrigger>
</Labeled>

<Labeled label={$t('clientEditor.defaultCurrency')}>
	<CurrencyInput bind:value={entity.defaultCurrency} />
</Labeled>

<Labeled label={$t('clientEditor.defaultDueDays')}>
	<input type="text" bind:value={entity.defaultDueDays} />
</Labeled>

<Labeled label={$t('clientEditor.defaultTaxRate')}>
	<TaxRateInput bind:taxRateId={entity.defaultTaxRateId} />
</Labeled>
