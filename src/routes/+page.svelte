<script lang="ts" context="module">
</script>

<script lang="ts">
	import Invoice from '../lib/components/invoice/Invoice.svelte'

	import LanguageSelector from '../lib/components/LanguageSelector.svelte'
	import SettingsBar from '../lib/components/settings/SettingsBar.svelte'
	import { activeInvoice } from '../lib/utils/Invoice'
</script>

<div class="flex">
	<div class="bg-stone-200 w-64 p-4 h-screen">
		<SettingsBar />
	</div>
	<div class="flex-grow flex items-center justify-center">
		<Invoice bind:invoice={$activeInvoice} />
	</div>
</div>

<div class="absolute right-2 top-2">
	<LanguageSelector />
</div>
