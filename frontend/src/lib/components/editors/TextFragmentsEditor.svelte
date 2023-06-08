<script lang="ts">
	import { applicationLanguage, t } from '../../stores/settings'
	import type { TranslationPaths } from '../../translations/translations'
	import LanguageSelectorPopup from '../LanguageSelectorPopup.svelte'
	import FloatingCardTrigger from '../basics/FloatingCardTrigger.svelte'

	const fragments = [
		'mail.invoiceSubject',
		'mail.invoiceText',
		'invoice.note',
		'invoice.footerNote',
		'invoice.paymentNote',
	]

	let fragmentLanguage = $applicationLanguage
	let fragmentName = fragments[0]
	let fragmentText = ''

	$: tFragmentName = $t(`textFragments.name.${fragmentName}` as TranslationPaths)
	$: tFragmentNames = fragments.map((f) => $t(`textFragments.name.${f}` as TranslationPaths))

	// {invoiceNumber}, {invoiceDate}, {invoiceMonth}, {invoiceLastMonth}, {invoiceYear}, {invoiceLastYear}, {invoiceDueDate}, {invoiceTotal}
</script>

<div class="flex flex-col px-3 py-2 mt-2 bg-gray-200">
	<div class="flex items-center justify-between">
		<FloatingCardTrigger>
			<svelte:fragment slot="trigger">
				<span class="font-medium underline decoration-dashed underline-offset-4 decoration-gray-500"
					>{tFragmentName}</span
				>
			</svelte:fragment>

			<div class="flex flex-col">
				{#each tFragmentNames as name}
					<div>{name}</div>
				{/each}
			</div>
		</FloatingCardTrigger>

		<LanguageSelectorPopup
			bind:selected={fragmentLanguage}
			class="underline decoration-dashed underline-offset-2 decoration-1"
		/>
	</div>
	<textarea class="w-full h-32 mt-2 bg-gray-100" bind:value={fragmentText} />
</div>
