<script lang="ts">
	import { cloneDeep } from 'lodash'
	import { formatClientName } from '../../../../../shared/client-formatter'
	import Button from '../../../lib/components/basics/Button.svelte'
	import type { EditorSelection } from '../../../lib/components/basics/EditorModal.svelte'
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte'
	import ClientEditorModal from '../../../lib/components/editors/ClientEditorModal.svelte'
	import { createClientQuery } from '../../../lib/controller/client'
	import { createUserSettingsQuery } from '../../../lib/controller/user-settings'
	import { t } from '../../../lib/stores/settings'
	import { trpc, type CreateClient } from '../../../lib/trpcClient'
	import { emptyClient } from '../../../lib/utils/clientUtils'

	const userSettings = createUserSettingsQuery()
	const clients = createClientQuery()

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

{#if $clients.isLoading}
	<Skeleton class="w-24 h-12" />
{:else if $clients.isError}
	<span>{$t('general.error')}</span>
{:else if $clients.data.length === 0}
	<span>{$t('clientEditor.noneFound')}</span>
{:else}
	{#each $clients.data as client}
		<div
			class="w-full p-2 mt-2 rounded-sm cursor-pointer xs:w-72 bg-slate-200 hover:bg-slate-300"
			on:click={() => selectClient(client.id)}
		>
			<h3 class="text-lg font-semibold">
				{formatClientName(client)}
			</h3>
		</div>
	{/each}
{/if}