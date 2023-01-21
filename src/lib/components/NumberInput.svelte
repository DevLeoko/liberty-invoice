<script lang="ts">
	import { tick } from 'svelte'
	import StealthyInput from './StealthyInput.svelte'

	export let formatted: string
	export let value: number = 0

	let focused = false
	let inputElement: StealthyInput

	function focus() {
		focused = true
		tick().then(() => inputElement.focus())
	}
</script>

{#if focused}
	<StealthyInput
		type="number"
		bind:value
		bind:this={inputElement}
		on:blur={() => (focused = false)}
	/>
{:else}
	<StealthyInput type="text" bind:this={inputElement} on:focus={focus} value={formatted} />
{/if}
