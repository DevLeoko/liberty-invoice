<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	export let value = false

	const dispatch = createEventDispatcher<{ test: string }>()
</script>

<button on:click={() => (value = !value)} class="uppercase">
	{value ? 'on' : 'off'}
</button>
