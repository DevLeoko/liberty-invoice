<script lang="ts">
	import ClientCard from '$lib/components/clients/ClientCard.svelte'
	import type { EditorSelection } from '$lib/utils/EditorSelection'
	import { cloneDeep, debounce } from 'lodash'
	import Button from '../../../lib/components/basics/Button.svelte'
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte'
	import ClientEditorModal from '../../../lib/components/editors/ClientEditorModal.svelte'
	import { createClientQuery } from '../../../lib/controller/client'
	import { createUserSettingsQuery } from '../../../lib/controller/user-settings'
	import { t } from '../../../lib/stores/settings'
	import { trpc, type CreateClient } from '../../../lib/trpcClient'
	import { emptyClient } from '../../../lib/utils/clientUtils'

	let searchQuery = ''
	let viewArchived = false
	let debouncedSearchQuery = ''

	const updateDebouncedSearchQuery = debounce((value: string) => {
		debouncedSearchQuery = value
	}, 300)

	$: updateDebouncedSearchQuery(searchQuery)

	const userSettings = createUserSettingsQuery()
	$: clients = createClientQuery({ search: debouncedSearchQuery, isArchived: viewArchived })

	let selected: EditorSelection<CreateClient> = null

	function startCreate() {
		const defaults = $userSettings.data
		if (!defaults) return

		selected = {
			entity: emptyClient(defaults),
		}
	}

	async function selectClient(id: string) {
		// TODO: add load indicator
		const client = await trpc.client.read.query({ id })
		selected = {
			id,
			entity: cloneDeep(client),
		}
	}
</script>

<ClientEditorModal bind:selected />

<PageTitle title={$t('menu.clients')}>
	{#if $userSettings.isLoading}
		<Skeleton class="h-9 w-36" />
	{:else}
		<Button on:click={startCreate}
			><span class="mr-1 material-icons">add</span> {$t('clientEditorModal.create')}</Button
		>
	{/if}
</PageTitle>

<div class="flex flex-col gap-4 max-w-[800px]">
	<div class="flex gap-2">
		<div class="relative flex-grow">
			<span class="absolute inset-y-0 left-0 flex items-center pl-2">
				<span class="text-lg material-icons">search</span>
			</span>
			<input
				type="text"
				bind:value={searchQuery}
				class="!pl-8"
				placeholder="Search by name, company or shorthand"
			/>
		</div>

		<Button on:click={() => (viewArchived = !viewArchived)} gray outlined>
			{viewArchived ? $t('client.showActive') : $t('client.showArchived')}
		</Button>
	</div>

	{#if $clients.isLoading}
		<Skeleton class="w-24 h-12" />
	{:else if $clients.isError}
		<span>{$t('general.error')}</span>
	{:else if $clients.data.length === 0}
		<span>{$t('clientEditor.noneFound')}</span>
	{:else}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each $clients.data as client (client.id)}
				<ClientCard {client} on:click={() => selectClient(client.id)} />
			{/each}
		</div>
	{/if}
</div>
