<script lang="ts">
	import { tick } from 'svelte'

	export let prefix: string = ''
	export let value: number = 0

	let focused = false
	let inputElement: HTMLInputElement

	$: formattedValue = `${prefix}${value.toFixed(2)}`

	function focus() {
		focused = true
		tick().then(() => inputElement.focus())
	}
</script>

{#if focused}
	<input type="number" bind:value bind:this={inputElement} on:blur={() => (focused = false)} />
{:else}
	<input
		type="text"
		class="pr-3"
		on:focus={focus}
		value={formattedValue}
		on:keydown|preventDefault
	/>
{/if}
