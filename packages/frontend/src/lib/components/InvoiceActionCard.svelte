<script lang="ts">
	import { goto } from '$app/navigation'
	import { openInvoiceMailModal } from '$lib/components/global/GlobalInvoiceMailModal.svelte'
	import { createEventDispatcher } from 'svelte'
	import {
		createInvoiceDeleteMutation,
		createInvoiceFinalizeMutation,
		createInvoiceLogPaymentMutation,
		getDownloadUrl,
	} from '../controller/invoice'
	import { logSuccess, t } from '../stores/settings'
	import type { ListInvoice } from '../trpcClient'
	import CardActionButton from './basics/CardActionButton.svelte'
	import ConfirmationCardTrigger from './basics/ConfirmationCardTrigger.svelte'

	const dispatch = createEventDispatcher()

	export let invoice: ListInvoice

	let loadingDelete = false
	let loadingFinalize = false
	let loadingMarkAsPaid = false

	const invoiceDeleteMutation = createInvoiceDeleteMutation()

	async function deleteInvoice() {
		if (loadingDelete) return

		loadingDelete = true
		await invoiceDeleteMutation(invoice.id).finally(() => {
			loadingDelete = false
		})

		$logSuccess('invoiceList.deleted')
	}

	const invoiceFinalizeMutation = createInvoiceFinalizeMutation()

	async function finalizeInvoice() {
		if (loadingFinalize) return

		loadingFinalize = true
		await invoiceFinalizeMutation(invoice.id).finally(() => {
			loadingFinalize = false
		})

		$logSuccess('invoiceList.finalized')
	}

	const logPaymentMutation = createInvoiceLogPaymentMutation()

	async function markAsPaid() {
		if (loadingMarkAsPaid) return

		loadingMarkAsPaid = true
		await logPaymentMutation({
			id: invoice.id,
			amount: invoice.amountWithTax - invoice.amountPaid,
		}).finally(() => {
			loadingMarkAsPaid = false
		})

		$logSuccess('invoiceList.markedAsPaid')
	}

	let loadingSendAndFinalize = false
	function sendAndFinalizeInvoice(event: MouseEvent) {
		event.stopPropagation()

		loadingSendAndFinalize = true
		openInvoiceMailModal
			.mutate(invoice.id, true)
			.then(() => {
				dispatch('close')
			})
			.finally(() => {
				loadingSendAndFinalize = false
			})
	}

	let loadingSend = false
	function sendInvoice() {
		loadingSend = true
		openInvoiceMailModal
			.mutate(invoice.id, false)
			.then(() => {
				dispatch('close')
			})
			.finally(() => {
				loadingSend = false
			})
	}
</script>

<div class="flex flex-col items-stretch space-y-1 text-sm text-left floating-actions">
	<b>{$t('general.actions')}</b>

	{#if invoice.draft}
		<CardActionButton on:click={finalizeInvoice} loading={loadingFinalize} icon="check">
			{$t('invoiceStatus.finalize')}
		</CardActionButton>

		<CardActionButton
			icon="mark_email_read"
			loading={loadingSendAndFinalize}
			on:click={sendAndFinalizeInvoice}
		>
			{$t('invoiceStatus.sendAndFinalize')}
		</CardActionButton>
		<div class="h-[1px] bg-slate-200" />
	{:else if invoice.amountPaid != invoice.amountWithTax}
		<CardActionButton icon="check" loading={loadingMarkAsPaid} on:click={markAsPaid}>
			{$t('invoiceStatus.markAsPaid')}
		</CardActionButton>

		<CardActionButton icon="mark_email_read" loading={loadingSend} on:click={sendInvoice}>
			{$t('invoiceStatus.send')}
		</CardActionButton>

		<div class="h-[1px] bg-slate-200" />
	{/if}
	<CardActionButton
		icon="content_copy"
		on:click={() => goto(`/invoices/new?duplicate=${invoice.id}`)}
	>
		{$t('general.duplicate')}
	</CardActionButton>
	<CardActionButton icon="edit" on:click={() => goto(`/invoices/${invoice.id}/edit`)}>
		{$t('general.edit')}
	</CardActionButton>
	<a href={getDownloadUrl(invoice.id)} class="floating-action" target="_blank">
		<span class="mr-1 text-sm material-icons">download</span>
		{$t('general.download')}
	</a>
	<div on:click|stopPropagation>
		<ConfirmationCardTrigger loading={loadingDelete} on:confirm={deleteInvoice} preferLeft>
			<div class="floating-action">
				<span class="mr-1 text-sm material-icons">delete</span>
				{$t('general.delete')}
			</div>
		</ConfirmationCardTrigger>
	</div>
</div>
