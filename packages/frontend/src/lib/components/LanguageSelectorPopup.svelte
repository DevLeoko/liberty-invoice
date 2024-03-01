<script lang="ts">
	import { t } from '../stores/settings'
	import type { TranslationPaths } from '../translations/translations'
	import LanguageSelector from './LanguageSelector.svelte'
	import FloatingCardTrigger from './basics/FloatingCardTrigger.svelte'

	export let selected: string // Locale

	$: languageName = $t(`language.${selected}` as TranslationPaths)

	let className = ''

	export { className as class }
</script>

<FloatingCardTrigger triggerClass={className}>
	<svelte:fragment slot="trigger">
		{languageName}
	</svelte:fragment>

	<LanguageSelector bind:selected />
</FloatingCardTrigger>
