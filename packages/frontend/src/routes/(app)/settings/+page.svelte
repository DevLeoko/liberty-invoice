<script lang="ts">
	import { logInfo, t } from '../../../lib/stores/settings'
</script>

<div class="grid max-w-lg grid-cols-1 gap-4 xs:grid-cols-2">
	<a href="/settings/account">
		<h2>
			<span class="material-icons">person</span>
			{$t('settings.account')}
		</h2>
		<p>{$t('settings.accountText')}</p>
	</a>
	<a href="/settings/business-details">
		<h2>
			<span class="material-icons">badge</span>
			{$t('settings.businessDetails')}
		</h2>
		<p>{$t('settings.businessDetailsText')}</p>
	</a>
	<a href="/settings/text-fragments">
		<h2><span class="material-icons">sticky_note_2</span>{$t('settings.textFragments')}</h2>
		<p>{$t('settings.textFragmentsText')}</p>
	</a>
	<a href="/settings/invoice-defaults">
		<h2><span class="material-icons">receipt_long</span>{$t('settings.invoiceDefaults')}</h2>
		<p>{$t('settings.invoiceDefaultsText')}</p>
	</a>
	<a href="/settings/invoice-numbering">
		<h2><span class="material-icons">tag</span>{$t('settings.invoiceNumberFormat')}</h2>
		<p>
			{$t('settings.invoiceNumberFormatText')}
		</p>
	</a>
	<a href="/settings/tax-rates">
		<h2><span class="material-icons">percent</span>{$t('settings.taxRates')}</h2>
		<p>
			{$t('settings.taxRatesText')}
		</p>
	</a>
	<article on:click={() => $logInfo('general.inDevelopment')} class="opacity-50">
		<h2><span class="material-icons">people</span>{$t('settings.members')}</h2>
		<p>
			{$t('settings.membersText')}<br />
			<span class="text-xs text-orange-600">Not available</span>
		</p>
	</article>
</div>

<style lang="postcss">
	article,
	a {
		@apply px-3 py-2 bg-gray-150 hover:bg-gray-200 cursor-pointer;
	}

	a h2,
	article h2 {
		@apply text-lg flex items-center leading-tight;
		word-break: break-word;
	}

	a h2 span,
	article h2 span {
		@apply mr-2 text-xl;
	}

	a p,
	article p {
		@apply text-sm mt-1 text-gray-600;
	}
</style>
