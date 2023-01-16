<script lang="ts">
	import { elementToPdf } from '@leoko/html2pdf-browser'
	import { flip } from 'svelte/animate'
	import InvoiceItemList from '../lib/components/InvoiceItemList.svelte'
	import InvoiceItemRow from '../lib/components/InvoiceItemRow.svelte'
	import LightPulse from '../lib/components/LightPulse.svelte'
	import { SAMPLE_INVOICE_ITEMS } from '../lib/utils/InvoiceItem'

	let invoiceItems = SAMPLE_INVOICE_ITEMS
	$: sum = invoiceItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)

	let showHints = false
	let timeout: ReturnType<typeof setTimeout> | null = null
	function movedCursor() {
		showHints = true
		if (timeout) clearTimeout(timeout)

		timeout = setTimeout(() => {
			showHints = false
		}, 2500)
	}

	let wrapper: HTMLElement
	function print() {
		elementToPdf(wrapper).then((doc) => doc.open())
	}
</script>

<div
	style="width: 210mm; height: 297mm; color: #4F5A69; box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.3); font-family: 'Roboto', sans-serif;"
	class="m-4 p-10 mx-auto relative"
	on:pointermove={movedCursor}
>
	<header class="flex justify-between">
		<div>
			<h1 class="text-3xl">Invoice</h1>
			<div class="flex mt-4">
				<div>
					<p>Invoice number</p>
					<p>Date of issue</p>
					<p>Date due</p>
				</div>

				<div class="ml-2 font-medium relative">
					<p>
						LEX-01 {#if showHints} <LightPulse /> {/if}
					</p>
					<p>
						Nov 12, 2019 {#if showHints} <LightPulse /> {/if}
					</p>
					<p>
						Dec 12, 2019 {#if showHints} <LightPulse /> {/if}
					</p>
				</div>
			</div>
		</div>
		<img src="example-logo.svg" class="h-16" alt="" />
	</header>

	<div class="flex justify-between mt-8 leading-tight">
		<div>
			<b class="leading-normal"
				>Billed to {#if showHints} <LightPulse /> {/if}</b
			>
			<p>SomeComp GmbH.</p>
			<p>c/o Tom Müller</p>
			<p>Sample street 23</p>
			<p>343D Washington</p>
			<p>US</p>
			<p>tom@some-comp.com</p>
		</div>

		<div>
			<b class="leading-normal">Respark</b>
			<p>Operating as Freelancer</p>
			<p>Leo Garbe</p>
			<p>Sesamstr. 111</p>
			<p>76133 Karlsruhe</p>
			<p>Germany</p>
			<p>contact@respark.dev</p>
		</div>
	</div>

	<h2 class="text-2xl font-medium mt-8">USD {sum.toFixed(2)} due December 12, 2019</h2>
	{#if showHints}
		<div class="absolute -ml-2 ">
			<LightPulse />
		</div>
	{/if}
	<p class="mt-1">Software development 01.01.2023 - 30.01.2023</p>

	<table class="w-full mt-5 invoiceTable">
		<tr class="borderline">
			<th />
			<th>Item</th>
			<th>Qty</th>
			<th>Unit price</th>
			<th>Amount</th>
			<th />
		</tr>
		<InvoiceItemList items={invoiceItems} />
		<tbody>
			<tr>
				<td colspan="3" class="bg-white" />
				<td>Subtotal</td>
				<td class="text-right">${sum.toFixed(2)}</td>
				<td />
			</tr>
			<tr>
				<td colspan="3" class="bg-white" />
				<td colspan="3" class="!text-left"
					>Tax be paid on reverse change basis {#if showHints} <LightPulse /> {/if}</td
				>
				<td />
			</tr>
			<tr class="bg-gray-300 font-semibold">
				<td colspan="3" class="bg-white" />
				<td>Total</td>
				<td class="text-right">${sum.toFixed(2)}</td>
				<td />
			</tr>
		</tbody>
	</table>
</div>
