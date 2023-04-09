<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import { createEventDispatcher } from 'svelte';

	let el: HTMLDivElement;

	let placeBottom = false;
	let placeLeft = false;
	onMount(() => {
		const { left, top, width } = el.getBoundingClientRect();
		const windowWidth = window.innerWidth;

		if (top < 0) {
			placeBottom = true;
		}

		if (left + width > windowWidth) {
			placeLeft = true;
		}
	});

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

<div
	class="absolute z-20 flex items-center px-3 py-2 my-1 text-black bg-white rounded-md shadow-sm w-max"
	class:top-full={placeBottom}
	class:bottom-full={!placeBottom}
	class:right-0={placeLeft}
	class:left-0={!placeLeft}
	bind:this={el}
	on:click|stopPropagation={() => {
		console.log('click prev');
	}}
>
	<div class="mr-4">Are you sure?</div>
	<Button snug red class="mr-2" on:click={handleYes}>Yes</Button>
	<Button snug gray on:click={handleNo}>Cancel</Button>
</div>
