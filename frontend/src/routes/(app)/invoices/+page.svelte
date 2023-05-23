<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import InvoicePreview from '../../../lib/components/InvoicePreview.svelte';
	import Button from '../../../lib/components/basics/Button.svelte';
	import SidePopup from '../../../lib/components/basics/SidePopup.svelte';
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte';
	import { createInvoiceQuery } from '../../../lib/tanQuery';
	import { trpc, type ReadInvoice, type ListInvoice } from '../../../lib/trpcClient';

	const invoices = createInvoiceQuery();

	let previewInvoice: ReadInvoice | null = null;
	let loadingPreview = false;

	function createNew() {
		// TODO: change button to link
		goto('/invoices/new');
	}

	async function openPreview(invoice: ListInvoice) {
		loadingPreview = true;
		previewInvoice = await trpc.invoice.read.query(invoice.id).finally(() => {
			loadingPreview = false;
		});
	}

	function closePreview() {
		previewInvoice = null;
		loadingPreview = false;
	}
</script>

<div class="flex justify-between mb-4">
	<h1 class="pageTitle">Invoices</h1>
	<Button on:click={createNew}><span class="mr-1 material-icons">add</span> New invoice</Button>
</div>

{#if $invoices.isLoading}
	<Skeleton class="w-24 h-12" />
{:else if $invoices.isError}
	<span>Something went wrong</span>
{:else if $invoices.data.length === 0}
	<div class="error">No invoices found</div>
{:else}
	<div class="grid w-full grid-table-5">
		<div class="text-left contents [&>*]:px-2">
			<div>Invoice number</div>
			<div>Client</div>
			<div>Amount</div>
			<div>Due date</div>
			<div>Status</div>
		</div>
		{#each $invoices.data as invoice}
			<a
				class="contents my-row [&>*]:px-2 [&>*]:py-1"
				href="{PUBLIC_BACKEND_URL}/invoice/{invoice.id}/download"
				on:click|preventDefault={() => openPreview(invoice)}
				target="_blank"
			>
				<div>{invoice.invoiceNumber}</div>
				<div>{invoice.client.name}</div>
				<div>{invoice.amountWithTax}</div>
				<div>{invoice.dueDate.toDateString()}</div>
				<div>{invoice.amountPaid === invoice.amountWithTax ? 'Paid' : 'Unpaid'}</div>
			</a>
		{/each}
	</div>

	{#if loadingPreview || previewInvoice}
		<SidePopup on:exit={closePreview} class="w-[600px]">
			{#if !previewInvoice}
				<Skeleton class="w-full h-48" />
			{:else}
				<InvoicePreview invoice={previewInvoice} on:exit={closePreview} />
			{/if}
		</SidePopup>
	{/if}
{/if}

<style lang="scss">
	.my-row:nth-child(even) {
		& > * {
			@apply bg-slate-200;
		}
	}
</style>
