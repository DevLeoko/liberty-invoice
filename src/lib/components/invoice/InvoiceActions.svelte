<script>
	import { createEventDispatcher } from 'svelte'
	import Button from '../Button.svelte'

	export let preview = false

	const dispatchEvent = createEventDispatcher()
</script>

<div class="flex">
	<Button class="mr-2" on:click={() => (preview = !preview)}>
		{#if !preview}
			Preview
		{:else}
			<span class="material-icons text-base mr-1">edit</span> Edit
		{/if}
	</Button>
	<Button on:click={() => dispatchEvent('download')}>
		<span class="material-icons text-base">download</span>
	</Button>
</div>
