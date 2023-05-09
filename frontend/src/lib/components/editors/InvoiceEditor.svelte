<script lang="ts">
	import type { NullableProp } from '../../../types/utilities';
	import type { CreateInvoice } from '../../trpcClient';
	import DateInput from '../basics/DateInput.svelte';
	import Labeled from '../basics/Labeled.svelte';
	import ClientSelector from '../ClientSelector.svelte';
	import InvoiceItemsEditor from './InvoiceItemsEditor.svelte';

	export let invoice: NullableProp<CreateInvoice, 'clientId'>;

	// const clients = createClientQuery();
	// const userSettings = queryUserSettings();

	$: dueDays = invoice.dueDate
		? Math.round((invoice.dueDate.getTime() - invoice.date.getTime()) / (1000 * 60 * 60 * 24))
		: undefined;
</script>

<div class="flex flex-col max-w-2xl space-y-6">
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

	<Labeled label="Client" actionText="toggle search">
		<ClientSelector bind:clientId={invoice.clientId} />
	</Labeled>

	<Labeled label="Note">
		<textarea class="w-full" rows="2" bind:value={invoice.note} />
	</Labeled>

	<div>
		<InvoiceItemsEditor bind:items={invoice.items} />
	</div>
</div>
