<script lang="ts">
	import Button from './Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import FloatingCard from './FloatingCard.svelte';

	const dispatchEvent = createEventDispatcher<{
		confirm: MouseEvent;
		cancel: MouseEvent;
	}>();

	function handleYes(event: CustomEvent<MouseEvent>) {
		event.stopPropagation();
		dispatchEvent('confirm', event.detail);
	}

	function handleNo(event: CustomEvent<MouseEvent>) {
		event.stopPropagation();
		dispatchEvent('cancel', event.detail);
	}
</script>

<FloatingCard>
	<div class="mr-4">Are you sure?</div>
	<Button snug red class="mr-2" on:click={handleYes}>Yes</Button>
	<Button snug gray on:click={handleNo}>Cancel</Button>
</FloatingCard>
