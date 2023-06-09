<script lang="ts">
	import { goto } from '$app/navigation'
	import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { useQueryClient } from '@tanstack/svelte-query'
	import { INVOICE_KEYS } from '../controller/tanQuery'
	import { logSuccess, t } from '../stores/settings'
	import { trpc, type ListInvoice } from '../trpcClient'
	import CardActionButton from './basics/CardActionButton.svelte'
	import ConfirmationCardTrigger from './basics/ConfirmationCardTrigger.svelte'

	export let invoice: ListInvoice

	let loadingDelete = false
	let loadingFinalize = false
	let loadingMarkAsPaid = false

	const queryClient = useQueryClient()

	async function deleteInvoice() {
		if (loadingDelete) return

		loadingDelete = true
		await trpc.invoice.delete.mutate(invoice.id).finally(() => {
			loadingDelete = false
		})

		$logSuccess('invoiceList.deleted')

		queryClient.invalidateQueries(INVOICE_KEYS.read(invoice.id))
		queryClient.setQueryData(INVOICE_KEYS.list(), (oldData?: { id: number }[]) => {
			if (!oldData) return oldData
			return oldData.filter((i) => i.id !== invoice.id)
		})
	}

	async function finalizeInvoice() {
		if (loadingFinalize) return

		loadingFinalize = true
		const newListInvoice = await trpc.invoice.finalize.mutate(invoice.id).finally(() => {
			loadingFinalize = false
		})

		$logSuccess('invoiceList.finalized')

		queryClient.invalidateQueries(INVOICE_KEYS.read(invoice.id))
		queryClient.setQueryData(INVOICE_KEYS.list(), (oldData?: { id: number }[]) => {
			if (!oldData) return oldData
			return oldData.map((i) => (i.id === invoice.id ? newListInvoice : i))
		})
	}

	async function markAsPaid() {
		if (loadingMarkAsPaid) return

		loadingMarkAsPaid = true
		const newListInvoice = await trpc.invoice.logPayment
			.mutate({
				id: invoice.id,
				amount: invoice.amountWithTax - invoice.amountPaid,
			})
			.finally(() => {
				loadingMarkAsPaid = false
			})

		$logSuccess('invoiceList.markedAsPaid')

		queryClient.invalidateQueries(INVOICE_KEYS.read(invoice.id))
		queryClient.setQueryData(INVOICE_KEYS.list(), (oldData?: { id: number }[]) => {
			if (!oldData) return oldData
			return oldData.map((i) => (i.id === invoice.id ? newListInvoice : i))
		})
	}
</script>

<div class="flex flex-col items-stretch space-y-1 text-sm text-left floating-actions">
	<b>{$t('general.actions')}</b>

	{#if invoice.draft}
		<CardActionButton on:click={finalizeInvoice} loading={loadingFinalize} icon="check">
			{$t('invoiceStatus.finalize')}
		</CardActionButton>

		<CardActionButton icon="mark_email_read" on:click={finalizeInvoice}>
			{$t('invoiceStatus.sendAndFinalize')}
		</CardActionButton>
		<div class="h-[1px] bg-slate-200" />
	{:else if invoice.amountPaid != invoice.amountWithTax}
		<CardActionButton icon="check" loading={loadingMarkAsPaid} on:click={markAsPaid}>
			{$t('invoiceStatus.markAsPaid')}
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
	<a
		href={`${PUBLIC_BACKEND_URL}/invoices/${invoice.id}/download`}
		class="floating-action"
		target="_blank"
	>
		<span class="mr-1 text-sm material-icons">download</span>
		{$t('general.download')}
	</a>
	<div on:click|stopPropagation>
		<ConfirmationCardTrigger loading={loadingDelete} on:confirm={deleteInvoice}>
			<div class="floating-action">
				<span class="mr-1 text-sm material-icons">delete</span>
				{$t('general.delete')}
			</div>
		</ConfirmationCardTrigger>
	</div>
</div>
