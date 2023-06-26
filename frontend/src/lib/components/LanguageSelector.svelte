<script lang="ts">
	import { t } from '../stores/settings'
	import { Locale } from '../translations/translations'

	export let selected: string // Locale
</script>

<div class="flex flex-col space-y-1">
	<b>{$t('general.languages')}</b>

	{#each Object.values(Locale) as language}
		<div
			class="floating-action flex items-center cursor-pointer {selected == language
				? 'font-medium text-blue-500'
				: ''}"
			on:click={() => (selected = language)}
		>
			<img src={`/flags/${language}.svg`} class="h-3.5 mr-2" alt="flag" />{$t(
				`language.${language}`,
			)}
		</div>
	{/each}
	<!-- <div class="flex items-center">
		<img src={`/flags/pl.svg`} class="h-3.5 mr-2" alt="flag" />{$t(`language.pl`)}
	</div> -->
</div>
