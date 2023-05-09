<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '../../../lib/components/basics/Button.svelte';
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte';
	import { createInvoiceQuery } from '../../../lib/tanQuery';

	const invoices = createInvoiceQuery();

	function createNew() {
		// TODO: change button to link
		goto('/invoices/new');
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
	<table class="w-full">
		<thead>
			<tr>
				<th>Invoice number</th>
				<th>Client</th>
				<th>Amount</th>
				<th>Due date</th>
				<th>Status</th>
			</tr>
		</thead>
		<tbody>
			{#each $invoices.data as invoice}
				<tr>
					<td>{invoice.invoiceNumber}</td>
					<td>{invoice.client.name}</td>
					<td>{invoice.amountWithTax}</td>
					<td>{invoice.dueDate.toDateString()}</td>
					<td>{invoice.amountPaid === invoice.amountWithTax ? 'Paid' : 'Unpaid'}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
