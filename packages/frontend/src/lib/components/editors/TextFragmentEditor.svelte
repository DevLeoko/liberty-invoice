<script lang="ts">
	import {
		createTextFragmentDeleteMutation,
		createTextFragmentListQuery,
		createTextFragmentUpsertMutation,
		getAvailableVariables,
	} from '../../controller/text-fragment'
	import { t } from '../../stores/settings'
	import { Locale, translate, type TranslationPaths } from '../../translations/translations'
	import LanguageSelectorPopup from '../LanguageSelectorPopup.svelte'

	export let fragmentLanguage: Locale
	export let fragmentName: string

	$: tFragmentName = $t(`textFragments.name.${fragmentName}` as TranslationPaths)
	$: tFragmentDefault = translate(
		fragmentLanguage,
		`textFragmentDefaults.${fragmentName}` as TranslationPaths,
	)

	$: availableVariables = getAvailableVariables(fragmentName)

	let fragmentText = ''
	let fragmentTextSaved = ''
	$: fragmentTextQuery = createTextFragmentListQuery(fragmentName, fragmentLanguage, null)

	function updateFragmentText(text: string) {
		fragmentText = text
		fragmentTextSaved = text
	}

	$: updateFragmentText($fragmentTextQuery.data?.value || '')

	const textFragmentUpsertMutation = createTextFragmentUpsertMutation()
	const textFragmentDeleteMutation = createTextFragmentDeleteMutation()

	async function onBlur() {
		if (fragmentTextSaved != fragmentText) {
			if (fragmentText)
				await textFragmentUpsertMutation(fragmentName, fragmentLanguage, null, fragmentText)
			else await textFragmentDeleteMutation(fragmentName, fragmentLanguage, null)
			fragmentTextSaved = fragmentText
		}
	}
</script>

<div
	class="flex flex-col px-3 py-2 bg-gray-200 {$fragmentTextQuery.isLoading
		? 'opacity-50 pointer-events-none'
		: ''}"
>
	<div class="flex items-center justify-between">
		<span class="font-medium">{tFragmentName}</span>
		<LanguageSelectorPopup
			bind:selected={fragmentLanguage}
			class="underline decoration-dashed underline-offset-2 decoration-1"
		/>
	</div>
	<textarea
		class="w-full h-32 mt-2 !leading-snug bg-gray-100 placeholder:leading-snug"
		on:blur={onBlur}
		placeholder={tFragmentDefault}
		bind:value={fragmentText}
	/>
	{#if fragmentTextSaved != fragmentText}
		<div class="flex items-center mt-1">
			<span class="text-sm italic text-gray-500">{$t('general.unsavedChanges')}</span>
		</div>
	{/if}
	{#if availableVariables}
		<p>
			{$t('textFragments.availableVariables')}:
			<span class="text-sm italic">{availableVariables}</span>
		</p>
	{/if}
</div>
