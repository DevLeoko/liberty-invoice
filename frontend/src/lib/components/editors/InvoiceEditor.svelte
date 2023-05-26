<script lang="ts">
	import type { NullableProp } from '../../../types/utilities';
	import { t } from '../../stores/settings';
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
		: 0;
</script>

<div class="flex flex-col max-w-2xl space-y-6">
	<div class="flex space-x-3">
		<Labeled label={$t('invoice.invoiceNumber')}>
			<div class="flex items-center">
				<input type="text" bind:value={invoice.invoiceNumber} disabled />
				<span class="material-icons input-icon">edit</span>
			</div>
		</Labeled>
		<Labeled label={$t('invoiceEditor.date')} class="!ml-auto">
			<DateInput bind:date={invoice.date} />
		</Labeled>
		<Labeled
			label={$t('invoiceEditor.due')}
			actionText={$t('invoiceEditor.dueIn', { days: dueDays })}
		>
			<DateInput bind:date={invoice.dueDate} />
		</Labeled>
	</div>

	<Labeled label={$t('general.client')} actionText={$t('invoiceEditor.toggleSearch')}>
		<ClientSelector bind:clientId={invoice.clientId} />
	</Labeled>

	<Labeled label={$t('invoiceEditor.note')}>
		<textarea class="w-full" rows="2" bind:value={invoice.note} />
	</Labeled>

	<div>
		<InvoiceItemsEditor bind:items={invoice.items} />
	</div>
</div>
