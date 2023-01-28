<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let items: any[]
	export let selected: any

	export let allowCreate = false

	const dispatch = createEventDispatcher()
</script>

<div class="vertialSelector">
	{#each items as item}
		{@const active = JSON.stringify(item) === JSON.stringify(selected)}
		<div class="item" on:click={() => (selected = item)} class:active>
			<slot {item} {selected} />
			<!-- <div class="actions">
				<span class="material-icons action mr-2" on:click={() => startEdit(i)}>edit</span>
				<span class="material-icons action" on:click={() => deleteClient(i)}>delete</span>
			</div> -->
		</div>
	{/each}
	{#if allowCreate}
		<div class="item" on:click={() => dispatch('create')}>
			<h3 class="text-2xl font-bold pb-1">+</h3>
		</div>
	{/if}
</div>
