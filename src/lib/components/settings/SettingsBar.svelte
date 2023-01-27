<script>
	import { cloneDeep } from 'lodash'
	import { account } from '../../utils/Account'
	import { activeInvoice, creanteNewInvoice } from '../../utils/Invoice'
	import Button from '../Button.svelte'
	import AccountSetting from './AccountSetting.svelte'
	import ClientSelector from './ClientSelector.svelte'
	import InvoiceList from './InvoiceList.svelte'

	$: accountMatchesInvoice = JSON.stringify($account) === JSON.stringify($activeInvoice.account)
</script>

<h1 class="text-xl font-medium">Invoice settings</h1>

<h2 class="mt-5 text-lg mb-2">Your details:</h2>
<AccountSetting />
{#if !accountMatchesInvoice}
	<Button on:click={() => ($activeInvoice.account = cloneDeep($account))} class="mt-2" outlined
		>Apply to selected invoice</Button
	>
{/if}

<h2 class="mt-5 text-lg mb-2">Client:</h2>
<ClientSelector bind:selected={$activeInvoice.client} />

<h2 class="mt-5 text-lg mb-2">Latest invoices:</h2>
<Button on:click={creanteNewInvoice} class="mb-2" outlined>New invoice</Button>
<InvoiceList />
