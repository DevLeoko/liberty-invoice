<script lang="ts">
	import LanguageSelector from '../../lib/components/LanguageSelector.svelte'
	import FloatingCardTrigger from '../../lib/components/basics/FloatingCardTrigger.svelte'
	import { applicationLanguage, t } from '../../lib/stores/settings'
</script>

<div class="flex w-screen h-screen max-w-full overflow-hidden">
	<div class="flex flex-col flex-grow min-w-0 p-6 pb-4 md:p-12">
		<a class="flex items-center mb-8" href="https://liberty-invoice.com/{$t('langCodeShort')}">
			<img class="h-8" src="/logo.svg" alt="logo" />
		</a>

		<div class="max-w-sm">
			<slot />
		</div>

		<div class="z-20 flex flex-wrap gap-4 mt-auto mb-4 text-xs text-gray-700">
			<span>&copy; Liberty Invoice {new Date().getFullYear()}</span>

			<a
				href="https://liberty-invoice.com/{$t('langCodeShort')}/legal/tos"
				class="transition-colors duration-300 text-slate-500 hover:text-blue-500:text-blue-500"
				>{$t('auth.legalLinks.termsOfService')}</a
			>
			<a
				href="https://liberty-invoice.com/{$t('langCodeShort')}/legal/privacy-policy"
				class="transition-colors duration-300 text-slate-500 hover:text-blue-500:text-blue-500"
				>{$t('auth.legalLinks.privacyPolicy')}</a
			>
			<a
				href="https://liberty-invoice.com/{$t('langCodeShort')}/legal/notice"
				class="transition-colors duration-300 text-slate-500 hover:text-blue-500:text-blue-500"
				>{$t('auth.legalLinks.impressum')}</a
			>

			<FloatingCardTrigger preferTop>
				<svelte:fragment slot="trigger">
					<span class="underline">
						{$applicationLanguage.toUpperCase()}
					</span>
				</svelte:fragment>

				<LanguageSelector bind:selected={$applicationLanguage} />
			</FloatingCardTrigger>
		</div>
	</div>
	<div
		class="hidden w-1/3 p-8 -mr-12 -skew-x-6 bg-blue-500 bg-center bg-cover opacity-80 md:block"
	/>
</div>
