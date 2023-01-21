<script lang="ts">
	import { getClientDisplayLines, type AccountDetails } from '../../utils/Client'
	import { getInvoiceContext } from './Invoice.svelte'

	const { it } = getInvoiceContext()

	export let accountDetails: AccountDetails

	$: accountLines = getClientDisplayLines(accountDetails, $it)
</script>

<div>
	{#each accountLines as line, i}
		{#if line}
			<p class:mt-2={i == 0 || !accountLines[i - 1]} class:font-bold={i == 0}>{line}</p>
		{/if}
	{/each}
</div>
