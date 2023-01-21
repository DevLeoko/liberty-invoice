<script lang="ts" context="module">
</script>

<script lang="ts">
	import Invoice from '../lib/components/invoice/Invoice.svelte'

	import LanguageSelector from '../lib/components/LanguageSelector.svelte'
	import { SAMPLE_INVOICE } from '../lib/utils/Invoice'

	let preview = false
</script>

<div class="absolute right-2 top-2">
	<LanguageSelector />

	<!-- Toggle preview checkbox -->
	<label class="flex items-center mt-2 select-none">
		<input type="checkbox" bind:checked={preview} />
		<span class="ml-2 text-gray-700">Preview</span>
	</label>
</div>

<Invoice invoice={SAMPLE_INVOICE} />
