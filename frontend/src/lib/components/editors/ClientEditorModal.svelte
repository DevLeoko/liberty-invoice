<script lang="ts">
	import { createClientCreateMutation, createClientUpdateMutation } from '../../controller/client'
	import type { CreateClient } from '../../trpcClient'
	import type { EditorSelection } from '../basics/EditorModal.svelte'
	import EditorModal from '../basics/EditorModal.svelte'
	import ClientEditor from './ClientEditor.svelte'

	export let selected: EditorSelection<CreateClient> = null

	const updateClient = createClientUpdateMutation()
	const createClient = createClientCreateMutation()

	async function onSave() {
		if (selected) {
			if (selected.id === undefined) {
				await createClient(selected.entity)
			} else {
				await updateClient({ id: selected.id, client: selected.entity })
			}
		}
	}
</script>

<EditorModal editor={ClientEditor} name="clientEditorModal" bind:selected {onSave} />
