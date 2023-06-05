<script lang="ts">
	import { t } from '../../stores/settings'
	import type { TranslationPaths } from '../../translations/translations'
	import type { CreateClient } from '../../trpcClient'
	import CurrencyInput from '../CurrencyInput.svelte'
	import LanguageSelector from '../LanguageSelector.svelte'
	import FloatingCard from '../basics/FloatingCard.svelte'
	import Labeled from '../basics/Labeled.svelte'

	export let entity: Pick<
		CreateClient,
		'defaultCurrency' | 'defaultTaxRateId' | 'defaultDueDays' | 'defaultLanguage'
	>

	let showLanguageSelector = false

	$: languageName = $t(`language.${entity.defaultLanguage}` as TranslationPaths)
</script>

<Labeled label={$t('clientEditor.defaultLanguage')}>
	<div
		class="cursor-pointer input-style"
		on:click|stopPropagation={() => (showLanguageSelector = true)}
	>
		{languageName}
		{#if showLanguageSelector}
			<FloatingCard
				preferBottom
				on:clickOutside={() => (showLanguageSelector = false)}
				on:click={() => (showLanguageSelector = false)}
			>
				<LanguageSelector bind:selected={entity.defaultLanguage} />
			</FloatingCard>
		{/if}
	</div>
</Labeled>

<Labeled label={$t('clientEditor.defaultCurrency')}>
	<CurrencyInput bind:value={entity.defaultCurrency} />
</Labeled>

<Labeled label={$t('clientEditor.defaultDueDays')}>
	<input type="text" bind:value={entity.defaultDueDays} />
</Labeled>
