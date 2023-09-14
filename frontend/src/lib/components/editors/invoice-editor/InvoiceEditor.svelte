<script lang="ts">
	import type { NullableProp } from '../../../../types/utilities'
	import { getCurrency, t } from '../../../stores/settings'
	import { trpc, type CreateInvoice } from '../../../trpcClient'
	import ClientSelector from '../../ClientSelector.svelte'
	import Button from '../../basics/Button.svelte'
	import DateInput from '../../basics/DateInput.svelte'
	import FloatingCardTrigger from '../../basics/FloatingCardTrigger.svelte'
	import Labeled from '../../basics/Labeled.svelte'
	import InvoiceItemsEditor from './InvoiceItemsEditor.svelte'
	import InvoiceNoteEditor from './InvoiceNoteEditor.svelte'

	export let invoice: NullableProp<CreateInvoice, 'clientId'>
	export let createMode = false

	$: currency = $getCurrency(invoice.currency) || $getCurrency('USD')

	$: clientId = invoice.clientId

	function onClientChange(clientId: number) {
		trpc.client.readDefaults.query({ id: clientId }).then((defaults) => {
			invoice.currency = defaults.defaultCurrency
			invoice.language = defaults.defaultLanguage
			invoice.dueDate = new Date(
				invoice.date.getTime() + defaults.defaultDueDays * 24 * 60 * 60 * 1000,
			)
			if (defaults.defaultTaxRateId != null) invoice.taxRateIds = [defaults.defaultTaxRateId]
		})
	}

	let initialLoad = true
	$: {
		if (clientId != null && !initialLoad) {
			onClientChange(clientId)
		}
		initialLoad = false
	}

	$: dueDays = invoice.dueDate
		? Math.round((invoice.dueDate.getTime() - invoice.date.getTime()) / (1000 * 60 * 60 * 24))
		: 0

	let overrideInvoiceNumber = false
</script>

<div class="flex flex-col max-w-2xl space-y-6">
	<div class="flex flex-wrap gap-3">
		<Labeled label={$t('invoice.invoiceNumber')} class="w-full mr-auto xs:w-auto">
			<div class="flex items-center">
				<input type="text" bind:value={invoice.invoiceNumber} disabled={!overrideInvoiceNumber} />
				<div>
					<FloatingCardTrigger preferLeft>
						<svelte:fragment slot="trigger">
							<span class="cursor-pointer material-icons input-icon">edit</span>
						</svelte:fragment>
						<div class="max-w-sm text-sm">
							<p class="leading-snug">
								{$t('invoiceEditor.invoiceNumberWarning1')}<a
									class="font-medium text-blue-500"
									href="/settings/invoice-numbering">{$t('invoiceEditor.invoiceNumberWarning2')}</a
								>{$t('invoiceEditor.invoiceNumberWarning3')}
							</p>
							<Button
								snug
								orange
								outlined
								class="mt-2"
								on:click={() => (overrideInvoiceNumber = true)}
								>{$t('invoiceEditor.invoiceNumberOverride')}</Button
							>
						</div>
					</FloatingCardTrigger>
				</div>
			</div>
		</Labeled>
		<div class="flex flex-wrap w-full gap-3 sm:w-auto">
			<Labeled label={$t('invoiceEditor.date')} class="flex-1">
				<DateInput bind:date={invoice.date} />
			</Labeled>
			<Labeled
				label={$t('invoiceEditor.due')}
				actionText={$t('invoiceEditor.dueIn', { days: dueDays })}
				class="flex-1"
			>
				<DateInput bind:date={invoice.dueDate} />
			</Labeled>
		</div>
	</div>

	<Labeled label={$t('general.client')}>
		<ClientSelector bind:clientId={invoice.clientId} />
	</Labeled>

	<Labeled label={$t('invoiceEditor.note')}>
		<InvoiceNoteEditor {invoice} {createMode} bind:note={invoice.note} />
	</Labeled>

	<div class="pl-2 -ml-2">
		<InvoiceItemsEditor
			{currency}
			bind:items={invoice.items}
			bind:taxRateIds={invoice.taxRateIds}
		/>
	</div>
</div>
