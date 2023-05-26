<script lang="ts">
	import { trpc, type CreateClient } from '../../../lib/trpcClient';
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte';
	import Button from '../../../lib/components/basics/Button.svelte';
	import { emptyClient } from '../../../lib/utils/clientUtils';
	import type { EditorSelection } from '../../../lib/components/basics/EditorModal.svelte';
	import { createClientQuery, createUserSettingsQuery } from '../../../lib/tanQuery';
	import ClientEditorModal from '../../../lib/components/editors/ClientEditorModal.svelte';
	import { t } from '../../../lib/stores/settings';

	const userSettings = createUserSettingsQuery();
	const clients = createClientQuery();

	let selected: EditorSelection<CreateClient> = null;

	function startCreate() {
		const defaults = $userSettings.data;
		if (!defaults) return;

		selected = {
			entity: emptyClient(defaults)
		};
	}

	async function selectClient(id: number) {
		// TODO: add load indicator
		const client = await trpc.client.read.query({ id });
		selected = {
			id,
			entity: client
		};
	}
</script>

<ClientEditorModal bind:selected />

<div class="flex justify-between mb-4">
	<h1 class="pageTitle">{$t('menu.clients')}</h1>
	{#if $userSettings.isLoading}
		<Skeleton class="h-9 w-36" />
	{:else}
		<Button on:click={startCreate}
			><span class="mr-1 material-icons">add</span> {$t('clientEditorModal.create')}</Button
		>
	{/if}
</div>

{#if $clients.isLoading}
	<Skeleton class="w-24 h-12" />
{:else if $clients.isError}
	<span>{$t('general.error')}</span>
{:else if $clients.data.length === 0}
	<span>{$t('clientEditor.noneFound')}</span>
{:else}
	{#each $clients.data as client}
		<div
			class="h-16 p-2 mt-2 rounded-sm cursor-pointer w-36 bg-slate-300 hover:bg-slate-400"
			on:click={() => selectClient(client.id)}
		>
			<h3 class="text-lg font-semibold">
				{client.name}
			</h3>
		</div>
	{/each}
{/if}
