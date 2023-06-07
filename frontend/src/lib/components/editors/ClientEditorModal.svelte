<script lang="ts">
	import { useQueryClient } from '@tanstack/svelte-query'
	import { logSuccess } from '../../stores/settings'
	import { CLIENT_KEYS } from '../../tanQuery'
	import { trpc, type CreateClient } from '../../trpcClient'
	import type { EditorSelection } from '../basics/EditorModal.svelte'
	import EditorModal from '../basics/EditorModal.svelte'
	import ClientEditor from './ClientEditor.svelte'

	const queryClient = useQueryClient()

	export let selected: EditorSelection<CreateClient> = null

	async function onSave() {
		if (selected) {
			if (selected.id === undefined) {
				await trpc.client.create.mutate(selected.entity)
				$logSuccess('clientEditorModal.created')
			} else {
				await trpc.client.update.mutate({ id: selected.id, client: selected.entity })
				$logSuccess('clientEditorModal.updated')

				queryClient.invalidateQueries(CLIENT_KEYS.read(selected.id))
			}

			queryClient.invalidateQueries(CLIENT_KEYS.list())
			selected = null
		}
	}
</script>

<EditorModal editor={ClientEditor} name="clientEditorModal" bind:selected {onSave} />
