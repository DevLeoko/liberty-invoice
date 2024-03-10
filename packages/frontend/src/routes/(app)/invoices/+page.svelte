<script lang="ts">
	import { page } from '$app/stores'
	import InvoiceTable from '$lib/components/invoices/InvoiceTable.svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte'
	import { createInvoiceQuery } from '../../../lib/controller/invoice'
	import { t } from '../../../lib/stores/settings'

	const invoices = createInvoiceQuery()

	let previewInvoiceId: string | null = null
	if ($page.url.searchParams.has('preview')) {
		previewInvoiceId = $page.url.searchParams.get('preview')!
	}
</script>

<PageTitle title={$t('menu.invoices')}>
	<Button href="/invoices/new">
		<span class="mr-1 material-icons">add</span>
		{$t('invoiceList.newInvoice')}
	</Button>
</PageTitle>

{#if $invoices.isLoading}
	<Skeleton class="w-24 h-12" />
{:else if $invoices.isError}
	<span>{$t('general.error')}</span>
{:else if $invoices.data.length === 0}
	<div class="error">{$t('invoiceList.noneFound')}</div>
{:else}
	<InvoiceTable invoices={$invoices.data} bind:previewInvoiceId />
{/if}
