<script lang="ts">
	import type { EditorSelection } from '$lib/utils/EditorSelection'
	import { formatClientName } from '../../../../shared/client-formatter'
	import { createClientQuery } from '../controller/client'
	import { createUserSettingsQuery } from '../controller/user-settings'
	import { t } from '../stores/settings'
	import type { CreateClient } from '../trpcClient'
	import { emptyClient } from '../utils/clientUtils'
	import Skeleton from './basics/Skeleton.svelte'
	import ClientEditorModal from './editors/ClientEditorModal.svelte'

	export let clientId: string | null

	let createClient: EditorSelection<CreateClient> = null
	let userSettings = createUserSettingsQuery()

	function startCreate() {
		if (!$userSettings.data) return
		// clientId = null
		createClient = {
			entity: emptyClient($userSettings.data),
		}
	}

	$: {
		if (clientId != null) {
			createClient = null
		}
	}

	const clients = createClientQuery()
</script>

<ClientEditorModal bind:selected={createClient} />

<div class="overflow-x-auto">
	<div class="flex min-w-fit">
		{#if $clients.isLoading || $clients.isError}
			<Skeleton class="w-16 h-16" />
		{:else}
			<div
				class="flex flex-col items-center justify-center w-16 h-16 mr-2 text-blue-500 border rounded-md cursor-pointer bg-opacity-70"
				class:bg-blue-100={createClient !== null}
				class:bg-white={createClient === null}
				on:click={startCreate}
			>
				<span class="material-icons">add</span>
				<span class="-mt-1 text-xs">{$t('invoiceEditor.create')}</span>
			</div>
			{#each $clients.data as client}
				<div
					class="flex items-center justify-center w-16 h-16 mr-2 border rounded-md cursor-pointer bg-opacity-70"
					class:border-opacity-20={client.id === clientId}
					class:bg-blue-100={client.id === clientId}
					class:bg-white={client.id !== clientId}
					class:text-blue-500={client.id === clientId}
					class:text-gray-600={client.id !== clientId}
					on:click={() => (clientId = client.id)}
				>
					<span
						class="font-semibold text-center overflow-hidden {!client.shorthand ? 'text-xs' : ''}"
						>{client.shorthand || formatClientName(client)}</span
					>
				</div>
			{/each}
		{/if}
	</div>
</div>
