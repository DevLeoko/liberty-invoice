<script lang="ts">
	import { useQueryClient } from '@tanstack/svelte-query'
	import { logSuccess } from '../../stores/alerts'
	import { type CreateClient, trpc } from '../../trpcClient'
	import type { EditorSelection } from '../basics/EditorModal.svelte'
	import EditorModal from '../basics/EditorModal.svelte'
	import ClientEditor from './ClientEditor.svelte'
	import { CLIENT_KEYS } from '../../tanQuery'

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

				queryClient.invalidateQueries(CLIENT_KEYS.read(selected.id))
			}

			queryClient.invalidateQueries(CLIENT_KEYS.list())
			selected = null
		}
	}
</script>

<EditorModal editor={ClientEditor} name="clientEditorModal" bind:selected {onSave} />
