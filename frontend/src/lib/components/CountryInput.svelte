<script lang="ts">
	import { TRANSLATIONS_EN } from '../../../../shared/invoice-translations/en'
	import { t } from '../stores/settings'
	import type { TranslationPaths } from '../translations/translations'
	import FloatingCard from './basics/FloatingCard.svelte'

	const COUNTRY_CODES = Object.keys(TRANSLATIONS_EN.countries)

	export let countryCode: string

	$: COUNTRIES = COUNTRY_CODES.map((code) => ({
		code,
		name: $t(`countries.${code}` as TranslationPaths),
	})).sort((a, b) => a.name.localeCompare(b.name))

	$: filteredCountries = COUNTRIES.filter((c) =>
		c.name.toLowerCase().includes(search.toLowerCase()),
	)

	function highlight(text: string, search: string) {
		const regex = new RegExp(`(${search})`, 'gi')
		return text.replace(regex, '<b>$1</b>')
	}

	let search = ''

	function onSearchChange(search: string) {
		search = search.trim()

		const selected = filteredCountries.find((c) => c.name.toLowerCase() === search.toLowerCase())

		if (selected) {
			countryCode = selected.code
		} else {
			countryCode = ''
		}
	}

	function onCountryCodeChange(code: string) {
		const selected = COUNTRIES.find((c) => c.code === code)

		if (selected) {
			search = selected.name
		}
	}

	$: onCountryCodeChange(countryCode)
	$: onSearchChange(search)

	let inputFocused = false
</script>

<div class="!flex items-center input-style group relative {!countryCode ? '!ring-orange-300' : ''}">
	<input
		type="string"
		class="outline-none"
		bind:value={search}
		on:focus={() => (inputFocused = true)}
		on:blur={() => (inputFocused = false)}
	/>

	{#if inputFocused}
		<FloatingCard class="flex flex-col overflow-x-hidden overflow-y-auto max-h-60">
			{#each filteredCountries as country}
				<div
					class="cursor-pointer floating-action"
					on:mousedown={() => (countryCode = country.code)}
				>
					{@html highlight(country.name, search)}
				</div>
			{/each}

			{#if filteredCountries.length == 0}
				<div class="text-sm text-gray-500">{$t('clientEditor.noMatchingCountries')}</div>
			{/if}
		</FloatingCard>
	{/if}
</div>
