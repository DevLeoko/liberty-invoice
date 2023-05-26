<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'

	const dispatch = createEventDispatcher<{ clickOutside: MouseEvent }>()

	let el: HTMLDivElement

	export let preferBottom = false

	let placeBottom = false
	let placeLeft = false
	onMount(() => {
		const { left, top, width, height } = el.getBoundingClientRect()
		const windowWidth = window.innerWidth

		if (preferBottom) {
			// Is enough space below?
			if (top + height <= window.innerHeight) {
				placeBottom = true
			}
		} else if (top < 0) {
			placeBottom = true
		}

		if (left + width > windowWidth) {
			placeLeft = true
		}
	})

	function onBodyClick(event: MouseEvent) {
		// Check if the click was outside the card
		if (!el.contains(event.target as Node)) {
			dispatch('clickOutside', event)
		}
	}

	let className = ''

	export { className as class }
</script>

<svelte:body on:click={onBodyClick} />

<div
	class="absolute z-20 flex items-center px-3 py-2 my-1 text-black bg-white rounded-md shadow-sm w-max {className}"
	class:top-full={placeBottom}
	class:bottom-full={!placeBottom}
	class:right-0={placeLeft}
	class:left-0={!placeLeft}
	bind:this={el}
	on:click|stopPropagation
>
	<slot />
</div>
