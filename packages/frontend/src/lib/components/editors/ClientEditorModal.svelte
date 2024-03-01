<script lang="ts">
	import type { EditorSelection } from '$lib/utils/EditorSelection'
	import {
		createClientCreateMutation,
		createClientDeleteMutation,
		createClientUpdateMutation,
	} from '../../controller/client'
	import type { CreateClient } from '../../trpcClient'
	import EditorModal from '../basics/EditorModal.svelte'
	import ClientEditor from './ClientEditor.svelte'

	export let selected: EditorSelection<CreateClient> = null

	const updateClient = createClientUpdateMutation()
	const createClient = createClientCreateMutation()
	const deleteClient = createClientDeleteMutation()

	async function onSave() {
		if (selected) {
			if (selected.id === undefined) {
				await createClient(selected.entity)
			} else {
				await updateClient({ id: selected.id, client: selected.entity })
			}
		}
	}

	async function onDelete() {
		if (selected && selected.id !== undefined) {
			await deleteClient({ id: selected.id })
		}
	}
</script>

<EditorModal editor={ClientEditor} name="clientEditorModal" bind:selected {onSave} {onDelete} />
