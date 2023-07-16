<script lang="ts">
	import { t } from '../../stores/settings'

	export let agreedToTerms = false
	export let agreedToMarketing = false
</script>

<!-- ToS and Marketing checkbox -->
<div class="leading-tight">
	<div class="flex items-center mt-2">
		<input
			type="checkbox"
			id="terms-checkbox"
			class="w-4 h-4 mr-1 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
			bind:checked={agreedToTerms}
		/><span class="mr-1 text-sm text-red-500">*</span>
		<label for="terms-checkbox">
			<div>&nbsp;</div>
			<span class="text-sm text-gray-500">
				{$t('auth.agreeTo')}
				<a
					class="text-blue-500"
					href="https://liberty-invoice.com/{$t('langCodeShort')}/legal/terms"
					>{$t('auth.termsOfService')}</a
				>
				{$t('auth.and')}
				<a
					class="text-blue-500"
					href="https://liberty-invoice.com/{$t('langCodeShort')}/legal/privacy"
					>{$t('auth.privacyPolicy')}</a
				>
			</span>
		</label>
	</div>

	<div class="flex items-center mt-2">
		<input
			type="checkbox"
			id="marketing-checkbox"
			class="w-4 h-4 mr-2 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
			bind:checked={agreedToMarketing}
		/>
		<label for="marketing-checkbox" class="text-sm text-gray-500"
			>{$t('auth.agreeToMarketing')}</label
		>
	</div>
</div>
