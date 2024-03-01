<script lang="ts">
	import { page } from '$app/stores'
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
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

<PageTitle {title} backLink={$page.url.pathname != '/settings' ? '/settings' : null} />

<slot />
