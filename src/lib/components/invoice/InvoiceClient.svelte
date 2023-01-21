<script lang="ts">
	import { getClientDisplayLines, type ClientDetails } from '../../utils/Client'
	import LightPulse from '../LightPulse.svelte'
	import { getInvoiceContext } from './Invoice.svelte'

	const { showHints, it } = getInvoiceContext()

	export let client: ClientDetails

	$: clientLines = getClientDisplayLines(client, $it)
</script>

<div>
	<b
		>{$it('invoice.billedTo')}
		{#if $showHints} <LightPulse /> {/if}</b
	>
	{#each clientLines as line, i}
		{#if line}
			<p class:mt-2={i == 0 || !clientLines[i - 1]}>{line}</p>
		{/if}
	{/each}
</div>
