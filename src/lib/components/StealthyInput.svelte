<script lang="ts">
	export let value: number | string = ''

	export let type: 'text' | 'number' | 'textarea' = 'text'

	let inputElement: HTMLInputElement | HTMLTextAreaElement

	let hovered = false

	export function focus() {
		inputElement.focus()
	}
</script>

<div class="relative" class:hovered>
	<span class="invisible whitespace-nowrap">&nbsp;{value}</span>
	{#if type === 'number'}
		<input class="pure" on:focus on:blur bind:this={inputElement} type="number" bind:value />
	{:else if type === 'textarea'}
		<textarea class="pure" on:focus on:blur bind:this={inputElement} bind:value />
	{:else}
		<input class="pure" on:focus on:blur bind:this={inputElement} type="text" bind:value />
	{/if}
	<!-- <div
		class="absolute -inset-10 bg-red-500 bg-opacity-50"
		on:mouseenter={() => (hovered = true)}
		on:mouseleave={() => (hovered = false)}
	/> -->
</div>

<style lang="scss">
	input,
	textarea {
		// border-radius: 4px;
		transition: border-color 100ms ease-in-out;
		@apply absolute inset-0 border-transparent;
		padding-left: 5px;
		margin-left: -5px;
	}

	.hovered input,
	input:hover,
	input:focus,
	.hovered textarea,
	textarea:hover,
	textarea:focus {
		margin-left: -6px;
		@apply border border-gray-300;
	}
</style>
