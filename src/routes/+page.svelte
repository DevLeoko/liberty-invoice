<script lang="ts" context="module">
</script>

<script lang="ts">
	import Invoice from '../lib/components/invoice/Invoice.svelte'
	import InvoiceActions from '../lib/components/invoice/InvoiceActions.svelte'

	import LanguageSelector from '../lib/components/LanguageSelector.svelte'
	import SettingsBar from '../lib/components/settings/SettingsBar.svelte'
	import { locale } from '../lib/utils/i18n'
	import { activeInvoice } from '../lib/utils/Invoice'
	import { elementToPdf } from '@leoko/html2pdf-browser'
	import { tick } from 'svelte'
	import Modal from '../lib/components/Modal.svelte'
	import Button from '../lib/components/Button.svelte'
	import { sleep } from '../lib/utils/general'

	let preview = false
	let invoiceContainer: HTMLElement | null = null

	let loadingPdf = false

	async function download() {
		const prevPreview = preview
		preview = true
		loadingPdf = true

		await tick()
		await sleep(3000)
		const pdf = await elementToPdf(invoiceContainer!)
		pdf.open()

		loadingPdf = false
		preview = prevPreview
	}
</script>

<div class="z-80">
	<Modal open={loadingPdf}>
		<Button loading outlined disabled>loading pdf...</Button>
	</Modal>
</div>

<div class="flex">
	<div class="w-64 h-screen relative">
		<div class="w-64 h-screen fixed inset-0 p-4 fancy-gradient overflow-y-auto z-30">
			<SettingsBar />
		</div>
	</div>
	<div class="flex-grow flex flex-col items-center justify-center">
		<div class="flex flex-col">
			<div class="mb-4 self-end">
				<InvoiceActions bind:preview on:download={download} />
			</div>
			<Invoice bind:invoice={$activeInvoice} {preview} bind:invoiceContainer />
		</div>
	</div>
</div>

<div class="absolute right-2 top-2">
	App language
	<LanguageSelector bind:selected={$locale} />
</div>

<style>
	.fancy-gradient {
		background: linear-gradient(55deg, rgba(216, 228, 255, 0.6), rgba(243, 244, 246, 0.7));
	}
</style>
