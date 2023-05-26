<script lang="ts">
	import { useQueryClient } from '@tanstack/svelte-query'
	import { logSuccess } from '../../stores/alerts'
	import { CLIENTS_KEY } from '../../tanQuery'
	import { type CreateClient, trpc } from '../../trpcClient'
	import type { EditorSelection } from '../basics/EditorModal.svelte'
	import EditorModal from '../basics/EditorModal.svelte'
	import ClientEditor from './ClientEditor.svelte'

	const queryClient = useQueryClient()

	export let selected: EditorSelection<CreateClient> = null

	async function onSave() {
		if (selected) {
			if (selected.id === undefined) {
				await trpc.client.create.mutate(selected.entity)
				logSuccess('clients.created')
			} else {
				await trpc.client.update.mutate({ id: selected.id, client: selected.entity })
				logSuccess('clients.updated')
			}
			selected = null
			queryClient.invalidateQueries([CLIENTS_KEY])
		}
	}
</script>

<EditorModal editor={ClientEditor} name="clientEditorModal" bind:selected {onSave} />
