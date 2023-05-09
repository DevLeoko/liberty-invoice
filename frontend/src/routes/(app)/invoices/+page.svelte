<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '../../../lib/components/basics/Button.svelte';

	function createNew() {
		// TODO: change button to link
		goto('/invoices/new');
	}
</script>

<div class="flex justify-between mb-4">
	<h1 class="pageTitle">Invoices</h1>
	<Button on:click={createNew}><span class="mr-1 material-icons">add</span> New invoice</Button>
</div>
