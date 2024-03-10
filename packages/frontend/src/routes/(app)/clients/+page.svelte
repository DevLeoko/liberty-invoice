<script lang="ts">
	import SearchInput from '$lib/components/basics/SearchInput.svelte'
	import ClientCard from '$lib/components/clients/ClientCard.svelte'
	import type { EditorSelection } from '$lib/utils/EditorSelection'
	import { cloneDeep, debounce } from 'lodash'
	import Button from '../../../lib/components/basics/Button.svelte'
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte'
	import ClientEditorModal from '../../../lib/components/editors/ClientEditorModal.svelte'
	import { createDetailedClientQuery } from '../../../lib/controller/client'
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
	$: clients = createDetailedClientQuery(
		{ search: debouncedSearchQuery, isArchived: viewArchived },
		12
	)

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
		<SearchInput
			bind:value={searchQuery}
			placeholder="client.searchPlaceholder"
			class="flex-grow"
		/>

		<Button
			on:click={() => (viewArchived = !viewArchived)}
			gray={!viewArchived}
			outlined
			class="min-w-36"
		>
			{viewArchived ? $t('client.showActive') : $t('client.showArchived')}
		</Button>
	</div>

	{#if $clients.isLoading}
		<Skeleton class="w-24 h-12" />
	{:else if $clients.isError}
		<span>{$t('general.error')}</span>
	{:else if $clients.data.pages.length === 0}
		<span>{$t('clientEditor.noneFound')}</span>
	{:else}
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
			{#key viewArchived}
				{#each $clients.data.pages.flatMap((p) => p.results) as client (client.id)}
					<ClientCard {client} on:click={() => selectClient(client.id)} />
				{/each}
			{/key}
		</div>

		{#if $clients.hasNextPage}
			<Button on:click={() => $clients.fetchNextPage()} outlined>{$t('general.loadMore')}</Button>
		{/if}
	{/if}
</div>
