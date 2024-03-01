<script lang="ts">
	import {
		TEXT_FRAGMENT_NAMES,
		createTextFragmentListQuery,
		getAvailableVariables,
	} from '../../controller/text-fragment'
	import { t } from '../../stores/settings'
	import type { Locale} from '../../translations/translations';
import { translate, type TranslationPaths } from '../../translations/translations'
	import type { CreateClient } from '../../trpcClient'
	import FloatingCardTrigger from '../basics/FloatingCardTrigger.svelte'

	export let clientLanguage: string // is Locale
	export let fragments: CreateClient['textFragments']

	let activeFragment = TEXT_FRAGMENT_NAMES[0]

	$: tFragmentName = $t(`textFragments.name.${activeFragment}` as TranslationPaths)

	$: defaultFragmentQuery = createTextFragmentListQuery(activeFragment, clientLanguage, null)

	$: tFragmentDefault =
		$defaultFragmentQuery.data?.value ??
		translate(
			clientLanguage as Locale,
			`textFragmentDefaults.${activeFragment}` as TranslationPaths
		)
	$: tFragmentNames = TEXT_FRAGMENT_NAMES.map((f) =>
		$t(`textFragments.name.${f}` as TranslationPaths)
	)

	$: availableVariables = getAvailableVariables(activeFragment)

	let inputText = ''

	function updateInputText(activeFragment: string) {
		inputText = fragments.find((f) => f.key === activeFragment)?.value ?? ''
	}

	$: updateInputText(activeFragment)

	function updateActiveFragment(inputText: string) {
		if (inputText) {
			const fragmentExists = fragments.some((f) => f.key === activeFragment)
			if (fragmentExists) {
				fragments = fragments.map((f) =>
					f.key === activeFragment ? { ...f, value: inputText } : f
				)
			} else {
				fragments = [...fragments, { key: activeFragment, value: inputText }]
			}
		} else {
			fragments = fragments.filter((f) => f.key !== activeFragment)
		}
	}

	$: updateActiveFragment(inputText)
</script>

<div class="flex flex-col">
	<div class="flex items-center justify-between">
		<FloatingCardTrigger>
			<svelte:fragment slot="trigger">
				<span
					class="text-base font-medium underline decoration-dashed decoration-1 underline-offset-4 decoration-gray-500"
					>{tFragmentName}</span
				>
			</svelte:fragment>

			<div class="flex flex-col">
				{#each tFragmentNames as name, i}
					<div
						class="floating-action {TEXT_FRAGMENT_NAMES[i] == activeFragment
							? 'text-blue-500 font-medium'
							: ''}"
						on:click={() => (activeFragment = TEXT_FRAGMENT_NAMES[i])}
					>
						{name}

						{#if fragments.some((f) => f.key === TEXT_FRAGMENT_NAMES[i])}
							<span class="ml-2 text-base material-icons opacity-40">edit</span>
						{/if}
					</div>
				{/each}
			</div>
		</FloatingCardTrigger>
	</div>
	<textarea
		class="w-full h-32 mt-2 !leading-snug bg-gray-100 placeholder:leading-snug"
		placeholder={tFragmentDefault}
		bind:value={inputText}
	/>
	{#if availableVariables}
		<p class="text-sm text-gray-600">
			{$t('textFragments.availableVariables')}:
			<span class="italic">{availableVariables}</span>
		</p>
	{/if}
</div>
