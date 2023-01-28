<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'

	export let open = false

	const dispatchEvent = createEventDispatcher()

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			dispatchEvent('exit')
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown)

		return () => {
			document.removeEventListener('keydown', handleKeydown)
		}
	})
</script>

{#if open}
	<div
		class="flex justify-center items-center w-screen h-screen fixed z-40 bg-blur left-0 top-0"
		on:click|self={() => dispatchEvent('exit')}
		on:keydown={handleKeydown}
	>
		<slot />
	</div>
{/if}

<style>
	.bg-blur {
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
	}
</style>
