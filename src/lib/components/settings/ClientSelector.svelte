<script lang="ts">
	import { clients, type ClientDetails } from '../../utils/Client'
	import BasicModal from '../BasicModal.svelte'
	import Button from '../Button.svelte'
	import ClientEditor from '../editor/ClientEditor.svelte'

	export let selected: ClientDetails

	const NEW_CLIENT: ClientDetails = {
		address: {}
	}

	function startCreate() {
		editClient = {
			editIndex: null,
			client: JSON.parse(JSON.stringify(NEW_CLIENT))
		}
	}

	function startEdit(index: number) {
		editClient = {
			editIndex: index,
			client: JSON.parse(JSON.stringify($clients[index]))
		}
	}

	function saveChanges() {
		if (editClient!.editIndex == null) {
			$clients = [...$clients, editClient!.client]
		} else {
			$clients = $clients.map((client, i) =>
				i === editClient!.editIndex ? editClient!.client : client
			)
		}
		editClient = null
	}

	function deleteClient(index: number) {
		$clients = $clients.filter((_, i) => i !== index)
	}

	let editClient: { editIndex: number | null; client: ClientDetails } | null = null
</script>

{#if editClient}
	<BasicModal open on:exit={() => (editClient = null)}>
		<svelte:fragment slot="title">
			{editClient.editIndex == null ? 'Create new client' : 'Edit client'}
		</svelte:fragment>
		<ClientEditor client={editClient.client} />
		<svelte:fragment slot="action">
			<Button on:click={() => (editClient = null)}>Cancel</Button>
			<Button on:click={saveChanges} class="ml-2">Save</Button>
		</svelte:fragment>
	</BasicModal>
{/if}

<div class="vertialSelector">
	{#each $clients as client, i}
		{@const isSelected = JSON.stringify(client) === JSON.stringify(selected)}
		<div class="item group" on:click={() => (selected = client)} class:border-2={isSelected}>
			<h3 class="text-lg">{client.shorthand}</h3>
			<div class="actions">
				<span class="material-icons action mr-2" on:click={() => startEdit(i)}>edit</span>
				<span class="material-icons action" on:click={() => deleteClient(i)}>delete</span>
			</div>
		</div>
	{/each}
	<div class="item" on:click={startCreate}>
		<h3 class="text-2xl font-bold pb-1">+</h3>
	</div>
</div>

<style>
</style>
