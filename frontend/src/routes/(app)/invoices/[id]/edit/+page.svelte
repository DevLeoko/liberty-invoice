<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Button from '../../../../../lib/components/basics/Button.svelte';
	import Skeleton from '../../../../../lib/components/basics/Skeleton.svelte';
	import InvoiceEditor from '../../../../../lib/components/editors/InvoiceEditor.svelte';
	import { trpc, type CreateInvoice, type ReadInvoice } from '../../../../../lib/trpcClient';
	import { logSuccess } from '../../../../../lib/stores/alerts';

	const id = Number.parseInt($page.params.id);

	let loadingSave = false;
	let invoice: null | CreateInvoice = null;

	onMount(async () => {
		const invoiceData = await trpc.invoice.read.query(id);

		invoice = {
			...invoiceData,
			taxRateIds: invoiceData.taxRates.map((taxRate) => taxRate.id)
		};
	});

	async function saveInvoice() {
		if (!invoice) {
			return;
		}

		loadingSave = true;

		await trpc.invoice.update
			.mutate({
				id,
				invoice
			})
			.finally(() => {
				loadingSave = false;
			});

		logSuccess('Invoice saved');
	}
</script>

<div class="flex justify-between mb-4">
	<h1 class="pageTitle">New invoice</h1>
	<Button loading={loadingSave} on:click={saveInvoice}
		><span class="mr-1 material-icons">check</span> Save</Button
	>
</div>

{#if invoice != null}
	<InvoiceEditor bind:invoice />
{:else}
	<Skeleton class="h-16" />
{/if}
