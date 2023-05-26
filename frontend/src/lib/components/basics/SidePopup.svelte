<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'

	export let zLevel = 40

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

	let className = ''

	export { className as class }
</script>

<div
	class="fixed top-0 left-0 flex items-stretch justify-end w-screen h-screen bg-blur"
	style:z-index={zLevel}
	on:click|self={() => dispatchEvent('exit')}
	on:keydown={handleKeydown}
>
	<div class="flex flex-col p-6 pt-4 bg-white rounded-l-lg {className}">
		<slot />
	</div>
</div>

<style>
	.bg-blur {
		background: rgba(0, 0, 0, 0.2);
		/* backdrop-filter: blur(2px); */
	}
</style>
