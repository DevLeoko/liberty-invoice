<script lang="ts">
	import type { NullableProp } from '../../../types/utilities';
	import DateInput from '../basics/DateInput.svelte';
	import Labeled from '../basics/Labeled.svelte';
	import ClientSelector from '../ClientSelector.svelte';
	// import { createClientQuery, queryUserSettings } from '../../tanQuery';
	import type { CreateInvoice } from '../../trpcClient';
	import InvoiceItemsEditor from './InvoiceItemsEditor.svelte';

	export let invoice: NullableProp<CreateInvoice, 'clientId'>;

	// const clients = createClientQuery();
	// const userSettings = queryUserSettings();

	$: dueDays = invoice.dueDate
		? Math.round((invoice.dueDate.getTime() - invoice.date.getTime()) / (1000 * 60 * 60 * 24))
		: undefined;
</script>

<div class="flex flex-col max-w-2xl">
	<div class="flex space-x-3">
		<Labeled label="Invoice ID">
			<div class="flex items-center">
				<input type="text" bind:value={invoice.invoiceNumber} disabled />
				<span class="material-icons input-icon">edit</span>
			</div>
		</Labeled>
		<Labeled label="Date" class="!ml-auto">
			<DateInput bind:date={invoice.date} />
		</Labeled>
		<Labeled label="Due" actionText="in {dueDays} days">
			<DateInput bind:date={invoice.dueDate} />
		</Labeled>
	</div>

	<Labeled label="Client" class="col-span-3" actionText="toggle search">
		<ClientSelector />
	</Labeled>

	<Labeled label="Note" class="col-span-3">
		<textarea class="w-full" rows="2" bind:value={invoice.note} />
	</Labeled>

	<div class="col-span-3">
		<InvoiceItemsEditor />
	</div>
</div>
