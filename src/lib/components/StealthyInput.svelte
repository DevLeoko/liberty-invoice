<script lang="ts">
	export let value: number | string = ''

	export let type: 'text' | 'number' = 'text'

	let inputElement: HTMLInputElement

	let hovered = false

	export function focus() {
		inputElement.focus()
	}
</script>

<div class="relative" class:hovered>
	<span class="invisible whitespace-nowrap">&nbsp;{value}</span>
	{#if type === 'number'}
		<input on:focus on:blur bind:this={inputElement} type="number" bind:value />
	{:else}
		<input on:focus on:blur bind:this={inputElement} type="text" bind:value />
	{/if}
	<!-- <div
		class="absolute -inset-10 bg-red-500 bg-opacity-50"
		on:mouseenter={() => (hovered = true)}
		on:mouseleave={() => (hovered = false)}
	/> -->
</div>

<style lang="scss">
	input {
		// border-radius: 4px;
		transition: border-color 100ms ease-in-out;
		@apply absolute inset-0 border-transparent;
		padding-left: 5px;
		margin-left: -5px;
	}

	.hovered input,
	input:hover,
	input:focus {
		margin-left: -6px;
		@apply border border-gray-300;
	}
</style>
