<script lang="ts">
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { trpc, type CreateClient } from '../../../lib/trpcClient';
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte';
	import Button from '../../../lib/components/basics/Button.svelte';
	import ClientEditor from '../../../lib/components/editors/ClientEditor.svelte';
	import { emptyClient } from '../../../lib/utils/clientUtils';
	import type { EditorSelection } from '../../../lib/components/basics/EditorModal.svelte';
	import EditorModal from '../../../lib/components/basics/EditorModal.svelte';
	import { logSuccess } from '../../../lib/stores/alerts';

	const client = useQueryClient();

	const clients = createQuery({
		queryKey: ['clients'],
		queryFn: () => trpc.client.list.query()
	});

	let selected: EditorSelection<CreateClient> = null;

	function startCreate() {
		selected = {
			entity: emptyClient({
				defaultCurrency: 'EUR',
				defaultLanguage: 'en',
				defaultTaxRateId: null,
				defaultDueDays: 30
			})
		};
	}

	async function onSave() {
		if (selected) {
			if (selected.id === undefined) {
				await trpc.client.create.mutate(selected.entity);
				logSuccess('clients.created');
			} else {
				await trpc.client.update.mutate({ id: selected.id, client: selected.entity });
				logSuccess('clients.updated');
			}
			selected = null;
			client.invalidateQueries(['clients']);
		}
	}
</script>

<EditorModal editor={ClientEditor} name="Client" bind:selected {onSave} />

<div class="flex justify-between">
	<h1 class="pageTitle">Clients</h1>
	<Button on:click={startCreate}><span class="mr-1 material-icons">add</span> New client</Button>
</div>

{#if $clients.isLoading}
	<Skeleton height="50px" />
{:else if $clients.isError}
	<span>Something went wrong</span>
{:else if $clients.data.length === 0}
	<div class="error">No clients found</div>
{:else}
	{#each $clients.data as client}
		<div>{client.name}</div>
	{/each}
{/if}
