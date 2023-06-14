<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { t } from '../../../lib/stores/settings'

	let title = $t('menu.settings')

	$: {
		if ($page.url.pathname.includes('account')) title = $t('settings.account')
		else if ($page.url.pathname.includes('business-details')) title = $t('settings.businessDetails')
		else if ($page.url.pathname.includes('invoice-defaults')) title = $t('settings.invoiceDefaults')
		else if ($page.url.pathname.includes('invoice-numbering'))
			title = $t('settings.invoiceNumberFormat')
		else if ($page.url.pathname.includes('text-fragments')) title = $t('settings.textFragments')
		else if ($page.url.pathname.includes('tax-rates')) title = $t('settings.taxRates')
		else title = $t('menu.settings')
	}
</script>

<h1 class="pageTitle">
	{#if $page.url.pathname != '/settings'}
		<span class="material-icons back-nav" on:click={() => goto('/settings')}>arrow_back</span>
	{/if}
	{title}
</h1>

<slot />
