<script lang="ts">
	import BasicModal from '$lib/components/basics/BasicModal.svelte'
	import Button from '$lib/components/basics/Button.svelte'
	import DynamicTextarea from '$lib/components/basics/DynamicTextarea.svelte'
	import Labeled from '$lib/components/basics/Labeled.svelte'
	import { createInvoiceFinalizeMutation, getDownloadUrl } from '$lib/controller/invoice'
	import { createFinalTextFragmentsQuery } from '$lib/controller/text-fragment'
	import { queryUserSettings } from '$lib/controller/user-settings'
	import { activePlan } from '$lib/stores/auth'
	import { logSuccess, t } from '$lib/stores/settings'
	import { Locale, translate } from '$lib/translations/translations'
	import { trpc, type ReadInvoice } from '$lib/trpcClient'
	import { getTextFragmentInvoiceVariables, parseTextFragment } from 'shared/text-fragment'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	export let invoice: ReadInvoice
	export let finalizeBeforeSend = false

	$: textFragmentQuery = createFinalTextFragmentsQuery(
		['mail.invoiceSubject', 'mail.invoiceText'],
		invoice.language as Locale,
		invoice.clientId
	)

	let email = ''
	let cc = ''
	let bcc = ''
	let subject = ''
	let text = ''

	function onInvoiceUpdate() {
		email = invoice.client.contactEmail
	}

	function updateTextFragments() {
		let subjectText = $textFragmentQuery?.find((q) => q.key === 'mail.invoiceSubject')?.value ?? ''
		let bodyText = $textFragmentQuery?.find((q) => q.key === 'mail.invoiceText')?.value ?? ''

		if (!$activePlan) {
			subjectText = translate(
				invoice.language as Locale,
				'textFragmentDefaults.mail.invoiceSubject'
			)
			bodyText = translate(invoice.language as Locale, 'textFragmentDefaults.mail.invoiceText')
		}

		queryUserSettings().then((userSettings) => {
			const invoiceVariables = getTextFragmentInvoiceVariables(invoice, userSettings)

			subject = parseTextFragment(subjectText, invoiceVariables)
			text = parseTextFragment(bodyText, invoiceVariables)
		})
	}

	$: {
		invoice
		onInvoiceUpdate()
	}

	$: {
		invoice
		$textFragmentQuery
		updateTextFragments()
	}

	$: mailDisclaimer = translate(invoice.language as Locale, 'mailTemplate.footerDisclaimer')

	let loadingSend = false

	const finalizeInvoiceMutation = createInvoiceFinalizeMutation()

	async function sendMail() {
		loadingSend = true

		try {
			if (finalizeBeforeSend) {
				await finalizeInvoiceMutation(invoice.id)
			}

			await trpc.invoice.sendMail.mutate({
				id: invoice.id,
				email,
				cc,
				bcc,
				content: $activePlan
					? {
							subject,
							body: text,
						}
					: null,
			})

			$logSuccess(
				finalizeBeforeSend
					? 'invoiceEmailModal.sendAndFinalizeSuccess'
					: 'invoiceEmailModal.sendSuccess'
			)

			dispatch('exit')
		} finally {
			loadingSend = false
		}
	}
</script>

<BasicModal
	title={$t(
		finalizeBeforeSend ? 'invoiceEmailModal.sendAndFinalizeTitle' : 'invoiceEmailModal.sendTitle',
		{ invoiceNumber: invoice.invoiceNumber }
	)}
	on:exit
>
	<div class="flex flex-col gap-2">
		<Labeled label={$t('invoiceEmailModal.email')}>
			<input type="email" bind:value={email} />
		</Labeled>

		<div class="grid grid-cols-2 gap-4">
			<Labeled label={$t('invoiceEmailModal.cc')}>
				<input type="email" placeholder={$t('general.optional')} bind:value={cc} />
			</Labeled>

			<Labeled label={$t('invoiceEmailModal.bcc')}>
				<input type="email" placeholder={$t('general.optional')} bind:value={bcc} />
			</Labeled>
		</div>

		<Labeled label={$t('invoiceEmailModal.subject')}>
			<input
				type="text"
				bind:value={subject}
				disabled={$textFragmentQuery == null || !$activePlan}
			/>
		</Labeled>

		<Labeled label={$t('invoiceEmailModal.text')} class="z-20">
			<DynamicTextarea
				bind:value={text}
				disabled={$textFragmentQuery == null || !$activePlan}
				class="!bg-opacity-100"
			/>
		</Labeled>

		<div
			class="z-10 !pt-4 -mt-4 input-style !bg-gray-100 !text-gray-500 whitespace-pre-wrap"
			style="font-size: 12px;"
		>
			{@html mailDisclaimer}
		</div>

		{#if !$activePlan}
			<div class="flex items-center gap-1 px-2 py-1 text-sm text-blue-500 bg-blue-50">
				<span class="text-base material-icons"> star </span>

				<p>
					{$t('invoiceEmailModal.editOnlyForPlus')}
				</p>
			</div>
		{/if}

		<Labeled label={$t('invoiceEmailModal.attachment')}>
			<a
				class="flex items-center gap-3 p-2 border border-gray-300 bg-gray-50 hover:bg-gray-100 w-max hover:text-blue-600"
				href={getDownloadUrl(invoice.id)}
				target="_blank"
			>
				<div class="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-md">
					<span class="material-icons">description</span>
				</div>
				<div class="pr-4 font-medium">
					{invoice.invoiceNumber}.pdf
				</div>
			</a>
		</Labeled>
	</div>

	<div class="flex justify-end gap-4 mt-6">
		<Button on:click={() => dispatch('exit')} gray class="mt-6">{$t('general.cancel')}</Button>
		<Button on:click={sendMail} loading={loadingSend} class="mt-6">
			{$t(finalizeBeforeSend ? 'invoiceEmailModal.sendAndFinalize' : 'invoiceEmailModal.send')}
		</Button>
	</div>
</BasicModal>
