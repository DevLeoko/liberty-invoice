<script lang="ts">
	import SearchInput from '$lib/components/basics/SearchInput.svelte'
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
	export let searchMode: boolean = false

	let searchQuery = ''

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

	$: clients = createClientQuery(searchMode ? { search: searchQuery } : {}, 10)
</script>

<ClientEditorModal bind:selected={createClient} />

{#if searchMode}
	<div class="flex flex-col gap-2">
		<SearchInput
			bind:value={searchQuery}
			placeholder="client.searchPlaceholder"
			class="flex-grow"
		/>
		{#if $clients.isLoading || $clients.isError}
			<Skeleton class="w-full h-6" />
		{:else}
			{#each $clients.data.pages.flatMap((page) => page.results) as client}
				{@const clientName = formatClientName(client)}
				<div
					class="px-2 py-0.5 border rounded-md cursor-pointer bg-opacity-70"
					class:border-opacity-20={client.id === clientId}
					class:bg-blue-100={client.id === clientId}
					class:bg-white={client.id !== clientId}
					class:text-blue-500={client.id === clientId}
					class:text-gray-600={client.id !== clientId}
					on:click={() => (clientId = client.id)}
				>
					<div class="flex gap-1 overflow-hidden font-semibold">
						{#if client.shorthand}
							<div class="font-mono tracking-wider min-w-10">
								{client.shorthand}
							</div>
						{/if}
						<div>
							{clientName}
						</div>
						{#if client.isFavorite}
							<span class="ml-auto text-lg text-blue-500 opacity-50 material-icons"> star </span>
						{/if}
					</div>
				</div>
			{/each}
			<div
				class="px-2 py-0.5 flex items-center gap-1 text-blue-500 border rounded-md cursor-pointe bg-opacity-70"
				class:bg-blue-100={createClient !== null}
				class:bg-white={createClient === null}
				on:click={startCreate}
			>
				<span class="text-base material-icons">add</span>
				<span class="text-sm">{$t('invoiceEditor.create')}</span>
			</div>
		{/if}
	</div>
{:else}
	<div class="overflow-x-auto">
		<div class="flex gap-2 min-w-fit">
			{#if $clients.isLoading || $clients.isError}
				<Skeleton class="w-16 h-16" />
			{:else}
				<div
					class="flex flex-col items-center justify-center w-16 h-16 text-blue-500 border rounded-md cursor-pointer bg-opacity-70"
					class:bg-blue-100={createClient !== null}
					class:bg-white={createClient === null}
					on:click={startCreate}
				>
					<span class="material-icons">add</span>
					<span class="-mt-1 text-xs">{$t('invoiceEditor.create')}</span>
				</div>
				{#each $clients.data.pages.flatMap((page) => page.results) as client}
					<div
						class="flex items-center justify-center w-16 h-16 border rounded-md cursor-pointer bg-opacity-70"
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
{/if}
