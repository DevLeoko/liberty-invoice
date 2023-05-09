<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '../../../../lib/components/basics/Button.svelte';
	import InvoiceEditor from '../../../../lib/components/editors/InvoiceEditor.svelte';
	import { trpc, type CreateInvoice } from '../../../../lib/trpcClient';
	import { parseInvoiceIdFormat } from '../../../../../../shared/invoice-ids';
	import type { NullableProp } from '../../../../types/utilities';
	import { queryUserSettings } from '../../../../lib/tanQuery';
	import Skeleton from '../../../../lib/components/basics/Skeleton.svelte';

	let invoice: null | NullableProp<CreateInvoice, 'clientId'> = null;
	let partialId: null | number = null;

	const userSettingsPromise = queryUserSettings();

	onMount(async () => {
		const [partialIdData, userSettings] = await Promise.all([
			trpc.invoice.getNextAvailablePartialInvoiceId.query(),
			userSettingsPromise
		]);

		const { idFormat, partialId: nextPartialId } = partialIdData;

		partialId = nextPartialId;

		const { format } = parseInvoiceIdFormat(idFormat);

		const dueDate = new Date();
		dueDate.setDate(dueDate.getDate() + userSettings.defaultDueDays);

		invoice = {
			invoiceNumber: format(partialId),
			date: new Date(),
			dueDate,
			note: '',
			clientId: null,
			items: [],
			taxRateIds: userSettings.defaultTaxRateId != null ? [userSettings.defaultTaxRateId] : [],
			language: userSettings.defaultLanguage,
			currency: userSettings.defaultCurrency
		};
	});
</script>

<div class="flex justify-between mb-4">
	<h1 class="pageTitle">New invoice</h1>
	<Button><span class="mr-1 material-icons">check</span> Save</Button>
</div>

{#if invoice != null}
	<InvoiceEditor bind:invoice />
{:else}
	<Skeleton class="h-16" />
{/if}
